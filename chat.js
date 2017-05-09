
var ChatEngine = function () {
    var name = sessionStorage.getItem('nick');
    var pass = sessionStorage.getItem('pass');
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
        if (name === null && pass === null) {
            name = document.getElementById("nick").value;
            pass = document.getElementById("pass").value;
        } 
        alert(name + " " + pass);
            if (!name && !pass) {
                alert("Nickname and password must be entered.");
            } else {
                var jqxhr = $.ajax({
                    url: 'http://homel.vsb.cz/~osm0014/login.php',
                    type: "POST",
                    data: {"nick": name, "pass": pass},
                    success: function (ret) {
                        if (ret == "correct") {
                            alert("correct");
                            sessionStorage.setItem('nick', name);
                            sessionStorage.setItem('pass', pass);
                            document.getElementById("head").innerHTML += "<h1>Actualy logged user: " + name + "!</h1> <a href=\"#home\" class=\"ui-btn\" onclick=\"chat.logout()\">logout</a>";
                        } else if (ret == "incorrect") {
                            alert("incorrect");
                            history.go(-1);
                            document.getElementById("error").innerHTML += "<h2>Incorrect login or password.</h2>";
                        } else {

                        }
                    }
                }).fail(function (err) {
                    alert("Something went wrong: " + err.responseText);
                });
            }
    };
    
    this.logout = function (){
        name = null;
        pass = null;
        xhr = "";
        sevr = "";
        oldata = "";
        msg = "";
        sessionStorage.clear();
    }

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
        document.getElementById("chatZone").innerHTML += '<div class="chatmsg"><b>' + name + '</b>: ' + msg + '<br/></div>';
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
                document.getElementById("chatZone").innerHTML += e.data;
                oldata = e.data;
            }
        };
    };
};
// Createing Object for Chat Engine
var chat = new ChatEngine();
