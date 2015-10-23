angular.module('dashboardApp', ['ngRoute'])
	// django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['$routeProvider', function($routeProvider){
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
    })
    .controller('dashboardController', function($scope, $http, $window, apiInfo) {
    	// api info
    	this.apiInfo = apiInfo;
    	
		// dashboard nav
		this.changeTab = function(which){
			this.apiInfo.hideApiMsg();

			document.getElementById("nav1").className = "";
			document.getElementById("nav2").className = "";
			document.getElementById("nav3").className = "";
			document.getElementById("nav4").className = "";

			document.getElementById("nav"+which).className ="active";

			switch(which){
				case 1:
					this.openBeacons();
					break;
				case 2:
					this.openCampaigns();
					break;
				case 3:
					this.openProfile();
					break;
				case 4:
					this.openPlaces();
					break;
			}
		};
		
		// tabs
		this.beaconsVisible = true;
		this.campaignsVisible = false;
		this.profileVisible = false;
		this.shopsVisible = false;

		this.openBeacons = function(){
			this.beaconsVisible = true;
			this.campaignsVisible = false;
			this.profileVisible = false;
			this.shopsVisible = false;
		};
		this.openCampaigns = function(){
			this.beaconsVisible = false;
			this.campaignsVisible = true;
			this.profileVisible = false;
			this.shopsVisible = false;
		};
		this.openProfile = function(){
			this.beaconsVisible = false;
			this.campaignsVisible = false;
			this.profileVisible = true;
			this.shopsVisible = false;			
		};
		this.openPlaces = function(){
			this.beaconsVisible = false;
			this.campaignsVisible = false;
			this.profileVisible = false;
			this.shopsVisible = true;
		};		
		
		// api
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
		
});


