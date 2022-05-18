import decode from "base32-decode";
import encode from "base32-encode";
import type Ws from "ws";
import { type Password, hashPassword, verifyPassWord } from "@crypto/password";
import type { GameMode } from "@gameMode/class";
import { GameModType } from "@gameMode/types";
import type { Lang } from "@lang";
import { emitCurrentPlayers } from "@packet/emitter/CurrentPlayer";
import { emitPlayerJoin } from "@packet/emitter/PlayerJoin";
import { emitPlayerLeft } from "@packet/emitter/PlayerLeft";
import { emitSetOwner } from "@packet/emitter/SetOwner";
import { handlePacket } from "@packet/handler";
import type { Player } from "@player/class";
import { ConnectError } from "@reply/ConnectError";
import { randomInt } from "crypto";

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

    gameMode!: GameMode;

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
        this.kickOnTimeout(player);
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
        throw ConnectError.InvalidPassword;
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
        emitPlayerLeft(this.players, player);
        const i = this.players.indexOf(player);
        if (i == -1) return;
        this.players.splice(i, 1);
        const doOwnerChange = this.ownerId == player.id;
        if (this.players.length == 0) {
            // log("No player left, closing the lobby", Info);
            this.destroy();
            return;
        }
        this.checkVoteSkip();
        if (doOwnerChange) {
            this.ownerId = this.players[0]!.id;
            emitSetOwner(this.players, this.ownerId)
        }

    }

    getPlayerFromUUID(uuid:String) {
        return this.players.find(p=>p.uuid===uuid);
    }

    /**
     * Websocket part
     * 
     */

    onWsAuth(ws:Ws, uuid:String) {
        const player = this.getPlayerFromUUID(uuid);
        if ( player != null ) {
            if (player.assignSocket(ws) ) {
                return this.onPlayerConnection(player);
            }
        }
        return ws.close(1008, 'Connection rejected because playerID is not registered in the lobby');
    }

    onPlayerConnection(player:Player) {
        emitPlayerJoin(this.players, player);
        this.sendState(player);
        player.socket!.on('message', (data:string) => handlePacket(this, player, data));//handle is method from the static extension packet/PacketHandler.hx
        player.socket!.on('close', (data) => this.websocketDisconnect(player));
    }

    sendState(player:Player) {
        const timeLeft = this.gameMode.gamePhase.duration - (Date.now()- this.gameMode.timestamp);
        emitSetOwner([player], this.ownerId);
        emitCurrentPlayers(this.players, player);
        this.gameMode.sendState(player);
        this.gameMode.gamePhase.sendState(player);
    }

    websocketDisconnect(player:Player) {
        player.socket = undefined;
        this.kickOnTimeout(player);
    }

    kickOnTimeout(player: Player) {
        return setTimeout(() => player.socket == null && this.removePlayer(player), 120000);
    }

    checkVoteSkip() {
        if (this.players.every(p=>p.voteSkip||!p.socket)) {
            this.gameMode.gamePhase.end();
            return true;
        } return false;
    }

    destroy() {
        this.gameMode.gamePhase.timer.abort();
        Lobby.map.delete(this.id);
        this.id = -1;
    }

    isDetroyed() {
        return this.id == -1;
    }

    selectGameMode(type: GameModType, config?:any) {
        // this.gameMode = GameModeSelect(type, config);
    }

    static joinPublicFree(lang:Lang, gameMode?:GameModType) {
        for (const [ _, l ] of this.map.entries()) {
            if (l.type == LobbyType.Public && (l.players.length < l.slot)) {
                if ( l.lang == lang ) {
                    if ( gameMode == null || (l.gameMode.type == gameMode)) {
                        return l
                    }
                }
            }
        }
        // if no free slot are find create a new public lobby
        const lobby = new Lobby(lang, LobbyType.Public);
        lobby.selectGameMode(gameMode || GameModType.Classic);
        lobby.gameMode.start();
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

    static decodeId(id: string) {
        try {
            if (id.length > 7) throw "id is too long"
            while (id.length < 7) id = "0" + id;
            const v = new DataView(new ArrayBuffer(32), 0);
            const u = new Uint8Array(decode(id, "Crockford"));
            for (var i = 0; i < 4; i++) v.setUint8(i, u[i] as number);
            return v.getUint32(0);
        } catch(e) {
            throw ConnectError.InvalidID;
        }
    }

}

export enum LobbyType {
    Public,
    Private,
    Twitch
}