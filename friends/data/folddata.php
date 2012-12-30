<?php
	$cb = $_GET["callback"];
	$arr = array();
	$status = array(0, 1, 2, 3);
	$colors = array("a67853", "737373", "326363", "428542", "165353");
	for($i = 0; $i < 100; $i++){
		$arr[$i] = '{"status": ' . $status[rand(0, count($status) - 1)] . ', "headpic": "http://placebox.es/30/30/' . $colors[rand(0, count($colors) - 1)] . '/ffffff/", "userid": ' . rand(100, 999) . '}';
	}
	echo $cb . '({"success": true, "data": [' . implode(",", $arr) . ']})';
?>