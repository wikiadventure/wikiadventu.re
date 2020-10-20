package controller.connect;

import config.Lang;

typedef ConnectionResponse = {
    status:ConnectionStatus,
    lobbyID:String,
    playerID:String,
    lang:Lang,
    ?error:String
}

enum abstract ConnectionStatus(String) {
    var Success;
    var ClientError;
    var ServerError;
}