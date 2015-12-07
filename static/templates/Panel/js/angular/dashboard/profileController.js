angular.module('panelApp').controller('profileController', ['currentPath', 'User', 'toast', function(currentPath, User, toast){
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
        User.get(function(user) {
            this.user = angular.copy(user);
            this.userBackup = angular.copy(user);
            this.unlock();
        }.bind(this), function(error){
            this.toast.showError(error.status);
            this.unlock();
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
            debugger
            this.user.password = "";
            this.user.old_password = "";
            this.userBackup = angular.copy(this.user);
            this.unlock();
            this.toast.showSuccess();
        }.bind(this), function(error){
            debugger
            this.user = angular.copy(this.userBackup);
            this.unlock();
            this.toast.showError(error.status);
        }.bind(this));

    };

    this.restoreBackup = function () {
        this.user = angular.copy(this.userBackup);
    }

    this.getUser();
    this.currentPath.setPath("Profile");
    this.currentPath.setPage("Profile");

}]);