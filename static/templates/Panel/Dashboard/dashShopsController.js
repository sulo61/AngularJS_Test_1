angular.module('panelApp').controller('dashShopsController', ['$scope', '$http', 'appInfo', function($scope, $http, appInfo){
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
	this.shopsList = [];
	this.shopsPages = [];	// numbers
	this.shopsCurrentPage = 1;
	this.numberOfItems = 0;
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
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'GET',
			url: '/api/shops/',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.shopsList = [];
			this.shopsPages = [];
			this.shopsList = response.data.results;
			this.numberOfItems = response.data.count;
			for (var i=0; i<Math.ceil((this.numberOfItems/5)); i++) {
		    	this.shopsPages.push(i+1);
		    }
		    this.shopsCurrentPage = page;
		    this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	};
	this.deleteShop = function(id, index){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'DELETE',
			url: '/api/shops/'+id
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.numberOfItems = this.numberOfItems - 1;
			if ( (this.numberOfItems <= (this.shopsCurrentPage-1) * 5) && this.numberOfItems>=5){
				this.shopsCurrentPage = this.shopsCurrentPage - 1;
			}
			this.unlock();
			this.getShops(this.shopsCurrentPage);
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}

	this.getShops(1);
}]);