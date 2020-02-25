package lobby;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;

class LobbyPage {
	var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse) {
		this.im = im;
		this.sr = sr;
		this.sr.setHeader("Content-Type", "text/html");
		try {
			Fs.readFile('templates/lobbyForm.html', function(err, data) {
				if (err != null) {
					this.sr.writeHead(404);
					this.sr.write("ressource not found");
				} else {
					this.sr.writeHead(200);
					this.sr.write(data);
				}

				this.sr.end();
			});
		} catch (e:Dynamic) {

		}
		

	}
}
