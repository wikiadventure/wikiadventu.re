import { EventSubscriber } from "src/script/eventSubscribe";
import { lang } from "store/lobby/state";
import { endPage, startPage } from "store/vote/state";
import { loadPreviews } from "store/wiki/action";
import { Packet, PacketHandler } from "../../type";
import { VanillaPacketTypeId } from "../type";

export interface WsVoteResult {
    start:string,
    end:string
}

export const onVoteResult:EventSubscriber<WsVoteResult> = new EventSubscriber();

export function canProcess(p:Packet<unknown>): p is Packet<WsVoteResult> {
    return p.type == VanillaPacketTypeId.VoteResult;
}

export async function process(v:WsVoteResult) {
    startPage.value.title = v.start;
    endPage.value.title = v.end
    var previews = await loadPreviews([v.start, v.end], lang.value);
    startPage.value = previews.find((w) => w.title == v.start) || {};
    endPage.value = previews.find((w) => w.title == v.end) || {};
    onVoteResult.forEach(f=>f(v));
}

export const voteResultHandler:PacketHandler<WsVoteResult> = {
    canProcess,
    process
}