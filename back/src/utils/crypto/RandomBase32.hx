package utils.crypto;

import haxe.crypto.BaseCode;
import haxe.io.Bytes;
import haxe.io.BytesBuffer;

class RandomBase32 {
    
    public static function init() {
        shuffle();
    }
    public static var firstChar:String = "";
    public static var codeTable:Bytes = null;

    static function shuffle() {
        var letters = "abcdefghijklmnopqrstuvwxyz".split("");
        var digits = "0123456789".split("");
        for (i in 0...4) letters.splice(Std.random(letters.length),1);
        var chars = letters.concat(digits);
        var i = chars.length - 1;
        while (i > 0) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
            i--;
        }
        firstChar = chars[0];
        codeTable = Bytes.ofString(chars.join(""));
    }

    public static function encode(n:Int):String {
        var b = Bytes.alloc(4);
        b.setInt32(0,n);
        var t = new BaseCode(codeTable).encodeBytes(b).toString();
        var i = t.length;
        while (t.charAt(--i)==firstChar) {};
        return t.substring(0,i+1);
    }

    public static function decode(str:String):Int {
        var b = new BytesBuffer();
        var s = Bytes.ofString(str);
        b.addBytes(s,0,s.length);
        while (b.length < 7) b.addString(firstChar);
        return new BaseCode(codeTable).decodeBytes(b.getBytes()).getInt32(0);
    }
}