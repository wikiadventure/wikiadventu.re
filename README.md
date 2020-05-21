# WikiAdventure

## Setup

### Haxe

First you need to install haxe > 4.0.0 [here](https://haxe.org/download/)

Then install all needed haxe librairies with command :
```
haxelib install hxnodejs
haxelib install hxsocketio
haxelib install hxnodejs-uuid
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

now you can hit debug > start debugging ( or f5 ), haxe will transpile the project to JavaScript in the bin/App.js file with the         node.hxml config and you can start debugging the node app with the Visual studio code debugger attach
    
    
## TODO

- [x] CSS routing
- [x] Connection form
- [x] Handle public lobby
- [x] Handle private lobby creation
- [x] Handle private lobby connection
- [x] Handle connection with direct lobby link ( without the connection form page )
- [x] integrate the wikipedia api rest v1 page in the design
- [x] Send players message with socket io
- [x] Share players message with socket io
- [x] Send players action with socket io
- [x] Handle players action on socket io
- [x] implemented verification to avoid cheating
- [x] Share players actions with socket io
- [ ] save data to make some statistic
