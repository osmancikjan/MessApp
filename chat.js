$(document).on("pageinit", "#mainapp", function () {
    $(document).on("swiperight", "#mainapp", function (e) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});

$(document).ready(function () {
    chat.login();
    chat.init();
    window.location = "#mainapp";
});

var ChatEngine = function () {
    var name = "";
    var pass = "";
    var msg = "";
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
        if (localStorage.getItem('nick') === null && localStorage.getItem('pass') === null) {
            name = document.getElementById("nick").value;
            pass = document.getElementById("pass").value;
        } else {
            name = localStorage.getItem('nick');
            pass = localStorage.getItem('pass');
        }
        document.getElementById("nick").value = "";
        document.getElementById("pass").value = "";
        if (!name && !pass) {
            alert("Nickname and password must be entered.");
        } else {
            var loginpost = $.ajax({
                url: 'http://homel.vsb.cz/~osm0014/login.php',
                type: "POST",
                data: {"nick": name, "pass": pass},
                success: function (ret) {
                    if (ret === "correct") {
                        var sendstat = $.ajax({
                            url: 'http://homel.vsb.cz/~osm0014/login.php',
                            type: "POST",
                            data: {"nick": name, "status": "online"}
                        });
                        localStorage.setItem('nick', name);
                        localStorage.setItem('pass', pass);
                        document.getElementById("user").innerHTML = "User: <br><h3>" + name + "</h3>";
                    } else if (ret === "incorrect") {
                        history.go(-1);
                        document.getElementById("error").innerHTML = "<h2>Incorrect login or password.</h2>";
                    } else {
                        history.go(-1);
                        alert("Something went wrong: " + ret);
                    }
                }
            }).fail(function (err) {
                alert("Something went wrong: " + err.responseText);
            });
        }
    };

    this.logout = function () {
        name = "";
        pass = "";
        xhr = "";
        sevr = "";
        oldata = "";
        msg = "";
        document.getElementById("chatZone").innerHTML = "";
        document.getElementById("user").innerHTML = "";
        document.getElementById("error").innerHTML = "";
        document.getElementById("regerror").innerHTML = "";
        localStorage.clear();
    };

    this.register = function () {
        var nick = document.getElementById("nickname").value;
        var pass1 = document.getElementById("pass1").value;
        var pass2 = document.getElementById("pass2").value;
        document.getElementById("nickname").value = "";
        document.getElementById("pass1").value = "";
        document.getElementById("pass2").value = "";
        if (pass1 === pass2) {
            var jqxhr = $.ajax({
                url: 'http://homel.vsb.cz/~osm0014/register.php',
                type: "POST",
                data: {"nick": nick, "pass": pass1},
                success: function (e) {
                    if (e === "success") {
                        alert("User registered successfully.");
                    } else if (e === "inlist") {
                        history.go(-1);
                        alert("User exists in database choose other nickname.");
                    } else {
                        history.go(-1);
                        alert("Something went wrong: " + e);
                    }
                }
            }).fail(function (err) {
                history.go(-1);
                alert("Something went wrong: " + err.responseText);
            });
        } else {
            window.location = "#register";
            document.getElementById("regerror").innerHTML = "<h2>Incorrect password.</h2>";
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
        document.getElementById("msg").value = "";
        var newMsg = msg.replace("#kappa", "<img src=\"http://homel.vsb.cz/~osm0014/img/kappa.jpg\" />").replace("#smile", "<img src=\"http://homel.vsb.cz/~osm0014/img/smile.jpg\" />").replace("8:)", "<img src=\"http://homel.vsb.cz/~osm0014/png/afro.png\" />").replace(":)", "<img src=\"http://homel.vsb.cz/~osm0014/png/smile.png\" />").replace("#wtf", "<img src=\"http://homel.vsb.cz/~osm0014/img/wtf.jpg\" />").replace(":D", "<img src=\"http://homel.vsb.cz/~osm0014/png/smiling.png\" />");
        msg = newMsg;

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
    };/*
    //SSE new online user
    this.newUserOnline = function () {
        sevr = new EventSource('http://homel.vsb.cz/~osm0014/server.php');
        sevr.addEventListener('newUserOnline', function (e) {

        });
    };
    //SSE user leave
    this.newUserOnline = function () {
        sevr = new EventSource('http://homel.vsb.cz/~osm0014/server.php');
        sevr.addEventListener('userLeave', function (e) {
            var index, id;
            sessionStorage.removeItem(id);
            for (var i = 0; i < sessionStorage.length; i++) {
                if (!sessionStorage.getItem("myNote" + i)) {
                    sessionStorage.setItem("myNote" + i, sessionStorage.getItem("myNote" + (i + 1)));
                    sessionStorage.removeItem("myNote" + (i + 1));
                }
            }
        });
    };*/
}; 
// Createing Object for Chat Engine
var chat = new ChatEngine();
/*
 function removeTodo(id) {
 var text, index, key, value;
 index = localStorage.length;
 localStorage.removeItem(id);
 for (var i = 0; i < localStorage.length; i++) {
 if (!localStorage.getItem("myNote" + i)) {
 localStorage.setItem("myNote" + i, localStorage.getItem("myNote" + (i + 1)));
 localStorage.removeItem("myNote" + (i + 1));
 }
 }
 showTodo();
*/