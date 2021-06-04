package response.connect;

import controller.connect.ConnectionResponse;
import haxe.Json;
import js.node.http.IncomingMessage;
import js.node.http.ServerResponse;

class ConnectionError {
	var im : IncomingMessage;
	var sr : ServerResponse;
	
	public function new(im : IncomingMessage, sr : ServerResponse, e:ConnectError) {
		this.im = im;
		this.sr = sr;
		this.sr.writeHead(400);
		this.sr.write(Json.stringify({code: e}));
		this.sr.end();
	}
}

enum abstract ConnectError(Int) from Int to Int {
    var InvalidMethod = 100; //client error
    var InvalidForm;
    var InvalidID;
    var InvalidLobbyType;
    var NoLobbyFoundWithID;
    var NoLobbyFoundWithChannelName;
    var LobbyFull;
    var InvalidPassword;
    var InvalidGameLoop;
	var InvalidTwitchCode;
    var LobbyLimitReached = 200; //server error
    var PrivateLobbyLimitReached;
	var TwitchConnectionError;
}
