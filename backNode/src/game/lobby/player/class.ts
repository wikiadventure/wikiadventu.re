import type  Ws from "ws";
import { randomUUID as uuid } from "node:crypto";

export class Player {

    socket?:Ws;
    pseudo:string;
    uuid:string;//for authentification
    score=0;
    voteSkip = false;
    id = -1;//for client identification
    alive = false;

    constructor(pseudo:string) {
        this.pseudo = pseudo.substring(30);
        this.uuid = uuid();
    }

    assignSocket(socket:Ws) {
        var firstConnection = true;
        if (this.socket != null) {
            firstConnection = false;
            this.socket.close(1006, "New socket connected");
        }
        this.socket = socket;
        this.socket.on('pong', () => this.alive = true);
        this.alive = true;
        return firstConnection;
    }

    reset() {
        this.score=0;        
    }

}
