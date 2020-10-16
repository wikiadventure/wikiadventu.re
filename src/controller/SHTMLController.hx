package controller;

import config.Lang;
import config.Lang.LangTools;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;

class SHTMLController {

    var im : IncomingMessage;
	var sr : ServerResponse;
	var lang : Lang;
    
    public function new(im : IncomingMessage, sr : ServerResponse) {
		this.im = im;
		this.sr = sr;
		this.sr.setHeader("Content-Type", "text/html");
		try {
			lang = cast(this.im.headers.get("lang"), String);
		} catch(err:Dynamic) {
			this.sr.writeHead(300);
			this.sr.write("ressource not found");
		}
        var regex = ~/\/shtml/g; 
        var truePath = regex.replace(this.im.url, "/templates/fragments");
		var requestedFileUrl = '.' + truePath;
			Fs.readFile(requestedFileUrl, function(err, data) {
				if (err != null) {
					this.sr.writeHead(404);
					this.sr.write("ressource not found");
				} else {
					this.sr.writeHead(200);
					var templateRegex = ~/(\${(.*?)})/g; // anything like ${ ... }
					var templatedData = templateRegex.map(data.toString(), function(r) {
						var match = r.matched(0);
						switch (match) {
							case "${vote}":
								return LangTools.getVote(lang);
							case "${votePlaceholder}":
								return LangTools.getVotePlaceholder(lang);
							case "${votePlaceholderSubmitted}":
								return LangTools.getVotePlaceholderSubmitted(lang);
							case "${chatPlaceholder}":
								return LangTools.getChatPlaceholder(lang);
							case "${startPage}":
								return LangTools.getStartPage(lang);
							case "${endPage}":
								return LangTools.getEndPage(lang);
							case "${socketError}":
								return LangTools.getSocketError(lang);
							case "${exitWarning}":
								return LangTools.getExitWarning(lang);
							default:
								return '';
						};
					});
					this.sr.write(templatedData);
				}

				this.sr.end();
			});
	}
}