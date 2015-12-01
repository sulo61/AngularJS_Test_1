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
    }])
    .factory('currentPath', function() {
        currentPath = function () {
            this.path = "Current path";
            this.page = "Current page";

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
    .controller("panelController", function($window, currentPath, Logout, User, toast){
        this.currentPath = currentPath;
        this.toast = toast;

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
