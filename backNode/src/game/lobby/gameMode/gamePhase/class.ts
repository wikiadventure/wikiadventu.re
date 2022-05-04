import type { GamePhaseType } from './types';
import type { Lobby } from "@game/lobby/class";
import type { Player } from '@game/lobby/player/class';
import { emitGamePhase } from '@game/lobby/packet/emitter/vanilla/GamePhase';
import { setTimeout } from "node:timers/promises"
import type { InternalPacketType } from '@game/lobby/packet/handler/type';
import { PacketSubscriberCallback, subscribe } from '@game/lobby/packet/handler/PacketSubscriber';

export class GamePhase {

    lobby:Lobby;
    
    duration:number;//In seconds
    
    type!:GamePhaseType;

    ended = false;

    packetEventSubscribers:Map<InternalPacketType, PacketSubscriberCallback[]> = new Map();

    constructor(lobby:Lobby, duration:number) {
        this.lobby = lobby;
        this.duration = duration;
    }
    
    start(data?:any):Promise<any> {
        this.lobby.players.forEach(p=>p.voteSkip = false);
        // this.lobby.log("New phase init : " + this.type +"|" + this.lobby.gameLoop.currentRound + "|" + this.duration, Info);
        return this.onStart().then(data=> {
            this.lobby.gameMode.timestamp = Date.now();
            emitGamePhase(this.lobby.players, this.type, this.lobby.gameMode.currentRound, this.duration);
            if (this.duration > 0) this.lobby.gameMode.loop = setTimeout(this.duration*1000, data).then(this.end);
        });
    }
    end(data?:any) {
        if (this.ended) return;
        this.ended = true;
        return this.onEnd().then(data=>{
            if (!this.lobby.isDetroyed()) this.lobby.gameMode.next(data);
        });
    }
    onStart(data?:any):Promise<any> {
        return Promise.resolve();
    }

    onEnd(data?:any):Promise<any> {
        return Promise.resolve();
    }

    sendState(player:Player) {
        
    }

    subscribePacket(type:InternalPacketType, callback: PacketSubscriberCallback) {
        subscribe(this.packetEventSubscribers, type, callback);
    }

    // inline function log(data : Dynamic, logType:LogType, ?pos : haxe.PosInfos) {
    //     lobby.log(data, logType, pos);
    // }

}