package controller;

import config.Language;
import config.Language.LanguageTools;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;

class SHTMLController {

    var im : IncomingMessage;
	var sr : ServerResponse;
	var lang : Language;
    
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
								return LanguageTools.getVote(lang);
							case "${votePlaceholder}":
								return LanguageTools.getVotePlaceholder(lang);
							case "${votePlaceholderSubmitted}":
								return LanguageTools.getVotePlaceholderSubmitted(lang);
							case "${chatPlaceholder}":
								return LanguageTools.getChatPlaceholder(lang);
							case "${startPage}":
								return LanguageTools.getStartPage(lang);
							case "${endPage}":
								return LanguageTools.getEndPage(lang);
							case "${socketError}":
								return LanguageTools.getSocketError(lang);
							case "${exitWarning}":
								return LanguageTools.getExitWarning(lang);
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