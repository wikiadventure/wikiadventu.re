import { isOwner, isWinner, owner, playersByScore, playersConnected, playersVoteSkip, selfPlayer, winner } from "./computed";
import { selfId, uuid, players, ownerId, winnerId, winnerPageHistory, winnerTime } from "./state"

export function playerSetup() {
    return {
      uuid,
      players,
      selfId,
      ownerId,
      winnerId,
      winnerPageHistory,
      winnerTime,
      winner,
      isOwner,
      isWinner,
      owner,
      selfPlayer,
      playersByScore,
      playersConnected,
      playersVoteSkip
    }
}

export function playerReset() {
  uuid.value = "";
  players.value = [];
  selfId.value = -1;
  ownerId.value = -2;
  winnerId.value = -3;
  winnerPageHistory.value = [];
  winnerTime.value = -1;
};
