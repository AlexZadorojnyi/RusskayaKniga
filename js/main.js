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

var slides = document.getElementsByClassName("promoSlides");
var slideIndex = 1;
var slideDuration = 5000;
var myVar = setInterval(cycleSlides, slideDuration);

function cycleSlides() {	
	if (slideIndex > slides.length - 1) {
		slideIndex = 0;
	} else if (slideIndex < 0) {
		slideIndex = slides.length - 1;
	}
	
	for (var i = 0; i < slides.length; i++){
		if (i == slideIndex) {
			slides[i].style.display = "block";
		} else {
			slides[i].style.display = "none";
		}
	}
	
	slideIndex++;
}