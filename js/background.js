function show_notification_webkit() {
	if (arguments.length !== 3)
		arguments[2] = "";

	var opt = {
		body: arguments[1],
		tag: arguments[2],
		icon: "image/48_black.png"
	}
	var notification = new Notification(arguments[0], opt);
	return notification;
}

function make_title(data) {
	var title;
	var name = decodeURIComponent(data.name).split("]")[1];

	if (!name) name = decodeURIComponent(data.name);
	
	title = name + "님의 제보입니다";

	return title;
}

function make_body_arrival(data, flag) {
	var str = "";

	str = data.channel + "채널에 ";

	if (flag === "n")
		str+="출현한 ";

	switch(data.boss) {
		case "B": str+="블랙드래곤"; break;
		case "W": str+="화이트드래곤"; break;
		case "R": str+="레드드래곤"; break;
		case "D": str+="사막드래곤"; break;
		case "E": str+="트릭스터"; break;
		default : return 1;
	}

	if (flag === "y")
		str+="이 출현했습니다";
	else
		str+="에 관한 제보는 잘못된 제보입니다";

	return str;
}

function make_body_now(data, flag) {
	var str = "";

	str = data.channel + "채널에서 ";

	if (flag === "n")
		str+="잡고있는 ";

	switch(data.boss) {
		case "B": str+="블랙드래곤"; break;
		case "W": str+="화이트드래곤"; break;
		case "R": str+="레드드래곤"; break;
		case "D": str+="사막드래곤"; break;
		case "E": str+="트릭스터"; break;
		default : return 1;
	}

	if (flag === "y")
		str+="을 잡고있습니다";
	else
		str+="에 관한 제보는 잘못된 제보입니다";

	return str;
}

function make_body_kill(data, flag) {
	var str = "";

	str = data.channel + "채널에서 ";

	if (flag === "n")
		str+="처치한 ";

	switch(data.boss) {
		case "B": str+="블랙드래곤"; break;
		case "W": str+="화이트드래곤"; break;
		case "R": str+="레드드래곤"; break;
		case "D": str+="사막드래곤"; break;
		case "E": str+="트릭스터"; break;
		default : return 1;
	}

	if (flag === "y")
		str+="을 처치하였습니다";
	else
		str+="에 관한 제보는 잘못된 제보입니다";

	return str;
}

function close_now_notification(id) {
	for (var i=nowNotificationsArray.length-1 ; i>=0 ; i--) {
		if (nowNotificationsArray[i].tag === id) {
			nowNotificationsArray[i].close();
			nowNotificationsArray.splice(i,1);
		}
	}
}

function set_notification_close_timeout(notification) {
	var sec = 1000;
	var millisec = second * sec;

	setTimeout(function() {
		notification.close();
	}, millisec);
}

var serverArray = new Array("L", "H", "W", "M");
var raidArray = new Array("B", "W", "D", "R");
var server;
var raids = [];
var second;
var sockets = [];
var nowNotificationsArray = [];

chrome.storage.local.get({
	server: 1,
	raids: [true, true, false, false],
	second: 7
}, function(items) {
	server = items.server;
	raids = items.raids;
	second = items.second;

	for (var i=0 ; i<raids.length ; i++) {
		if (raids[i] === true) {
			sockets[sockets.length] = io.connect("http://211.109.170.90:12345/socket_" + serverArray[server] + raidArray[i]);
		}
	}

	for (var i=0 ; i<sockets.length ; i++) {
		sockets[i].on("client", function(data){
			if (data.state.split("_")[0] != "checker") {
				var status = data.state.split("_")[0];
				var flag = data.state.split("_")[1];
				var notifyTitle;
				var notifyBody;
				var notification;
				var notificationId = data.server + data.boss + data.channel;
				
				notifyTitle = make_title(data);			

				switch(status){
					case "arrival":
						notifyBody = make_body_arrival(data, flag);
						notification = show_notification_webkit(notifyTitle, notifyBody, notificationId);
						set_notification_close_timeout(notification);
					break;

					case "now":
						notifyBody = make_body_now(data, flag);
						notification = show_notification_webkit(notifyTitle, notifyBody, notificationId);
						if (flag === "y"){
							nowNotificationsArray.push(notification);
						}
						else {
							close_now_notification(notificationId);
							set_notification_close_timeout(notification);
						}
					break;

					case "0":
						notifyBody = make_body_kill(data, flag);
						notification = show_notification_webkit(notifyTitle, notifyBody);
						set_notification_close_timeout(notification);
						if (flag === "y") {
							close_now_notification(notificationId);
						}
						else {
							flag = "y";
							notifyBody = make_body_now(data, flag);
							notification = show_notification_webkit(notifyTitle, notifyBody, notificationId);
							nowNotificationsArray.push(notification);
						}
					break;
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