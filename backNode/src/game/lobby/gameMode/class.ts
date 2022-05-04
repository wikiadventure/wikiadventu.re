import { PacketSubscriberCallback, subscribe } from './../packet/handler/PacketSubscriber';
import type { InternalPacket, InternalPacketType } from './../packet/handler/type';
import type { IPacketHandler } from './../packet/handler/index';
import type { ClientPacketType } from '../packet/handler/type';
import type { GamePhase } from './gamePhase/class';
import type { Lobby } from './../class';
import { ConnectError } from '@reply/ConnectError';
import type { GameModType, VanillaGameModType } from './types';
import {} from "node:timers/promises";
import type { Player } from '../player/class';

export class GameMode {

    type!:GameModType;
    lobby:Lobby;
    gamePhase!:GamePhase;
    loop!:Promise<any>;
    timestamp:number = 0;
    round:number = 0;
    currentRound:number = 0;
    packetEventSubscribers:Map<InternalPacketType, PacketSubscriberCallback[]> = new Map();
    packetHandlers:Map<ClientPacketType, IPacketHandler> = new Map();
  
    constructor(type: GameModType, lobby: Lobby) {
        this.type = type;
        this.lobby = lobby;
    }
    
    start(data?:any):Promise<any> {
        this.currentRound = 1;
        return this.onStart(data);
    }

    onStart(data?:any):Promise<any> {
        return Promise.resolve();
    }

    end(data?:any):Promise<any> {
        this.onEnd(data);
        return this.start();
    }

    onEnd(data?:any):Promise<any> {
        return Promise.resolve();
    }

    /**
     * an abstract function that should start a new phase depending on the previous one
     * you can pass any data to it
     * @param data 
     */
    next(data?:any):Promise<any> {
        return Promise.resolve();
    }

    /**
     * an abstract function that should send every info so a player can join mid game
     * @param player to send to
     */
    sendState(player:Player) {
        
    }

    onPacket(player:Player, p:InternalPacket) {
        this.packetEventSubscribers.get(p.type)?.forEach(h=>h(this.lobby, player, p));
        this.gamePhase.packetEventSubscribers.get(p.type)?.forEach(h=>h(this.lobby, player, p));
    }

    static GameModeSelect(lobby:Lobby, type:GameModType, config:any = {}) {
        // lobby.gameMode = () => {
        //     switch (type) {
        //         case VanillaGameModType.Classic: return new Classic(lobby, config);
        //         case VanillaGameModType.Random: return new Random(lobby, config);
        //         default:
        //             throw ConnectError.InvalidGameMode;
        //     }
        // }();
    }

    subscribePacket(type:InternalPacketType, callback: PacketSubscriberCallback) {
        subscribe(this.packetEventSubscribers, type, callback);
    }

}
