$(document).ready(function(){
	
	//Width of one book element without padding
	var bookInnerWidth = $(".book").outerWidth();
	
	//Sets margin width based on container parameters
	setMargins();
	
	//Scroll books <<LEFT<<
	$(".scrollLeft").click(function(){
		var thisClass = this.classList[1];
		//console.log(thisClass);
		if(Math.round(($("." + thisClass + ".book").outerWidth(true) * $("." + thisClass + ".book").length - $("." + thisClass + ".bookContainer").innerWidth()) + $("." + thisClass + ".book:first").position().left - 1 - $("." + thisClass + ".book").outerWidth(true)) >= 0){
			$("." + thisClass + ".book").animate({right: "+=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, "slow");
		} else {
			console.log(thisClass + " reached end of list");
		}
	});
	
	//Scroll books >>RIGHT>>
	$(".scrollRight").click(function(){
		var thisClass = this.classList[1];
		//console.log(thisClass);
		if(Math.round($("." + thisClass + ".book:first").position().left - 1 + $("." + thisClass + ".book").outerWidth(true)) <= 0){
			$("." + thisClass + ".book").animate({right: "-=" + $("." + thisClass + ".book").outerWidth(true) + "px"}, "slow");
		} else {
			console.log(thisClass + " reached start of list");
		}
	});
	
	//Sets margin width based on container parameters
	function setMargins() {
		$(".bookContainer").each(function(){
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
			
			console.log(this.classList[1] + " container\nContainer width: " + containerWidth + "px\nBook width: " + bookInnerWidth + "px\nFits: " + i + "/" + bookNum + " books at once\nRemainder: " + r + "px\nMargins: " + r + "/" + i + "=" + (r / i / 2) + "px");
		})
	}
	
	window.onresize = setMargins;
});