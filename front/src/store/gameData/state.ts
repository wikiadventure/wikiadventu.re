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
  lobbyID: string;
  owner:number;//id the owner player
  self: number;//id the player
  players: Array<Player>;
  messages: Array<Message>;
  winnerPageHistory: Array<string>,
  winnerTime: number,
  winnerId: number;
  volume:number;
  mute:boolean;
  safeMode:boolean;

  vote:WikiVote;
  suggestions:WikiSuggestion[];
  startPage: WikiPreview;
  endPage: WikiPreview;
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
  winnerPageHistory: [],
  winnerTime: 0,
  players: [],
  messages: [],
  self: -1,
  owner: -2,
  winnerId: -3,
  volume: 0.3,
  mute: false,
  safeMode: false,
  vote: {
    input: "",
    label: null,
    title: null,
    description: null,
    thumbnail: null
  },
  suggestions: [],
  startPage: {
    title: null,
    description: null,
    thumbnail: null
  },
  endPage: {
    title: null,
    description: null,
    thumbnail: null
  },
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

export interface WikiPreview  {
  title: string, 
  description: string
  thumbnail: {
    source: string,
    width: number,
    height: number
  }
}
export interface WikiSuggestion extends WikiPreview {
  index?:number
}
export interface WikiVote extends WikiPreview {
  input:string;
  label:string;//what is display
}
