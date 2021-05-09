import counter from './script/countdown';
import { Lang } from 'src/i18n';
import { MutationTree } from 'vuex';
import { GameData, LobbyType, Message, Player, WikiRawSuggestion } from './state';
import { GameState, Path, PlayerJoin, PlayerLeft, UpdateScore, VoteResult, VoteSkip, WinRound, WsMessage } from './actions';
import { wikiHeaders } from 'src/mixins/wikiTools';

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
  setSlot(state:GameData, s:number) {
    state.slot = s;
  },
  setGameLoop(state:GameData, type:number) {
    state.gameLoop = type;
  },
  path(state:GameData, data:Path) {
    state.winnerPageHistory = data.pages;
    state.winnerTime = data.time;
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
    state.players.find(s => s.id == p.id).isConnected = false;
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
    if (g.round == 1) state.players = state.players.filter(p => p.isConnected);
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
  },
  voteInput(state:GameData, v:string) {
    state.voteInput = v;
  },
  async loadSuggestions(state:GameData) {
    var url = new URL('https://'+state.lang+'.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      gpssearch: state.voteInput,
      generator: 'prefixsearch',
      prop: 'pageprops|pageimages|pageterms',
      redirects: '1', // Automatically resolve redirects
      ppprop: 'displaytitle',
      piprop: 'thumbnail',
      pithumbsize: '160',
      pilimit: '30',
      wbptterms: 'description',
      gpsnamespace: "0", // Only return results in Wikipedia's main namespace
      gpslimit: "5", // Return at most five results
      origin: '*',
    }).toString();
    const response = await fetch(url.toString(), { headers: wikiHeaders })
    .then((r) => r.json())
    .catch((error) => {
      console.log(error);
    })
    state.suggestions = [];
    if (!response.query || !response.query.pages) {}
    for (const page of Object.values(response.query.pages) as WikiRawSuggestion[]) {
      console.log(page);
      if ( page.ns === 0 ) {
        state.suggestions.push({
          index: page.index,
          title: page.title,
          description: page.terms.description[0],
          thumbnail: page.thumbnail ? page.thumbnail : {
            source: "",
            height: 160,
            width: 160
          }
        });
      }
    }
    state.suggestions.sort((a,b) => a.index-b.index);
    
  }
  
};

export default mutation;
