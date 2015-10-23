angular.module('appDashboard', []).
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
    }).controller('dashboardController', function($scope, $http, $window) {
    	// api info
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
		// models
		this.user = {};
		this.first_name = "";
		this.last_name = "";
		this.email = "";
		this.password = ""
		this.id = -1;

		this.places = [];
		this.placesPages = [];
		this.placesCurrentPage = 1;
		// dashboard nav
		this.changeTab = function(which){
			this.hideApiMsg();

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
		// places nav
		this.placesNavActive = function(page){
			if (page==this.placesCurrentPage){
				return "active"
			} else {
				return "";
			}
		}
		this.placesNavNext = function(){
			if (this.placesCurrentPage<this.placesPages.length){
				this.getPlaces(this.placesCurrentPage+1);
			}
		}
		this.placesNavPrev = function(){
			if (this.placesCurrentPage>1){
				this.getPlaces(this.placesCurrentPage-1);	
			}
		}
		// tabs
		this.beaconsVisible = true;
		this.campaignsVisible = false;
		this.profileVisible = false;
		this.placesVisible = false;

		this.openBeacons = function(){
			this.beaconsVisible = true;
			this.campaignsVisible = false;
			this.profileVisible = false;
			this.placesVisible = false;
		};
		this.openCampaigns = function(){
			this.beaconsVisible = false;
			this.campaignsVisible = true;
			this.profileVisible = false;
			this.placesVisible = false;
		};
		this.openProfile = function(){
			this.beaconsVisible = false;
			this.campaignsVisible = false;
			this.profileVisible = true;
			this.placesVisible = false;			
			this.getUser();
		};
		this.openPlaces = function(){
			this.beaconsVisible = false;
			this.campaignsVisible = false;
			this.profileVisible = false;
			this.placesVisible = true;
			this.getPlaces(1);
		};
		// api get
		this.getUser = function(){
			$http({
				method: 'GET',
				url: '/user/'
			}).then(function successCallback(response){
				this.user = response.data;
			}.bind(this), function errorCallback(response){
				this.showFail(response);
			}.bind(this));
		};
		this.getPlaces = function(page){
			$http({
				method: 'GET',
				url: '/shops/',
				params: {"page" : page}
			}).then(function successCallback(response){
				this.places = [];
				this.placesPages = [];

				this.places = response.data.results;
				for (var i=0; i<parseInt((response.data.count/5)+1); i++) {
			    	this.placesPages.push(i+1);
			    }
			    this.placesCurrentPage = page;
			}.bind(this), function errorCallback(response){
				this.showFail(response);
			}.bind(this));	
		};
		// api post
		this.logout = function(){
			$http({
				method: 'POST',
				url: '/logout/'
			}).then(function successCallback(response){
				$window.location.href = "/";
			}.bind(this), function errorCallback(response){
				this.showFail(response);
			}.bind(this));	
		};
		this.postUser = function(){
			$http({
				method: 'PATCH',
				url: '/user/'+this.user.id+'/',
				data: this.user
			}).then(function successCallback(response){
				this.showSuccess();
			}.bind(this), function errorCallback(response){
				this.showFail(response);
			}.bind(this));
		};
});


