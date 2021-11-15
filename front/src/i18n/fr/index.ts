import type { MessageSchema } from "../";

const fr:MessageSchema = {
  error404: {
    content: "Hey! Comment est vous arrivé là? Il n'y a rien à voir. Vous devriez retourner à l'accueil.",
    button: "Accueil"
  },
  play: "Jouer",
  worker: {
    updateFound: "Nouvelle mise à jour! Le jeu va recharger après le téléchargement.",
    updated: "Nouvelle mise à jour installée! Rechargement..."
  },
  indexHowToPlay: {
    title: "Comment jouer?",
    content: "Le jeu est simple, il faut aller le plus vite possible d'une page à l'autre, mais on ne peut naviguer qu'avec les liens sur la page Wikipédia de départ. Pendant la phase de vote, vous pouvez suggérer le titre de la page Wikipedia de départ ou d'arrivée. À la fin de la phase de vote, le jeu choisira au hasard une page de démarrage et une page de fin et le jeu commencera."
  },
  news: "Nouveautés",
  newsContent: "La version beta est maintenant ouverte!",
  contribution: "Contribution",
  contributionSection: {
    discord: "Trouve des joueurs sur notre Discord",
    github: "Apporte ta pierre à l'édifice grâce à Github",
    kofi: "Offre moi un café",
    nano: "Partage tes Nano avec moi"
  },
  home: "Accueil",
  publicLobby: "Partie publique",
  privateLobby: "Partie privée",
  twitchLobby: "Partie sur Twitch",
  join: "Rejoindre",
  create: "Créer",
  start: "démarrer",
  invite: "inviter",
  input: {
    langSelect: "Langue du wiki",
    lobbyID: "ID de la Partie",
    twitchName: "Pseudo Twitch",
    pseudo: "Pseudo",
    password: "Mot de passe",
    gameLoop: "Mode de jeu",
    slot: "Places",
    gameModeConfig: "Configuration du mode de jeu",
    voteDuration: "Durée de la phase de vote en secondes",
    playDuration: "Durée de la phase de jeu en secondes",
    round: "Round",
    error: {
      minChars3: "3 caractères minimum",
      maxChars25: "25 caractères maximum",
    }
  },
  menu: {
    joinPublicLobby: "Rejoindre une partie publique",
    joinPrivateLobby: "Rejoindre une partie privée",
    joinTwitchLobby: "Rejoindre une partie sur Twitch",
    createPrivateLobby: "Créer une partie privée",
    createTwitchLobby: "Créer une partie sur Twitch",
    button: {
      createWithTwitch: "Créer la partie avec Twitch",
      joinWithTwitch: "Rejoindre avec Twitch",
    }
  },
  gameTab: {
    round: "Round",
    phase: "Phase",
    timeLeft: "Temps restant",
    vote: {
      submitVote: "Envoyer ton vote",
      noVoteTitle: "Page aléatoire ???",
      noVoteDescription: "Vous n'avez pas encore voter! Votre vote compte comme une page aléatoire.",
      noPageFoundDescription: "Votre Suggestion ne mène vers aucune page wikipédia!"
      
    },
    start: "Départ",
    end: "Arrivée",
    noWinnerYet: "Pas encore de gagnant!",
    pageHistory: "Historique du dernier gagnant",
    showEndPage: "Afficher la page de fin",
  },
  chatTab: {
    send: "Envoyer un message"
  },
  settingTab: {
    settings: "Options",
    fullscreen: "Plein écran",
    safeModeTooltip: "SafeMode vas flouter les images de wikipédia, vous pouvez les déflouté pour la page en cours avec ctrl + alt + Q"
  },
  scoreTab: {
    title: "Scores",
    leaderboard: "Classement"
  },
  roundWinScreen: {
    timeOut: "Temps écoulé!"
  },
  gameLoop: {
    description: {
      0: "Soyez le plus rapide pour trouver la page tirée au sort parmi les votes des joueurs !",
      1: "L'ordinateur choisit les pages pour vous ! Remportez la victoire en atteignant la page en premier !"
    },
    0: "Classique",
    1: "Aléatoire",
  },
  phase: {
    0: "En attente de joueurs",
    1: "Vote",
    2: "Recherche",
    3: "Résultat",
    4: "Fin de partie",
    notify: {
      1: "La phase de vote commence. Vous pouvez envoyer vos suggestions!",
      2: "La phase de recherche commence. Soyez le premier à atteindre la page d'arrivée!"
    }
  },
  shortcut: {
    title: "Raccourcis",
    spaceKey: "espace",
    openMenu: "Ouvre le menu",
    openEndPage: "Ouvre la page de fin",
    disableSafeMode: "Désactive le SafeMode pour la page actuel",
  },
  exitWarn: "Voulez-vous vraiment quitter la partie?",
  lobbyIDRequired: "Veuiller saisir un identifiant de partie à rejoindre",
  fetchError: "Une erreur a eu lieu lors de la communication avec le serveur",
  copySuccess: "Copié avec succès!",
  copyFail: "Erreur lors de la copie",
  wikiPage: {
    noEndPageYet: "Pas encore de page d'arrivée",
    tipsTitle: "Astuce",
    tipsContent: "Vous pouvez ouvrir le menu du jeu avec le bouton en haut à gauche ou avec ctrl + alt + shift. Vous pouvez aussi ouvrir la page de fin avec ctrl + alt + espace.",
    tipsContentMobile: "Vous pouvez ouvrir le menu du jeu avec le bouton en haut à gauche ou en faisant glisser vers la droite. Vous pouvez aussi ouvrir la page de fin en faisant glisser vers la gauche.",
  },
  connectError: {
    unknowError: "??? Erreur inconnue",
    noInternet: "Problème de connexion avec le serveur",
    invalidMethod: "??? méthode de la requête http invalide",
    invalidForm: "??? Erreur de format du formulaire",
    invalidLobbyType: "??? Type de partie inexistant",
    invalidID: "L'identifiant de partie est invalide",
    noLobbyFoundWithID: "Aucune partie trouvée avec l'identifiant",
    noLobbyFoundWithChannelName: "Aucune partie trouvée avec Le nom de chaîne",
    lobbyFull: "La partie que vous voulez rejoindre est remplie",
    invalidPassword: "Mot de passe invalide",
    invalidGameLoop: "??? Mode de jeu inexistant",
    invalidTwitchCode: "Erreur du client lors la connection twitch",
    lobbyLimitReached: "La limite de partie a été atteinte!",
    privateLobbyLimitReached: "La limite de partie privé a été atteinte",
    twitchConnectionError: "Erreur du serveur lors de la connection twitch"
  }
};

export default fr;
