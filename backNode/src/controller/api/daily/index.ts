import { schedule } from "node-cron";
import { currentPages, setDailyCurrentPage } from "./DailyPage";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { DailyRequest } from "./types";

setDailyCurrentPage();
schedule('0 1 * * *', setDailyCurrentPage, {
    scheduled: true,
    timezone: "UTC"
});

export function Daily(req: FastifyRequest, rep: FastifyReply) {
    const form = req.body as DailyRequest;
    const c = currentPages.get(form.lang);
    if (c==null) {
        rep.code(400)
            .send({ code: DailyError.NoDailyForLang });
        return;
    }
    rep.send({ start: c.start, end: c.end });
}

enum DailyError {
	NoDailyForLang = 300,
}
