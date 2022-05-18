import { setTimeout } from 'node:timers/promises';
import type { Lobby } from "@lobby/class";
import { wsEmit } from "@packet/emitter";
import { ServerPacketType } from "@packet/emitter/types";
import type { ClientPacketType } from "@packet/handler/type";
import type { Player } from "@player/class";
import type { WikiPage } from "@wikiApi/pagePicker";
import { GamePhase } from "./class";
import { GamePhaseType } from "./types";

type PlayingStartData = {
    start: WikiPage,
    end: WikiPage
}

export class Playing extends GamePhase {

    static firstScoreGain = 1000;

    override type = GamePhaseType.Playing as const;

    startPage:WikiPage;
    endPage:WikiPage;

    timeAfterVictory = 60;

    victoryTimestamp = -1;

    leaderboard:PlayingPlayer[] = [];// a stack containing player by order of victoryTime

    hasWinner = false;

    override get players() {return this.lobby.players as PlayingPlayer[]};
    
    override async start(data?: any): Promise<any> {
    }

    override async onStart(data?:any):Promise<PlayingStartData> {
        this.players.forEach(p=>p.pageHistory = [this.startPage])
        return { start: this.startPage, end: this.endPage };
    }

    override async onEnd(data?:any) {
        return;
    }


    override sendState(player:Player) {
        this.emitState([player], { start: this.startPage, end: this.endPage } as PlayingStartData);
    }
    
    constructor(start:WikiPage, end:WikiPage, lobby:Lobby, duration = 600) {
        super(lobby, duration);
        this.startPage = start;
        this.endPage = end;
        
    }

    handleLink(lobby:Lobby, player:Player, c:ClientLink) {
        const p = player as PlayingPlayer;
        if (p.pageHistory != null) p.pageHistory.push(c.page);
        if (c.page.id == this.endPage.id) this.win(p);
    }

    win(player:PlayingPlayer) {
        const time = Date.now() - this.victoryTimestamp;
        if (time >= this.timeAfterVictory) return;
        if (this.leaderboard.length == 0) {
            this.victoryTimestamp = Date.now();
            player.score += Playing.firstScoreGain;
            if (this.victoryTimestamp - this.timestamp >= this.timeAfterVictory*1000) {
                this.timer.abort();
                this.timer = new AbortController();
                try {
                    setTimeout(this.timeAfterVictory*1000, undefined, { signal: this.timer.signal }).then(this.end).catch();
                } catch {}
                emitWin(this.players, player, Playing.firstScoreGain, this.timeAfterVictory);
            }
        } else {
            // the score decrease when the first player win until it reache half at the end
            const scoreGain = Playing.firstScoreGain * (1.5-this.timeAfterVictory / time);
            player.score += scoreGain;
            emitWin(this.players, player, Playing.firstScoreGain);
        }
        this.leaderboard.push(player);
    }

}

interface PlayingPlayer extends Player {
    pageHistory: WikiPage[]
}

type ClientLink = {
    type: ClientPacketType.GamePhase,
    gamePhase: GamePhaseType.Playing,
    page: WikiPage
}

type ServerWin = {
    type: ServerPacketType.GamePhase,
    gamePhase: GamePhaseType.Playing,
    player: number, //id
    scoreGain: number,// score gained on this phase
    score: number, // score after the gain ( for sync purpose )
    newTime?: number
}

function emitWin(players:Player[], player:Player, scoreGain:number, newTime?:number) {
    wsEmit(players, {
        type: ServerPacketType.GamePhase,
        gamePhase: GamePhaseType.Playing,
        player: player.id,
        scoreGain,
        score: player.score,
        newTime
    } as ServerWin)
}



// type WikiPageId = number;