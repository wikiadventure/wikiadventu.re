import { ModPacketType, ModPacketTypeId } from "./mod/type"
import { VanillaPacketType, VanillaPacketTypeId } from "./vanilla/type";

/**
 * An interface that define an object that can check if he can process the packet
 */
 export type PacketHandler<T extends PacketType> = {
    /**
     * A type guard that verify if packet type match given one
     */
    canProcess: (c: Packet<unknown>) => c is Packet<T>,
    /**
     * A function that process the data of the packet
     */
    process:(c:T) => Promise<void>

}

export type PacketType = VanillaPacketType | ModPacketType | unknown;

export type PacketTypeId = VanillaPacketTypeId | ModPacketTypeId;

export type Packet<T extends PacketType> = T & {
    type:PacketTypeId,
}