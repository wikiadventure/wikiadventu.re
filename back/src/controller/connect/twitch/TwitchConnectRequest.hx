package controller.connect.twitch;

import controller.connect.ConnectRequest;

typedef TwitchConnectRequest = {
    > ConnectRequest,
    ?code: String
}
