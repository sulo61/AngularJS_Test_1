angular.module('panelApp').controller('dashBeaconsController', ['$scope', '$http', 'appInfo', 'Beacons', 'Beacon', function($scope, $http, appInfo, Beacons, Beacon){
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
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		Beacons.get({page:page}, function(success){
			this.beaconsList = [];
			this.beaconsPages = [];
			this.beaconsList = success.results;
			this.numberOfItems = success.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
				this.beaconsPages.push(i+1);
			}
			this.beaconsCurrentPage = page;
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	};
	this.deleteBeacon = function(id, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		Beacon.delete({beaconID:id}, function(){
			this.appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.beaconsCurrentPage-1) * 5) && this.numberOfItems>=5){
				this.beaconsCurrentPage = this.beaconsCurrentPage - 1;
			}
			this.unlock();
			this.getBeacons(this.beaconsCurrentPage);
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	}

	this.getBeacons(1)
}]);