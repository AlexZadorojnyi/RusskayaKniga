var app = angular.module("myApp", []);

app.directive('cycleSlides', function() {
	return function(scope, element, attrs) {
		if (scope.$last){
			setTimeout(cycleSlides(), 5000);
		}
	};
});

//Filters promos based on start and end dates
app.filter('promoFilter', function(){
	return function(input){
		var output = [];
		var currentDate = new Date();
		
		for(var i = 0; i < input.length; i++){
			//Begins displaying on start date, removed on end date
			if(input[i].endDate.getTime() > currentDate.getTime() && currentDate.getTime() > input[i].startDate.getTime()){
				output.push(input[i]);
			}
		}
		return output;
	}
});

app.controller('myCtrl', ['$scope', function($scope) {
	angular.element(document).ready(function () {
        //Scroll variables
		var blockScroll = false;
		var scrollSpeed = 400;
		
		//Width of one book element without padding
		var bookInnerWidth = $(".book").outerWidth();
		
		//Sets margin width based on container parameters
		setMargins();
		window.onresize = setMargins;
		
		//Scroll books >>LEFT>>
		$(".scrollLeft").click(function(){
			var thisClass = this.classList[1];
			if(!reachedStart(thisClass)){
				if(!blockScroll){
					blockScroll = true;
					//Animate for first book in the slider, buttons toggle when animation completes
					$("." + thisClass + ".book:first").animate({right: "-=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, scrollSpeed, function(){
						blockScroll = false;
						if(reachedStart(thisClass)){
							toggleButton(thisClass, "left", "0");
							console.log(thisClass + " reached start of list");
						}
						if(!reachedEnd(thisClass)) toggleButton(thisClass, "right", "1");
						//console.log(Math.round($("." + thisClass + ".book:first").position().left - 1));
					});
					//Animate for the rest of the books in the slider
					$("." + thisClass + ".book:not(:first)").animate({right: "-=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, scrollSpeed);
				}
			}
		});
		
		//Scroll books <<RIGHT<<
		$(".scrollRight").click(function(){
			var thisClass = this.classList[1];
			if(!reachedEnd(thisClass)){
				if(!blockScroll){
					blockScroll = true;
					//Animate for first book in the slider, buttons toggle when animation completes
					$("." + thisClass + ".book:first").animate({right: "+=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, scrollSpeed, function(){
						blockScroll = false;
						if(reachedEnd(thisClass)){
							toggleButton(thisClass, "right", "0");
							console.log(thisClass + " reached end of list");
						}
						if(!reachedStart(thisClass)) toggleButton(thisClass, "left", "1");
						//console.log(Math.round($("." + thisClass + ".book:first").position().left - 1));
					});
					//Animate for the rest of the books in the slider
					$("." + thisClass + ".book:not(:first)").animate({right: "+=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, scrollSpeed);
				}
			}
		});
		
		//Sets margin width based on container parameters
		function setMargins() {
			$(".bookContainer").each(function(){
				//console.log($("." + this.classList[1] + ".book:first").position().left - 1);
				
				var bookIndex = Math.round(($("." + this.classList[1] + ".book:first").position().left - 1) / $(this).children(".book").outerWidth(true));
				
				//Number of book elements
				var bookNum = $(this).children(".book").length;
				//Width of the book container element
				var containerWidth = $(this).innerWidth();
				
				var i = 0;
				var r = 0;
				
				do {
					i++;
					r = containerWidth - (bookInnerWidth * i);
				} while (r > bookInnerWidth && i < bookNum);
				
				$(this).children(".book").css("margin-left",  (r / i / 2) + "px");
				$(this).children(".book").css("margin-right", (r / i / 2) + "px");
				
				//Width of one book element with padding
				var bookOuterWidth = $(this).children(".book").outerWidth(true);
				//Total width of all book elements with padding
				var totalWidth = bookOuterWidth * bookNum;
				
				//console.log(this.classList[1] + " container\nContainer width: " + containerWidth + "px\nBook width: " + bookInnerWidth + "px\nFits: " + i + "/" + bookNum + " books at once\nRemainder: " + r + "px\nMargins: " + r + "/" + i + "=" + (r / i / 2) + "px");
				
				
				//if(bookOuterWidth * bookNum - containerWidth - Math.abs(bookIndex * bookOuterWidth) < 0) {
					$(this).children(".book").css("right", Math.abs(bookIndex * bookOuterWidth));
				//}
			})
		}
		
		/*Replaces long if statement
		Math.round(($("." + thisClass + ".book").outerWidth(true) * $("." + thisClass + ".book").length - $("." + thisClass + ".bookContainer").innerWidth()) + $("." + thisClass + ".book:first").position().left - 1 - $("." + thisClass + ".book").outerWidth(true)) >= 0
		*/
		function reachedEnd(thisClass) {
			var bookOuterWidth = $("." + thisClass + ".book").outerWidth(true);
			var bookNum = $("." + thisClass + ".book").length;
			var containerWidth = $("." + thisClass + ".bookContainer").innerWidth();
			var bookPos = $("." + thisClass + ".book:first").position().left;
			
			if(Math.round(bookOuterWidth * bookNum - containerWidth + bookPos - bookOuterWidth) >= 0){
				return false;
			} else {
				return true;
			}
		}
		
		/*Replaces long if statement
		Math.round($("." + thisClass + ".book:first").position().left - 1 + $("." + thisClass + ".book").outerWidth(true)) <= 0
		*/
		function reachedStart(thisClass) {
			var bookOuterWidth = $("." + thisClass + ".book").outerWidth(true);
			var bookPos = $("." + thisClass + ".book:first").position().left - 1;
			
			if(Math.round(bookPos + bookOuterWidth) <= 0){
				return false;
			} else {
				return true;
			}
		}
		
		//Fades book slider buttons in and out
		$(".bookContainer").mouseenter(function(e){
			var thisClass = this.classList[1];
			if(!reachedEnd(thisClass))   toggleButton(thisClass, "right", "1");
			if(!reachedStart(thisClass)) toggleButton(thisClass, "left", "1");
		}).mouseleave(function(e) {
			if(e.relatedTarget == null || e.relatedTarget.classList[1] != this.classList[1]) {
				toggleButton(this.classList[1], "right", "0");
				toggleButton(this.classList[1], "left", "0");
			}
		});
		
		//Toggles specified slider button on/off
		function toggleButton(thisClass, button, opacity){
			if(button == "right"){
				$(".scrollRight." + thisClass).animate({opacity: opacity}, "fast");
				$(".scrollRight." + thisClass).css("cursor", "default");
				//console.log(thisClass + " " + button + " " + toggle);
			} else if (button == "left") {
				$(".scrollLeft." + thisClass).animate({opacity: opacity}, "fast");
				$(".scrollLeft." + thisClass).css("cursor", "pointer");
				//console.log(thisClass + " " + button + " " + toggle);
			}
		}
	});
	$scope.random = function(){
		return 0.5 - Math.random();
	};
	$scope.promos = [
  	{ 
		address: "../../images/promo/eng/promoEng5.jpg", 
		startDate: new Date('2018-07-11'),
		endDate: new Date('2018-09-12'),
		lang: "en",
		importance: 3
  	},
	{ 
		address: "../../images/promo/eng/promoEng6.jpg", 
		startDate: new Date('2018-06-20'),
		endDate: new Date('2018-08-01'),
		lang: "en",
		importance: 2
  	},
	{ 
		address: "../../images/promo/eng/promoEng7.jpg", 
		startDate: new Date('2018-06-21'),
		endDate: new Date('2018-08-01'),
		lang: "en",
		importance: 1
  	},
	{ 
		address: "../../images/promo/rus/promoRus5.jpg", 
		startDate: new Date('2018-06-19'),
		endDate: new Date('2018-08-01'),
		lang: "ru",
		importance: 3
  	},
	{ 
		address: "../../images/promo/rus/promoRus6.jpg", 
		startDate: new Date('2018-06-20'),
		endDate: new Date('2018-08-01'),
		lang: "ru",
		importance: 2
  	},
	{ 
		address: "../../images/promo/rus/promoRus7.jpg", 
		startDate: new Date('2018-06-21'),
		endDate: new Date('2018-08-01'),
		lang: "ru",
		importance: 1
  	}];
	$scope.books = [
	{
		address: "../../images/books/01.jpg",
		title: "История Российского государства. Царь Петр Алексеевич. Азиатская европеизация",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/02.jpg",
		title: "Ореховый Будда",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/03.jpg",
		title: "Призрак Канта",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/04.jpg",
		title: "Не прощаюсь",
		price: 0,
		author: "",
		category: ["New Arrivals"]
		
	},
	{
		address: "../../images/books/05.jpg",
		title: "Огонь и агония",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/06.jpg",
		title: "Дети мои",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/07.jpg",
		title: "Тобол. Много званых",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/08.jpg",
		title: "Вафли по-шпионски",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/09.jpg",
		title: "iPhuck 10",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	},
	{
		address: "../../images/books/10.jpg",
		title: "Дальше жить",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/11.jpg",
		title: "Самые родные, самые близкие",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/12.jpg",
		title: "Про девушку, которая была бабушкой",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/13.jpg",
		title: "Тобол. Мало избранных",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/14.jpg",
		title: "Бабий ветер",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	},
	{
		address: "../../images/books/15.jpg",
		title: "Русская фантастика-2017. Том первый",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/16.jpg",
		title: "Погребенный великан",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/17.jpg",
		title: "Шпионы тоже лохи",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/18.jpg",
		title: "Джек Ричер, или Без второго имени",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/19.png",
		title: "Мой дикий сад",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/20.jpg",
		title: "Желтые розы для актрисы",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/21.jpg",
		title: "Крайон. Обретение счастья. Победа над страхами, тревогами, сомнениями",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/22.jpg",
		title: "Всё та же я. Цикл До встречи с тобой. Кн.3",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/23.jpg",
		title: "Очаг",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/24.jpg",
		title: "След лисицы на камнях",
		price: 0,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/25.jpg",
		title: "Я признаюсь",
		price: 0 ,
		author: "",
		category: ["New Arrivals"]
	},
	{
		address: "../../images/books/26.jpg",
		title: "Девушка не нашего круга",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	},
	{
		address: "../../images/books/27.jpg",
		title: "Союз радости и печали",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	},
	{
		address: "../../images/books/28.jpg",
		title: "Запасной выход из комы",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	},
	{
		address: "../../images/books/29.jpg",
		title: "Венец демона",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	},
	{
		address: "../../images/books/30.jpg",
		title: "Север и Юг",
		price: 0,
		author: "",
		category: ["New Arrivals", "Top Sellers"]
	}];
}]);