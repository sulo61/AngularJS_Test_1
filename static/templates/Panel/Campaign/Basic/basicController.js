angular.module('panelApp').controller('basicController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
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
	// model
	this.basic = {id:"", name:"", start_date:"", end_date:"", is_active:false};
	this.basicCopy = {};
	// save
	this.save = function(){
		this.saveBasic();
	}
	// dismiss
	this.dismiss = function(){
		this.basic = angular.copy(this.basicCopy);
	}
	// copy
	this.makeCopy = function(response){
		this.basicCopy = angular.copy(this.basic);		
		this.id = this.basic.id;
		this.name = this.basic.name;
		appInfo.setCurrentPath("Dashboard/Campaign/"+this.name+'/Basic information');			
	}
	// api
	this.getBasic = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		if (this.id>0){
			$http({
				method: 'GET',
				url: '/api/campaigns/'+this.id
			}).then(function successCallback(response){
				this.basic = response.data;	
				this.basic.beacons = [];
				this.basicCopy = angular.copy(this.basic);
				this.unlock();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
				this.unlock();
			});	
		}
	}
	this.patchBasic = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'PATCH',
			url: '/api/campaigns/'+this.id,
			data: this.basic
		}).then(function successCallback(response){
			this.makeCopy();
			appInfo.showSuccess();
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}
	this.postBasic = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'POST',
			url: '/api/campaigns/',
			data: this.basic
		}).then(function successCallback(response){
			this.basic = response.data;
			this.makeCopy();
			appInfo.showSuccess();
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});	
	}
	this.saveBasic = function(){
		if (this.id>0){
			this.patchBasic();
		} else {
			this.postBasic();
		}
	}	
	this.getBasic();


}]);