import type { Lobby } from "@lobby/class";
import type { PacketHandler } from "@packet/handler";
import { type PacketSubscriberCallback, subscribe } from "@packet/handler/PacketSubscriber";
import type { ClientPacketType, ClientPacket } from "@packet/handler/type";
import type { Player } from "@player/class";
import type { roundCount } from "./config/type";
import type { GamePhase } from "./gamePhase/class";
import type { GameModType } from "./types";



export class GameMode {

    type!:GameModType;
    lobby:Lobby;
    gamePhase!:GamePhase;
    timestamp:number = 0;
    round:roundCount = 3 as roundCount;
    currentRound:number = 0;
    packetEventSubscribers:Map<ClientPacketType, PacketSubscriberCallback[]> = new Map();
    packetHandlers:Map<ClientPacketType, PacketHandler> = new Map();
    get players() {return this.lobby.players};
  
    constructor(type: GameModType, lobby: Lobby) {
        this.type = type;
        this.lobby = lobby;
    }
    
    async start(data?:any):Promise<any> {
        this.timestamp = Date.now();
        this.currentRound = 1;
        return this.onStart(data);
    }

    async onStart(data?:any):Promise<any> {
    }

    async end(data?:any):Promise<any> {
        await this.onEnd(data);
        return this.start();
    }

    async onEnd(data?:any):Promise<any> {
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

    onPacket(player:Player, p:ClientPacket) {
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

    subscribePacket(type:ClientPacketType, callback: PacketSubscriberCallback) {
        subscribe(this.packetEventSubscribers, type, callback);
    }

}
