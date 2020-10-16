package controller;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;

class FrontController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    
    public function new(im : IncomingMessage, sr : ServerResponse) {
		this.im = im;
        this.sr = sr;
        trace(im.url);
        var idx = this.im.url.lastIndexOf(".");
        var extension = this.im.url.substring(idx+1);
        var mimeType:String = switch extension {
            case "/":
                "text/html";
            case "js":
                "application/javascript";
            case "css":
                "text/css";
            case "ogg":
                "audio/ogg";
            case "mp3":
                "audio/mpeg";
            case "svg":
                "image/svg+xml";
            case "png":
                "image/png";
            case "woff":
                "font/woff";
            case "woff2":
                "font/woff2";
            case "ico":
                "image/x-icon";
            default :
                "unknown/unknown";
        };
        trace(extension + " - " + mimeType);
        this.sr.setHeader("Content-Type", mimeType);
        this.sr.setHeader("Cache-Control", "max-age=604800"); //cache for a week
        var url = this.im.url == "/" ? "/index.html" : this.im.url; 
		var requestedFileUrl = './front' + url;
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