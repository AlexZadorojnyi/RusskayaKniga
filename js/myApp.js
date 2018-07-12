var app = angular.module("myApp", [])
.directive('cycleSlides', function() {
	return function(scope, element, attrs) {
		if (scope.$last){
			setTimeout(cycleSlides(), 5000);
		}
	};
})
.controller('myCtrl', [function() {
    angular.element(document).ready(function () {
        console.log("ur mom gay");
    });
}]);