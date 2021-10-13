package lobby.wikiAPI;

import lobby.packet.emitter.vanilla.Rollback.RollbackEmitter;
import lobby.player.Player;
import haxe.Json;
import js.node.Https;
import js.node.Querystring;
import config.Lang;
import js.lib.Promise;

class WikiTools {

    static final wikiHeaders = {
        "Api-User-Agent": "wiki-adventure/1.1 (https://wiki-adventure.sacramentix.fr/; pro@sacramentix.fr)"
    };
    public static function selectPage(suggestionList:Array<String>, lang:Lang):Promise<VoteResult> {
        var promiseList = new Array<Promise<String>>();
        for (i in 0...suggestionList.length) {
            var title = suggestionList[i];
            if (title != "") {
                var promise = new Promise<String>(
                    function (resolve, reject) {
                        var param:WikiRequest = {
                            action: "query",
                            format: "json",
                            formatversion: "2",
                            list: "search",
                            srlimit: 1,
                            srnamespace: 0,
                            srsearch: "intitle:"+title,
                            srprop: ""
                        };
                        var encodedParam = "/w/api.php?" + Querystring.encode(param);
                        var options:HttpsRequestOptions =  {
                            hostname: LangTools.getURL(lang),
                            path: encodedParam,
                            method: 'POST',
                            headers: wikiHeaders
                        };
                        var request = Https.request(options, function (response) {
                            response.on('data', function (data) {
                                try {
                                    var parsed:WikiResponse = Json.parse(data);
                                    if (parsed.query.searchinfo.totalhits == 0) {
                                        getRandomURL(lang).then((p)-> resolve(p));
                                    } else {
                                        resolve(parsed.query.search[0].title);
                                    }
                                } catch(e:Dynamic) {
                                    reject("SEVERE server Error : " + e);
                                }
                            });
                        });
                        request.on('error', function (e) {
                            reject("SEVERE server Error : " + e);
                        });
                        request.end();
                    }
                );
                promiseList.push(promise);
            } else {
                promiseList.push(getRandomURL(lang));
            }
        }
        while (promiseList.length < 2) {
            promiseList.push(getRandomURL(lang));
        }
        var voteResult:Promise<VoteResult> = Promise.all(promiseList).then(
            function(urlList):Promise<VoteResult> {
                var endPage = urlList.splice(Std.random(urlList.length),1)[0];
                var startPage:String = null;
                do {
                    startPage = urlList.splice(Std.random(urlList.length),1)[0];
                } while (endPage == startPage && urlList.length > 0);
                if (endPage == startPage) {
                    return new Promise<VoteResult>(
                        (resolve, reject) -> getRandomURL(lang)
                        .then((page) -> resolve({startPage: page, endPage: endPage}))
                    );
                } else {
                    var result:VoteResult = {startPage: startPage, endPage: endPage};
                    return Promise.resolve(result);
                }
                return null;
            });
        return voteResult;
    }

    /**
     * request the wikipedia api and get a random page
     * @param lang the lang of the random page
     */
     public static function getRandomURL(lang:Lang):Promise<String> {
        return new Promise<String>(function(resolve, reject) {
            var param:WikiRequest = {
                action: "query",
                format: "json",
                formatversion: "2",
                list: "random",
                rnnamespace: 0,
                rnlimit: 1,
            };
            var encodedParam = "/w/api.php?" + Querystring.encode(param);
            var options:HttpsRequestOptions =  {
                hostname: LangTools.getURL(lang),
                path: encodedParam,
                method: 'POST',
                headers: wikiHeaders 
            };
            var request = Https.request(options, function (response) {
                response.on('data', function (data) {
                    try {
                        var parsed:WikiResponse = Json.parse(data);
                        resolve(parsed.query.random[0].title);
                    } catch(e:Dynamic) {
                        reject("SEVERE server Error : " + e);
                    }   
                });
            });
            request.on('error', function (e) {
                reject("SEVERE server Error : " + e);
            });
            request.end();
        });
    }

      /**
     * check if the player jump is valid (when he click on a link to go to an another page)
     * we ask the wikipedia api to do so
     * @param player from which the data come from
     * @param url 
     */
     public static function validateJump(lang:Lang, oldPage:String, newPage:String):Promise<String> {
        return new Promise<String>(
            function(resolve, reject) {
                var param:WikiRequest = {
                    action: "query",
                    format: "json",
                    titles: oldPage,
                    generator: "links",
                    redirects: 1,
                    formatversion: "2",
                    gpltitles: newPage
                };
                var encodedParam = "/w/api.php?" + Querystring.encode(param);
                var options:HttpsRequestOptions =  {
                    hostname: LangTools.getURL(lang),
                    path: encodedParam,
                    method: 'POST',
                    headers: wikiHeaders  
                };
                var request = Https.request(options, function (response) {
                    var body = '';
                    response.on('data', function (chunk) {
                        body = body + chunk;
                    });
                    response.on('end', function () {
                        try {
                            var wiki:WikiResponse = Json.parse(body);
                            if (wiki.query == null) {
                                var r:ValidationReject = {
                                    type: Cheat,
                                    url: encodedParam,
                                    body: body
                                };
                                reject(r);
                            }
                            else resolve(wiki.query.pages[0].title);
                        } catch(e:Dynamic) {
                            var r:ValidationReject = {
                                type: WikiError,
                                url: encodedParam,
                                body: body,
                                error: e,
                            };
                            reject(r);
                        }
                    });
                });
                request.on('error', function (e) {
                    var r:ValidationReject = {
                        type: RequestFailed,
                        url: encodedParam,
                        error: e,
                    };
                    reject(r);
                });
                request.end();
            }
        );
    }

    public static function validate(lobby:Lobby, player:Player, toValidate:String) {
        var oldPage = player.currentPage;
        player.numberOfJump +=1;
        player.currentPage = toValidate;
        var currentValidation = player.currentValidation;
        var validation:Promise<String>;
        validation = WikiTools.validateJump(lobby.lang, oldPage, toValidate);
        validation.then(
            landPage -> {
                currentValidation.page = landPage;
                currentValidation.validated = true;
                player.validationBuffer.remove(validation);
                return landPage;
            },
            (reason) -> {
                var pos = player.validationList.indexOf(currentValidation);
                if ( pos != -1) {
                    player.validationList.splice(pos,player.validationList.length);
                    RollbackEmitter.emitRollback(player, player.currentPage);
                }
                player.validationBuffer.remove(validation);
                switch reason.type { 
                    case Cheat: //onCheat(player, oldPage, toValidate, reason.url, reason.body);
                    case WikiError: //onWikiError(player, oldPage, toValidate, reason.url, reason.body);
                    case RequestFailed: //onRequestFailed(player, oldPage, toValidate, reason.url, reason.e);
                }
                return Promise.reject(reason);
            }
            
        );
        return validation;
    }

}

typedef VoteResult = {
    var startPage:String;
    var endPage:String;
}

enum abstract ValidationRejectType(Int) {
    var Cheat;
    var WikiError;
    var RequestFailed;   
}

typedef ValidationReject = {
    var type:ValidationRejectType;
    var url:String;
    var ?body:String;
    var ?error:String;
}