/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.error404')
        .controller('Error404Ctrl', error404Ctrl);

    error404Ctrl.$inject = ['$scope', '$rootScope'];

    function error404Ctrl($scope, $rootScope) {
        $rootScope.curPath = 'error';
        $rootScope.publicPart = true;
        $rootScope.publicPartWorkout = false;
    } // ~~~ error404Ctrl ~~~

})();


