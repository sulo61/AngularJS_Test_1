angular.module('panelApp', ['ui.bootstrap', 'ngRoute'])
	// django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['$routeProvider', function($routeProvider){
    	// $routeProvider.when("/",
    	// 	{
    	// 		templateUrl: "/dashboard/",
			  //   controller: "dashboardController",
			  //   controllerAs: 'dc'
    	// 	});
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
    }).controller("panelController", function($scope, $window){
    	this.tabs = [
		    { title:'Dynamic Title 1', content:'Dynamic content 1' },
		    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
	  	];

		this.alertMe = function() {
		    setTimeout(function() {
		      $window.alert('You\'ve selected the alert tab!');
		    });
		};

		alert("alertuje");

		
    })
