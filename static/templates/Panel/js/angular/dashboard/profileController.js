angular.module('panelApp').controller('profileController', ['currentPath', 'User', 'toast', 'pageLoader', function(currentPath, User, toast, pageLoader){
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
    // model user
    this.user = {};
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.password = ""
    this.id = -1;
    this.userBackup = {}



    // api
    // get user
    this.getUser = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        pageLoader.showLoader();

        User.get(function(user) {
            this.user = angular.copy(user);
            this.userBackup = angular.copy(user);
            this.unlock();
            pageLoader.hideLoader()
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
            pageLoader.hideLoader()
        });
    };

    // update user
    this.pathUser = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        User.patch({userID:this.user.id}, this.user, function(){
            this.user.password = "";
            this.user.old_password = "";
            this.userBackup = angular.copy(this.user);
            this.unlock();
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.user = angular.copy(this.userBackup);
            this.unlock();
            this.toast.showApiError(error);
        }.bind(this));

    };

    this.restoreBackup = function () {
        this.user = angular.copy(this.userBackup);
    }

    this.getUser();
    this.currentPath.setPath("Profile");
    this.currentPath.setPage("Profile");

}]);