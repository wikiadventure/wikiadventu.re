package macros;

class Env {
    public static macro function getPort():haxe.macro.Expr {
        if (haxe.macro.Context.defined("port")) {
            var port = haxe.macro.Context.definedValue("port");
            return macro $v{port};
        } else {
            return macro process.env['PORT'];
        }
    }  
}
