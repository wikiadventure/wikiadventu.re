import type { RequestInit } from "node-fetch";

export const wikiHeaders = {
    "Api-User-Agent": "wikiadventu.re (https://wikiadventu.re; pro@sacramentix.fr)"
}

export const wikiRequestInit:RequestInit = {
    method: "POST",
    headers: wikiHeaders
}