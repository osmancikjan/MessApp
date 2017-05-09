<?php
header('Access-Control-Allow-Origin: *');
$nick = $_POST["nick"];
$pass = $_POST["pass"];

$res = "";
$file = fopen("usrlst.csv", "r");
$i = 0;

while (!feof($file)) {
    $line = fgets($file);
    $arr[$i] = explode(';', $line);
    $i = $i + 1;
}

fclose($file);

for ($index = 0; $index < count($arr); $index++) {
   
    $arr[$index][1] = str_replace("\n", "", str_replace("\r", "", $arr[$index][1]));
   
    if ($arr[$index][0] == $nick && $arr[$index][1] == $pass) {
        echo "correct";
        exit;
    } else if($arr[$index][0] == $nick && $arr[$index][1] != $pass) {
        echo "incorrect";
        exit;
    }
}
echo "not exists";
?>
