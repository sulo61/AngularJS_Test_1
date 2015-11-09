angular.module('panelApp').controller('beaconsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// models
	this.beaconsList = [];
	this.beaconsPages = [];	// numbers
	this.beaconsCurrentPage = 1;
	this.numberOfItems = 0;
	this.campaignBeacons = [];
	// campaign params
	this.id = $routeParams.id;
	// nav
	this.beaconsNavActive = function(page){
		if (page==this.beaconsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.beaconsNavNext = function(){
		if (this.beaconsCurrentPage<this.beaconsPages.length){
			this.getbeacons(this.beaconsCurrentPage+1);
		}
	};
	this.beaconsNavPrev = function(){
		if (this.beaconsCurrentPage>1){
			this.getbeacons(this.beaconsCurrentPage-1);	
		}
	};
	// api
	this.getBeacons = function(page){
		$http({
			method: 'GET',
			url: '/api/beacons/',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.beaconsList = [];
			this.beaconsPages = [];
			this.beaconsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.beaconsPages.push(i+1);
		    }
		    this.beaconsCurrentPage = page;
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	};	
	this.getCampaignBeacons = function(){
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.id+"/beacons",
			params: {"page" : page}
		}).then(function successCallback(response){
			this.beaconsList = [];
			this.beaconsPages = [];
			this.beaconsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.beaconsPages.push(i+1);
		    }
		    this.beaconsCurrentPage = page;
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}

	this.getBeacons(1)

}]);