package lobby.wikiAPI;

typedef WikiResponse = {
    var query:WikiQuery;
}
typedef WikiQuery = {
    var searchinfo:{
        var totalhits:Int;
    };
    var search:Array<WikiResult>;
    var random:Array<WikiResult>;
    var pages:Array<WikiResult>;
}
typedef WikiResult = {
    var ns:Int;
    var title:String;
    var pageid:Int;
    var links:Array<WikiResult>;
}
