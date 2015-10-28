angular.module('panelApp').controller('shopController', ['$scope', '$http', '$routeParams', 'apiInfo', function($scope, $http, $routeParams, apiInfo){
	// api info
	this.apiInfo = apiInfo;
	this.id = $routeParams.id;
	
}]);