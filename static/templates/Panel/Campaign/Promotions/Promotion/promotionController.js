angular.module('panelApp').controller('promotionController', ['$scope', '$http', '$routeParams', 'Upload', 'appInfo', 'CampaignPromotions', 'CampaignPromotion', function($scope, $http, $routeParams, Upload, appInfo, CampaignPromotions, CampaignPromotion){
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
	this.promotionID = $routeParams.promotionID;
	this.promotionNAME = $routeParams.promotionNAME;
	// model
	this.promotion = { id:0 };
	this.promotionCOPY = {};
	
	this.dismiss = function(){
		this.promotion = angular.copy(this.promotionCOPY);
	}
	this.save = function(){
		if (this.promotionID>0){
			this.patchPromotion();
		} else {
			this.postPromotion();
		}
	}
	this.makeCopy = function(){
		this.promotionCOPY = angular.copy(this.promotion);
		this.promotionID = this.promotion.id;
		this.promotionNAME = this.promotion.title;
	}
	// get promotion
	this.getPromotion = function(){
		if (this.promotionID>0){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			CampaignPromotion.get({campaignID:this.campaignID, promotionID:this.promotionID}, function(success){
				this.promotion = success;
				this.makeCopy();
				this.unlock();
			}.bind(this), function(error){
				this.appInfo.showFail(error);
				this.unlock();
			}.bind(this));

		}
	}
	// patch promotion
	this.patchPromotion = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignPromotion.patch({campaignID:this.campaignID, promotionID:this.promotionID}, this.promotion, function(){
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));
				
	}
	// post promotion
	this.postPromotion = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		CampaignPromotions.save({campaignID:this.campaignID}, this.promotion,  function(success){
			this.promotion = success;
			this.makeCopy();
			this.appInfo.showSuccess();
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this));
	}
	// uplopromotion photo	
	this.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		$scope.errFile = errFiles && errFiles[0];
		if (file) {
			file.upload = Upload.upload({
				url: '/api/campaigns/'+this.campaignID+"/promotions/"+this.promotionID+"/image/",
				data: {image: file}
			});
			file.upload.then(function (response) {
				this.promotion.image = angular.copy(response.data.image);
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


	this.getPromotion(this.promotionID);
}]);