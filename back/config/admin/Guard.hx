package config.admin;

import haxe.crypto.Base64;
import js.node.http.ServerResponse;
import js.node.http.IncomingMessage;
import haxe.crypto.Sha256;
import haxe.http.HttpStatus;
import js.Node.process;

class Guard {
    
    private static var passwordHash:String;

    public static function init() {
        passwordHash = process.env['ADMIN_PASSWORD'];
    }

    public static function checkPassword(p:String):Bool {
        return Sha256.encode(p) == passwordHash;
    }

    public static function auth(im : IncomingMessage, sr : ServerResponse, body : String) {
        var pass:String = im.headers.get("authorization");
        if (pass == null) return reject(sr);
        var bytes = Base64.decode(pass.substring(6));
        pass = bytes.getString(0,bytes.length);
        if(!checkPassword(pass.substring(1))) return reject(sr);
        return true;
    }

    public static function reject(sr:ServerResponse):Bool {
        sr.setHeader("WWW-Authenticate", 'Basic realm="Access denied, please provide the correct password!"');
        sr.writeHead(Unauthorized);
        sr.write("Access denied, please provide the correct password!");
        sr.end();
        return false;
    }
}