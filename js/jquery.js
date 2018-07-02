$(document).ready(function(){
	
	//Width of one book element without padding
	var bookInnerWidth = $(".book").outerWidth();
	//Number of book elements
	var bookNum = $(".book").length;
	//Width of the book container element
	var containerWidth;
	//Width of one book element with padding
	var bookOuterWidth;
	//Total width of all book elements with padding
	var totalWidth;
	//Sets margin width based on container parameters
	setMargins();
	
	//Scroll books <<LEFT<<
	$("#scrollLeft").click(function(){
		if(Math.round((totalWidth - containerWidth) + $(".book:first").position().left - 1 - bookOuterWidth) >= 0){
			$(".book").animate({right: "+=" + bookOuterWidth + "px"}, "slow");
		} else {
			console.log("Reached end of list");
		}
	});
	
	//Scroll books >>RIGHT>>
	$("#scrollRight").click(function(){
		if(Math.round($(".book:first").position().left - 1 + bookOuterWidth) <= 0){
			$(".book").animate({right: "-=" + bookOuterWidth + "px"}, "slow");
		} else {
			console.log("Reached start of list");
		}
	});
	
	//Sets margin width based on container parameters
	function setMargins() {
		var i = 0;
		var r = 0;
		
		containerWidth = $(".bookContainer").innerWidth();
		
		do {
			i++;
			r = containerWidth - (bookInnerWidth * i);
		} while (r > bookInnerWidth && i <= bookNum);
		
		$(".book").css("margin-left", (r / i / 2) + "px");
		$(".book").css("margin-right", (r / i / 2) + "px");
		
		bookOuterWidth = $(".book").outerWidth(true);
		totalWidth = bookOuterWidth * bookNum;
		
		console.log("Container width: " + containerWidth + "px\nBook width: " + bookInnerWidth + "px\nFits: " + i + "/" + bookNum + " books at once\nRemainder: " + r + "px\nMargins: " + r + "/" + i + "=" + (r / i / 2) + "px");
	}
	
	window.onresize = setMargins;
});