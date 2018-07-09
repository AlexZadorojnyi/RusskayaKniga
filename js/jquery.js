$(document).ready(function(){
	
	//Width of one book element without padding
	var bookInnerWidth = $(".book").outerWidth();
	
	//Sets margin width based on container parameters
	setMargins();
	
	//Scroll books <<LEFT<<
	$(".scrollLeft").click(function(){
		var thisClass = this.classList[1];
		if(!reachedEnd(thisClass)){
			$("." + thisClass + ".book").animate({right: "+=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, "slow", function(){
				console.log(Math.round($("." + thisClass + ".book:first").position().left - 1));
			});
		} else {
			console.log(thisClass + " reached end of list");
		}
	});
	
	//Scroll books >>RIGHT>>
	$(".scrollRight").click(function(){
		var thisClass = this.classList[1];
		if(!reachedStart(thisClass)){
			$("." + thisClass + ".book").animate({right: "-=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, "slow", function(){
				console.log(Math.round($("." + thisClass + ".book:first").position().left - 1));
			});
		} else {
			console.log(thisClass + " reached start of list");
		}
	});
	
	//Sets margin width based on container parameters
	function setMargins() {
		$(".bookContainer").each(function(){
			//console.log($("." + this.classList[1] + ".book:first").position().left - 1);
			//
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
		var bookPos = $("." + thisClass + ".book:first").position().left - 1;
		
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
	
	window.onresize = setMargins;
	
	//Fades book slider buttons in and out
	$(".bookContainer").mouseenter(function(e){
		var thisClass = this.classList[1];
		$(".scrollLeft."  + this.classList[1]).animate({opacity: "1"});
		$(".scrollRight." + this.classList[1]).animate({opacity: "1"});
	}).mouseleave(function(e) {
		if(e.relatedTarget.classList[1] != this.classList[1]) {
			$(".scrollLeft."  + this.classList[1]).animate({opacity: "0"});
			$(".scrollRight." + this.classList[1]).animate({opacity: "0"});
		}
	});
});