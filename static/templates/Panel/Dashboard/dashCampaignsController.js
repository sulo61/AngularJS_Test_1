angular.module('panelApp').controller('dashCampaignsController', ['$scope', '$http', 'appInfo', function($scope, $http, appInfo){
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
		$http({
			method: 'GET',
			url: '/api/campaigns/',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.campaignsList = [];
			this.campaignsPages = [];
			this.campaignsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.campaignsPages.push(i+1);
		    }
		    this.campaignsCurrentPage = page;
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	};
	this.deleteCampaign = function(id, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'DELETE',
			url: '/api/campaigns/'+id
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.campaignsCurrentPage-1) * 5) && this.numberOfItems>=5){
				this.campaignsCurrentPage = this.campaignsCurrentPage - 1;
			}
			this.getCampaigns(this.campaignsCurrentPage);
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}



	this.getCampaigns(1);
}]);