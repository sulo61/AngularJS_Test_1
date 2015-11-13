angular.module('panelApp').controller('awardsController', ['$scope', '$http', '$routeParams', 'appInfo', 'CampaignAwards', 'CampaignAward', function($scope, $http, $routeParams, appInfo, CampaignAwards, CampaignAward){
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
	this.awardsList = [];
	this.awardsPages = [];	// numbers
	this.awardsCurrentPage = 1;
	this.numberOfItems = 0;
	// nav
	this.awardsNavActive = function(page){
		if (page==this.awardsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.awardsNavNext = function(){
		if (this.awardsCurrentPage<this.awardsPages.length){
			this.getAwards(this.awardsCurrentPage+1);
		}
	};
	this.awardsNavPrev = function(){
		if (this.awardsCurrentPage>1){
			this.getAwards(this.awardsCurrentPage-1);	
		}
	};
	// api
	this.getAwards = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignAwards.get({campaignID:this.id}, {page:page}, function(success){
			this.awardsList = [];
			this.awardsPages = [];
			this.awardsList = success.results;
			this.numberOfItems = success.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
				this.awardsPages.push(i+1);
			}
			this.awardsCurrentPage = page;
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	};
	this.deleteAward = function(awardID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignAward.delete({campaignID:this.id, awardID:awardID}, function(){
			this.appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.awardsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.awardsCurrentPage = this.awardsCurrentPage - 1;
			}
			this.unlock();
			this.getAwards(this.awardsCurrentPage);
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	}

	this.getAwards(1);

}]);