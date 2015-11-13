angular.module('panelApp').controller('awardController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', 'CampaignAwards', 'CampaignAward', function($scope, $http, $routeParams, Upload, appInfo, CampaignAwards, CampaignAward){
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
	}
	// get award
	this.getAward = function(){		
		if (this.awardID>0){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			CampaignAward.get({campaignID:this.campaignID, awardID:this.awardID}, function(success){
				this.award = success;
				this.makeCopy();
				this.unlock();
			}.bind(this), function(error){
				this.appInfo.showFail(error);
				this.unlock();
			}.bind(this));

		}
	}
	// patch award
	this.patchAward = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignAward.patch({campaignID:this.campaignID, awardID:this.awardID}, this.award, function(){
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	}
	// post award
	this.postAward = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignAwards.save({campaignID:this.campaignID}, this.award,  function(success){
			this.award = success;
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this))
	}
	// upload photo	
	this.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID+"/image/",
                data: {image: file}
            });
            file.upload.then(function (response) {
            	this.award.image = angular.copy(response.data.image);
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


	this.getAward(this.awardID);
}]);