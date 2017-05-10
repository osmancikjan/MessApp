$(document).on("pageinit", "#mainapp", function () {
    $(document).on("swiperight", "#mainapp", function (e) {
        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});

$(document).ready(function () {
    if (localStorage.getItem('nick') && localStorage.getItem('pass')){
        chat.login();
    }
    
});

var ChatEngine = function () {
    var name = "";
    var pass = "";
    var msg = "";
    var oldata = "";
    var sevr = " ";
    var xhr = " ";
    
    this.init = function () {
        if (EventSource) {
            this.initSevr();
        } else {
            alert("Use latest Chrome or FireFox");
        }
    };
    
    this.login = function () {
        if (!localStorage.getItem('nick') && !localStorage.getItem('pass')) {
            name = document.getElementById("nick").value;
            pass = document.getElementById("pass").value;
        } else {
            
            name = localStorage.getItem('nick');
            pass = localStorage.getItem('pass');
        }
        document.getElementById("nick").value = "";
        document.getElementById("pass").value = "";
        if (name ==="" && pass === "") {
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
                        window.location = "#mainapp";
                        chat.init();
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

    this.sendMsg = function () {
        msg = document.getElementById("msg").value;
        document.getElementById("msg").value = "";
        var newMsg = msg.replace("#kappa", "<img src=\"http://homel.vsb.cz/~osm0014/img/kappa.jpg\" />").replace("#kappa", "<img src=\"http://homel.vsb.cz/~osm0014/img/kappa.jpg\" />").replace("#smile", "<img src=\"http://homel.vsb.cz/~osm0014/img/smile.jpg\" />").replace("#smile", "<img src=\"http://homel.vsb.cz/~osm0014/img/smile.jpg\" />").replace("8:)", "<img src=\"http://homel.vsb.cz/~osm0014/png/afro.png\" />").replace("8:)", "<img src=\"http://homel.vsb.cz/~osm0014/png/afro.png\" />").replace(":)", "<img src=\"http://homel.vsb.cz/~osm0014/png/smile.png\" />").replace(":)", "<img src=\"http://homel.vsb.cz/~osm0014/png/smile.png\" />").replace("#wtf", "<img src=\"http://homel.vsb.cz/~osm0014/img/wtf.jpg\" />").replace("#wtf", "<img src=\"http://homel.vsb.cz/~osm0014/img/wtf.jpg\" />").replace(":D", "<img src=\"http://homel.vsb.cz/~osm0014/png/smiling.png\" />").replace(":D", "<img src=\"http://homel.vsb.cz/~osm0014/png/smiling.png\" />");
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

var chat = new ChatEngine();
