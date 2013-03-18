angular.module('services', [])
.factory('Members', ['$http', function($http){
    return {
        get: function(callback){
            $http.get('/js/model/members.js').success(function(data) {
                callback(data);
            });
        }
    };
}]);