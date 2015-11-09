angular.module('panelApp', ['ui.bootstrap', 'ngRoute', 'uiGmapgoogle-maps', 'ngFileUpload'])
	// django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['$routeProvider', function($routeProvider){
    	$routeProvider
    		.when("/beacons", {
					templateUrl: "/dash/beacons",
				    controller: "dashBeaconsController",
				    controllerAs: 'beaconsCtrl'
    		})
    		.when("/profile", {
    				templateUrl: "/dash/profile",
				    controller: "dashProfileController",
				    controllerAs: 'dpc'
    		})
    		.when("/campaigns", {
    				templateUrl: "/dash/campaigns",
				    controller: "dashCampaignsController",
				    controllerAs: 'dcc'
    		})
    		.when("/shops", {
    				templateUrl: "/dash/shops",
				    controller: "dashShopsController",
				    controllerAs: 'dsc'
    		})
    		.when("/shops/:id?", {
    				templateUrl: "/shop",
				    controller: "shopController",
				    controllerAs: 'sc'	
    		})
    		.when("/beacons/:id?", {
    				templateUrl: "/beacon",
				    controller: "beaconController",
				    controllerAs: 'beaconCtrl'	
    		})
    		.when("/campaigns/:id?/basic/", {
    				templateUrl: "/campaign/basic",
				    controller: "basicController",
				    controllerAs: 'bc'	
    		})
    		.when("/campaigns/:id?/ads/", {
    				templateUrl: "/campaign/ads",
				    controller: "adsController",
				    controllerAs: 'ac'	
    		})
    		.when("/campaigns/:id?/actions/", {
    				templateUrl: "/campaign/actions",
				    controller: "actionsController",
				    controllerAs: 'actionsCtrl'	
    		})		
    		.when("/campaigns/:id?/awards/", {
    				templateUrl: "/campaign/awards",
				    controller: "awardsController",
				    controllerAs: 'awc'	
    		})
    		.when("/campaigns/:campaignID?/awards/:awardID?", {
    				templateUrl: "/campaign/award",
				    controller: "awardController",
				    controllerAs: 'awardCtrl'	
    		})
    		.when("/campaigns/:campaignID?/ads/:adID?", {
    				templateUrl: "/campaign/ad",
				    controller: "adController",
				    controllerAs: 'adCtrl'	
    		})
    }])
    .config(['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: false
        });
    }])
    .factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username + ':' + data.password));
        }
    })
    .factory('appInfo', function() {
    	appInfo = function () {
	    	this.appInfoShow = false;
	    	this.appInfoSuccess = true;
	    	//this.appInfoMsg = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' };
	    	this.appInfoMsg = {};
	    	this.currentPath = "Dashboard";

	    	this.showSuccess = function(){
	    		this.appInfoShow = true;
		    	this.appInfoSuccess = true;
		    	this.appInfoMsg = { type: 'success', msg: 'OK!' };
	    	};
	    	this.showFail = function(errorMsg){
	    		this.appInfoShow = true;
		    	this.appInfoSuccess = false;
		    	this.appInfoMsg = { type: 'danger', msg: errorMsg };
	    	};
	    	this.hideApiMsg = function(){
	    		this.appInfoShow = false;
		    	this.appInfoSuccess = true;
		    	this.appInfoMsg = {};
	    	};
	    	this.setCurrentPath = function(path){
	    		this.currentPath = path;
	    	}
    	}
    	return new appInfo();
    })
	.directive("checkIfActive", function($location, appInfo) {
		return {
			link: function(scope, el, attrs) {
				var elementPath;
				elementPath = attrs.href;
				scope.$on('$locationChangeSuccess', function(event, newURL, oldURL) {
					appInfo.hideApiMsg(); // EXTRACT THIS TO NEXT DIRECTIVE								
					if (newURL.search(elementPath) !== -1) {
					 	el.parent().addClass("active");
					 } else {
					 	el.parent().removeClass("active");
					 }
		      	})
			}
		};
	})
    .controller("panelController", function($scope, $window, $http, $location, appInfo){
		this.appInfo = appInfo;		
	
		this.logout = function(){
			$http({
				method: 'POST',
				url: '/logout/'
			}).then(function successCallback(response){
				$window.location.href = "/";
			}, function errorCallback(response){
				appInfo.showFail(response);
			}.bind(this));	
		};
		
    })
