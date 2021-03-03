import counter from './script/countdown';
import { Lang } from 'src/i18n';
import { MutationTree } from 'vuex';
import { GameData, GameState, LobbyType, Message, Player, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, VoteSkip, WinRound, WsMessage } from './state';

const mutation: MutationTree<GameData> = {
  setLang(state:GameData, l:Lang) {
    state.lang = l;
  },
  setUuid(state:GameData, uuid:string) {
    state.uuid = uuid;
  },
  setLobbyID(state:GameData, id:string) {
    state.lobbyID = id;
  },
  setLobbyType(state:GameData, type:LobbyType) {
    state.lobbyType = type;
  },
  setGameLoop(state:GameData, type:number) {
    state.gameLoop = type;
  },
  path(state:GameData, a:string[]) {
    state.winnerPageHistory = a;
  },
  voteSkip(state:GameData, p:VoteSkip) {
    for(var player of state.players) {
      if (player.id == p.id) {
        player.voteSkip = p.state;
        return;
      }
    }
  },
  setOwner(state:GameData, o:number) {
    state.owner = o;
  },
  pushMessage(state:GameData, m:WsMessage) {
    var message:Message = {
      playerID: m.id,
      content: m.mes,
      timeStamp: Date.now()  
    }
    state.messages.push(message);
  },
  playerJoin(state:GameData, p:PlayerJoin) {
    var player:Player = {
      pseudo: p.pseudo,
      id: p.id,
      score: p.score,
      winStreak: 0,
      voteSkip: p.voteSkip,
      isConnected: true
    }
    if (p.self) state.self = p.id;
    state.players.push(player);
  },
  playerLeft(state:GameData, p:PlayerLeft) {
    for(var i=0;i<state.players.length; ++i) {
      if (state.players[i].id == p.id) {
        state.players[i].isConnected = false;
        return;
      }
    }
  },
  voteResult(state:GameData, v:VoteResult) {
    state.startPage = v.start;
    state.endPage = v.end;
  },
  updateScore(state:GameData, p:UpdateScore) {
    for(var player of state.players) {
      if (player.id == p.id) {
        player.score = p.score;
        return;
      }
    }
  },
  gameState(state:GameData, g:GameState) {
    state.players.forEach(p => p.voteSkip = false);
    state.gamePhase = g.phase;
    state.round = g.round;
    state.timeController.abort();
    state.timeController = new AbortController();
    state.timeLeft = g.time*1000;
    state.timeStamp = document.timeline ? document.timeline.currentTime : performance.now();
    counter(1000, state.timeStamp, state.timeController.signal, time => {
      state.timeLeft = g.time*1000 - (time - state.timeStamp);
      if (state.timeLeft <= 0) {
        state.timeController.abort();
        state.timeLeft = 0;
      }
    });
  },
  deleteVote(state:GameData) {
    state.vote = null;
  },
  winRound(state:GameData, w:WinRound) {
    state.winnerId = w.id;
  },
  mute(state:GameData, m:boolean) {
    state.mute = m;
  },
  volume(state:GameData, v:number) {
    state.volume = v;
  },
  safeMode(state:GameData, b:boolean) {
    state.safeMode = b;
  }
  
};

export default mutation;
