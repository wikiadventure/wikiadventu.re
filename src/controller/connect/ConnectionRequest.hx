package controller.connect;

import config.Lang;
import lobby.LoginType;

typedef ConnectionRequest = {
    type:LoginType,
    lang:Lang,
    pseudo:String,
    ?password:String,
    ?lobby:String
}