angular.module('app-auth', []).controller('app-controller', function($scope, $http, $window) {
	$scope.beaconsVisible = true;
	$scope.campaignsVisible = false;
	$scope.profileVisible = false;
	$scope.placesVisible = false;
	// nav
	$scope.changeTab = function(which){
		document.getElementById("nav1").className = "";
		document.getElementById("nav2").className = "";
		document.getElementById("nav3").className = "";
		document.getElementById("nav4").className = "";

		document.getElementById("nav"+which).className ="active";

		switch(which){
			case 1:
				$scope.getBeacons();
				break;
			case 2:
				$scope.getCampaigns();
				break;
			case 3:
				$scope.getProfile();
				break;
			case 4:
				$scope.getPlaces();
				break;
		}
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
		$scope.beaconsVisible = true;
		$scope.campaignsVisible = false;
		$scope.profileVisible = false;
		$scope.placesVisible = false;
	}
	$scope.getCampaigns = function(){
		$scope.beaconsVisible = false;
		$scope.campaignsVisible = true;
		$scope.profileVisible = false;
		$scope.placesVisible = false;
	}
	$scope.getProfile = function(){
		$scope.beaconsVisible = false;
		$scope.campaignsVisible = false;
		$scope.profileVisible = true;
		$scope.placesVisible = false;	
		$http({
			method: 'GET',
			url: '/user/'
		}).then(function successCallback(response){
			alert("S");
		}, function errorCallback(response){
			alert("E");
		});	
	}
	$scope.getPlaces = function(){
		$scope.beaconsVisible = false;
		$scope.campaignsVisible = false;
		$scope.profileVisible = false;
		$scope.placesVisible = true;
	}
});


