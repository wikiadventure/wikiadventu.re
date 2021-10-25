<h1 align="center">
	<a href="https://wikiadventu.re"><img width=402 height=250 src="front/public/svg/openGraph.svg" alt="Wiki Adventure"/></a>
</h1>

<p align="center">
    <a href="https://discord.gg/wRN6Dam">
        <img src="https://img.shields.io/discord/724622557554147348?logo=discord" alt="join me on Discord">
	</a>
    <a href="https://wikiadventu.re">
        <img src="https://img.shields.io/endpoint?url=https://wikiadventu.re/api/badge" alt="number of people onlines on the game">
	</a>
</p>
<h4 align="center">
	Wiki Adventure is a multiplayer game combining culture and speed. Players compete against each other on Wikipedia and have to scroll through the pages as quickly as possible to win.
</h4>

<p align="center">
	<strong>
		<a href="https://wikiadventu.re">Play</a>
		•
		<a href="#-tech-stack">Tech stack</a>
		•
		<a href="#%EF%B8%8F-contributing">Contributing</a>
		•
		<a href="#-diagram">Diagram</a>
		•
		<a href="#run-the-project">Run the project</a>
	</strong>
</p>


## 🚀 Tech stack

<p align="center">
	<a href="https://haxe.org"><img width=32 height=32 src="https://haxe.org/img/haxe-logo.svg" alt="Haxe logo"></a>
    <a href="https://nodejs.org"><img width=32 height=32 src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" alt="Node js logo"></a> 
    <a href="https://quasar.dev"><img width=32 height=32 src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="Quasar js logo"></a>  
    <a href="https://v3.vuejs.org"><img width=32 height=32 src="https://v3.vuejs.org/logo.png" alt="Vue js logo"></a>  
    <a href="https://vue-i18n.intlify.dev"><img width=36.57 height=32 src="https://vue-i18n.intlify.dev/vue-i18n-logo.png" alt="Vue js logo"></a>
	<a href="https://www.typescriptlang.org"><img width=32 height=32 src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Typescript logo"></a>
</p>

The project is Web app made out of a backend and a frontend:

- The backend is written in [Haxe](https://haxe.org) which compile to javascript that will be interpreted by Node js.
    - It also use the [Twurple](https://github.com/twurple/twurple) , the [ws](https://github.com/websockets/ws) and the [uuid](https://github.com/uuidjs/uuid) lib.
- The frontend is written in [Quasar](https://quasar.dev) 2 based on [Vue 3](https://v3.vuejs.org) with typescript
    - It also use the [vue-i18n](https://vue-i18n.intlify.dev) lib.

## 🖋️ Contributing

<p align="center">
    <a href="https://github.com/Sacramentix/WikiAdventure/actions/workflows/tests-monitor-links.yml">
        <img src="https://github.com/Sacramentix/WikiAdventure/actions/workflows/tests-monitor-links.yml/badge.svg?branch=master)" alt="Link Monitoring State">
	</a>
</p>

Want to help with Wiki Adventure? Well first, Thank you so much for your interest! We are always appreciate for improvements to the project and contributions from open-source developers are greatly appreciated.
What you can do to help:
- Make the game available in your language, check this guide (WIP).
- Create you own game mode, check this guide (WIP).
- Solve one of those issue (if there no issue we've made a great job!).
- Make a code review. It always good to have a second eye!
- Donate on [Ko-Fi](https://ko-fi.com/sacramentix) ❤️

## 📋 Diagram
<p align="center">Check out the backend diagram ( still in progress ) </p>
<p align="center">
	<a 
	   href="https://app.diagrams.net/?title=AppDiagram.drawio.svg&ui=dark#Uhttps%3A%2F%2Fraw.githubusercontent.com%2FSacramentix%2FWikiAdventure%2FQuasar-V2%2Fback%2FAppDiagram.drawio.svg"
	   title="Draw io logo">
		<img width=199 height=50 src="https://drawio-app.com/wp-content/uploads/2020/11/drawio_logo_RGB_dark_mini_199x50px.png" />
	</a>
</p>
<p align="center">Frontend diagram soon!</p>

## Run the project

#### Node js
- Make sure you have v14 or higher. You can install it from the official website [here](https://nodejs.org).
#### Librairies
- Install all the required librairies for the backend and frontend in one click with the [setup.sh](/setup.sh) script.
```
echo "Install global lib"
npm i -g lix; npm i -g nodemon; npm i -g @quasar/cli
echo "Install local lib"
cd back; npm i; cd ../bin; npm i; cd ../front; npm i
```
#### Workspace
- If you use [Visual Studio Code](https://code.visualstudio.com) (I recommend it ❤️) you can open the project with the project.code-workspace file.
#### Debug
- In [Visual Studio Code](https://code.visualstudio.com) just press F5 to run the default debug config.
#### Run a private instance
- First make sure you follow [# Node js](#node-js) and [# Librairies](#librairies) part. Then go to the bin folder and run 
```
npm run build; npm run start
``` 
