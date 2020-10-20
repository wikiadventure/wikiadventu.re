# WikiAdventure

<p align="center">
  <a href="http://wiki-adventure-io.herokuapp.com/" title="Wiki Adventure"><img width=294 height=256 src="bin/res/svg/logoV1.svg" /></a>
</p>

## Setup

### Haxe

First you need to install haxe > 4.0.0 [here](https://haxe.org/download/)

Then install all needed haxe librairies with command :
```
haxelib git twitch-chat-client https://github.com/Sacramentix/hx-twitch-chat-client.git
haxelib install hxsocketio
haxelib install uuid
haxelib install tink_json
```
### NodeJS

then you need to install nodeJS > 12.16.0 [here](https://nodejs.org/en/download/)

then install the corresponding npm modules with command :
```
cd bin
npm install
```
 ### Visual Studio Code   

make sure to install the haxe extension pack

## Debug

### Visual Studio Code

now you can hit debug > start debugging ( or f5 ), haxe will transpile the project to JavaScript in the bin/App.js file with the node.hxml config, quasar will build the front end and you can start debugging the node app with the Visual studio code debugger attach

## Structure ( WIP )

You can find a digram of the project structure [here](https://app.creately.com/diagram/c3k6MCT7yss).
    
## TODO

- [ ] Make a game layout in quasar
- [ ] Vuex store for game data
- [ ] handle connection with the new front end
