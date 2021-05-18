export function translate(e:ErrorCode):string {
    switch (e) {
        case ErrorCode.InvalidID: return "connectError.invalidID";
        case ErrorCode.NoLobbyFoundWithID: return "connectError.noLobbyFoundWithID";
        case ErrorCode.NoLobbyFoundWithChannelName: return "connectError.noLobbyFoundWithChannelName";
        case ErrorCode.LobbyFull: return "connectError.lobbyFull";
        case ErrorCode.InvalidPassword: return "connectError.invalidPassword";
        case ErrorCode.LobbyLimitReached: return "connectError.lobbyLimitReached";
        case ErrorCode.PrivateLobbyLimitReached: return "connectError.privateLobbyLimitReached";
        default: return "";
    }
}

export enum ErrorCode {
    InvalidID = 100, //client error
    NoLobbyFoundWithID,
    NoLobbyFoundWithChannelName,
    LobbyFull,
    InvalidPassword,
    LobbyLimitReached = 200, //server error
    PrivateLobbyLimitReached,
}
