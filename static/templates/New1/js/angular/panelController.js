angular.module('panelApp', ['ui.bootstrap', 'ngRoute', 'ngFileUpload', 'ngResource', 'toaster', 'ngAnimate', 'ngMap'])
    // django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            // DASH
            .when("/profile", {
                templateUrl: "/dash/profile",
                controller: "profileController",
                controllerAs: 'profileCtrl'
            })
            .when("/campaigns", {
                templateUrl: "/dash/campaigns",
                controller: "campaignsController",
                controllerAs: 'campaignsCtrl'
            })
            .when("/shops", {
                templateUrl: "/dash/shops",
                controller: "shopsController",
                controllerAs: 'shopsCtrl'
            })
            // SHOP
            .when("/shops/:id?", {
                templateUrl: "/shop",
                controller: "shopController",
                controllerAs: 'shopCtrl'
            })
            // CAMPAIGN
            .when("/campaigns/:id?/basic/", {
                templateUrl: "/campaign/basic",
                controller: "campaignBasicController",
                controllerAs: 'cBasicCtrl'
            })
            .when("/campaigns/:id?/ads/", {
                templateUrl: "/campaign/ads",
                controller: "campaignAbsController",
                controllerAs: 'cAbsCtrl'
            })
    }])
    .factory('currentPath', function() {
        currentPath = function () {
            this.path = "";
            this.page = "";

            this.setPath = function(path){
                this.path = path;
            }
            this.getPath = function(){
                return this.path;
            }
            this.setPage = function (page) {
                this.page = page;
            }
            this.getPage = function(){
                return this.page;
            }
        }
        return new currentPath();
    })
    .factory('toast', function(toaster){
        toast = function () {
            this.showSuccess = function () {
                toaster.pop({
                    type: 'success',
                    title: 'Success',
                    body: '',
                    showCloseButton: true,
                    timeout: 2000
                });
            }
            this.showError = function(error){
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: error,
                    showCloseButton: true,
                    timeout: 2000
                });
            }
        }
        return new toast();
    })
    .factory('campaign', function(){
        campaign = function () {
            this.id = 0;
            this.setID = function(id){
                this.id = id;
            }
        }
        return new campaign();
    })
    .directive("checkIfActive", function() {
        return {
            link: function(scope, el, attrs) {
                var elementPath;
                elementPath = attrs.href;
                scope.$on('$locationChangeSuccess', function(event, newURL) {
                    if (newURL.search(elementPath) !== -1) {
                        el.parent().addClass("active");
                    } else {
                        el.parent().removeClass("active");
                    }
                })
            }
        };
    })
    .directive("checkIfCampaign", function() {
        return {
            link: function(scope, el, attrs) {
                var elementPath;
                elementPath = attrs.href;

                scope.$on('$locationChangeSuccess', function(event, newURL) {
                    if (newURL.search("campaigns") !== -1 && (newURL.search("basic") !== -1) || newURL.search("ads") !== -1 || newURL.search("actions") !== -1 || newURL.search("awards") !== -1 || newURL.search("beacons") !== -1 || newURL.search("promos") !== -1) {
                        el.parent().removeClass("collapse");
                    } else {
                        el.parent().addClass("collapse");
                    }

                    el.parent().removeClass("active");

                    if ( (newURL.search("basic") !== -1) && elementPath.search("basic") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("ads") !== -1) && elementPath.search("ads") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("actions") !== -1) && elementPath.search("actions") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("awards") !== -1) && elementPath.search("awards") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("beacons") !== -1) && elementPath.search("beacons") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("promos") !== -1) && elementPath.search("promos") !== -1){
                        el.parent().addClass("active");
                    }

                })
            }
        };
    })
    .controller("panelController", function($window, currentPath, Logout, User, toast, campaign){
        this.currentPath = currentPath;
        this.toast = toast;
        this.campaign = campaign;

        this.user = {
            first_name: "",
            last_name: "",
            email: ""
        };

        this.logout = function () {
            if (this.lock){
                return;
            } else {
                this.lock = true;
            }
            Logout.post(function(){
                    this.lock = false;
                    $window.location.href = "/";
                }, function(error) {
                    this.lock = false;
                    appInfo.showFail(error);
                }
            )};

        this.getFullName = function(){
            return this.user.first_name + " " + this.user.last_name;
        }

        User.get(function(user) {
            this.user = user;
        }.bind(this), function(error){
            this.toast.showError(error)
        });
    })
