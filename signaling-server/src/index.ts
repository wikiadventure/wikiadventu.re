import { DurableObject } from "cloudflare:workers";

interface Env {
    ROOM: DurableObjectNamespace;
}

// Room Durable Object
export class Room extends DurableObject {

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
    }

    webSocketError(ws: WebSocket, error: unknown) {
        // Log the error and close the connection.
        console.error("WebSocket error:", error);
        ws.close(1011, "An error occurred");
    }

    async fetch(request: Request) {
        const url = new URL(request.url);

        if (request.headers.get("Upgrade") !== "websocket") {
            return new Response("Expected websocket", { status: 400 });
        }

        const { 0: client, 1: server } = new WebSocketPair();

        const clientId = crypto.randomUUID();
        this.ctx.acceptWebSocket(server, [clientId]);

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketOpen(ws: WebSocket) {
        const clientId = this.ctx.getTags(ws)[0];

        // Inform the new client about existing users
        const existingUsers = this.ctx.getWebSockets().map((client) => this.ctx.getTags(client)[0]).filter(id => id !== clientId);
        if (existingUsers.length > 0) {
            const peersMessage = JSON.stringify({ type: 'peers', peers: existingUsers });
            ws.send(peersMessage);
        }

        // Notify existing clients about the new client
        const newUserMessage = JSON.stringify({ type: 'peers', peers: [clientId] });
        this.broadcast(newUserMessage, clientId);
    }

    async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
        const senderId = this.ctx.getTags(ws)[0];
        try {
            const messageData = JSON.parse(message as string);
            this.handleYWebRTCMessage(senderId, messageData);
        } catch (e) {
            // For non-JSON messages, just forward.
            this.broadcast(message, senderId);
        }
    }

    private handleYWebRTCMessage(senderId: string, messageData: any) {
        const messageWithSender = { ...messageData, from: senderId };
        const messageStr = JSON.stringify(messageWithSender);

        if (messageData.to) {
            this.sendTo(messageData.to, messageStr);
        } else if (messageData.type === 'publish') {
            // These are y-webrtc-awareness messages, broadcast them
            this.broadcast(messageStr, senderId);
        } else if (messageData.type === 'subscribe') {

        } else {
            // Fallback for other messages, like discovery
            this.broadcast(messageStr, senderId);
        }
    }

    async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
        const clientId = this.ctx.getTags(ws)[0];
        // Notify remaining clients that this client has disconnected
        const disconnectMessage = JSON.stringify({
            type: 'peers',
            disconnected: [clientId],
        });
        this.broadcast(disconnectMessage, clientId);

        if (this.ctx.getWebSockets().length <= 1) {
            // Set an alarm to clean up the room if it's empty.
            this.ctx.storage.setAlarm(Date.now() + 15 * 60 * 1000);
        }
    }

    async alarm() {
        if (this.ctx.getWebSockets().length === 0) {
            await this.ctx.storage.deleteAll();
        }
    }

    private sendTo(clientId: string, message: string | ArrayBuffer) {
        for (const client of this.ctx.getWebSockets()) {
            if (this.ctx.getTags(client)[0] === clientId) {
                client.send(message);
                return;
            }
        }
    }

    private broadcast(message: string | ArrayBuffer, senderId?: string) {
        for (const client of this.ctx.getWebSockets()) {
            if (this.ctx.getTags(client)[0] !== senderId) {
                client.send(message);
            }
        }
    }
}

async function hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}


export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

        const corsHeaders = new Headers();
        corsHeaders.set("Access-Control-Allow-Origin", "*");
        corsHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
        corsHeaders.set("Access-Control-Allow-Headers", "Content-Type");

        const url = new URL(request.url);
        const room_name = url.pathname.slice(1);
        const password = url.searchParams.get("password") ?? "";

        if (!room_name) {
            return new Response("Not found", { status: 404, headers: corsHeaders });
        }

        if (request.method == "HEAD" && room_name == "ping") {
            return new Response(Date.now().toString(), { status: 200, headers: corsHeaders });
        }

        const passwordHash = await hashPassword(password, room_name);

        const id = env.ROOM.idFromName(passwordHash);
        const stub = env.ROOM.get(id);

        return stub.fetch(request);
    },
} satisfies ExportedHandler<Env>;
