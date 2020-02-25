package lobby;

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
        trace("creating GamePage");
		Fs.readFile('templates/gamePage.html', function(err, data) {
			if (err != null) {
                trace(err);
				this.sr.writeHead(404);
                this.sr.write("ressource not found");

			} else {
                this.sr.writeHead(200);
                var urlRegex = ~/(\$1)/g;
                var idRegex = ~/(\$2)/g;
                var modifiedData = urlRegex.replace(data.toString(), Lobby.encodeID(lobby.id));
                modifiedData = idRegex.replace(modifiedData, player.uuid);
                this.sr.write(modifiedData);
                
			}
            this.sr.end();
        });
        

	}
}
