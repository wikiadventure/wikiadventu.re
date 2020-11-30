import { Lang } from "src/i18n";

export enum LobbyType {
  Public = "Public",
  Private = "Private",
  Twitch = "Twitch"
}

export interface GameData {
  ws?: WebSocket;
  uuid: string;
  lang: Lang;
  lobbyType: LobbyType;
  startPage: string;
  lobbyState: LobbyState;
  stateCounter: NodeJS.Timeout;
  round: number;
  timeLeft: number;
  timeStamp: number;
  endPage: string;
  lobbyID: string;
  selfPlayerID: number;
  players: Array<Player>;
  messages: Array<Message>;
  winnerId: number;
  volume:number;
  mute:boolean;
}

export interface Player {
  pseudo: string;
  id: number;
  score: number;
  winStreak: number;
  isConnected:boolean;
}

export interface Message {
  playerID: number;
  content: string;
  timeStamp: number;
}

export enum LobbyState {
  Voting = "Voting",
  Playing = "Playing",
  RoundFinish = "RoundFinish",
  GameFinish = "GameFinish"
}

const state: GameData = {
  ws: undefined,
  uuid: "",
  lang: Lang.en,
  lobbyType: LobbyType.Public,
  lobbyID: "",
  lobbyState: LobbyState.Voting,
  stateCounter: undefined,
  round: 0,
  timeLeft: 0,
  timeStamp: 0,
  startPage: "",
  endPage: "",
  selfPlayerID: -1,
  players: [],
  messages: [],
  winnerId: -1,
  volume: 1,
  mute: false
};

export enum LobbyEventType {
  PlayerJoin = "PlayerJoin",
  PlayerLeft = "PlayerLeft",
  VoteResult = "VoteResult",
  GameState = "GameState",
  UpdateScore = "UpdateScore",
  WinRound = "WinRound",
  Message = "Message"
}

export interface LobbyEvent<T> {
  type:LobbyEventType,
  data:T
}
export interface PlayerJoin {
  pseudo:string,
  id:number,
  score:number,
  self:boolean
}
export interface PlayerLeft {
  id:number
}
export interface VoteResult {
  start:string,
  end:string
}
export interface GameState {
  state:LobbyState,
  round:number,
  time:number
}
export interface UpdateScore {
  id:number,
  score:number
}
export interface WinRound {
  id:number
}
export interface WsMessage {
  id:number,
  mes:string
}

export default state;
