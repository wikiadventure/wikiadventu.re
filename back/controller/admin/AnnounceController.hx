package controller.admin;

import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
import lobby.packet.emitter.vanilla.Message.ServerMessage;
import haxe.Json;
import async.WS;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;
import config.admin.Guard;

class AnnounceController {

    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
    
    public function new(im : IncomingMessage, sr : ServerResponse, body : String) {
		this.im = im;
        this.sr = sr;
        this.body = body;
        if (!Guard.auth(im, sr, body)) return;
        var data:ServerMessage = {
            type: VanillaServerPacketType.Message,
            id: -2,
            data: body
        }
        var mes = Json.stringify(data);
        WS.server.clients.forEach((v,k,s) -> k.send(mes));
        this.sr.writeHead(200);
		this.sr.write("Announce sucessfully send!");
        this.sr.end();
    }

}