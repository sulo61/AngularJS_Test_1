angular.module('panelApp').controller('adsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// campaign params
	this.id = $routeParams.id;
	this.name = $routeParams.name;
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
		$http({
			method: 'GET',
			url: '/campaigns/'+this.id+'/ads',
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
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	};
	this.deleteAd = function(adID, index){
		$http({
			method: 'DELETE',
			url: '/campaigns/'+this.id+'/ads/'+adID
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if (this.numberOfItems <= (this.adsCurrentPage-1) * 5){
				this.adsCurrentPage = this.adsCurrentPage - 1;
			}
			this.getAds(this.adsCurrentPage);
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}

	this.getAds(1);

}]);