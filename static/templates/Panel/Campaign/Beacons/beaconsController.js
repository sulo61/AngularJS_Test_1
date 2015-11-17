angular.module('panelApp').controller('beaconsController', ['$scope', '$http', '$routeParams', 'appInfo', 'CampaignBeacons', 'CampaignBeacon', 'CampaignBeaconsGenerate', function($scope, $http, $routeParams, appInfo, CampaignBeacons, CampaignBeacon, CampaignBeaconsGenerate){
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

		CampaignBeacons.query({campaignID:this.id}, function(success){
			this.beaconsList = [];
			this.beaconsList = success;
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	}
	this.deleteBeacon = function(beaconID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignBeacon.delete({campaignID:this.id, beaconID:beaconID}, function(){
			this.appInfo.showSuccess();
			this.unlock();
			this.getCampaignBeacons();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this))

	}
	this.generateBeacons = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignBeaconsGenerate.save({campaignID:this.id}, {pk:this.id, count:this.numberOfNewBeacons}, function(){
			this.appInfo.showSuccess();
			this.unlock();
			this.getCampaignBeacons();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this))

	}

	this.getCampaignBeacons()

}]);