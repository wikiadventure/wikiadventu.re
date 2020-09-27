var hasVoted = false;
var socket;
var pageStart;
var pageEnd;
var stateCounter;
var players = [];
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
var isMobile = window.mobileCheck();
var wikiRequestUrlRoot = "https://" + lobbyLang + ".wikipedia.org/api/rest_v1/page/" + (isMobile ? "mobile-" : "") + "html/";

addEventListener("uiSectionTemplate",(function () {
    if (history.pushState) {
        window.history.pushState("lobby " + lobbyID, "WikiAdventure", "/play/" + lobbyID);
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
        document.getElementById('inputVote').placeholder = votePlaceholder;
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
    if ( state == "GameFinish") {
        buildLeaderboard(time);
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
    players.sort((a, b) => b.score - a.score);
    var i = 0;
    while (i < players.length) {
        if (i < 3) {
            document.getElementById("name-"+(i+1)).innerText = players[i].name;
            document.getElementById("score-"+(i+1)).innerText = players[i].score;
        } else {
            var template = document.getElementById("template-leaderboard-item");
            var clone = document.importNode(template.content, true);
            clone.querySelectorAll(".position")[0].innerText = i+1;
            clone.querySelectorAll(".name")[0].innerText = players[i].name;
            clone.querySelectorAll(".score")[0].innerText =  players[i].score;
            grid.appendChild(clone);
        }
        i++;
    }
    var leaderboard = document.getElementById("leaderboard");
    leaderboard.style.display = "block";
    leaderboard.style.opacity = "1";
    setTimeout(function(){leaderboard.style.opacity = "0";}, duration*1000);
    setTimeout(function(){leaderboard.style.display = "none";}, duration*1000+500);
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
fetch( wikiRequestUrlRoot + url , options)
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