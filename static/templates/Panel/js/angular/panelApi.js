angular.module('panelApp')
    .factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username + ':' + data.password));
        }
    })

    .factory('User', ['$resource',
        function($resource){
            return $resource('../api/user/:userID', {userID: '@id'}, {
                patch: {method:'PATCH'}
            });
        }])
    .factory('Logout', ['$resource',
        function($resource){
            return $resource('../logout/', {}, {
                post: {method:'POST'}
            });
        }])
    .factory('Shops', ['$resource',
        function($resource){
            return $resource('../api/shops/');
        }])
    .factory('Shop', ['$resource',
        function($resource){
            return $resource('../api/shops/:shopID/', {shopID: '@id'}, {
                patch: {method:'PATCH'}
            });
        }])
    .factory('Campaigns', ['$resource',
        function($resource){
            return $resource('../api/campaigns/');
        }])
    .factory('Campaign', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID', {campaignID: '@id'}, {
                patch: {method:'PATCH'}
            });
        }])
    .factory('Beacons', ['$resource',
        function($resource){
            return $resource('../api/beacons');
        }])
    .factory('Beacon', ['$resource',
        function($resource){
            return $resource('../api/beacons/:beaconID', {beaconID: '@id'});
        }])
    .factory('GoogleCoords', ['$resource',
        function($resource){
            return $resource('http://maps.google.com/maps/api/geocode/json');
        }])
    .factory('CampaignBeacons', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/beacons/', {campaignID:'@campaignID'});
        }])
    .factory('CampaignBeacon', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/beacons/:beaconID', {campaignID:'@campaignID', beaconID:'@beaconID'});
        }])
    .factory('CampaignBeaconsGenerate', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/create_beacons/', {campaignID:'@campaignID'}, {
                save: {method:'POST', isArray:true}
            });
        }])
    .factory('CampaignAwards', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/awards/', {campaignID:'@campaignID'});
        }])
    .factory('CampaignAward', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/awards/:awardID', {campaignID:'@campaignID', awardID:'@awardID'}, {
                patch: {method:'PATCH'}
            });
        }])
    .factory('CampaignAds', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/ads/', {campaignID:'@campaignID'});
        }])
    .factory('CampaignAd', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/ads/:adID', {campaignID:'@campaignID', adID:'@adID'}, {
                patch: {method:'PATCH'}
            });
        }])
    .factory('CampaignActions', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/actions/', {campaignID:'@campaignID'});
        }])
    .factory('CampaignAction', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/actions/:actionID', {campaignID:'@campaignID', actionID:'@actionID'}, {
                patch: {method:'PATCH'}
            });
        }])
    .factory('CampaignPromotions', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/promotions/', {campaignID:'@campaignID'});
        }])
    .factory('CampaignPromotion', ['$resource',
        function($resource){
            return $resource('../api/campaigns/:campaignID/promotions/:itemID', {campaignID:'@campaignID', itemID:'@itemID'}, {
                patch: {method:'PATCH'}
            });
        }])