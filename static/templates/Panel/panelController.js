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
				    controller: "panelController",
				    controllerAs: 'pc'
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
	    	this.apiSuccess = false;
	    	this.apiFail = false;
	    	this.apiFailMsg = "";

	    	this.showSuccess = function(){
	    		this.apiSuccess = true;
		    	this.apiFail = false;
		    	this.apiFailMsg = "";
	    	};
	    	this.showFail = function(msg){
	    		this.apiSuccess = false;
		    	this.apiFail = true;
		    	this.apiFailMsg = msg;	
	    	};
	    	this.hideApiMsg = function(){
	    		this.apiSuccess = false;
		    	this.apiFail = false;
		    	this.apiFailMsg = "";
	    	};
    	}
    	return new ApiInfo();
    }).controller("panelController", function($scope, $window, $http, $location){
		this.currentPath = "Dashboard";
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
