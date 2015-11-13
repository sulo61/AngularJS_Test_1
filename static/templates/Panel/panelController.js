angular.module('panelApp', ['ui.bootstrap', 'ngRoute', 'uiGmapgoogle-maps', 'ngFileUpload', 'ngResource'])
	// django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
	.config(function($resourceProvider) {
		$resourceProvider.defaults.stripTrailingSlashes = false;
	})
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
    		.when("/campaigns/:id?/beacons/", {
    				templateUrl: "/campaign/beacons",
				    controller: "beaconsController",
				    controllerAs: 'beaconsCtrl'	
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
    		.when("/campaigns/:campaignID?/actions/:actionID?", {
    				templateUrl: "/campaign/action",
				    controller: "actionController",
				    controllerAs: 'actionCtrl'	
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
	.factory('User', ['$resource',
		function($resource){
			return $resource('../api/user/:userID', {userID: '@id'}, {
				patch: {method:'PATCH'}
			});
	}])
	.factory('Logout', ['$resource',
		function($resource){
			return $resource('../logout/', {}, {
				post: {method:'POST'}
			});
	}])
	.factory('Shops', ['$resource',
		function($resource){
			return $resource('../api/shops/');
	}])
	.factory('Shop', ['$resource',
		function($resource){
			return $resource('../api/shops/:shopID/', {shopID: '@id'}, {
				patch: {method:'PATCH'}
			});
		}])
	.factory('Campaigns', ['$resource',
		function($resource){
			return $resource('../api/campaigns/');
	}])
	.factory('Campaign', ['$resource',
		function($resource){
			return $resource('../api/campaigns/:campaignID', {campaignID: '@id'}, {
				patch: {method:'PATCH'}
			});
	}])
	.factory('Beacons', ['$resource',
		function($resource){
			return $resource('../api/beacons');
	}])
	.factory('Beacon', ['$resource',
		function($resource){
			return $resource('../api/beacons/:beaconID', {beaconID: '@id'});
		}])
	.factory('GoogleCoords', ['$resource',
		function($resource){
			return $resource('http://maps.google.com/maps/api/geocode/json');
	}])
	.factory('CampaignBeacons', ['$resource',
		function($resource){
			return $resource('../api/campaigns/:campaignID/beacons/', {campaignID:'@campaignID'});
	}])
	.factory('CampaignBeacon', ['$resource',
		function($resource){
			return $resource('../api/campaigns/:campaignID/beacons/:beaconID', {campaignID:'@campaignID', beaconID:'@beaconID'});
	}])
	.factory('CampaignBeaconsGenerate', ['$resource',
		function($resource){
			return $resource('../api/campaigns/:campaignID/create_beacons/', {campaignID:'@campaignID'});
	}])
    .factory('appInfo', function() {
    	appInfo = function () {
	    	this.appInfoShow = false;
	    	this.appInfoSuccess = true;
	    	//this.appInfoMsg = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' };
	    	this.appInfoMsg = {};

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
    .controller("panelController", function($scope, $window, $http, $location, appInfo, User, Logout){
		this.lock = false;
		this.appInfo = appInfo;

		this.logout = function () {
			if (this.lock){
				return;
			} else {
				this.lock = true;
			}
			Logout.post(function(){
				this.lock = false;
				$window.location.href = "/";
			}, function(error) {
				this.lock = false;
				appInfo.showFail(error);
			}
		)};

		User.get(function(user) {
			this.email = user.email;
		}.bind(this), function(error){
			this.email = "?"
		});


    })
