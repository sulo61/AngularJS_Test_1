angular.module('panelApp').controller('dashShopsController', ['$scope', '$http', 'appInfo', function($scope, $http, appInfo){
	// api info
	this.appInfo = appInfo;
	// models
	this.shopsList = [];
	this.shopsPages = [];	// numbers
	this.shopsCurrentPage = 1;
	// nav
	this.shopsNavActive = function(page){
		if (page==this.shopsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.shopsNavNext = function(){
		if (this.shopsCurrentPage<this.shopsPages.length){
			this.getShops(this.shopsCurrentPage+1);
		}
	};
	this.shopsNavPrev = function(){
		if (this.shopsCurrentPage>1){
			this.getShops(this.shopsCurrentPage-1);	
		}
	};
	// api
	this.getShops = function(page){
		$http({
			method: 'GET',
			url: '/shops/',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.shopsList = [];
			this.shopsPages = [];
			this.shopsList = response.data.results;
			for (var i=0; i<parseInt((response.data.count/5)+1); i++) {
		    	this.shopsPages.push(i+1);
		    }
		    this.shopsCurrentPage = page;
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	};

	this.getShops(1);
}]);