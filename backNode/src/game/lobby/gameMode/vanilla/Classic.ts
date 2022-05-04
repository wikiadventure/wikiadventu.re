// import { LobbyType } from '@game/lobby/types';
// import { GameMode } from './../class';

// class Classic extends GameMode {

//     voteDuration:number;
//     playDuration:number;

//     override onStart(data?:any) {
//         this.gamePhase = this.lobby.type != LobbyType.Public ? new Waiting(lobby) : new Voting(lobby, voteDuration);
//         return this.gamePhase.start();
//     }

//     // public override function onEnd(?data:Any) {
//     // }

//     public override function next(?data:Any):Promise<Any> {
//         if (lobby.players.length == 0) return Promise.resolve();
//         switch phase.type {
//             case VanillaPhaseType.Waiting:
//                 phase = new Voting(lobby, voteDuration);
//             case VanillaPhaseType.Voting:
//                 var v:VoteResult = data;
//                 if (v == null) return Promise.resolve();
//                 phase = new Playing(v.startPage, v.endPage, lobby, playDuration);
//             case VanillaPhaseType.Playing:
//                 phase = new RoundFinish(lobby);
//             case VanillaPhaseType.RoundFinish:
//                 if (lobby.gameLoop.currentRound >= lobby.gameLoop.round) phase = new GameFinish(lobby);
//                 else {
//                     currentRound++;
//                     phase = new Voting(lobby, voteDuration);
//                 }
//             case VanillaPhaseType.GameFinish:
//                 return end();
//         }
//         if (phase != null) {
//             return phase.start();
//         }
//         return Promise.resolve();
//     }

//     public override function new(lobby:Lobby, c:ClassicConfig) {
//         super();
//         this.lobby = lobby;
//         this.round = new Round(c.round, 3);
//         this.voteDuration = new PhaseDuration(c.voteDuration, 60);
//         this.playDuration = new PhaseDuration(c.playDuration, 600);
//         this.type = VanillaGameLoopType.Classic;
//         this.packetHandlers = [
//             ClientMessageHandler.instance,
//             ClientResetVoteHandler.instance,
//             ClientStartHandler.instance,
//             ClientValidateHandler.instance,
//             ClientVoteHandler.instance,
//             ClientVoteSkipHandler.instance
//         ];
        
//     }

// }

// typedef ClassicConfig = {
//     ?round:String,
//     ?voteDuration:String,
//     ?playDuration:String
// }