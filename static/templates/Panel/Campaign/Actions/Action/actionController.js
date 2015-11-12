angular.module('panelApp').controller('actionController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', function($scope, $http, $routeParams, Upload, appInfo){
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
	// visible flag
	this.chooseBeacon = false;
	this.chooseAd = false;
	// action params
	this.campaignID = $routeParams.campaignID;
	this.actionID = $routeParams.actionID;
	// models
	this.action = {};
	this.actionCopy = {};

	this.beaconsList = [];
	this.beaconsPages = [];	// numbers
	this.beaconsCurrentPage = 1;

	this.adsList = [];
	this.adsPages = [];	// numbers
	this.adsCurrentPage = 1;
	// save disiss
	this.dismiss = function(){
		this.action = angular.copy(this.actionCopy);
	}
	this.save = function(){
		if (this.actionID>0){
			this.patchAction();
		} else {
			this.postAction();
		}
	}
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
	this.adsNavActive = function(page){
		if (page==this.adsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.adsNavNext = function(){
		if (this.adsCurrentPage<this.adsPages.length){
			this.getAds(this.adsCurrentPage+1);
		}
	};
	this.adsNavPrev = function(){
		if (this.adsCurrentPage>1){
			this.getAds(this.adsCurrentPage-1);	
		}
	};
	// beacons
	this.toggleNewBeacon = function(){
		if (this.chooseBeacon){
			this.closeNewBeacon();			
		} else {
			this.openNewBeacon();
		}
	}
	this.openNewBeacon = function(){
		this.chooseBeacon = true;
		this.getCampaignBeacons(1);
	}
	this.closeNewBeacon = function(){
		this.chooseBeacon = false;
		this.beaconsList = [];
		this.beaconsPages = [];	// numbers
		this.beaconsCurrentPage = 1;
	}
	this.useNewBeacon = function(id){
		this.action.beacon = id;
		this.closeNewBeacon();
	}
	// ads
	this.toggleNewAd = function(){
		if (this.chooseAd){
			this.closeNewAd();			
		} else {
			this.openNewAd();
		}
	}
	this.openNewAd = function(){
		this.chooseAd = true;
		this.getCampaignAds(1);
	}
	this.closeNewAd = function(){
		this.chooseAd = false;
		this.adsList = [];
		this.adsPages = [];	// numbers
		this.adsCurrentPage = 1;
	}
	this.useNewAd = function(id){
		this.action.ad = id;
		this.closeNewAd();
	}
	// copy
	this.makeCopy = function(){
		this.actionCopy = angular.copy(this.action);
		this.actionID = this.action.id;
	}
	// api
	this.getAction= function(){
		if (this.actionID>0){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			$http({
				method: 'GET',
				url: '/api/campaigns/'+this.campaignID+"/actions/"+this.actionID
			}).then(function successCallback(response){
				this.action = response.data;
				this.makeCopy();
				this.unlock();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
				this.unlock();
			}.bind(this));	
		}
	}
	this.getCampaignBeacons = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.campaignID+"/beacons/"
		}).then(function successCallback(response){
			this.beaconsList = [];
			this.beaconsList = response.data;			
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}
	this.getCampaignAds = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.campaignID+'/ads/',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.adsList = [];
			this.adsPages = [];
			this.adsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.adsPages.push(i+1);
		    }
		    this.adsCurrentPage = page;
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	};
	this.patchAction = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}		
		$http({
			method: 'PATCH',
			url: '/api/campaigns/'+this.campaignID+"/actions/"+this.actionID,
			data: this.action
		}).then(function successCallback(response){
			this.makeCopy();
			appInfo.showSuccess();
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		}.bind(this));			
				
	}
	this.postAction = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		debugger
		$http({
			method: 'POST',
			url: '/api/campaigns/'+this.campaignID+'/actions/',
			data: this.action
		}).then(function successCallback(response){
			this.action = response.data;
			this.actionID = this.action.id;
			this.makeCopy();			
			appInfo.showSuccess();
			this.unlock();			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		}.bind(this));			
	}

	this.getAction();
}]);