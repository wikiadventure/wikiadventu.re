package controller.connect.twitch;

import config.Lang;
import lobby.LoginType;

typedef TwitchConnectRequest = {
    type:LoginType,
    lang:Lang,
    pseudo:String,
    password:String,
    ?uuid:String,
    ?lobby:String
}