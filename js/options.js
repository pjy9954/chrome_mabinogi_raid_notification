function get_select_server() {
	var radioBtns = document.getElementsByClassName("radioBtn");

	for(var i=0 ; i<radioBtns.length ; i++) {
		if (radioBtns[i].checked == true) return i;
	}

	return 0;
}

function get_select_raids() {
	var raids = document.getElementsByClassName("checkbox");
	var returnArray = new Array();

	for(var i=0 ; i<raids.length ; i++) {
		returnArray[i] = raids[i].checked;
	}

	return returnArray;
}

function save_options() {
	var server = get_select_server();
	var raids = get_select_raids();
	var second = document.getElementById("notiSec").value;
	chrome.storage.local.set({
		server: server,
		raids: raids,
		second: second
	});

	chrome.runtime.sendMessage(chrome.runtime.id, "refresh");
}

function restore_options() {
	chrome.storage.local.get({
		server: 1,
		raids: [true, true, false, false],
		second: 7
	}, function(items) {
		var radioBtns = document.getElementsByClassName("radioBtn");
		var raids = document.getElementsByClassName("checkbox");

		radioBtns[items.server].checked = true;
		raids[0].checked = items.raids[0];
		raids[1].checked = items.raids[1];
		raids[2].checked = items.raids[2];
		raids[3].checked = items.raids[3];
		document.getElementById("notiSec").value = items.second;
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);