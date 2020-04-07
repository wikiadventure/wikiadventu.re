package controller;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;

class ResController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    
    public function new(im : IncomingMessage, sr : ServerResponse) {
		this.im = im;
		this.sr = sr;
        var idx = this.im.url.lastIndexOf(".");
        var extension = this.im.url.substring(idx+1);
        var mimeType:String = switch extension {
            case "ogg":
                "audio/ogg";
            case "mp3":
                "audio/mpeg";
            default :
                "unknown/unknown";
        };
        trace(extension + " - " + mimeType);
        this.sr.setHeader("Content-Type", mimeType);
		var requestedFileUrl = '.' + this.im.url;
		Fs.readFile(requestedFileUrl, function(err, data) {
			if (err != null) {
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