package lobby.packet.handler.vanilla;

import lobby.packet.PacketHandler.IPacketHandler;
import lobby.Lobby.LogType;
import lobby.Lobby.LogType;
import lobby.gameLoop.Phase.VanillaPhaseType;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket;

typedef ClientStart = ClientPacket;

class ClientStartHandler implements IPacketHandler {

    final type = VanillaClientPacketType.Start;

    function new(){}

    public static final instance = new ClientStartHandler();

    public function canProcess(c:ClientPacket) return c.type == type;

    public function process(lobby:Lobby, player:Player, c:ClientStart) {
        if (player.id != lobby.ownerId) return lobby.log("Someone who is not owner tried to start --> " + player.uuid, LogType.Error);
        if (lobby.gameLoop.phase.type != VanillaPhaseType.Waiting) return lobby.log("Game already start --> "  + player.uuid, LogType.Error);
        lobby.gameLoop.phase.end();
    }

}
