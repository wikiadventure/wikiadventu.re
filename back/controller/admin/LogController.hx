package controller.admin;

import js.node.Fs;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import config.admin.Guard;
import haxe.http.HttpStatus;

class LogController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        if (!Guard.auth(im, sr, body)) return;
        var file = "./log/"+im.url.substring(9);
        Fs.readFile(file, function(err, data) {
			if (err != null) {
                trace(err);
				this.sr.writeHead(404);
				this.sr.write("ressource not found");
			} else {
				this.sr.writeHead(200);
				this.sr.write(data);
			}
            this.sr.end();
		});
    }

}