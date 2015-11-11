/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.profile')
        .controller('ProfileCtrl', profileCtrl)
        .controller('ProfileAccountCtrl', profileAccountCtrl)
        .controller('ProfilePasswordCtrl', profilePasswordCtrl)
        .controller('ProfileAchivmentsCtrl', profileAchivmentsCtrl)
        .controller('ProfileDesignCtrl', profileDesignCtrl);


    profileCtrl.$inject = [ '$scope', '$rootScope',
                            'AuthfireFactory' ];
    profileAccountCtrl.$inject = [ '$scope', '$rootScope',
                                   'ngfitfire', 'AuthfireFactory' ];
    profilePasswordCtrl.$inject = ['$scope', '$rootScope'];
    profileAchivmentsCtrl.$inject = ['$scope', '$rootScope'];
    profileDesignCtrl.$inject = ['$scope', '$rootScope'];

    function profileCtrl( $scope, $rootScope,
                          AuthfireFactory ) {

        var vm = this;

        $rootScope.curPath = 'profile';
        $rootScope.publicPart = false;
        $rootScope.publicPartWorkout = false;

        vm.logout = function (  ) {
            console.log( 'Пользователь должен выйти из системы.' );
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

    } // ~~~ profileCtrl ~~~

    function profileAccountCtrl( $scope, $rootScope,
                                 ngfitfire, AuthfireFactory ) {

        var vm = this;
        vm.userProfileObj = $rootScope.currentUser;

        console.log( '$rootScope.currentUser', $rootScope.currentUser );

        vm.accountProfileEdit = function () {
            for (var i in vm.userProfileObj) {
                if ( typeof( vm.userProfileObj[i] ) === 'undefined'  ) {
                    vm.userProfileObj[i] = '';
                }
            }
//            console.log( '$rootScope.currentUser', vm.userProfileObj );
            ngfitfire.accountProfileEdit( vm.userProfileObj.id, vm.userProfileObj );
        }; // ~~~ vm.accountProfileEdit ~~~


    } // ~~~ profileAccountCtrl ~~~

    function profilePasswordCtrl($scope, $rootScope) {

    } // ~~~ profilePasswordCtrl ~~~
    function profileAchivmentsCtrl($scope, $rootScope) {

    } // ~~~ profileAchivmentsCtrl ~~~
    function profileDesignCtrl($scope, $rootScope) {

    } // ~~~ profileDesignCtrl ~~~

})();
