var hasVoted = false;
var socket;
var pageStart;
var pageEnd;
var stateCounter;
var players = [];

addEventListener("uiSectionTemplate",(function () {
    if (history.pushState) {
        window.history.pushState("lobby " + lobbyID, "WikiAdventure", lobbyID);
      } else {
        document.location.href =  lobbyID;
      }
    socket = io("/"+lobbyID,  { query: "playerID="+playerID });
    socket.on('error', (error) => {
      var logMessage = socketError;
      console.log(error);
      console.log(logMessage);
      addMessage(error);
      addMessage(logMessage);
    });
    document.getElementById('chatForm').onsubmit = function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('message', document.getElementById('inputMessage').value);
        document.getElementById('inputMessage').value = "";
        var hasVoted = true;
        return false;
    };
    document.getElementById('votingForm').onsubmit = function(e){
        e.preventDefault(); // prevents page reloading
        voteSubmit(document.getElementById('inputVote').value);
    };
    function voteSubmit(vote) {
        var requestTitle = vote;
        socket.emit('vote', requestTitle);
        document.getElementById("playerVote").innerText = requestTitle;
        document.getElementById('inputVote').value = "";
        document.getElementById('inputVote').placeholder = "${votePlaceholderSubmitted}";
        fetch("https://" + lobbyLang + ".wikipedia.org/w/api.php?action=query&origin=*&list=search&srlimit=1&srnamespace=0&srsearch=intitle:" + encodeURIComponent(requestTitle) + "&format=json&srprop=")
            .then(function(response){return response.json();})
            .then(function(response) {
                var trueTitle;
                if (typeof response.query.search[0] === 'undefined') trueTitle = "no page found";
                else trueTitle = response.query.search[0].title;
                document.getElementById("playerVote").innerText = requestTitle + " → " + trueTitle;
            });
    };
    socket.on('message', function(msg){
        addMessage(msg);
    });
    socket.on('voteResult', function(data){
        var idx = data.indexOf("?");
        pageStart = data.substring(0, idx);
        document.getElementById("pageStart").innerText = pageStart;
        pageEnd = data.substring(idx+1);
        document.getElementById("pageEnd").innerText = pageEnd;
        requestWikiPage(pageStart);
    });
    socket.on('playerLeft', function(playerID){
        document.getElementById("player"+playerID).remove();
        players.splice(players.findIndex(e => e.id == playerID));
    });
    socket.on('updateScore', function(data){
        var idx = data.indexOf(":");
        var playerID = data.substring(0, idx);
        var score = data.substring(idx+1);
        document.getElementById("player"+playerID).getElementsByClassName("playerScore")[0].innerText = score;
        var player = players.find(e => e.id == playerID);
        player.score = score;
    });
    socket.on('newPlayer', function(data){
        var idx = data.indexOf(":");
        var playerID = data.substring(0, idx);
        var remain = data.substring(idx+1);
        idx = remain.indexOf(":");
        var playerName = remain.substring(0, idx);
        var playerScore = remain.substring(idx+1);
        if (players.findIndex(e => e.id == playerID) == -1) {
            var player = {id: playerID, name: playerName, score: playerScore};
            players.push(player);
        }
        if (document.getElementById("player"+playerID) == null) {
            var div = document.createElement("div");
            div.className = "score";
            div.innerHTML = '<p class="playerName">' + playerName + '</p><p class="playerScore">' + playerScore + '</p>';
            div.id = "player" + playerID;
            document.getElementById("playerScoreSection").appendChild(div);
        }
    });
    socket.on('gameState', function(data){
        switchState(data);
    });
}));

function showAlert(title, data) {
    var div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = "<h3>" + title + "</h3><p>" + data + "</p>";
    div.onclick = function (e) {
      div.style.opacity = 0;
      setTimeout(function(){div.remove();}, 500);
    };
    document.body.appendChild(div);
    setTimeout(function(){div.style.opacity = 0;}, 15000);
    setTimeout(function(){div.remove();}, 15500);
};

  function switchState(data) {
    var hasVoted = false;
    clearInterval(stateCounter);
    document.getElementById('inputVote').placeholder = votePlaceholder;
    var idx = data.indexOf("|");
    var state = data.substring(0, idx);
    var remain = data.substring(idx+1);
    idx = remain.indexOf("|");
    var round = remain.substring(0, idx);
    var time = remain.substring(idx+1);
    if ( state == "gameFinish") {
        buildLeaderboard(remain);
    } else {
        showAlert(state + " round " + round, 'Check your board for more info<br/>You can click to close me');
    }
    document.getElementById("stateName").innerText = state + " round " + round;
    var timeLeft = time;
    var timeStamp = Date.now();
    var countdownSound = document.getElementById("countdownSound");
    var playing = false;
    stateCounter = setInterval(function() {
        var time = Date.now();
        var dt = time - timeStamp;
        timeStamp = time;
        timeLeft = timeLeft - dt*0.001;
        if (timeLeft <= 10) {
            if (!playing) {
              countdownSound.play();
              playing = true;
            }
        }
        document.getElementById("stateTime").innerText = Math.ceil(timeLeft);
        if (timeLeft < 0) {
          clearInterval(stateCounter);
          document.getElementById("stateTime").innerText = 0;
          playing = false;
        }
    }, 100);
};

