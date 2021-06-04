package controller.connect.twitch;

import controller.connect.ConnectionRequest;

typedef TwitchConnectRequest = {
    > ConnectionRequest,
    ?code: String
}