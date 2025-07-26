/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { DurableObject } from "cloudflare:workers";

interface Env {
	ROOM: DurableObjectNamespace;
}

// Room Durable Object
export class Room extends DurableObject {
	passwordHash?: string;
	salt?: string;
	awarenessStates: Map<string, any> = new Map();

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.ctx.blockConcurrencyWhile(async () => {
			this.passwordHash = await this.ctx.storage.get("passwordHash");
			this.salt = await this.ctx.storage.get("salt");
			this.awarenessStates = (await this.ctx.storage.get("awarenessStates")) || new Map();
		});
	}

	webSocketError(ws: WebSocket, error: unknown) {
		// Log the error and close the connection.
		console.error("WebSocket error:", error);
		ws.close(1011, "An error occurred");
	}

	private async hashPassword(password: string, salt: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(password + salt);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	async fetch(request: Request) {
		const url = new URL(request.url);
		const password = url.searchParams.get("password");

		if (this.passwordHash && this.salt) {
			if (!password) {
				return new Response("Password required", { status: 401 });
			}
			const requestPasswordHash = await this.hashPassword(password, this.salt);
			if (this.passwordHash !== requestPasswordHash) {
				return new Response("Invalid password", { status: 403 });
			}
		} else if (password) {
			// First user sets the password
			this.salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			this.passwordHash = await this.hashPassword(password, this.salt);
			await this.ctx.storage.put({
				passwordHash: this.passwordHash,
				salt: this.salt,
			});
		}

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

		// Send existing awareness states to the new client
		for (const [id, awareness] of this.awarenessStates.entries()) {
			if (id !== clientId) {
				const awarenessMessage = {
					type: 'publish',
					from: id,
					awareness: awareness,
				};
				ws.send(JSON.stringify(awarenessMessage));
			}
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
			if (messageData.awareness) {
				this.awarenessStates.set(senderId, messageData.awareness);
				this.ctx.storage.put("awarenessStates", this.awarenessStates);
			}
			// These are y-webrtc-awareness messages, broadcast them
			this.broadcast(messageStr, senderId);
		} else if (messageData.type === 'subscribe') {
			// y-webrtc clients send this message to get awareness states.
			for (const [clientId, awareness] of this.awarenessStates.entries()) {
				if (clientId !== senderId) {
					const awarenessMessage = {
						type: 'publish',
						from: clientId,
						awareness: awareness,
					};
					this.sendTo(senderId, JSON.stringify(awarenessMessage));
				}
			}
		} else {
			// Fallback for other messages, like discovery
			this.broadcast(messageStr, senderId);
		}
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		const clientId = this.ctx.getTags(ws)[0];
		this.awarenessStates.delete(clientId);
		this.ctx.storage.put("awarenessStates", this.awarenessStates);
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


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const roomId = url.pathname.slice(1);

		if (!roomId) {
			return new Response("Not found", { status: 404 });
		}

		const id = env.ROOM.idFromName(roomId);
		const stub = env.ROOM.get(id);

		return stub.fetch(request);
	},
} satisfies ExportedHandler<Env>;
