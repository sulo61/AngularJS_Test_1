angular.module('panelApp').controller('adsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
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
		$http({
			method: 'GET',
			url: '/api/campaigns/'+this.id+'/ads',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.adsList = [];
			this.adsPages = [];
			this.adsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.adsPages.push(i+1);
		    }
		    this.adsCurrentPage = page;
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	};
	this.deleteAd = function(adID, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'DELETE',
			url: '/api/campaigns/'+this.id+'/ads/'+adID
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.adsCurrentPage-1) * 5) && this.numberOfItems>=5 ){
				this.adsCurrentPage = this.adsCurrentPage - 1;
			}
			this.unlock();
			this.getAds(this.adsCurrentPage);			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}

	this.getAds(1);

}]);