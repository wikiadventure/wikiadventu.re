package lobby;

import config.Language.LanguageTools;
import js.html.XMLHttpRequest;
import lobby.player.Player;
import js.lib.RegExp;
import lobby.Lobby;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;


class GamePage {
    var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse, lobby:Lobby, player:Player) {
		this.im = im;
		this.sr = sr;
        this.sr.setHeader("Content-Type", "text/html");
		Fs.readFile('templates/gamePage.html', function(err, data) {
			if (err != null) {
                trace(err);
				this.sr.writeHead(404);
                this.sr.write("ressource not found");

			} else {
                this.sr.writeHead(200);
                var templateRegex = ~/(\${(.*?)})/g; // anything like ${ ... }
                var templatedData = templateRegex.map(data.toString(), function(r) {
                    var match = r.matched(0);
                    switch (match) {
                        case "${lobbyID}":
                            return Lobby.encodeID(lobby.id);
                        case "${playerID}":
                            return player.uuid;
                        case "${lobbyLang}":
                            return lobby.language;
                        case "${votePlaceholder}":
                            return LanguageTools.getVotePlaceholder(lobby.language);
                        case "${votePlaceholderSubmitted}":
                            return LanguageTools.getVotePlaceholderSubmitted(lobby.language);
                        case "${chatPlaceholder}":
                            return LanguageTools.getChatPlaceholder(lobby.language);
                        case "${startPage}":
                            return LanguageTools.translateStartPage(lobby.language);
                        case "${endPage}":
                            return LanguageTools.translateEndPage(lobby.language);
                        case "${socketError}":
                            return LanguageTools.getSocketError(lobby.language);
                        case "${exitWarning}":
                            return LanguageTools.getExitWarning(lobby.language);
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
