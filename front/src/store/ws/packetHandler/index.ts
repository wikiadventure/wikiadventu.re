import { Packet, PacketHandler, PacketType } from "./type";

/**
 * An array that contain {@link PacketHandler} that is used to process all the packet receive on the websocket
 * The array must be filled with all the needed handler of the gameMode at the start of game
 */
export const PacketHandlers:PacketHandler<any>[] = [];

/**
 * Loop trough all {@link PacketHandler} in {@link PacketHandlers} and process the p {@link Packet} if it can
 * Does nothing if no {@link PacketHandler} can process p {@link Packet} type
 */
export async function handlePacket(p:Packet<PacketType>) {
    for (const h of PacketHandlers) if (h.canProcess(p)) return h.process(p);
    if(process.env.DEV) {
        console.log(
            "Non handle packet of type " + p.type, 
            p, 
            "Make sure you filled the PacketHandlers array with all needed PacketHandler"
        );
    }
}