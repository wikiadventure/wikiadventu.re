package controller.connect.twitch;

import controller.connect.ConnectionRequest;
import config.Lang;
import lobby.LoginType;

typedef TwitchConnectRequest = {
    > ConnectionRequest,
    ?code: String
}