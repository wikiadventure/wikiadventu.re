package controller.connect;

import lobby.GameLoop.GameLoopType;
import config.Lang;
import lobby.LoginType;

typedef ConnectRequest = {
    type:LoginType,
    lang:Lang,
    pseudo:String,
    ?slot:Int,
    ?gameLoop:GameLoopType,
    ?password:String,
    ?lobby:String
}