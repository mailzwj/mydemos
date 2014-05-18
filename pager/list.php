<?php
    $perPage = $_GET['perPage'];
    $pageTo = $_GET['pageTo'];
    $id = $_GET['goods_id'];
    $cb = $_GET['callback'];

    $data = Array();
    for ($i = 0; $i < $perPage; $i++) {
        array_push($data, '{"name": "' . rand(100, 1000) . '", "value": "' . rand(1001, 10000) . '"}');
    }

    echo $cb . '({"status": "success", "err": "", "goods_id": "' . $id . '", "perPage": "' . $perPage . '", "pageTo": "' . $pageTo . '", "total": "450", "result": [' . join(",", $data) . ']})';
?>