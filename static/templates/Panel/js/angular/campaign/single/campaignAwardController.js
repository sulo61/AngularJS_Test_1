angular.module('panelApp').controller('campaignAwardController', ['$routeParams', 'CampaignAwards', 'CampaignAward', 'currentPath', 'toast', 'campaignMENU', 'panelCache', 'Upload', 'awardsUtils', 'dataImageUtils', function($routeParams, CampaignAwards, CampaignAward, currentPath, toast, campaignMENU, panelCache, Upload, awardsUtils, dataImageUtils){
    // lock
    this.isLock = false;
    this.lock = function(){
        this.isLock = true;
    }
    this.unlock = function(){
        this.isLock = false;
    }
    // api info
    this.currentPath = currentPath;
    this.toast = toast;
    this.cache = panelCache;
    this.awardsUtils = awardsUtils;
    this.photoUtils = dataImageUtils;
    // award params
    this.campaignID = $routeParams.campaignID;
    this.campaignNAME = $routeParams.campaignNAME;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.campaignID>0?this.campaignID:0);
    this.awardID = $routeParams.awardID;
    this.awardNAME = $routeParams.awardNAME;
    // model
    this.award = { id:0 };
    this.awardCOPY = {};
    this.currentTypeName = this.awardsUtils.getTypeNameFromNumber(-1);
    // cropper
    this.myCroppedImage='';

    this.dismiss = function(){
        this.award = angular.copy(this.awardCOPY);
    }
    this.save = function(){
        this.award.type = this.awardsUtils.getTypeNumberFromName(this.currentTypeName);
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

    this.updatePath = function () {
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Awards / " + this.award.title);
        this.currentPath.setPage(this.award.title);
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
                this.currentTypeName = this.awardsUtils.getTypeNameFromNumber(this.award.type);
                this.makeCopy();
                this.unlock();
                this.updatePath();
            }.bind(this), function(error){
                this.toast.showError(error);
                this.unlock();
            }.bind(this));

        }  else {
            this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Advertisements / " + "New award");
            this.currentPath.setPage("New award");
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
            this.toast.showSuccess();
            this.unlock();
            this.updatePath();
        }.bind(this), function(error){
            this.toast.showApiError(error);
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
            this.toast.showSuccess();
            this.unlock();
            this.updatePath();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));
    }
    // upload photo
    this.uploadFiles = function(file) {
        this.f = file;
        if (this.f) {
            this.f.upload = Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID+"/image/",
                data: {image: this.f}
            });
            this.f.upload.then(function (response) {
                this.toast.showSuccess();
                this.award.image = "";
                this.award.image = angular.copy(response.data.image);
            }.bind(this), function (response) {
                if (response.status > 0)
                    this.toast.showApiError(response);
            }.bind(this), function (evt) {
            });
        }
    }

    this.saveFile = function () {
        this.f = this.photoUtils.convertDataToFile(this.myCroppedImage, "image");
        if (this.f) {
            Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/awards/"+this.awardID+"/image/",
                data: {image: this.f}
            }).then(function (response){
                this.toast.showSuccess();
                this.award.image = "";
                this.award.image = angular.copy(response.data.image);
            }.bind(this), function(response){
                if (response.status > 0)
                    this.toast.showApiError(response);
            })
        }
    }


    this.getAward(this.awardID);

}]);