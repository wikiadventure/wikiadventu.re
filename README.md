# WikiAdventure
<p align="center">
  <a href="http://wiki-adventure.herokuapp.com/" title="Wiki Adventure"><img width=402 height=250 src="front-quasar/wiki-adventure-quasar/public/svg/openGraph.svg" /></a>
</p>
## Setup

### Haxe

First you need to install haxe > 4.0.0 [here](https://haxe.org/download/)

Then install all needed haxe librairies with command :
```
haxelib install node.hxml
```
### NodeJS

then you need to install nodeJS > 12.16.0 [here](https://nodejs.org/en/download/)

then install the corresponding npm modules with command :
```
cd bin
npm install
```
### librairies

launch the setup script to install all the librairies.
It will install haxe lib, then backend npm lib and finally quasar and frontend lib! 

 ### Visual Studio Code   

make sure to install the haxe extension pack

## Debug

### Visual Studio Code

now you can hit debug > start debugging ( or f5 ), haxe will transpile the project to JavaScript in the bin/App.js file with the node.hxml config, quasar will build the front end and you can start debugging the node app with the Visual studio code debugger attach

## Structure ( WIP )

You can find a daigram of the project structure [here](https://lucid.app/lucidchart/invitations/accept/dca36f9b-f3a1-4547-a113-c6a8adb6ab82).
    
## TODO

- [ ] Add an celebration on the leaderboard screen


