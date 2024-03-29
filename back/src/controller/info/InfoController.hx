package controller.info;

import lobby.TwitchLobby;
import haxe.Json;
import response.SuccessResponse;
import lobby.Lobby;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
using StringTools;

class InfoController {
    
    var im : IncomingMessage;
    var sr : ServerResponse;
    var body : String;
   

    public function new(im : IncomingMessage, sr : ServerResponse) {
        this.im = im;
        this.sr = sr;
        var lobbyID = im.url.substring(10);
        var twitchID = lobbyID.startsWith("twitch:") ? im.url.substring(17) : null;
        try {
            var lobby = twitchID == null ? Lobby.find(Lobby.decodeID(lobbyID)) : TwitchLobby.find(twitchID);
            var id = twitchID == null ? lobby.formatId : cast(lobby, TwitchLobby).name;
            var json:InfoResponse = {
                status: Found,
                lobbyID: id,
                lobbyType: lobby.type,
                lobbyLang: lobby.lang,
                slot: lobby.slot,
                players: lobby.players.length,
                gameMode: lobby.gameLoop.type,
                gamePhase: lobby.gameLoop.phase.type
                

            };
            new SuccessResponse(im, sr, Json.stringify(json));
        } catch(e:Dynamic) {
            var json:InfoResponse = {
                status: NotFound,
                error: e

            };
            new SuccessResponse(im, sr, Json.stringify(json));
        }
        
    }

}