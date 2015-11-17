angular.module('panelApp').controller('promotionsController', ['$scope', '$http', '$routeParams', 'appInfo', 'CampaignPromotions', 'CampaignPromotion',  function($scope, $http, $routeParams, appInfo, CampaignPromotions, CampaignPromotion){
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
	this.promotionsList = [];
	this.promotionsPages = [];	// numbers
	this.promotionsCurrentPage = 1;
	this.numberOfItems = 0;
	// nav
	this.promotionsNavActive = function(page){
		if (page==this.promotionsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.promotionsNavNext = function(){
		if (this.promotionsCurrentPage<this.promotionsPages.length){
			this.getAds(this.promotionsCurrentPage+1);
		}
	};
	this.promotionsNavPrev = function(){
		if (this.promotionsCurrentPage>1){
			this.getAds(this.promotionsCurrentPage-1);	
		}
	};
	// api
	this.getPromotions = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}


		CampaignPromotions.get({campaignID:this.id, page:page}, function(success){
			this.promotionsList = [];
			this.promotionsPages = [];
			this.promotionsList = success.results;
			this.numberOfItems = success.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
				this.promotionsPages.push(i+1);
			}
			this.promotionsCurrentPage = page;
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	};
	this.deletePromotion = function(promotionID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignPromotion.delete({campaignID:this.id, promotionID:promotionID}, function(){
			this.appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.promotionsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.promotionsCurrentPage = this.promotionsCurrentPage - 1;
			}
			this.unlock();
			this.getPromotions(this.promotionsCurrentPage);
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));
	}

	this.getPromotions(1);

}]);