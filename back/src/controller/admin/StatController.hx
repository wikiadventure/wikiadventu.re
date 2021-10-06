package controller.admin;

import lobby.Lobby;
import async.WS;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import config.admin.Guard;
import js.Node.process;

class StatController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        if (!Guard.auth(im, sr, body)) return;
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
                            <tr><th><h3>Lobby ::formatId::</h3></th></tr>
                            <tr><th>type : ::type::</th></tr>
                            <tr><th>Language : ::language::</th></tr>
                            <tr><th>gamemode : ::gameLoop.type::</th></tr>
                            <tr><th>gamephase : ::gameLoop.phase.type::</th></tr>
                            <tr><th>Round : ::gameLoop.currentRound:: / ::gameLoop.round::</th></tr>
                            <tr><th>Player : ::players.length:: / ::slot::</th></tr>
                            <tr><th>Total player : ::totalPlayer::</th></tr>
                            <tr><th><a href="/api/log/lobby/::formatId::/PlayerData.log">PlayerData</a></th></tr>
                            <tr><th><a href="/api/log/lobby/::formatId::/Info.log">Info</a></th></tr>
                            <tr><th><a href="/api/log/lobby/::formatId::/Warning.log">Warning</a></th></tr>
                            <tr><th><a href="/api/log/lobby/::formatId::/Error.log">Error</a></th></tr>
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