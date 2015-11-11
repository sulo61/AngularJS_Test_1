angular.module('panelApp').controller('actionsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
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
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.campaignID+'/actions',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.actionsList = [];
			this.actionsPages = [];
			this.actionsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.actionsPages.push(i+1);
		    }
		    this.actionsCurrentPage = page;
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	};
	this.deleteAction = function(actionID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'DELETE',
			url: '/api/campaigns/'+this.campaignID+'/actions/'+actionID
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.actionsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.actionsCurrentPage = this.actionsCurrentPage - 1;
			}
			this.unlock();
			this.getActions(this.actionsCurrentPage);			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}

	this.getActions(1);

}]);