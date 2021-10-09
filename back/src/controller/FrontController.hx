package controller;

import js.lib.Promise;
import js.node.Fs;
import js.html.AbortController;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import js.node.util.Promisify;

class FrontController {

    static var read = Promisify.promisify(Fs.readFile);

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
		var f = './front' + url;
        var resolveEncoding = 
            im.headers.exists('accept-encoding') && acceptGzip() ?
                existGzip(f) :
                Promise.resolve(f);
        resolveEncoding.then( file -> {
            read(file)
            .then( data -> {
                this.sr.writeHead(200);
				this.sr.write(data);
            })
            .catchError( e -> {
                this.sr.writeHead(404);
				this.sr.write("ressource not found"); 
            })
            .finally(() -> this.sr.end());
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
    //We only support gz for the moment
    public function acceptGzip() {
        var encs = im.headers.get('accept-encoding');
        var e:Array<String> = Std.isOfType(encs, String) ? [encs] : encs;
        for (s in e) if (s.indexOf("gzip")!=-1||s.indexOf("*")!=-1) return true;
        return false;
    }
    /**
     * return a promise of the accepted file path
     * @param f 
     */
    function existGzip(f:String) {
        return new Promise((r,e) -> 
            Promisify.promisify(Fs.access)(f+'.gz')
                .then(b-> {
                    sr.setHeader("Content-Encoding", "gzip");
                    r(f+".gz");
                })
                .catchError(c->r(f)));
    }

}