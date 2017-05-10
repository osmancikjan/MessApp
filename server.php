<?php

// creating Event stream
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$name = $_POST['name'];
$msg = $_POST['msg'];

function sendMsg($msg) {
    echo "data: $msg" . PHP_EOL;
    flush();
}

if (!empty($name) && !empty($msg)) {
    $fp = fopen("_chat.txt", "a");
    fwrite($fp, '<div class="chatmsg"><b>' . $name . '</b>: ' . $msg . '<br/></div>' . PHP_EOL);
    fclose($fp);
}

if (file_exists("_chat.txt") && filesize("_chat.txt") > 0) {
    $arrhtml = array_reverse(file("_chat.txt"));
    $message = $arrhtml[0];
}

if (filesize("_chat.txt") > 10000) {
    unlink("_chat.txt");
}

sendMsg($message);

