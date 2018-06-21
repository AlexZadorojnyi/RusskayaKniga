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

var slides = document.getElementsByClassName("slides");
var slideIndex = 0;
var slideDuration = 5000;
var myVar;

function cycleSlides() {
	if (slideIndex > slides.length - 1) {
		slideIndex = 0;
	} else if (slideIndex < 0) {
		slideIndex = slides.length - 1;
	}
	
	document.getElementById("slidesButtonNums").innerHTML = "";
	
	for (var i = 0; i < slides.length; i++){
		if (i == slideIndex) {
			slides[i].style.display = "block";
			document.getElementById("slidesButtonNums").innerHTML += "\<span onclick=\"goToSlide("  + (i+1) +" )\">&#9899;</span>";
		} else {
			slides[i].style.display = "none";
			document.getElementById("slidesButtonNums").innerHTML += "\<span onclick=\"goToSlide("  + (i+1) +" )\">&#9898;</span>";
		}
	}
	
	slideIndex++;
	myVar = setTimeout(cycleSlides, slideDuration);
}

function nextSlide() {
	clearTimeout(myVar);
	cycleSlides();
}

function prevSlide() {
	clearTimeout(myVar);
	slideIndex -= 2;
	cycleSlides();
}

function goToSlide(n) {
	clearTimeout(myVar);
	slideIndex = n - 1;
	cycleSlides();
}