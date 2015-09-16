/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.main')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                views : {
                    'navbarPublick' : {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'formPostAdd' : {
                        templateUrl: 'app/components/post-form/post-form.html',
                        controller: 'FormPostAddCtrl',
                        controllerAs: 'vm'
                    },
                    'allPostsMainPage' : {
                        templateUrl: 'app/components/all-posts/all-posts.html',
                        controller: 'AllPostsMainPageCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/main/main.html',
                        controller: 'MainCtrl',
                        controllerAs: 'vm'
                    }
                }

            }) // main
        ;
    }

})();
