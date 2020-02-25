First you need to install haxe > 4.0.0 https://haxe.org/download/

Then install all needed haxe librairies with command :
    haxelib install hxnodejs
    haxelib install hxsocketio
    haxelib install hxnodejs-uuid

then you need to install nodeJS > 12.16.0 https://nodejs.org/en/download/

then install the corresponding npm modules with command :
    cd bin
    npm install

Now if you are on vscode make sure to install the haxe extension pack

    now you can hit debug, it will transpile the project to JavaScript in the bin/App.js file
    and debug the node app