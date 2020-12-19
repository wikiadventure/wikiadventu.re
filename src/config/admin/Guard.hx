package config.admin;

import haxe.crypto.Sha256;
import js.Node.process;

class Guard {
    
    private static var passwordHash:String;

    public static function init() {
        passwordHash = process.env['ADMIN_PASSWORD'];
    }

    public static function checkPassword(p:String):Bool {
        return Sha256.encode(p) == passwordHash;
    }

}