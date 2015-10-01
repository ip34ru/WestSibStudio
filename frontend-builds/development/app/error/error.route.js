/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.error404')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('error', {
                views : {
                    'navbarPublick' : {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/error/error.html',
                        controller: 'Error404Ctrl',
                        controllerAs: 'vm'
                    }
                }
            }) // 404 error
        ;
    }

})();

