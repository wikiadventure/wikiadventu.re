import { GameLoop, gameLoopSelect } from './gameLoop/class';
import { ConnectError } from './../../reply/ConnectError';
import { randomInt } from 'crypto';
import { hashPassword, Password, verifyPassWord } from 'src/crypto/password';

import type { Lang } from "src/lang";
import type { Player } from './player/class';
import { GameLoopType, VanillaGameLoopType } from './gameLoop/types';
import { LobbyType } from "./types";
import encode from "base32-encode";
import decode from "base32-decode";

// public var totalPlayer:Int = 0; //use to give an id to player when sending info with socket io
// public var slot:Int;
// public var id:Int;

// public var formatId(get,never):String;
// public function get_formatId():String {
//     return RandomBase32.encode(id);
// }

// public var passwordHash:String;
// public var lang:Lang;
// public var players:Array<Player>;
// public var ownerId:Int = 0;//we could meaby have multiple owner
// public var owner(get, never):Player;
// public function get_owner() return players.find(p->p.id==ownerId);

// public static var lobbyLimit:Int = 10000;
// public static var privateLimit:Int = 2000;
// public static var lobbyList:Array<Lobby> = [];

// public function new(lang:Lang, type:LobbyType, ?passwordHash:String, slot:Int=15) {
//     if (lobbyList.length >= lobbyLimit) throw ConnectError.LobbyLimitReached;
//     else if (getPrivateLobbyLength() >= privateLimit) throw ConnectError.PrivateLobbyLimitReached;
//     players = new Array<Player>();
//     this.lang = lang;
//     this.type = type;
//     this.slot = slot;
//     this.passwordHash = passwordHash;
//     heartbeat = Timers.setInterval(checkAlive, 30000);
//     insert();
// }

export class Lobby {

    static map = new Map<number, Lobby>();

    totalPlayers = 0;

    lang: Lang;
    type: LobbyType;
    password: Password;
    slot: number;
    id = -1;

    players: Player[] = [];
    ownerId = 0;

    gameLoop!: GameLoop;

    hearbeat = setInterval(this.checkAlive, 60000);

    constructor(lang: Lang, type: LobbyType, password = "", slot = 15) {
        this.lang = lang;
        this.type = type;
        this.password = hashPassword(password);
        this.slot = slot;
        this.insert();

    }

    insert() {
        var pos = -1;
        do {
            pos = randomInt(100000);
        } while (Lobby.map.has(pos));
        this.id = pos;
        Lobby.map.set(this.id, this);
    }

    static find(id: string) {
        const lobby = Lobby.map.get(Lobby.decodeId(id));
        if (lobby == null) throw ConnectError.NoLobbyFoundWithID;
        return lobby;
    }

    addplayer(player: Player) {
        this.players.push(player);
        player.id = this.totalPlayers;
        this.totalPlayers++;
        // kickOnTimeout(player);
        // log("new player registered : " + player.uuid + " --> " + player.pseudo, PlayerData);
    }

    checkForSlot() {
        if (this.players.length >= this.slot) throw ConnectError.LobbyFull;
        return {
            addPlayer: this.addplayer
        }
    }

    connect(password:string = "") {
        if (this.type == LobbyType.Public || verifyPassWord(password, this.password)) return this.checkForSlot();
        // log("connection rejected : " + player.uuid + " --> " + player.pseudo + "provide a wrong password", PlayerData);
        throw ""// ConnectError.InvalidPassword;
    }

    checkAlive() {
        this.players.forEach(p => {
            if (p.socket != null) {
                if (!p.alive) {
                    p.socket.close();
                    this.kickOnTimeout(p);
                } else {
                    p.alive = false;
                    p.socket.ping();
                }
            }
        })
    }

    get formatId() {
        return Lobby.encodeId(this.id);
    }

    /**
     * remove a player from the lobby,
     * send the new owner if he get remove
     *  and delete the lobby if it go empty
     * @param player to remove
     */
    removePlayer(player: Player) {
        // // log("player left : " + player.uuid + " --> " + player.pseudo, PlayerData);
        // // this.players.emitPlayerLeft(player);
        const i = this.players.indexOf(player);
        if (i == -1) return;
        this.players.splice(i, 1);
        const doOwnerChange = this.ownerId == player.id;
        if (this.players.length == 0) {
            // log("No player left, closing the lobby", Info);
            this.destroy();
            return;
        }
        // checkVoteSkip();
        if (doOwnerChange) {
            this.ownerId = this.players[0]!.id;
            // players.emitSetOwner(ownerId);
        }

    }

    kickOnTimeout(player: Player) {
        return setTimeout(() => player.socket != null || this.removePlayer(player), 120000);
    }

    destroy() {
        Lobby.map.delete(this.id);
        this.id = -1;
    }

    selectGameLoop(type: GameLoopType, config?:any) {
        this.gameLoop = gameLoopSelect(type, config);
    }

    static joinPublicFree(lang:Lang, gameLoop?:GameLoopType) {
        for (const [ _, l ] of this.map.entries()) {
            if (l.type == LobbyType.Public && (l.players.length < l.slot)) {
                if ( l.lang == lang ) {
                    if ( gameLoop == null || (l.gameLoop.type == gameLoop)) {
                        return l
                    }
                }
            }
        }
        // if no free slot are find create a new public lobby
        const lobby = new Lobby(lang, LobbyType.Public);
        lobby.selectGameLoop(gameLoop || VanillaGameLoopType.Classic);
        lobby.gameLoop.start();
        return lobby;
    }

    static encodeId(n: number) {
        const a: number[] = [];
        a.unshift(n & 255);
        while (n >= 256) {
            n = n >>> 8;
            a.unshift(n & 255);
        }
        while (a.length < 4) {
            a.unshift(0);
        }
        return encode(new Uint8Array(a), "Crockford").replace(/^0+/, "");
    }

    static decodeId(s: string) {
        try {
            if (s.length > 7) throw "s is too long"
            while (s.length < 7) s = "0" + s;
            const v = new DataView(new ArrayBuffer(32), 0);
            const u = new Uint8Array(decode(s, "Crockford"));
            for (var i = 0; i < 4; i++) v.setUint8(i, u[i] as number);
            return v.getUint32(0);
        } catch(e) {
            throw ConnectError.InvalidID;
        }
    }

}
