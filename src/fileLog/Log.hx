package fileLog;

import js.node.Path;
import js.node.Fs;

class Log {
    
    public static function inFile(fileName:String, content:String) {
        var file = "log/" + fileName;
        try {
            ensureDirectoryExistence(file);
        } catch (e:Dynamic) {
            trace(e);
        }
        Fs.appendFile(file, content + "\n", function (error) {
            if (error != null) {
                trace("ERROR !!!! cannot log : " + error);
            }
        });
    }

    public static function ensureDirectoryExistence(filePath) {
      var dirname = Path.dirname(filePath);
      if (Fs.existsSync(dirname)) {
        return true;
      }
      ensureDirectoryExistence(dirname);
      Fs.mkdirSync(dirname);
      return false;
    }
}