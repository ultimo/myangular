function MemberDetailsCtrl($scope, $routeParams, Members) {
    var me = this;
    //fetch all members
    Members.get(function(data){
        me.data = data;

        //find member based on the route id 
        member = data.filter(function(member){
            return member.id == $routeParams.memberId;
        })[0];
        me.member = member;

        //fetch member's friends
        member.friends = me.getFriends(member);

        //fetch member's suggested friends
        member.suggestedFriends = me.getSuggestedFriends(member.friends);
        if ($routeParams.friendId) {
            member.friendsOfFriend = me.getFriendsOfFriend($routeParams.friendId);
        }
        //make member available in frontend
        $scope.member = member;
    });
    console.log($routeParams);
    $scope.getClass = function(id) {
        return $routeParams.friendId == id ? 'selected' : '';
    };
}

MemberDetailsCtrl.prototype = {

    getClass: function(id) {
        console.log(arguments);
        return $routeParams.path == id ? 'selected' : '';
    },

    getFriends: function(member) {
        return this.getMembersById(member.friends);
    },

    getSuggestedFriends: function(memberFriends, data) {
        data = data || this.data;
        var probableFriends = [];

        //get a complete list of ids for friends of friends
        angular.forEach(memberFriends, function(memberFriend){
            angular.forEach(memberFriend.friends, function(probableFriend){
                probableFriends.push(probableFriend);
            });
        });

        //count the occurrance of each friends friend
        var suggestedFriends = array_count_values(probableFriends);

        //remove the member itself from the list
        if (this.member) { delete suggestedFriends[this.member.id]; }

        //remove everyone that is already a friend
        angular.forEach(memberFriends, function(memberFriend){
            delete suggestedFriends[memberFriend.id];
        });

        var toFetch = [];
        angular.forEach(suggestedFriends, function(value, key){
            if (value < 2) {
                //remove all friends of friends with a low occurance 
                delete suggestedFriends[key];
            } else {
                //prepare for fetching members
                toFetch.push(key);
            }
        });

        //fetch the remaining members
        return this.getMembersById(toFetch);
    },

    getFriendsOfFriend: function(friendId, data) {
        data = data || this.data;
        var friend = this.getMembersById(friendId)[0];
        return this.getMembersById(friend.friends);
    },

    getMembersById: function(memberIds, data) {
        if (typeof memberIds !== "object") {
            memberIds = [memberIds];
        }
        data = data || this.data;
        var members = [];

        //fetch member model for each friend
        angular.forEach(memberIds, function(memberId){
            members.push(
                data.filter(function(member){
                    return member.id == memberId;
                })[0]
            );
        });
        return members;
    }

};

function array_count_values (array) {
    // http://kevin.vanzonneveld.net
    var tmp_arr = {},
        key = '',
        t = '';

    var __getType = function (obj) {
        var t = typeof obj;
        t = t.toLowerCase();
        if (t === "object") {
          t = "array";
        }
        return t;
    };

    var __countValue = function (value) {
        switch (typeof(value)) {
            case "number":
                if (Math.floor(value) !== value) {
                    return;
                }
            case "string":
                if (value in this && this.hasOwnProperty(value)) {
                    ++this[value];
                } else {
                    this[value] = 1;
                }
        }
    };

    t = __getType(array);
    if (t === 'array') {
        for (key in array) {
            if (array.hasOwnProperty(key)) {
                __countValue.call(tmp_arr, array[key]);
            }
        }
    }
    return tmp_arr;
}