angular.module('panelApp').controller('dashCampaignsController', ['$scope', '$http', 'appInfo', 'Campaigns', function($scope, $http, appInfo, Campaigns){
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
	this.campaignsList = [];
	this.campaignsPages = [];	// numbers
	this.campaignsCurrentPage = 1;
	this.numberOfItems = 0;

	// nav
	this.campaignsNavActive = function(page){
		if (page==this.campaignsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.campaignsNavNext = function(){
		if (this.campaignsCurrentPage<this.campaignsPages.length){
			this.getCampaigns(this.campaignsCurrentPage+1);
		}
	};
	this.campaignsNavPrev = function(){
		if (this.campaignsCurrentPage>1){
			this.getCampaigns(this.campaignsCurrentPage-1);	
		}
	};
	
	// api
	this.getCampaigns = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		Campaigns.get({page:page}, function(success){
			this.campaignsList = [];
			this.campaignsPages = [];
			this.campaignsList = success.results;
			this.numberOfItems = success.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
				this.campaignsPages.push(i+1);
			}
			this.campaignsCurrentPage = page;
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		});

	};
	this.deleteCampaign = function(id, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		Campaigns.delete({campaignID:id}, function(){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.campaignsCurrentPage-1) * 5) && this.numberOfItems>=5){
				this.campaignsCurrentPage = this.campaignsCurrentPage - 1;
			}
			this.unlock();
			this.getCampaigns(this.campaignsCurrentPage);
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		});

	}



	this.getCampaigns(1);
}]);