function buildLeaderboard(duration) {
    var grid = document.getElementById("grid-leaderboard");
    var item = grid.getElementsByClassName('grid-leaderboard-item');
    while(item[0]) item[0].remove();
    players.sort((a, b) => a.score - b.score);
    var i = 0;
    while (i < players.length) {
        if (i < 3) {
            document.getElementById("name-"+(i+1)).innerText = players[i].name;
            document.getElementById("score-"+(i+1)).innerText = players[i].score;
        } else {
            var template = document.getElementById("template-leaderboard-item");
            var clone = document.importNode(template.content, true);
            clone.querySelectorAll(".position").innerText = i+1;
            clone.querySelectorAll(".name").innerText = players[i].name;
            clone.querySelectorAll(".score").innerText =  players[i].score;
            grid.appendChild(clone);
        }
        i++;
    }
    var leaderboard = document.getElementById("leaderboard");
    leaderboard.style.display = "block";
    leaderboard.style.opacity = "1";
    setTimeout(function(){leaderboard.style.opacity = "0";}, duration);
    setTimeout(function(){leaderboard.style.display = "none";}, duration+500);
};

function addMessage(message) {
    var messageLine = document.createElement('li');
    messageLine.textContent = message;
    document.getElementById('outputMessages').insertBefore(messageLine, document.getElementById('outputMessages').childNodes[0]);
};

addEventListener("beforeunload", function (event) {
    var confirmationMessage = exitWarning;
    event.returnValue = confirmationMessage;
    return confirmationMessage;
});

addEventListener("unload", function (event) {
    socket.close();
});

//Code to toggle off the link of the wikipedia page and redirect them to custom function

function disableLinks() {
var links= document.getElementsByTagName("a");
for (var i=0;i<links.length;i++) {
    links[i].addEventListener("click",function(e){
      //check if the link go to another wikipage and not info page or external

      if (this.getAttribute("href").lastIndexOf(":") == -1 && this.getAttribute("href").lastIndexOf(".ogg") == -1 && this.rel != "mw:ExtLink" && !this.classList.contains("new")) {
        var idx = this.href.lastIndexOf("/");
        decodeURIComponent()
        var url = this.href.substring(idx+1);
        var anchor = url.indexOf("#");
        if (anchor != -1) url = url.substring(0, anchor);
        url = decodeURIComponent(url);
        requestWikiPage(url);

      }
      e.preventDefault();
    });
}
};

function requestWikiPage(url) {
socket.emit('validateJump', url);
if (decodeURI(url) == pageEnd) {
    document.getElementById("winSound").play();
}
var header= new Headers({
    "Api-User-Agent":"pediaFinder/1.1 (https://pedia-finder.herokuapp.com/; benjamin.gilloury@gmail.com)",
    "origin": "*",
});
var options = { method: 'GET',
       headers: header,
       mode: 'cors',
       cache: 'default' };
fetch("https://" + lobbyLang + ".wikipedia.org/api/rest_v1/page/html/" + url , options)
            .then(function(response){return response.text();})
            .then(function(response) {
                var trueTitle;
                var parser = new DOMParser();
                var wikiData = parser.parseFromString(response, "text/html") ;
                var cssLinks = wikiData.head.getElementsByTagName("link");
                document.getElementById("wikiSection").innerHTML = "";

                for (var i=0;i<document.head.childNodes.length;i++) {
                  if (document.head.childNodes[i].tagName == "link" && document.head.childNodes[i].id != "uiCSS") {
                    document.head.childNodes[i].remove();
                  }
                }
                for (var i=0;i<cssLinks.length;i++) {
                  if (cssLinks[i].rel == "stylesheet") {
                    cssLinks[i].href += "https://" + lobbyLang + ".wikipedia.org";
                    document.head.appendChild(cssLinks[i]);
                  }
                }

                document.getElementById("wikiSection").innerHTML = wikiData.body.innerHTML;
                
                disableLinks();
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                if (history.pushState) {
                  window.history.pushState("lobby " + lobbyID, "WikiAdventure", lobbyID + "?" + url);
                } else {
                  document.location.href =  lobbyID + "?" + url;
                }
            });
};

/**
* part for tab shorcut ( open and close menu with escape )
**/

addEventListener("keydown", event => {
if (event.isComposing || event.keyCode === 229) {
    return;
}
if (event.keyCode === 27) {
    document.getElementById("showUI").checked = !document.getElementById("showUI").checked;
}
});