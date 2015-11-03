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
    		.when("/campaign/basic/:id/:name?", {
    				templateUrl: "/campaign/basic",
				    controller: "basicController",
				    controllerAs: 'bc'	
    		})
    		.when("/campaign/ads/:id/:name?", {
    				templateUrl: "/campaign/ads",
				    controller: "adsController",
				    controllerAs: 'ac'	
    		})
    		.when("/campaign/sce/:id/:name?", {
    				templateUrl: "/campaign/sce",
				    controller: "sceController",
				    controllerAs: 'sc'	
    		})		
    		.when("/campaign/awards/:id/:name?", {
    				templateUrl: "/campaign/awards",
				    controller: "awardsController",
				    controllerAs: 'awc'	
    		})
    		.when("/campaign/award/:campaignID/:campaignNAME/:awardID/:awardNAME?", {
    				templateUrl: "/campaign/award",
				    controller: "awardController",
				    controllerAs: 'awardCtrl'	
    		})
    		.when("/campaign/award/:campaignID/:campaignNAME/:adID/:adNAME?", {
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
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+name+"/Basic information");
			$location.path('/campaign/basic/'+id+'/'+name);	
		}
		this.showCampaignAds = function(name, id){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+name+"/Advertisements");
			$location.path('/campaign/ads/'+id+'/'+name);	
		}
		this.showCampaignSce = function(name, id){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+name+"/Scenarios");
			$location.path('/campaign/sce/'+id+'/'+name);	
		}
		this.showCampaignAwards = function(name, id){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+name+"/Awards");
			$location.path('/campaign/awards/'+id+'/'+name);	
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
		this.showAward = function(campaignNAME, campaignID, awardNAME, awardID){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+campaignNAME+'/Award/'+awardNAME);
			$location.path('/campaign/award/'+campaignID+'/'+campaignNAME+'/'+awardID+'/'+awardNAME);		
		}
		this.showAd = function(campaignNAME, campaignID, adNAME, adID){
			appInfo.hideApiMsg();
			this.appInfo.setCurrentPath("Dashboard/Campaign/"+campaignNAME+'/Advertisements/'+adNAME);
			$location.path('/campaign/ad/'+campaignID+'/'+campaignNAME+'/'+adID+'/'+adNAME);		
		}
		
    })
