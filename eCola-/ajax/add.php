<?php
    $id = $_REQUEST["id"];
    $cat = $_REQUEST["logtype"];
    $start_at = $_REQUEST["begin_at"];
    $end_at = $_REQUEST["end_at"];
    $content = $_REQUEST["content"];

    echo '{"id":"id'.rand(1000,10000).'","cat":"'.$cat.'","status":"success"}';
?>