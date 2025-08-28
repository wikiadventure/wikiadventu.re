<h1 align="center">
	<a href="https://wikiadventu.re"><img width=402 height=250 src="./public/openGraph.svg" alt="Wiki Adventure"/></a>
</h1>

<p align="center">
    	<a href="https://discord.gg/wRN6Dam">
        	<img src="https://img.shields.io/discord/724622557554147348?logo=discord" alt="join me on Discord">
	</a>
   	<!-- <a href="https://wikiadventu.re">
        	<img src="https://img.shields.io/endpoint?url=https://api.wikiadventu.re/api/badge" alt="number of people onlines on the game">
	</a>
	<a href="https://github.com/Sacramentix/WikiAdventure/actions/workflows/tests-monitor-links.yml">
        	<img src="https://github.com/Sacramentix/WikiAdventure/actions/workflows/tests-monitor-links.yml/badge.svg?branch=master" alt="Link Monitoring State"> -->
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
		<a href="#-diagram">Diagram</a>
		•
		<a href="#run-the-project">Run the project</a>
	</strong>
</p>


## 🚀 Tech stack

<p align="center">
	<a href="https://v3.vuejs.org">
	    <svg viewBox="0 0 128 128" width="32" height="32"><path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" data-v-5f26462c=""></path><path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" data-v-5f26462c=""></path></svg>
	</a>  
    <a href="https://vue-i18n.intlify.dev"><img width=36.57 height=32 src="https://vue-i18n.intlify.dev/vue-i18n-logo.png" alt="Vue js logo"></a>
	<a href="https://www.typescriptlang.org"><img width=32 height=32 src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Typescript logo"></a>
    <a href="https://yjs.dev"><img width=27.22 height=32 src="https://yjs.dev/_next/static/media/yjslogo.a1275f44.svg" alt="Yjs logo"></a>
</p>

The project is Web app made out of a signaling server for web-rtc hosted on cloudflare worker and a frontend as Progressive Web App in Vue 3.

## 📋 Diagram
<p align="center">Soon... </p>

## Run the project

### Node js
- Make sure you have v22 or higher. You can install it from the official website [here](https://nodejs.org).
### Mise en place CLI
- You can also use ```mise``` cli to install necessary tools like node for the project with ```mise install```.  Install ```mise``` [here](https://mise.jdx.dev/getting-started.html).

### Install dependencies

Run #### Install dependencies

Run ```npm i && cd signaling-server && npm i```

### launch the app in dev

To run the app and connect the player together via web-rtc, we need a signaling server that will handle room creation and discovery.

Start it with ```npm run dev-signaling-server``` and start the web app with ```npm run dev```.

Don't forget to copy the .env.example to a fresh .env.local