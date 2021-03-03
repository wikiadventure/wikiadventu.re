export interface ConnectEvent {
    type:ConnectType,
    password?:string,

}

export enum ConnectType {
    PublicJoin = "PublicJoin",
    PrivateJoin = "PrivateJoin",
    PrivateCreate = "PrivateCreate",
    TwitchJoinWithout = "TwitchJoinWithout",
    TwitchJoinWith = "TwitchJoinWith",
    TwitchCreate = "TwitchCreate"
}