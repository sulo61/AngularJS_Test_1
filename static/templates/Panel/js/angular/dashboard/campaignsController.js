angular.module('panelApp').controller('campaignsController', ['currentPath', 'Campaigns', 'Campaign', 'toast', 'dateUtils', function(currentPath, Campaigns, Campaign, toast, dateUtils){
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
    this.dateUtils = dateUtils;
    // models
    this.campaignsList = [];
    this.campaignsPages = [];
    this.campaignsPerPage = 5;
    this.campaignsCurrentPage = 1;
    this.numberOfCampaigns = 0;

    // pagination nav
    this.campaignsNavActive = function(page){
        if (page==this.campaignsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.campaignsNavNext = function(){
        if (this.campaignsCurrentPage<this.campaignsPages.length){
            this.getCampaigns(this.campaignsCurrentPage+1);
        }
    };
    this.campaignsNavPrev = function(){
        if (this.campaignsCurrentPage>1){
            this.getCampaigns(this.campaignsCurrentPage-1);
        }
    };
    // api
    this.getCampaigns = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Campaigns.get({page:page}, function(success){
            this.campaignsList = [];
            this.campaignsPages = [];
            this.campaignsList = success.results;
            this.numberOfCampaigns = success.count;
            for (var i=0; i<Math.ceil((this.numberOfCampaigns/this.campaignsPerPage)); i++) {
                this.campaignsPages.push(i+1);
            }
            this.campaignsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            this.toast.showApiError(error)
            this.unlock();
        }.bind(this));

    };
    this.deleteCampaign = function(id){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Campaign.delete({campaignID:id}, function(){
            this.numberOfCampaigns = this.numberOfCampaigns - 1;
            if ( (this.numberOfCampaigns <= (this.campaignsCurrentPage-1) * this.campaignsPerPage) && this.numberOfCampaigns>=this.campaignsPerPage ){
                this.campaignsCurrentPage = this.campaignsCurrentPage - 1;
            }
            this.unlock();
            this.getCampaigns(this.campaignsCurrentPage);
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));

    }

    this.getCampaigns(1);
    this.currentPath.setPath("Campaigns");
    this.currentPath.setPage("Campaigns");
}]);