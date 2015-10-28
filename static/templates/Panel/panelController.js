angular.module('panelApp', ['ui.bootstrap', 'ngRoute'])
	// django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['$routeProvider', function($routeProvider){
    	$routeProvider
    		.when("/dashBeacons", {
					templateUrl: "/dash/beacons",
				    controller: "panelController",
				    controllerAs: 'pc'
    		})
    		.when("/dashProfile", {
    				templateUrl: "/dash/profile",
				    controller: "dashProfileController",
				    controllerAs: 'dpc'
    		})
    		.when("/dashCampaigns", {
    				templateUrl: "/dash/campaigns",
				    controller: "panelController",
				    controllerAs: 'pc'
    		})
    		.when("/dashShops", {
    				templateUrl: "/dash/shops",
				    controller: "panelController",
				    controllerAs: 'pc'
    		})
    }])
    .factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username + ':' + data.password));
        }
    })
    .factory('apiInfo', function() {
    	ApiInfo = function () {
	    	this.apiInfoShow = false;
	    	this.apiInfoSuccess = true;
	    	//this.apiInfoMsg = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' };
	    	this.apiInfoMsg = {};

	    	this.showSuccess = function(){
	    		this.apiInfoShow = true;
		    	this.apiInfoSuccess = true;
		    	this.apiInfoMsg = { type: 'success', msg: 'OK!' };
	    	};
	    	this.showFail = function(errorMsg){
	    		this.apiInfoShow = true;
		    	this.apiInfoSuccess = false;
		    	this.apiInfoMsg = { type: 'danger', msg: errorMsg };
	    	};
	    	this.hideApiMsg = function(){
	    		this.apiInfoShow = false;
		    	this.apiInfoSuccess = true;
		    	this.apiInfoMsg = {};
	    	};
    	}
    	return new ApiInfo();
    }).controller("panelController", function($scope, $window, $http, $location, apiInfo){
		this.currentPath = "Dashboard";
		this.apiInfo = apiInfo;
	
		this.logout = function(){
			$http({
				method: 'POST',
				url: '/logout/'
			}).then(function successCallback(response){
				$window.location.href = "/";
			}, function errorCallback(response){
				apiInfo.showFail(response);
			}.bind(this));	
		};
		this.showBeacons = function(){
			this.currentPath = "Dashboard/Beacons"
			$location.path('/dashBeacons');
		}
		this.showProfile = function(){
			this.currentPath = "Dashboard/Profile"
			$location.path('/dashProfile');
		}
		this.showCampaigns = function(){
			this.currentPath = "Dashboard/Campaigns"
			$location.path('/dashCampaigns');	
		}
		this.showShops = function(){
			this.currentPath = "Dashboard/Shops"
			$location.path('/dashShops');	
		}
    })
