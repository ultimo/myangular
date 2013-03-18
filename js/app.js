angular.module('membersApp', ['services']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/members/:memberId', {templateUrl: 'view/member-details.html', controller: MemberDetailsCtrl}).
      when('/members/:memberId/friends/:friendId', {templateUrl: 'view/member-details.html', controller: MemberDetailsCtrl}).
      otherwise({redirectTo: '/members'});
}]);