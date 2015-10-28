angular.module('panelApp').controller('shopController', ['$scope', '$http', '$routeParams', 'apiInfo', function($scope, $http, $routeParams, apiInfo){
	// api info
	this.apiInfo = apiInfo;
	// shop id
	this.id = $routeParams.id;
	// model
	this.shop = {};
	// get shop
	this.getShop = function(id){
		$http({
			method: 'GET',
			url: '/shops/'+id+"/"
		}).then(function successCallback(response){
			this.shop = response.data;
		}.bind(this), function errorCallback(response){
			apiInfo.showFail(response);
		}.bind(this));	
	}

	this.getShop(this.id);
	
}]);