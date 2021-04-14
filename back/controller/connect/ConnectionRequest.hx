package controller.connect;

import config.Lang;
import lobby.LoginType;

typedef ConnectionRequest = {
    type:LoginType,
    lang:Lang,
    pseudo:String,
    ?slot:Int,
    ?gameMode:Int,
    ?password:String,
    ?lobby:String
}