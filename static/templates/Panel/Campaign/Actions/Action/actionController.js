angular.module('panelApp').controller('actionController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', function($scope, $http, $routeParams, Upload, appInfo){
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
	// action params
	this.campaignID = $routeParams.campaignID;
	this.actionID = $routeParams.actionID;
	// models
	this.action = {};
	this.actionCopy = {};
	// copy
	this.makeCopy = function(){
		this.actionCopy = angular.copy(this.action);
		this.actionID = this.action.id;
	}
	// api
	this.getAction= function(){
		if (this.actionID>0){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			$http({
				method: 'GET',
				url: '/api/campaigns/'+this.campaignID+"/actions/"+this.actionID
			}).then(function successCallback(response){
				this.action = response.data;
				this.makeCopy();
				this.unlock();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
				this.unlock();
			}.bind(this));	
		}
	}
	this.getAction();
}]);