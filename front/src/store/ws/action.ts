import { id, type } from "../lobby/state";
import { LobbyType } from "../lobby/type";
import { uuid } from "../player/state";
import { handlePacket } from "./packetHandler";
import { Packet } from "./packetHandler/type";
import { ws } from "./state";


export function connect() {
  var loc = window.location;
  var protocol = loc.protocol == "https:" ? "wss://" : "ws://";
  var lobbyType = type.value == LobbyType.Twitch ? "twitchLobby" : "lobby";
  if(process.env.DEV) {
    var wsURL = protocol + "localhost:5000" + "/" + lobbyType + "/" + id.value + "/" + uuid.value;
  } else {
    var wsURL = protocol + loc.host + "/" + lobbyType + "/" + id.value+ "/" + uuid.value;
  }
  ws.value  = new WebSocket(wsURL);
  ws.value.onopen = onOpen;
  ws.value.onclose = onClose;
  ws.value.onerror = onError;
  ws.value.onmessage = onMessage
};

function onOpen(e:Event) {
  console.log("Websocket  open : ", e);
};

function onClose(e:CloseEvent) {
  console.log("Websocket close : ", e.code, e.reason);
};

function onError(e:Event) {
  console.log("Websocket error : ", e);
};

function onMessage(e:MessageEvent) {
  var p:Packet<unknown> = JSON.parse(e.data);
  handlePacket(p);
};