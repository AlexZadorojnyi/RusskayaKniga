app.controller('MainController', ['$scope', function($scope) { 
  $scope.promos = [
  	{ 
		address: "..\/..\/images\/promo\/eng\/promoEng5.jpg", 
		date: new Date('2018', '06', '19')
		lang: "eng"
  	},
	{ 
		address: "../../images/promo/eng/promoEng6.jpg", 
		date: new Date('2018', '06', '20')
		lang: "eng"
  	},
	{ 
		address: "../../images/promo/eng/promoEng7.jpg", 
		date: new Date('2018', '06', '21')
		lang: "eng"
  	},
	{ 
		address: "../../images/promo/eng/promoRus5.jpg", 
		date: new Date('2018', '06', '19')
		lang: "rus"
  	},
	{ 
		address: "../../images/promo/eng/promoRus6.jpg", 
		date: new Date('2018', '06', '20')
		lang: "rus"
  	},
	{ 
		address: "../../images/promo/eng/promoRus7.jpg", 
		date: new Date('2018', '06', '21')
		lang: "rus"
  	}
  ];
}]);