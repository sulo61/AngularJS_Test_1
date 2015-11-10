angular.module('panelApp').controller('awardsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
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
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.id+'/awards',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.awardsList = [];
			this.awardsPages = [];
			this.awardsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.awardsPages.push(i+1);
		    }
		    this.awardsCurrentPage = page;
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	};
	this.deleteAward = function(awardID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'DELETE',
			url: '/api/campaigns/'+this.id+'/awards/'+awardID
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.awardsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.awardsCurrentPage = this.awardsCurrentPage - 1;
			}
			this.getAwards(this.awardsCurrentPage);
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}

	this.getAwards(1);

}]);