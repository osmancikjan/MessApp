<?php

header('Access-Control-Allow-Origin: *');
$nick = $_POST['nick'];
$pass = $_POST['pass'];

$fr = fopen("usrlst.csv", "r");
$i = 0;
while (!feof($fr)) {
    $line = fgets($fr);
    $arr[$i] = explode(';', $line);
    $i = $i + 1;
}
fclose($fr);

for ($index = 0; $index < count($arr); $index++) {
    if ($arr[$index][0] == $nick) {
        echo "inlist";
        exit;
    }
}

$ret = file_put_contents("usrlst.csv", $nick . ';' . $pass . PHP_EOL, FILE_APPEND);

if ($ret) {
    echo "success";
} else {
    echo "Cannot insert data. Contact administrator.";
}
