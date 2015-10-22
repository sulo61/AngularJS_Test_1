angular.module('app-auth', []).
	// django auth
    config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }]).
    factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username + ':' + data.password));
        }
    }).controller('app-controller', function($scope, $http, $window) {
    	// api info
    	$scope.apiSuccess = false;
    	$scope.apiFail = false;
    	$scope.apiFailMsg = "";
    	$scope.showSuccess = function(){
    		$scope.apiSuccess = true;
	    	$scope.apiFail = false;
	    	$scope.apiFailMsg = "";
    	};
    	$scope.showFail = function(msg){
    		$scope.apiSuccess = false;
	    	$scope.apiFail = true;
	    	$scope.apiFailMsg = msg;	
    	};
    	$scope.hideApiMsg = function(){
    		$scope.apiSuccess = false;
	    	$scope.apiFail = false;
	    	$scope.apiFailMsg = "";
    	};
		// models
		$scope.user = {};
		$scope.first_name = "";
		$scope.last_name = "";
		$scope.email = "";
		$scope.password = ""
		$scope.id = -1;
		// nav
		$scope.changeTab = function(which){
			$scope.hideApiMsg();

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
				$scope.showFail(response);
			});
		};
		// api post
		$scope.logout = function(){
			$http({
				method: 'POST',
				url: '/logout/'
			}).then(function successCallback(response){
				$window.location.href = "/";
			}, function errorCallback(response){
				$scope.showFail(response);
			});	
		};
		$scope.postUser = function(){
			$http({
				method: 'PATCH',
				url: '/user/'+$scope.user.id+'/',
				data: $scope.user
			}).then(function successCallback(response){
				$scope.showSuccess();
			}, function errorCallback(response){
				$scope.showFail(response);
			});
		};
});


