angular.module('app-auth', []).
    config(['$httpProvider', function($httpProvider){
        // django and angular both support csrf tokens. This tells
        // angular which cookie to add to what header.
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }]).
    factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            // as per HTTP authentication spec [1], credentials must be
            // encoded in base64. Lets use window.btoa [2]
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username +
                                        ':' + data.password));
        }
    }).controller('app-controller', function($scope, $http, $window) {
	// models
	$scope.user = {};
	$scope.first_name = "";
	$scope.last_name = "";
	$scope.email = "";
	$scope.password = ""
	$scope.id = -1;
	// nav
	$scope.changeTab = function(which){
		document.getElementById("nav1").className = "";
		document.getElementById("nav2").className = "";
		document.getElementById("nav3").className = "";
		document.getElementById("nav4").className = "";

		document.getElementById("nav"+which).className ="active";

		switch(which){
			case 1:
				$scope.openBeacons();
				break;
			case 2:
				$scope.openCampaigns();
				break;
			case 3:
				$scope.openProfile();
				break;
			case 4:
				$scope.openPlaces();
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
			$window.location.href = "/";
		}, function errorCallback(response){
			alert("E");
			debugger
		});	
	};
	// tabs
	$scope.beaconsVisible = true;
	$scope.campaignsVisible = false;
	$scope.profileVisible = false;
	$scope.placesVisible = false;

	$scope.openBeacons = function(){
		$scope.beaconsVisible = true;
		$scope.campaignsVisible = false;
		$scope.profileVisible = false;
		$scope.placesVisible = false;
	};
	$scope.openCampaigns = function(){
		$scope.beaconsVisible = false;
		$scope.campaignsVisible = true;
		$scope.profileVisible = false;
		$scope.placesVisible = false;
	};
	$scope.openProfile = function(){
		$scope.beaconsVisible = false;
		$scope.campaignsVisible = false;
		$scope.profileVisible = true;
		$scope.placesVisible = false;			
		$scope.getUser();
	};
	$scope.openPlaces = function(){
		$scope.beaconsVisible = false;
		$scope.campaignsVisible = false;
		$scope.profileVisible = false;
		$scope.placesVisible = true;
	};
	// api get
	$scope.getUser = function(){
		$http({
			method: 'GET',
			url: '/user/'
		}).then(function successCallback(response){
			$scope.user = response.data;
		}, function errorCallback(response){
			alert("E");
		});
	};
	// api post
	$scope.postUser = function(){
		$http({
			method: 'PATCH',
			url: '/user/'+$scope.user.id+'/',
			data: $scope.user
		}).then(function successCallback(response){
			alert("S");
		}, function errorCallback(response){
			alert("E");
		});
	};
});


