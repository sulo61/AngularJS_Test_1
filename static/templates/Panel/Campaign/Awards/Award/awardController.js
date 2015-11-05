angular.module('panelApp').controller('awardController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// award params
	this.campaignID = $routeParams.campaignID;
	this.campaignNAME = $routeParams.campaignNAME;
	this.awardID = $routeParams.awardID;
	this.awardNAME = $routeParams.awardNAME;
	// model
	this.award = { id:0 };
	this.awardCOPY = {};
	
	this.dismiss = function(){
		this.award = angular.copy(this.awardCOPY);
	}
	this.save = function(){
		if (this.awardID>0){
			this.patchAward();
		} else {
			this.postAward();
		}
	}
	this.makeCopy = function(){
		this.awardCOPY = angular.copy(this.award);
		this.awardID = this.award.id;
		this.awardNAME = this.award.title;	
		appInfo.setCurrentPath("Dashboard/Campaign/"+this.campaignNAME+'/Award/'+this.awardNAME);
	}
	// get award
	this.getAward = function(){
		if (this.awardID>0){
			$http({
				method: 'GET',
				url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID
			}).then(function successCallback(response){
				this.award = response.data;
				this.makeCopy();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
			}.bind(this));	
		}
	}
	// patch award
	this.patchAward = function(){		
		$http({
			method: 'PATCH',
			url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID,
			data: this.award
		}).then(function successCallback(response){
			this.makeCopy();
			appInfo.showSuccess();		
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
				
	}
	// post award
	this.postAward = function(){
		$http({
			method: 'POST',
			url: '/api/campaigns/'+this.campaignID+'/awards/',
			data: this.award
		}).then(function successCallback(response){
			this.award = response.data;
			this.makeCopy();
			appInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
	}
	


	this.getAward(this.awardID);
}]);