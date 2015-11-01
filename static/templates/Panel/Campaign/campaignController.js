angular.module('panelApp').controller('campaignController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// shop id
	this.id = $routeParams.id;
	// visibility
	this.pageVisibility = [true, false, false, false];
	this.showPage = function(which){
		this.pageVisibility = [false, false, false, false];
		this.pageVisibility[which] = true;
	}
	
}]);