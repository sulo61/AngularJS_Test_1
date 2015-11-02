angular.module('panelApp', ['ui.bootstrap', 'ngRoute', 'uiGmapgoogle-maps'])
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
				    controller: "dashCampaignsController",
				    controllerAs: 'dcc'
    		})
    		.when("/dashShops", {
    				templateUrl: "/dash/shops",
				    controller: "dashShopsController",
				    controllerAs: 'dsc'
    		})
    		.when("/shop/:id?", {
    				templateUrl: "/shop",
				    controller: "shopController",
				    controllerAs: 'sc'	
    		})
    		.when("/campaign/basic/:id?", {
    				templateUrl: "/campaign/basic",
				    controller: "campaignBasicController",
				    controllerAs: 'cbasicc'	
    		})
    		.when("/campaign/ads/:id?", {
    				templateUrl: "/campaign/ads",
				    controller: "campaignAdsController",
				    controllerAs: 'cadsc'	
    		})
    		.when("/campaign/sce/:id?", {
    				templateUrl: "/campaign/sce",
				    controller: "campaignSceController",
				    controllerAs: 'cscec'	
    		})
    		.when("/campaign/awa/:id?", {
    				templateUrl: "/campaign/awa",
				    controller: "campaignAwaController",
				    controllerAs: 'cawac'	
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
    }).controller("panelController", function($scope, $window, $http, $location, appInfo){
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
		this.showBeacons = function(){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Beacons");
			$location.path('/dashBeacons');
		}
		this.showProfile = function(){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Profile");
			$location.path('/dashProfile');
		}
		this.showCampaigns = function(){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaigns");
			$location.path('/dashCampaigns');	
		}
		this.showCampaignBasic = function(name, id){
			this.appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+name);
			$location.path('/campaign/basic/'+id);
		}	
		this.showCampaignAds = function(){
			this.appInfo.hideApiMsg();
			$location.path('/campaign/ads/');			
		}
		this.showCampaignSce = function(){
			this.appInfo.hideApiMsg();
			$location.path('/campaign/sce/');
		}
		this.showCampaignAwa = function(){
			this.appInfo.hideApiMsg();
			$location.path('/campaign/awa/');
		}
		this.showShops = function(){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Shops");
			$location.path('/dashShops');	
		}
		this.showShop = function(name, id){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Shop/"+name);
			$location.path('/shop/'+id);		
		}

    })
