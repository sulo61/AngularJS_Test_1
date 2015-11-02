angular.module('panelApp').controller('dashCampaignsController', ['$scope', '$http', 'appInfo', function($scope, $http, appInfo){
	// api info
	this.appInfo = appInfo;
	// models
	this.campaignsList = [];
	this.campaignsPages = [];	// numbers
	this.campaignsCurrentPage = 1;

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
		$http({
			method: 'GET',
			url: '/campaigns/',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.campaignsList = [];
			this.campaignsPages = [];
			this.campaignsList = response.data.results;
			for (var i=0; i<Math.ceil((response.data.count/5)); i++) {
		    	this.campaignsPages.push(i+1);
		    }
		    this.campaignsCurrentPage = page;
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	};
	this.deleteCampaign = function(id, index){
		$http({
			method: 'DELETE',
			url: '/campaigns/'+id
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.getCampaigns(this.campaignsCurrentPage);
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}



	this.getCampaigns(1);
}]);