function show_notification_webkit(title, body, id) {
	var opt = {
		body: body,
		tag: id,
		icon: "image/48_black.png"
	}
	var notification = new Notification(title, opt);
	return notification;
}

function make_body_arrival(data) {
	var str = "";

	str = data.channel + "채널에 ";

	switch(data.boss) {
		case "B": str+="블랙드래곤이 "; break;
		case "W": str+="화이트드래곤이 "; break;
		case "R": str+="레드드래곤이 "; break;
		case "D": str+="사막드래곤이 "; break;
		case "E": str+="트릭스터가 "; break;
		default : return 1;
	}

	str+="출현했습니다";

	return str;
}

function make_title(boss) {
	var title;

	switch(boss) {
		case "B": title="블랙드래곤"; break;
		case "W": title="화이트드래곤"; break;
		case "R": title="레드드래곤"; break;
		case "D": title="사막드래곤"; break;
		case "E": title="트릭스터"; break;
		default : return 1;
	}

	title += " 진행상황 알림";

	return title;
}


function make_body_now(data) {
	var str = "";

	str = data.channel + "채널에서 ";

	switch(data.boss) {
		case "B": str+="블랙드래곤을 "; break;
		case "W": str+="화이트드래곤을 "; break;
		case "R": str+="레드드래곤을 "; break;
		case "D": str+="사막드래곤을 "; break;
		case "E": str+="트릭스터를 "; break;
		default : return 1;
	}

	str+="잡고있습니다";

	return str;
}

var serverArray = new Array("L", "H", "W", "M");
var raidArray = new Array("B", "W", "D", "R");
var server;
var raids = [];
var sockets = [];
var nowNotificationsArray = [];

chrome.storage.local.get({
	server: 1,
	raids: [true, true, false, false]
}, function(items) {
	server = items.server;
	raids = items.raids;

	for (var i=0 ; i<raids.length ; i++) {
		if (raids[i] === true) {
			sockets[sockets.length] = io.connect("http://211.109.170.90:12345/socket_" + serverArray[server] + raidArray[i]);
		}
	}

	for (var i=0 ; i<sockets.length ; i++) {
		sockets[i].on("client", function(data){
			if (data.state.split("_")[0] != "checker") {
				var status = data.state.split("_")[0];
				var timelimit;
				var notifyBody;
				var notifyTitle;
				var notification;
				var notificationId = data.server + data.boss + data.channel;
				var sec = 1000;

				notifyTitle = make_title(data.boss);			

				switch(status){
					case "arrival":
					timelimit = 7*sec;
					notifyBody = make_body_arrival(data);
					notification = show_notification_webkit(notifyTitle, notifyBody, notificationId);
					break;

					case "now":
					notifyBody = make_body_now(data);
					notification = show_notification_webkit(notifyTitle, notifyBody, notificationId);
					nowNotificationsArray.push(notification);
					break;

					case "0":
					for (var i=0 ; i<nowNotificationsArray.length ; i++) {
						if (nowNotificationsArray[i].tag === notificationId) {
							nowNotificationsArray[i].close();
							nowNotificationsArray.splice(i,1);
						}
					}
					break;

					default : 
					return 1;
				}

				if (timelimit) {
					setTimeout(function() {
						notification.close();
					}, timelimit);
				}
			}
		});
	}
});

chrome.runtime.onMessage.addListener(function(message) {
	if (message === "refresh") {
		for (var i=0 ; i<sockets.length ; i++) {
			sockets[i].close();
		}
		chrome.runtime.reload();
	}
});