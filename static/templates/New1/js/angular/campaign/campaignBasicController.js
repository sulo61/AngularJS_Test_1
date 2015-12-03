angular.module('panelApp').controller('campaignBasicController', ['$routeParams', 'Campaign', 'Campaigns', 'currentPath', 'toast', 'campaign', function($routeParams, Campaign, Campaigns, currentPath, toast, campaign){
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
    this.campaign = campaign;
    this.campaign.setID(this.id>0?this.id:0);
    // model
    this.basic = {id:"", name:"", start_date:"", end_date:"", is_active:false};
    this.basicCopy = {};
    // save
    this.save = function(){
        debugger
        this.saveBasic();
    }
    // dismiss
    this.dismiss = function(){
        this.basic = angular.copy(this.basicCopy);
    }
    // copy
    this.makeCopy = function(response){
        this.basicCopy = angular.copy(this.basic);
        this.id = this.basic.id;
        this.name = this.basic.name;
    }
    this.updatePath = function () {
        this.currentPath.setPath("Campaign / "+this.basic.name);
        this.currentPath.setPage(this.basic.name);
    }
    // api
    this.getBasic = function(){
        if (this.id>0){
            if (this.isLock){
                return;
            } else {
                this.lock();
            }
            Campaign.get({campaignID:this.id}, function(success){
                this.basic = success;
                this.basic.beacons = [];
                this.basicCopy = angular.copy(this.basic);
                this.unlock();
                this.updatePath();
            }.bind(this), function(error){
                this.toast.showError(error);
                this.unlock();
            }.bind(this));
        } else {
            this.currentPath.setPath("Campaign / New campaign");
            this.currentPath.setPage("New campaign");
        }
    }
    this.patchBasic = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        Campaign.patch({campaignID:this.id}, this.basic, function(){
            this.makeCopy();
            this.unlock();
            this.updatePath();
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this));
    }

    this.postBasic = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Campaigns.save(this.basic, function(success){
            this.basic = success;
            this.makeCopy();
            this.unlock();
            this.updatePath();
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this))

    }

    this.saveBasic = function(){
        if (this.id>0){
            this.patchBasic();
        } else {
            this.postBasic();
        }
    }
    this.getBasic();


}]);