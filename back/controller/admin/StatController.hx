package controller.admin;

import lobby.Lobby;
import async.WS;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import config.admin.Guard;
import haxe.http.HttpStatus;
import js.Node.process;

class StatController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        if (!Guard.checkPassword(body)) {
            this.sr.writeHead(Unauthorized);
            this.sr.write("Access denied, please provide the correct password!");
            this.sr.end();
            return;
        }
        var responseData = 
        '
        <html>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th colspan="2"><h1>Stat</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th><h2>General Info</h2></th>
                        </tr>
                        <tr>
                            <th>Server ram : ${process.memoryUsage().heapUsed}</th>
                            <th>Total WS client : ${WS.server.clients.size}</th>
                        </tr>
                        <tr>
                            <th><h2>Lobby Info</h2></th>
                        </tr>
                        ::foreach lobby::
                            <tr><th><h3>Lobby ::encodedID::</h3></th></tr>
                            <tr><th>type : ::type::</th></tr>
                            <tr><th>Language : ::language::</th></tr>
                            <tr><th>State : ::state::</th></tr>
                            <tr><th>Round : ::currentRound:: / ::round::</th></tr>
                            <tr><th>Start page : ::startPage::</th></tr>
                            <tr><th>End page : ::endPage::</th></tr>
                            <tr><th>Player : ::players.length:: / ::slot::</th></tr>
                            <tr><th>Total player : ::totalPlayer::</th></tr>
                        ::end::
                    </tbody>
                </table>
            </body>
        </html>
        ';
        var info = {
            lobby: Lobby.lobbyList,
        }
        var template = new haxe.Template(responseData);
        sr.writeHead(200);
        sr.write(template.execute(info));
        sr.end();
    }

}