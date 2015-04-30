function show_notification(message) {
	var opt = {
		type: "basic",
		title: "케이포트의 공유노기",
		message: message,
		iconUrl: "image/82.png"
	}

	chrome.notifications.create(opt);
}

function make_str(data) {
	var str_tmp = "";

	str_tmp = decodeURIComponent(data.name) + "님이 " + data.channel + "채널에 ";

	switch(data.boss) {
		case "B": str_tmp+="블랙드래곤"; break;
		case "W": str_tmp+="화이트드래곤"; break;
		case "R": str_tmp+="레드드래곤"; break;
		case "D": str_tmp+="사막드래곤"; break;
		case "E": str_tmp+="트릭스터"; break;
		default : str_tmp+="error"; break;
	}

	switch(data.state.split("_")[0]){
		case "arrival": str_tmp+="의 출현을 "; break;
		case "0": str_tmp+="의 죽음을 "; break;
		case "now": str_tmp+="을 잡고있음을 "; break;
		case "skip": str_tmp+="의 패스를 "; break;
		default : str_tmp+="error"; break;
	}

	switch(data.state.split("_")[1]){
		case "y": str_tmp+="제보"; break;
		case "n": str_tmp+="취소"; break;
		case "c": str_tmp+="초기화"; break;
		default : str_tmp+="error"; break;
	}

	str_tmp+="하였습니다.";

	return str_tmp;
}

var serverArray = new Array("L", "H", "W", "M");
var raidArray = new Array("B", "W", "D", "R");
var server;
var raids = [];
var sockets = [];

chrome.storage.local.get({
	server: 1,
	raids: [true, true, false, false]
}, function(items) {
	server = items.server;
	raids = items.raids;

	for (var i=0 ; i<raids.length ; i++) {
		if (raids[i] == true) {
			sockets[sockets.length] = io.connect("http://211.109.170.90:12345/socket_" + serverArray[server] + raidArray[i]);
		}
	}

	for (var i=0 ; i<sockets.length ; i++) {
		sockets[i].on("client", function(data){
			if (data.state.split("_")[0] != "checker") {
				var notify_str = make_str(data);
				show_notification(notify_str);
			}
		});
	}
});

chrome.runtime.onMessage.addListener(function(message) {
	if (message == "refresh") {
		for (var i=0 ; i<sockets.length ; i++) {
			sockets[i].close();
		}
		chrome.runtime.reload();
	}
});