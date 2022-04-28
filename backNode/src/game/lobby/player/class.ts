import type { PlayerMod } from './types';
import type  Ws from "ws";
import { randomUUID as uuid } from "node:crypto";

export class Player<T extends PlayerMod | never = never > {

    mod:T;

    socket?:Ws;
    pseudo:string;
    uuid:string;//for authentification
    score=0;
    numberOfJump=0;
    vote:String = "";
    voteSkip = false;
    id = -1;//for client identification
    alive = false;
    validationBuffer:Array<Promise<string>> = [];//used to store validation of visited
    validationList:Array<PageValidation> = [];
    get currentValidation() { return this.validationList.at(-1) }
    get currentPage() { return this.validationList.at(-1)?.page || "" }
    set currentPage(s:string) { this.validationList.push({page: s, validated: false}) }

    validationListReset() { this.validationList = [] }

    constructor(pseudo:string , ...[mod]: T extends never ? [] : [T]) {
        this.pseudo = pseudo.substring(30);
        this.mod = mod as T;
        this.uuid = uuid();
    }

    assignSocket(socket:Ws):boolean {
        if (this.socket != null) return false;
        this.socket = socket;
        this.socket.on('pong', () => this.alive = true);
        this.alive = true;
        return true;
    }

}

type PageValidation = {
    page:string,
    validated:boolean
}
