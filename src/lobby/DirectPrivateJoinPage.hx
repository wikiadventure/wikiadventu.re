package lobby;

import js.node.Fs;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;

class DirectPrivateJoinPage {
    var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse, lobby:Lobby) {
		this.im = im;
		this.sr = sr;
		this.sr.setHeader("Content-Type", "text/html");
		Fs.readFile('templates/directPrivateForm.html', function(err, data) {
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
                        case "${lobbyLang}":
                            return lobby.language;
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