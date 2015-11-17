angular.module('panelApp').controller('actionsController', ['$scope', '$http', '$routeParams', 'appInfo', 'CampaignActions', 'CampaignAction', function($scope, $http, $routeParams, appInfo, CampaignActions, CampaignAction){
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
	this.campaignID = $routeParams.id;
	// models
	this.actionsList = [];
	this.actionsPages = [];	// numbers
	this.actionsCurrentPage = 1;
	this.numberOfItems = 0;
	// nav
	this.actionsNavActive = function(page){
		if (page==this.actionsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.actionsNavNext = function(){
		if (this.actionsCurrentPage<this.actionsPages.length){
			this.getActions(this.actionsCurrentPage+1);
		}
	};
	this.actionsNavPrev = function(){
		if (this.actionsCurrentPage>1){
			this.getActions(this.actionsCurrentPage-1);	
		}
	};
	// api
	this.getActions = function(page){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}


		CampaignActions.get({campaignID:this.campaignID, page:page}, function(success){
			this.actionsList = [];
			this.actionsPages = [];
			this.actionsList = success.results;
			this.numberOfItems = success.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
				this.actionsPages.push(i+1);
			}
			this.actionsCurrentPage = page;
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this));



	};
	this.deleteAction = function(actionID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		CampaignAction.delete({campaignID:this.campaignID, actionID:actionID}, function(){
			this.appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.actionsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.actionsCurrentPage = this.actionsCurrentPage - 1;
			}
			this.unlock();
			this.getAds(this.actionsCurrentPage);
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	}

	this.getActions(1);

}]);