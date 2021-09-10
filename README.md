# WikiAdventure

<p align="center">
    <a href="https://discord.gg/wRN6Dam">
        <img src="https://img.shields.io/discord/724622557554147348?logo=discord"
            alt="join me on Discord"></a>
    <a href="https://wiki-adventure.sacramentix.fr">
        <img src="https://img.shields.io/endpoint?url=https://wiki-adventure.sacramentix.fr/api/badge"
            alt="number of people onlines on the game"></a>
</p>

<p align="center">
  <a href="http://wiki-adventure.sacramentix.fr" title="Wiki Adventure"><img width=402 height=250 src="front/public/svg/openGraph.svg" /></a>
</p>
Wiki Adventure is a multiplayer game combining culture and speed. Players compete against each other on Wikipedia and have to scroll through the pages as quickly as possible to win.

## 🚀Tech stack

<p align="center">
    <a href="https://haxe.org"><img width=32 height=32 src="https://haxe.org/img/haxe-logo.svg" alt="Haxe logo"></a>
    <a href="https://nodejs.org"><img width=52.24 height=32 src="https://nodejs.org/static/images/logo.svg" alt="Node js"></a>
</p>

The project is Web app made out of a backend and a frontend:

- The backend is written in [Haxe](https://haxe.org) which compile to javascript that will be interpreted by Node js.
    - It also use the [Twurple](https://github.com/twurple/twurple) , the [ws](https://github.com/websockets/ws) and the [uuid](https://github.com/uuidjs/uuid) lib.
- The frontend is written in [Quasar](https://quasar.dev) 2 based on [Vue 3](https://v3.vuejs.org) with typescript
    - It also use the vue-i18n lib.

## Setup

### NodeJS

First, you need to install [NodeJS > 12.16.0 here](https://nodejs.org/en/download/)

### Librairies

Launch the setup script to install Lix, Haxe, Quasar and all needed librairies.

### Code Workspace

Open the project with the project.code-workspace with Visual Studio Code.

 ### Extension

Make sure to install the recommended extension.

## Debug

### Visual Studio Code

Now you can hit run > start debugging ( or the f5 key ).
The back and front will be built and the Visual Studio Code debugger will be attach.

## Diagram
<p align="center">Check out the project diagram on</p>
<p align="center"><a href="https://app.diagrams.net/#HSacramentix%2FWikiAdventure%2FQuasar-V2%2Fback%2FAppDiagram.drawio.svg" title="Draw io logo"><img width=199 height=50 src="https://drawio-app.com/wp-content/uploads/2020/11/drawio_logo_RGB_dark_mini_199x50px.png" /></a></p>
