// package lobby.packet.emitter.vanilla;

// import lobby.player.Player;
// import haxe.Json;
// import lobby.packet.emitter.ServerPacket.VanillaServerPacketType;
// using Lambda;

// typedef ServerRollback= ServerPacket & {
//     page: String
// }

// class RollbackEmitter {

    
//     public static function emitRollback(player:Player, oldPage:String) {
//         var data:ServerRollback = {
//             type: VanillaServerPacketType.Rollback,
//             page: oldPage
//         }
//         var textData = Json.stringify(data);
//         if(player.socket != null) player.socket.send(textData);
//     }

// }