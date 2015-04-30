if (document.getElementsByTagName("frame")[1] != null) {
	$('head').append('<meta http-equiv="refresh" content="0;url=http://211.109.170.90:8888/Mabinogi/">');
} else {
	var s = document.createElement('script');

	s.src = chrome.extension.getURL('inject.js');
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);

	if (!localStorage['extId']) {
		localStorage['extId'] = chrome.runtime.id;
	}
}