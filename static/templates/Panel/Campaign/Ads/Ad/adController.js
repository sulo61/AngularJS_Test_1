angular.module('panelApp').controller('adController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// award params
	this.campaignID = $routeParams.campaignID;
	this.campaignNAME = $routeParams.campaignNAME;
	this.adID = $routeParams.adID;
	this.adNAME = $routeParams.adNAME;
	// model
	this.ad = { id:0 };
	this.adCOPY = {};
	
	this.dismiss = function(){
		this.ad = angular.copy(this.adCOPY);
	}
	this.save = function(){
		if (this.adID>0){
			this.patchAd();
		} else {
			this.postAd();
		}
	}
	this.makeCopy = function(){
		this.adCOPY = angular.copy(this.ad);
		this.adID = this.ad.id;
		this.adNAME = this.ad.title;
		appInfo.setCurrentPath("Dashboard/Campaign/"+this.campaignNAME+'/Advertisement/'+this.adNAME);
	}
	// get ad
	this.getAd = function(){
		if (this.adID>0){
			$http({
				method: 'GET',
				url: '/campaigns/'+this.campaignID+"/ads/"+this.adID
			}).then(function successCallback(response){
				this.ad = response.data;
				this.makeCopy();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
			}.bind(this));	
		}
	}
	// patch ad
	this.patchAd = function(){		
		$http({
			method: 'PATCH',
			url: '/campaigns/'+this.campaignID+"/ads/"+this.adID,
			data: this.ad
		}).then(function successCallback(response){
			this.makeCopy();
			appInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
				
	}
	// post ad
	this.postAd = function(){
		$http({
			method: 'POST',
			url: '/campaigns/'+this.campaignID+'/ads/',
			data: this.ad
		}).then(function successCallback(response){
			this.ad = response.data;
			this.makeCopy();			
			appInfo.showSuccess();			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
	}


	this.getAd(this.adID);
}]);