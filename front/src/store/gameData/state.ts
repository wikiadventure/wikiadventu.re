import { Lang } from "src/i18n";
import { GameLoopType } from "./type/gameLoop";
import { PhaseType } from "./type/phase";

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
  slot: number;
  gameLoop: number;
  gamePhase: number;
  timeController: AbortController;
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
  voteInput:string;
  suggestions:WikiSuggestion[];
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

const state: GameData = {
  ws: undefined,
  uuid: "",
  lang: Lang.en,
  lobbyType: LobbyType.Public,
  lobbyID: "",
  slot: 15,
  gameLoop: GameLoopType.Classic,
  gamePhase: PhaseType.Waiting,
  timeController: new AbortController(),
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
  volume: 0.3,
  mute: false,
  safeMode: false,
  voteInput: "",
  suggestions: []
};

export default state;

export interface WikiRawSuggestion  {
  ns: number, 
  index: number, 
  title: string, 
  terms: {
    description: string[]
  },
  thumbnail: {
    source: string,
    width: number,
    height: number
  }
}

export interface WikiSuggestion  {
  index: number,
  title: string, 
  description: string
  thumbnail: {
    source: string,
    width: number,
    height: number
  }
}