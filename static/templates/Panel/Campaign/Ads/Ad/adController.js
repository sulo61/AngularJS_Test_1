angular.module('panelApp').controller('adController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', function($scope, $http, $routeParams, Upload, appInfo){
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
				url: '/api/campaigns/'+this.campaignID+"/ads/"+this.adID
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
			url: '/api/campaigns/'+this.campaignID+"/ads/"+this.adID,
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
			url: '/api/campaigns/'+this.campaignID+'/ads/',
			data: this.ad
		}).then(function successCallback(response){
			this.ad = response.data;
			this.makeCopy();			
			appInfo.showSuccess();			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
	}
	// upload photo	
	this.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/ads/"+this.adID+"/image",
                data: {image: file}
            });
            file.upload.then(function (response) {
            	this.ad.image = angular.copy(response.data.image);
            	appInfo.showSuccess();
                // $timeout(function () {                	
                //     appInfo.showFail(response.data);
                // });
            }.bind(this), function (response) {
            	if (response.status > 0)
                	appInfo.showFail(response.status + ': ' + response.data);
            }, function (evt) {                
            });
        }   
    }


	this.getAd(this.adID);
}]);