angular.module('panelApp').controller('campaignActionsController', ['$routeParams', 'CampaignActions', 'CampaignAction', 'currentPath', 'toast', 'campaignMENU', function($routeParams, CampaignActions, CampaignAction, currentPath, toast, campaignMENU){
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
    // campaign params
    this.id = $routeParams.id;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.id>0?this.id:0);
    // models
    this.actionsList = [];
    this.actionsPages = [];	// numbers
    this.actionsCurrentPage = 1;
    this.numberOfItems = 0;
    this.perPage = 5;
    // nav
    this.actionsNavActive = function(page){
        if (page==this.actionsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.actionsNavNext = function(){
        if (this.actionsCurrentPage<this.actionsPages.length){
            this.getActions(this.actionsCurrentPage+1);
        }
    };
    this.actionsNavPrev = function(){
        if (this.actionsCurrentPage>1){
            this.getActions(this.actionsCurrentPage-1);
        }
    };
    // api
    this.getActions = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }


        CampaignActions.get({campaignID:this.id, page:page}, function(success){
            this.actionsList = [];
            this.actionsPages = [];
            this.actionsList = success.results;
            this.numberOfItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfItems/this.perPage)); i++) {
                this.actionsPages.push(i+1);
            }
            this.actionsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            appInfo.showFail(error);
            this.unlock();
        }.bind(this));

    };
    this.deleteAction = function(actionID){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        CampaignAction.delete({campaignID:this.id, actionID:actionID}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.actionsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage ){
                this.actionsCurrentPage = this.actionsCurrentPage - 1;
            }
            this.unlock();
            this.getActions(this.actionsCurrentPage);
        }.bind(this), function(error){
            this.unlock();
        }.bind(this));
    }

    this.getActions(1);

}]);