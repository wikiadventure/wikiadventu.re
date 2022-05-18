import { setTimeout } from 'node:timers/promises';
import type { Lobby } from "@lobby/class";
import { emitState } from "@packet/emitter/State";
import type { PacketHandler } from "@packet/handler";
import { PacketSubscriberCallback, subscribe } from "@packet/handler/PacketSubscriber";
import type { ClientPacketType } from "@packet/handler/type";
import type { Player } from "@player/class";
import type { GamePhaseType } from "./types";

export class GamePhase {

    lobby:Lobby;
    
    duration:number;//In seconds
    
    type!:GamePhaseType;

    ended = false;

    timestamp = -1;
    timer!:AbortController;

    packetEventSubscribers:Map<ClientPacketType, PacketSubscriberCallback[]> = new Map();
    packetHandlers:Map<ClientPacketType, PacketHandler> = new Map();
    
    get players() {return this.lobby.players};

    constructor(lobby:Lobby, duration:number) {
        this.lobby = lobby;
        this.duration = duration;
    }

    startTimer() {
        this.timestamp = Date.now();
        if (this.duration > 0) {
            this.timer = new AbortController();
            try {
                setTimeout(this.duration*1000, undefined, { signal: this.timer.signal }).then(this.end).catch();
            } catch {}
            
        }
    }
    

    
    async start(data?:any):Promise<any> {
        this.lobby.players.forEach(p=>p.voteSkip = false);
        // this.lobby.log("New phase init : " + this.type +"|" + this.lobby.gameLoop.currentRound + "|" + this.duration, Info);
        return this.onStart().then(startData=> {
            this.emitState(this.lobby.players, startData);
            this.startTimer();
        });
    }
    
    async end(data?:any) {
        if (this.ended) return;
        this.ended = true;
        this.timer.abort();
        return this.onEnd().then(data=>{
            if (!this.lobby.isDetroyed()) this.lobby.gameMode.next(data);
        });
    }
    async onStart(data?:any):Promise<any> {
        return;
    }

    async onEnd(data?:any):Promise<any> {  
        return;
    }

    sendState(player:Player) {
        this.emitState([player])
    }

    subscribePacket(type:ClientPacketType, callback: PacketSubscriberCallback) {
        subscribe(this.packetEventSubscribers, type, callback);
    }
    
    emitState(players:Player[], data?:any) {
        emitState(players, this.lobby.gameMode.type, this.type, this.lobby.gameMode.currentRound, data);
    }

    // inline function log(data : Dynamic, logType:LogType, ?pos : haxe.PosInfos) {
    //     lobby.log(data, logType, pos);
    // }

}