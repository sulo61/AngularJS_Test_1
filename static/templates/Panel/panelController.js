angular.module('panelApp', ['ngRoute'])
	// django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['$routeProvider', function($routeProvider){
    	$routeProvider.when("/dashboard",
    		{
    			templateUrl: "Dashboard/dashboard.html",
			    controller: "dashboardController",
			    controllerAs: "dc"
    		});
    }])
    .factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username + ':' + data.password));
        }
    })
    .factory('apiInfo', function() {
    	ApiInfo = function () {
	    	this.apiSuccess = false;
	    	this.apiFail = false;
	    	this.apiFailMsg = "";

	    	this.showSuccess = function(){
	    		this.apiSuccess = true;
		    	this.apiFail = false;
		    	this.apiFailMsg = "";
	    	};
	    	this.showFail = function(msg){
	    		this.apiSuccess = false;
		    	this.apiFail = true;
		    	this.apiFailMsg = msg;	
	    	};
	    	this.hideApiMsg = function(){
	    		this.apiSuccess = false;
		    	this.apiFail = false;
		    	this.apiFailMsg = "";
	    	};
    	}
    	return new ApiInfo();
    })
    .controller('panelController', function($scope, $location) {
    	
    });
