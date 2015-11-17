angular.module('panelApp').controller('adController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', 'CampaignAds', 'CampaignAd', function($scope, $http, $routeParams, Upload, appInfo, CampaignAds, CampaignAd){
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
	}
	// get ad
	this.getAd = function(){
		if (this.adID>0){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			CampaignAd.get({campaignID:this.campaignID, adID:this.adID}, function(success){
				this.ad = success;
				this.makeCopy();
				this.unlock();
			}.bind(this), function(error){
				this.appInfo.showFail(error);
				this.unlock();
			}.bind(this));

		}
	}
	// patch ad
	this.patchAd = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignAd.patch({campaignID:this.campaignID, adID:this.adID}, this.ad, function(){
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));
				
	}
	// post ad
	this.postAd = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignAds.save({campaignID:this.campaignID}, this.ad,  function(success){
			this.ad = success;
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
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