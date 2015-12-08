angular.module('panelApp').controller('campaignAbsController', ['$routeParams', 'CampaignAds', 'CampaignAd', 'currentPath', 'toast', 'campaignMENU', 'panelCache', function($routeParams, CampaignAds, CampaignAd, currentPath, toast, campaignMENU, panelCache){
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
    // campaign params
    this.id = $routeParams.id;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.id>0?this.id:0);
    // models
    this.adsList = [];
    this.adsPages = [];	// numbers
    this.perPage = 5;
    this.adsCurrentPage = 1;
    this.numberOfAdsItems = 0;
    // nav
    this.adsNavActive = function(page){
        if (page==this.adsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.adsNavNext = function(){
        if (this.adsCurrentPage<this.adsPages.length){
            this.getAds(this.adsCurrentPage+1);
        }
    };
    this.adsNavPrev = function(){
        if (this.adsCurrentPage>1){
            this.getAds(this.adsCurrentPage-1);
        }
    };

    this.updatePath = function () {
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.id) + " / Advertisements");
        this.currentPath.setPage("Advertisements");
    }
    // api
    this.getAds = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }


        CampaignAds.get({campaignID:this.id, page:page}, function(success){
            this.adsList = [];
            this.adsPages = [];
            this.adsList = success.results;
            this.numberOfAdsItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfAdsItems/this.perPage)); i++) {
                this.adsPages.push(i+1);
            }
            this.adsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            this.toast.showError(error);
            this.toast.show
            this.unlock();
        }.bind(this));

    };
    this.deleteAd = function(adID){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        CampaignAd.delete({campaignID:this.id, adID:adID}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.adsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage ){
                this.adsCurrentPage = this.adsCurrentPage - 1;
            }
            this.unlock();
            this.getAds(this.adsCurrentPage);
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this));
    }

    this.getAds(1);
    this.updatePath();
}]);