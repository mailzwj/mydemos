<?php
	if ( isset( $_REQUEST["head"] ) ) {
?>
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<title>jQuery朋友网右侧边栏</title>
</head>
<body>
<?php
	}
?>
<div class="Rb-main">
	<div class="Rb-hd">
		<h2 class="Rb-title">聊天</h2>
	</div>
	<div class="Rb-bd">
		<div class="Rb-list">
			<script type="text/template" id="Rb-ListTpl">
				<div class="Rb-headlist">
					<a href="{{url}}" target="_blank" class="Rb-piclink">
						<img src="{{headpic}}" width="30" height="30">
						<span class="Rb-userstatus{{status}}"></span>
					</a>
				</div>
			</script>
		</div>
	</div>
	<div class="Rb-ft">
		aaa
	</div>
</div>
<?php
	if ( isset( $_REQUEST["head"] ) ) {
?>
</body>
</html>
<?php
	}
?>