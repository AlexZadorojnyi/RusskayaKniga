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
var slideIndex = 0;
var slideDuration = 5000;
var myVar;

function cycleSlides() {
	//console.log(slideIndex);
	
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
	myVar = setTimeout(cycleSlides, slideDuration);
}

function nextSlide() {
	clearTimeout(myVar);
	//slideIndex++;
	cycleSlides();
}

function prevSlide() {
	clearTimeout(myVar);
	slideIndex -= 2;
	cycleSlides();
}

function displayButtons() {
	for (var i = 0; i < slides.length; i++) {
		document.getElementById("numberButtons").innerHTML += "\<button type=\"button\">" + (i+1) + "\<\/button>";;
	}
}