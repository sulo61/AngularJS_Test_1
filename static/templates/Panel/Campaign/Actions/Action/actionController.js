angular.module('panelApp').controller('actionController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', 'CampaignActions', 'CampaignAction', 'CampaignBeacons', 'CampaignAds', function($scope, $http, $routeParams, Upload, appInfo, CampaignActions, CampaignAction, CampaignBeacons, CampaignAds){
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
			this.getCampaignBeacons(this.beaconsCurrentPage+1);
		}
	};
	this.beaconsNavPrev = function(){
		if (this.beaconsCurrentPage>1){
			this.getCampaignBeacons(this.beaconsCurrentPage-1);
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
			this.getCampaignAds(this.adsCurrentPage+1);
		}
	};
	this.adsNavPrev = function(){
		if (this.adsCurrentPage>1){
			this.getCampaignAds(this.adsCurrentPage-1);
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

			CampaignAction.get({campaignID:this.campaignID, actionID:this.actionID}, function(success){
				this.action = success;
				this.makeCopy();
				this.unlock();
			}.bind(this), function(error){
				this.appInfo.showFail(error);
				this.unlock();
			}.bind(this));

		}
	}
	this.getCampaignBeacons = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignBeacons.get({campaignID:this.campaignID, pagination:true, page:page}, function(success){
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

	}
	this.getCampaignAds = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignAds.get({campaignID:this.campaignID, page:page}, function(success){
			this.adsList = [];
			this.adsPages = [];
			this.adsList = success.results;
			this.numberOfItems = success.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
				this.adsPages.push(i+1);
			}
			this.adsCurrentPage = page;
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this));
	};
	this.patchAction = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignAction.patch({campaignID:this.campaignID, actionID:this.actionID}, this.action, function(){
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));
				
	}
	this.postAction = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignActions.save({campaignID:this.campaignID}, this.action,  function(success){
			this.action = success;
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this))


	}

	this.getAction();
}]);