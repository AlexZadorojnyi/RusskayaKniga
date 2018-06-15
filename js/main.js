var eng = "\/eng\/";
var rus = "\/rus\/";

function changeLang() {
	var url = window.location.href;
	
	if(url.match(/\/rus\//g)){
		var newUrl = url.replace(rus, eng);
		window.location = newUrl;
	}
	
	if(url.match(/\/eng\//g)){
		var newUrl = url.replace(eng, rus);
		window.location = newUrl;
	}
}