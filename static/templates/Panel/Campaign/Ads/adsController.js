angular.module('panelApp').controller('adsController', ['$scope', '$http', '$routeParams', 'appInfo', 'CampaignAds', 'CampaignAd',  function($scope, $http, $routeParams, appInfo, CampaignAds, CampaignAd){
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
	// campaign params
	this.id = $routeParams.id;
	// models
	this.adsList = [];
	this.adsPages = [];	// numbers
	this.adsCurrentPage = 1;
	this.numberOfItems = 0;
	// nav
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
	// api
	this.getAds = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}


		CampaignAds.get({campaignID:this.id, page:page}, function(success){
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
	this.deleteAd = function(adID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignAd.delete({campaignID:this.id, adID:adID}, function(){
			this.appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.adsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.adsCurrentPage = this.adsCurrentPage - 1;
			}
			this.unlock();
			this.getAds(this.adsCurrentPage);
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));
	}

	this.getAds(1);

}]);