angular.module('app-auth', []).controller('app-controller', function($scope, $http) {
	// nav
	$scope.changeTab = function(which){
		document.getElementById("nav1").className = "";
		document.getElementById("nav2").className = "";
		document.getElementById("nav3").className = "";
		document.getElementById("nav4").className = "";

		document.getElementById("nav"+which).className ="active";
	}
});


