export default {
  play: "play",
  worker: {
    updateFound: "New update! The game will restart after downloading.",
    updated: "New update installed! Restarting..."
  },
  indexHowToPlay: {
    title: "How to play?",
    content: "The game is really simple, you need to go as fast as possible from one page to another one, but you can only navigate with the link on the Wikipedia page. During the voting phase you can suggest Wikipedia page title. At the end of the voting phase the game will randomly pick a start page and an end page and the game will begin."
  },
  news: "News",
  newsContent: "Beta version now live!",
  contribution: "contribution",
  contributionSection: {
    discord: "Find friends to play with on our Discord",
    github: "Contribute to the game",
    kofi: "Buy me a coffee",
    nano: "Share your Nano with me !"
  },
  home: "Home",
  publicLobby: "Public Party",
  privateLobby: "Private Party",
  twitchLobby: "Twitch Party",
  join: "Join",
  create: "Create",
  start: "start",
  invite: "invite",
  input: {
    langSelect: "Wiki language",
    lobbyID: "Party ID",
    pseudo: "Username",
    password: "Password",
    gameLoop: "Game mode",
    slot: "Slots",
    gameModeConfig: "Game mode configuration",
    voteDuration: "Vote phase duration in secondes",
    playDuration: "Play phase duration in secondes",
    round: "Round",
    error: {
      minChars3: '3 character minimum',
      maxChars25: '25 character maximum',

    }
  },
  menu: {
    joinPublicLobby: "Join a Public Party",
    joinPrivateLobby: "Join a Private Party",
    joinTwitchLobby: "Join a Twitch Party",
    createPrivateLobby: "Create a Private Party",
    createTwitchLobby: "Create a Twitch Party",
    button: {
      createWithTwitch: "Create with Twitch",
      joinWithTwitch: "Join with Twitch",
    }
  },
  gameTab: {
    round: "Round",
    phase: "Phase",
    timeLeft: "Time left",
    vote: {
      submitVote: "Submit your vote",
      noVoteTitle: "Random page ???",
      noVoteDescription: "You have not yet voted! Your vote counts as a random page.",
      noPageFoundDescription: "Your Suggestion does not lead to any Wikipedia page!"
      
    },
    start: "Start",
    end: "Finish",
    noWinnerYet: "No winner yet!",
    pageHistory: "History of the last winner",
    showEndPage: "Show end page",
  },
  chatTab: {
    send: "Send a message"
  },
  settingTab: {
    settings: "Settings",
    fullscreen: "Fullscreen",
    safeModeTooltip: "SafeMode will blur image of wikipedia, you can unblur image for the current page with ctrl + alt + Q"
  },
  scoreTab: {
    title: "Scoreboard",
    leaderboard: "Leaderboard"
  },
  roundWinScreen: {
    timeOut: "Time out!"
  },
  gameLoop: {
    description: {
      0: "Be the fastest to reach the page randomly picked among player votes.",
      1: "Computer choose pages for you ! Achieve victory by reaching the finish page first."
    },
    0: "Classic",
    1: "Random"
  },
  phase: {
    0: "Waiting player",
    1: "Voting",
    2: "Searching",
    3: "Result",
    4: "Game end",
    notify: {
      1: "Voting phase started. You can now submit your suggestions!",
      2: "Searching phase started. Be the first to reach the end page!"
    }
  },
  shortcut: {
    title: "Shortcuts",
    spaceKey: "space",
    openMenu: "Open the menu",
    openEndPage: "Open the end page",
    disableSafeMode: "Disable Safemode for the current page",
  },
  exitWarn: "Do you really want to leave the party?",
  lobbyIDRequired: "Please enter a Party ID to connect to",
  fetchError: "An error occurred while communicating with server",
  copySuccess: "Copied successfully!",
  copyFail: "Error during the copy",
  wikiPage: {
    noEndPageYet: "No End Page yet",
    tipsTitle: "Tips",
    tipsContent: "You can open the game menu with top left button or with ctrl + alt + shift. You can also open the end page with ctrl + alt + space",
    tipsContentMobile: "You can open the game menu with top left button or by swiping to the right. You can also open the end page by swiping to the left.",
  },
  connectError: {
    UnknowError: "??? Unknow error",
    NoInternet: "Connection problem with the server",
    InvalidMethod: "??? Invalid http request method",
    InvalidForm: "??? Form format error",
    InvalidLobbyType: "??? Non-existent lobby type",
    InvalidID: "The Party ID provided is invalid",
    NoLobbyFoundWithID: "No game found with this Party ID",
    NoLobbyFoundWithChannelName: "No game found with this channel name",
    LobbyFull: "The party you want to join is full",
    InvalidPassword: "Invalid Password",
    InvalidGameLoop: "??? Non-existent game mode",
    InvalidTwitchCode: "Client error while connecting twitch",
    LobbyLimitReached: "The party limit has been reached!",
    PrivateLobbyLimitReached: "The private party limit has been reached!",
    TwitchConnectionError: "Server error while connecting twitch"
  }
};
