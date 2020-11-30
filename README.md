# WikiAdventure

<p align="center">
  <a href="http://wiki-adventure-io.herokuapp.com/" title="Wiki Adventure"><img width=294 height=256 src="bin/res/svg/logoV1.svg" /></a>
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
### Quasar

Check the README.md in front-quasar/wiki-adventure-quasar

 ### Visual Studio Code   

make sure to install the haxe extension pack

## Debug

### Visual Studio Code

now you can hit debug > start debugging ( or f5 ), haxe will transpile the project to JavaScript in the bin/App.js file with the node.hxml config, quasar will build the front end and you can start debugging the node app with the Visual studio code debugger attach

## Structure ( WIP )

You can find a digram of the project structure [here](https://app.creately.com/diagram/c3k6MCT7yss).
    
## TODO

- [x] Make a game layout in quasar
- [x] Vuex store for game data
- [x] Handle connection with the new front end
- [x] Add round winner animation
- [x] Add a leaderboard at the end of the game
- [x] Add close button to the round winner animation and leaderboard
- [x] Integrate theme switch, ui language select ( ui lange != game lang which define the wiki language )
- [ ] Complete the i18n internalization
- [x] Add sound in game
- [x] Add a volume slider and a mute button
- [ ] Add an celebration on the leaderboard screen
