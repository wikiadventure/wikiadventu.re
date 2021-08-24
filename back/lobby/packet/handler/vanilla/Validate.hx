package lobby.packet.handler.vanilla;

import lobby.packet.PacketEventSubscriber.InternalPacket;
import lobby.packet.PacketEventSubscriber.InternalPacketType;
import lobby.wikiAPI.WikiTools;
import lobby.player.Player;
import lobby.packet.handler.ClientPacket.VanillaClientPacketType;

typedef ClientValidate = ClientPacket & {
    page:String
}

class ClientValidateHandler extends PacketHandler {

    final type = VanillaClientPacketType.Validate;

    override function canProcess(c:ClientPacket) return c.type == type;

    override function process(lobby:Lobby, player:Player, c:ClientPacket) {
        var json:ClientValidate = cast c;
        if (json.page == null) return;
        var toValidate = json.page;
        if (player.currentPage == toValidate) return;
        WikiTools.validate(lobby, player, toValidate)
        .then(
            page -> {
                var p:InternalValidationSucessPacket = cast c;
                p.type = InternalPacketType.ValidationSucess;
                p.page = page;
                lobby.gameLoop.onPacket(player, p);
            },
            reason -> {
                var p:InternalValidationFailedPacket = cast c;
                p.type = InternalPacketType.ValidationFailed;
                p.reason = reason;
                lobby.gameLoop.onPacket(player, p);
            }

        );
    }
}

typedef InternalValidationSucessPacket = InternalPacket & {
    page: String
}

typedef InternalValidationFailedPacket = InternalPacket & {
    reason: ValidationReject
}
