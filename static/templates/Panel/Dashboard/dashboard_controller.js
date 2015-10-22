angular.module('app-auth', []).controller('app-controller', function($scope, $http, $window) {
	// nav
	$scope.changeTab = function(which){
		document.getElementById("nav1").className = "";
		document.getElementById("nav2").className = "";
		document.getElementById("nav3").className = "";
		document.getElementById("nav4").className = "";

		document.getElementById("nav"+which).className ="active";
	};
	// logout
	$scope.logout = function(){
		$http({
			method: 'POST',
			url: '/logout/'
		}).then(function successCallback(response){
			alert("S");
			debugger
			$window.location.href = "/login";
		}, function errorCallback(response){
			alert("E");
			debugger
		});	
	};
	// tabs
	$scope.getBeacons = function(){
		alert("lol");
	}
	$scope.getProfile = function(){
		$http({
			method: '',
			url: '/GET/'
		}).then(function successCallback(response){
			alert("S");
		}, function errorCallback(response){
			alert("E");
		});	
	}
});


