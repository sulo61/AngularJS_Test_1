angular.module('panelApp').controller('awardController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', function($scope, $http, $routeParams, Upload, appInfo){
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
		appInfo.setCurrentPath("Dashboard/Campaign/"+this.campaignNAME+'/Award/'+this.awardNAME);
	}
	// get award
	this.getAward = function(){		
		if (this.awardID>0){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			$http({
				method: 'GET',
				url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID
			}).then(function successCallback(response){
				this.award = response.data;
				this.makeCopy();
				this.unlock();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
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
		$http({
			method: 'PATCH',
			url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID,
			data: this.award
		}).then(function successCallback(response){
			this.makeCopy();
			appInfo.showSuccess();
			this.unlock();		
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
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
		$http({
			method: 'POST',
			url: '/api/campaigns/'+this.campaignID+'/awards/',
			data: this.award
		}).then(function successCallback(response){
			this.award = response.data;
			this.makeCopy();
			appInfo.showSuccess();
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		}.bind(this));			
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