package lobby;

import config.Lang.LangTools;
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
        trace("gamepage");
		this.im = im;
        this.sr = sr;
        if (!this.sr.headersSent) this.sr.setHeader("Content-Type", "text/html");
		Fs.readFile('templates/gamePage.html', function(err, data) {
			if (err != null) {
                trace(err);
				if (!this.sr.headersSent) this.sr.writeHead(404);
                this.sr.write("ressource not found");
			} else {
                if (!this.sr.headersSent) this.sr.writeHead(200);
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
                            return LangTools.getVotePlaceholder(lobby.language);
                        case "${votePlaceholderSubmitted}":
                            return LangTools.getVotePlaceholderSubmitted(lobby.language);
                        case "${chatPlaceholder}":
                            return LangTools.getChatPlaceholder(lobby.language);
                        case "${startPage}":
                            return LangTools.getStartPage(lobby.language);
                        case "${endPage}":
                            return LangTools.getEndPage(lobby.language);
                        case "${socketError}":
                            return LangTools.getSocketError(lobby.language);
                        case "${exitWarning}":
                            return LangTools.getExitWarning(lobby.language);
                        default:
                            return '';
                    };
                });
                this.sr.write(templatedData, 'utf-8', function() {
                    this.sr.end();
                });
                
			}
            
        });
      
	}
}
