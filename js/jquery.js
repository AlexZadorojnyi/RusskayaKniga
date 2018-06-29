$(document).ready(function(){
	
	//Width of one book element without padding
	var bookInnerWidth = $(".book").outerWidth();
	//Width of the book container element
	var containerWidth = $(".bookContainer").innerWidth();
		
	var i = 0;
	var r = 0;
	
	do {
		i++;
		r = containerWidth - (bookInnerWidth * i);
	} while (r > bookInnerWidth);
	
	$(".book").css("margin-left", (r / i / 2) + "px");
	$(".book").css("margin-right", (r / i / 2) + "px");
	
	console.log("This container is " + containerWidth + "px wide and can fit " + i + " " + bookInnerWidth + "px wide books with the remainder of " + r + "px. The margin of each book will be " + (r / i / 2) + "px.");
	
	//Width of one book element with padding
	var bookOuterWidth = $(".book").outerWidth(true);
	//Number of book elements
	var bookNum = $(".book").length;
	//Total width of all book elements with padding
	var totalWidth = bookOuterWidth * bookNum;
	
	//Scroll books <<LEFT<<
	$("#scrollLeft").click(function(){
		if((totalWidth - containerWidth) + ($(".book:first").position().left - 1 - bookOuterWidth) > 0){
			$(".book").animate({right: "+=" + bookOuterWidth + "px"}, "slow", function(){
				//console.log($(".book:first").position().left - 1);
			});
		} else {
			console.log("Reached end of list");
		}
	});
	
	//Scroll books <<RIGHT<<
	$("#scrollRight").click(function(){
		if($(".book").css("right") != "0px"){
			$(".book").animate({right: "-=" + bookOuterWidth + "px"}, "slow", function(){
				//console.log($(".book:first").position().left - 1);
			});
		} else {
			console.log("Reached start of list");
		}
	});
});