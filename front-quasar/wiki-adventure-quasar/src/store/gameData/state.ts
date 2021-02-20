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
  lobbyPhase: LobbyPhase;
  stateCounter: NodeJS.Timeout;
  round: number;
  timeLeft: number;
  timeStamp: number;
  startPage: string;
  endPage: string;
  vote: string,
  lobbyID: string;
  owner:number;//id the owner player
  self: number;//id the player
  players: Array<Player>;
  messages: Array<Message>;
  winnerPageHistory: Array<string>,
  winnerId: number;
  volume:number;
  mute:boolean;
  safeMode:boolean;
}

export interface Player {
  pseudo: string;
  id: number;
  score: number;
  winStreak: number;
  voteSkip:boolean;
  isConnected:boolean;
}

export interface Message {
  playerID: number;
  content: string;
  timeStamp: number;
}

export enum LobbyPhase {
  Waiting,
  Voting,
  Playing,
  RoundFinish,
  GameFinish
}

const state: GameData = {
  ws: undefined,
  uuid: "",
  lang: Lang.en,
  lobbyType: LobbyType.Public,
  lobbyID: "",
  lobbyPhase: LobbyPhase.Waiting,
  stateCounter: undefined,
  round: 0,
  timeLeft: 0,
  timeStamp: 0,
  startPage: "",
  endPage: "",
  vote: null,
  winnerPageHistory: [],
  players: [],
  messages: [],
  self: -1,
  owner: -2,
  winnerId: -3,
  volume: 1,
  mute: false,
  safeMode: false
};

export enum LobbyEventType {
  SetOwner = "SetOwner",
  PlayerJoin = "PlayerJoin",
  PlayerLeft = "PlayerLeft",
  VoteResult = "VoteResult",
  GameState = "GameState",
  UpdateScore = "UpdateScore",
  WinRound = "WinRound",
  Message = "Message",
  Path = "Path",
  VoteSkip = "VoteSkip"
}

export interface LobbyEvent<T> {
  type:LobbyEventType,
  data:T
}
export interface PlayerJoin {
  pseudo:string,
  id:number,//The player id
  score:number,
  voteSkip:boolean,
  self:boolean
}
export interface Path {
  id:number,//The player id
  pages:string[]
}
export interface SetOwner {
  id:number//The player id
}
export interface PlayerLeft {
  id:number//The player id
}
export interface VoteResult {
  start:string,
  end:string
}
export interface VoteSkip {
  id:number, //The player id who skip
  state:boolean
}
export interface GameState {
  phase:LobbyPhase,
  round:number,
  time:number
}
export interface UpdateScore {
  id:number,//The player id
  score:number
}
export interface WinRound {
  id:number//The player id
}
export interface WsMessage {
  id:number,//The player id
  mes:string
}

export default state;
