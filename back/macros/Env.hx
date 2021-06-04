package macros;

class Env {
    public static macro function get(p:String):haxe.macro.Expr {
        if (haxe.macro.Context.defined(p)) {
            var x = haxe.macro.Context.definedValue(p);
            return macro $v{x};
        } else {
            return macro process.env[$v{p}];
        }
    }  
}
