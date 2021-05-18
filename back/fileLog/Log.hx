package fileLog;

import js.lib.Promise;
import js.node.Path;
import js.node.Fs;

class Log {
    
    public static function inFile(fileName:String, content:String) {
        var file = "log/" + fileName;
        try {
            var dirs = file.substring(0, file.lastIndexOf('/'));
            ensureDirectoryExistence(dirs)
            .then(
                function (b) {
                    Fs.appendFile(file, content + "\n", function (error) {
                        if (error != null) {
                            trace("ERROR !!!! cannot log : " + error);
                        }
                    });  
                }
            );
        } catch (e:Dynamic) {
            trace(e);
        }
    }

    public static function ensureDirectoryExistence(filePath):Promise<Bool> {
        return new Promise<Bool>(
            function (resolve, reject) {
                Fs.mkdir(filePath,  js.Syntax.code("{ recursive: true }"), function (e:js.lib.Error) {
                    if (e != null) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
            }
        );
    }
}