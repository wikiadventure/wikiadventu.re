package async;

import js.node.socketio.Server.Namespace;
import js.node.socketio.*;

class IO {
    
    public static var server:Server;

    public static function init(app:Dynamic) {

        server = new Server(app);

        server.listen(5001);
        
    }

}