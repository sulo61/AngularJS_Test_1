angular.module('panelApp').controller('campaignAwardsController', ['$routeParams', 'CampaignAwards', 'CampaignAward', 'currentPath', 'toast', 'campaignMENU', 'panelCache', function($routeParams, CampaignAwards, CampaignAward, currentPath, toast, campaignMENU, panelCache){
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
    this.awardsList = [];
    this.awardsPages = [];	// numbers
    this.awardsCurrentPage = 1;
    this.numberOfItems = 0;
    this.perPage = 5;
    // nav
    this.awardsNavActive = function(page){
        if (page==this.awardsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.awardsNavNext = function(){
        if (this.awardsCurrentPage<this.awardsPages.length){
            this.getAwards(this.awardsCurrentPage+1);
        }
    };
    this.awardsNavPrev = function(){
        if (this.awardsCurrentPage>1){
            this.getAwards(this.awardsCurrentPage-1);
        }
    };

    this.updatePath = function () {
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.id) + " / Awards");
        this.currentPath.setPage("Awards");
    }
    // api
    this.getAwards = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }


        CampaignAwards.get({campaignID:this.id, page:page}, function(success){
            this.awardsList = [];
            this.awardsPages = [];
            this.awardsList = success.results;
            this.numberOfItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfItems/this.perPage)); i++) {
                this.awardsPages.push(i+1);
            }
            this.awardsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            appInfo.showFail(error);
            this.unlock();
        }.bind(this));

    };
    this.deleteAward = function(awardID){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        CampaignAward.delete({campaignID:this.id, awardID:awardID}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.awardsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage ){
                this.awardsCurrentPage = this.awardsCurrentPage - 1;
            }
            this.unlock();
            this.getAwards(this.awardsCurrentPage);
        }.bind(this), function(error){
            this.unlock();
        }.bind(this));
    }

    this.getAwards(1);
    this.updatePath();

}]);