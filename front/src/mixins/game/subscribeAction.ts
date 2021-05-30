
import { onUnmounted } from "@vue/composition-api";
import { Store } from "src/store";
import { GameState, Path, Rollback, VoteResult, WinRound, WsMessage } from "src/store/gameData/actions";

var gameStateEvents:((g:GameState)=>void) [] = [];
var winRoundEvents:((g:WinRound)=>void) [] = [];
var pathEvents:((g:Path)=>void) [] = [];
var voteResultEvents:((g:VoteResult)=>void) [] = [];
var messageEvents:((g:WsMessage)=>void) [] = [];
var rollbackEvents:((g:Rollback)=>void) [] = [];

var actionListeners = { unsubscribe: Store.subscribeAction((a, s) => {
    if (!a.type.startsWith("gameData")) return;
    const t = a.type.substring(9);
    //call every fucntion of the array
    const calls:(x:((y:any)=>void) []) => void = (x:((y:any)=>void) []) => x.forEach(f=>f?.(a.payload));
    switch (t) {
      case "onGameState":
        return calls(gameStateEvents);
      case "onWinRound":
        return calls(winRoundEvents);
      case "onPath":
        return calls(pathEvents);
      case "onVoteResult":
        return calls(voteResultEvents);
      case "onMessage":
        return calls(messageEvents);
      case "onRollback":
        return calls(rollbackEvents);
    }
  })
};
export default function(
    onGameState?:(g:GameState)=>void,
    onWinRound?:(g:WinRound)=>void,
    onPath?:(g:Path)=>void,
    onVoteResult?:(g:VoteResult)=>void,
    onMessage?:(g:WsMessage)=>void,
    onRollback?:(g:Rollback)=>void,
  ) {
  const push = (a:any[], b:any) => {if(b) a.push(b)};
  push(gameStateEvents, onGameState);
  push(winRoundEvents, onWinRound);
  push(pathEvents, onPath);
  push(voteResultEvents, onVoteResult);
  push(messageEvents, onMessage);
  push(rollbackEvents, onRollback);
  function unsubscribeAction() {
    const remove = (a:any[], b:any) => {
      if (!b) return;
      const i = a.indexOf(b);
      if (i != -1) a.splice(i, 1);
    };
    remove(gameStateEvents, onGameState);
    remove(winRoundEvents, onWinRound);
    remove(pathEvents, onPath);
    remove(voteResultEvents, onVoteResult);
    remove(messageEvents, onMessage);
    remove(rollbackEvents, onRollback);
  }

  return {
    unsubscribeAction
  }
}


