window.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('nick')) {
        window.location.href = "#mainapp";
        document.getElementById("head").innerHTML += "<h1>Actualy logged user: " + name + "!</h1> <button class=\"ui-btn\" onclick=\"chat.logout()\">logout</button>";
    }
}, true);

var ChatEngine = function () {
    var name = "";
    var pass = "";
    var msg = "";
    var chatZone = document.getElementById("chatZone");
    var oldata = "";
    var sevr = " ";
    var xhr = " ";
    //initialzation
    this.init = function () {
        if (EventSource) {
            this.initSevr();
        } else {
            alert("Use latest Chrome or FireFox");
        }
    };
    //Setting user name
    this.login = function () {
        name = document.getElementById("nick").value;
        pass = document.getElementById("pass").value;
        if (!name || name === "" && !pass && pass === "") {
            alert("Nickname and password must be entered.");
        } else {
            var jqxhr = $.ajax({
                url: 'http://homel.vsb.cz/~osm0014/login.php',
                type: "POST",
                data: {"nick": name, "pass": pass},
                success: function (ret) {
                    if (ret == "correct") {
                        sessionStorage.setItem('nick', name);
                        location="index.html#mainapp";
                        document.getElementById("head").innerHTML += "<h1>Actualy logged user: " + name + "!</h1> <button class=\"ui-btn\" onclick=\"chat.logout()\">logout</button>";
                    } else if (ret == "incorrect") {
                        window.location.href = "#login";
                        document.getElementById("error").innerHTML += "<h2>Incorrect login or password.</h2>";
                    } else {

                    }
                }
            }).fail(function (err) {
                alert("Something went wrong: " + err.responseText);
            });

        }
    };

    this.playAudio = function (sound) {
          if (window.HTMLAudioElement) {
            var snd = new Audio('');
            if (snd.canPlayType('audio/mp3')) {
                snd = new Audio('http://homel.vsb.cz/~osm0014/' + sound + '.mp3');
            } else
            {
                alert("cannot play");
                return false;
            }
            snd.play();
        } else {
            alert('Audio support is not present');
        }
    };

    //For sending message
    this.sendMsg = function () {
        msg = document.getElementById("msg").value;
        chatZone.innerHTML += '<div class="chatmsg"><b>' + name + '</b>: ' + msg + '<br/></div>';
        oldata = '<div class="chatmsg"><b>' + name + '</b>: ' + msg + '<br/></div>';
        var jqxhr = $.ajax({
            url: 'http://homel.vsb.cz/~osm0014/server.php',
            type: "POST",
            data: {"name": name, "msg": msg}
        }).fail(function (err) {
            alert("Something went wrong: " + err.responseText);
        });
        return false;
    };
    //sending message to server
    //HTML5 SSE(Server Sent Event) initilization
    this.initSevr = function () {
        sevr = new EventSource('http://homel.vsb.cz/~osm0014/server.php');
        sevr.onmessage = function (e) {
            if (oldata !== e.data) {
                chatZone.innerHTML += e.data;
                oldata = e.data;
            }
        };
    };
};
// Createing Object for Chat Engine
var chat = new ChatEngine();
chat.init();