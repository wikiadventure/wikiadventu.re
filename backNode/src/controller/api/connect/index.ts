import type { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import type { GameLoopType } from "src/game/lobby/gameLoop/types";
import type { Lang } from "src/lang";

const options:RouteShorthandOptions = {
    schema: {

    }
}

export function connect(req: FastifyRequest, rep: FastifyReply) {

    
    // switch req.body.type {
    //     case PublicJoin: new PublicJoinController(im, sr, body, form);
    //     case PrivateCreate: new PrivateCreateController(im, sr, body, form);
    //     case PrivateJoin: new PrivateJoinController(im, sr, body, form);
    //     default: new ConnectionError(im, sr, InvalidLobbyType);
    // }

}

// type ConnectRequest = {
//     type:LoginType,
//     lang:Lang,
//     pseudo:String,
//     slot?:number,
//     gameLoop?:GameLoopType,
//     password?:string,
//     lobby?:string,
//     config:any
// }
