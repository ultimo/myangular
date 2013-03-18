function MembersListCtrl($scope, $routeParams, Members) {
	Members.get(function(data) {
		$scope.members = data;
        $scope.getClass = function(id) {
            return $routeParams.memberId == id ? 'selected' : '';
        };
    });
}