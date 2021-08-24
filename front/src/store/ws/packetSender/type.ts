import { ModClientPacketType, ModClientPacketTypeId } from "./mod/type";
import { VanillaClientPacketType, VanillaClientPacketTypeId } from "./vanilla/type";

export type ClientPacketType = VanillaClientPacketType | ModClientPacketType;

export type ClientPacketTypeId = VanillaClientPacketTypeId | ModClientPacketTypeId;

export type ClientPacket<T extends ClientPacketType> = T & {
    type:ClientPacketTypeId,
}