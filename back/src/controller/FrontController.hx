package controller;

import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import js.node.Fs;

class FrontController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    
    public function new(im : IncomingMessage, sr : ServerResponse) {
		this.im = im;
        this.sr = sr;
        var mimeType = "text/html";
        var idx = this.im.url.lastIndexOf(".");
        var url:String = "/index.html";
        if (idx != -1) {
            var extension = this.im.url.substring(idx+1);
            mimeType = getMimeType(extension);
            url = this.im.url;
        }
        this.sr.setHeader("Content-Type", mimeType);
        if (url != "/index.html") this.sr.setHeader("Cache-Control", "max-age=604800"); //cache for a week
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
    
    public function getMimeType(extension:String) {
        var mimeType:String = switch extension {
            case "html":
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
        return mimeType;
    }

}