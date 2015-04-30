socket.on('client',function(data){
	var str_tmp="";
	
	str_tmp="<font color='red'><b>"+decodeURIComponent(data.name)+"</b></font>님이 <font color='red'><b>"+data.channel+"채널</b></font>에 ";
	if(data.state.split("_")[0]=="checker"){
		str_tmp+="<font color='red'><b>채널링 도우미</b></font>를 ";
		switch(data.state.split("_")[1]){
			case "y": str_tmp+="신청"; break;
			case "n": str_tmp+="취소"; break;
			case "c": str_tmp+="초기화"; break;
			default : str_tmp+="error"; break;
		}
		str_tmp+="하셨습니다.";
	}else{
		str_tmp+="<font color='red'><b>";
		switch(data.boss){
			case "B": str_tmp+="블랙드래곤"; break;
			case "W": str_tmp+="화이트드래곤"; break;
			case "R": str_tmp+="레드드래곤"; break;
			case "D": str_tmp+="사막드래곤"; break;
			case "E": str_tmp+="트릭스터"; break;
			default : str_tmp+="error"; break;
		}
		str_tmp+="</b></font>의 <font color='red'><b>";
	
		switch(data.state.split("_")[0]){
			case "arrival": str_tmp+="출현"; break;
			case "0": str_tmp+="죽음"; break;
			case "now": str_tmp+="잡고있음"; break;
			case "skip": str_tmp+="패스"; break;
			default : str_tmp+="error"; break;
		}
		str_tmp+="</b></font>을(를) <font color='red'><b>";
		switch(data.state.split("_")[1]){
			case "y": str_tmp+="제보"; break;
			case "n": str_tmp+="취소"; break;
			case "c": str_tmp+="초기화"; break;
			default : str_tmp+="error"; break;
		}
		str_tmp+="</b></font>하였습니다.";
	}

	//injected part start
	function strip_tag(str) {
		var regex = /(<([^>]+)>)/ig;
		return str.replace(regex, "");
	}

	chrome.runtime.sendMessage(localStorage['extId'],strip_tag(str_tmp));
	//injected part end

	$("#socket_view").html(str_tmp);
	$("#socket_view").show('fast');
	clearTimeout(view_time);
	view_time = setTimeout(function(){$("#socket_view").hide('fast');},4000);

	cg_channel();
	
	switch(data.state.split("_")[0]){
		case "arrival": case "now":
			soundPlay();
		break;
		default :
		break;
	}
	
	var d = new Date();
	var timeKo="";
	timeKo+= (d.getMonth()+1)>9 ? ''+(d.getMonth()+1) : '0'+(d.getMonth()+1);
	timeKo+= "-"+(d.getDate()>9 ? ''+d.getDate() : '0'+d.getDate());
	timeKo+= " "+(d.getHours()>9 ? ''+d.getHours() : '0'+d.getHours());
	timeKo+= ":"+(d.getMinutes()>9 ? ''+d.getMinutes() : '0'+d.getMinutes());
	timeKo+= ":"+(d.getSeconds()>9 ? ''+d.getSeconds() : '0'+d.getSeconds());
	putHistory(timeKo,data.channel,data.state.split("_")[0],decodeURIComponent(data.name));
});

console.log("injected!");