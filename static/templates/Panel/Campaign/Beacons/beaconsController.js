angular.module('panelApp').controller('beaconsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// lock
	this.isLock = false;
	this.lock = function(){
		this.isLock = true;
	}
	this.unlock = function(){
		this.isLock = false;
	}
	// api info
	this.appInfo = appInfo;
	// models
	this.beaconsList = [];
	this.beaconsPages = [];	// numbers
	this.beaconsCurrentPage = 1;
	this.numberOfItems = 0;
	this.campaignBeacons = [];
	this.numberOfNewBeacons = 0;	
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
	this.getCampaignBeacons = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.id+"/beacons/"
		}).then(function successCallback(response){
			this.beaconsList = [];
			this.beaconsList = response.data;			
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}
	this.deleteBeacon = function(beaconID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'DELETE',
			url: '/api/campaigns/'+this.id+'/beacons/'+beaconID
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.unlock();
			this.getCampaignBeacons();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}
	this.generateBeacons = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'POST',
			url: '/api/campaigns/'+this.id+'/create_beacons/',
			data: {pk:this.id, count:this.numberOfNewBeacons}
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.unlock();
			this.getCampaignBeacons();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});
	}

	this.getCampaignBeacons()

}]);