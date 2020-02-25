import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import haxe.http.HttpStatus;
import js.node.Fs;

class MainPage {
    var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse) {
		this.im = im;
		this.sr = sr;
        this.sr.setHeader("Content-Type", "text/html");
		Fs.readFile('templates/mainPage.html', function(err, data) {
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
