/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.profile')
        .config(route);

    route.$inject = [ '$stateProvider', '$urlRouterProvider' ];

    function route( $stateProvider, $urlRouterProvider ) {

        $urlRouterProvider
            .when('/profile', '/profile/account')             //редирект в профиль --> учетная запись
        ; // ~~~ $urlRouterProvider ~~~

        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/private/profile/profile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }





            }) // profile
            // nested states ~~~ Идея дернута вот отсюда https://scotch.io/tutorials/single-page-apps-with-angularjs-routing-and-templating
            // пункты меню в профиле
            .state('profile.account', {
                url: '/account',
                templateUrl: 'app/private/profile/profile.account.html',
                controller: 'ProfileAccountCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }

            }) // учетная запись
            .state('profile.password', {
                url: '/password',
                templateUrl: 'app/private/profile/profile.password.html',
                controller: 'ProfilePasswordCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }

            }) // пароль
            .state('profile.achivments', {
                url: '/achivments',
                templateUrl: 'app/private/profile/profile.achivments.html',
                controller: 'ProfileAchivmentsCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }

            }) // достижения
            .state('profile.design', {
                url: '/design',
                templateUrl: 'app/private/profile/profile.design.html',
                controller: 'ProfileDesignCtrl',
                controllerAs: 'vm'

                ,
                resolve: {
                    'currentAuth' : function ( AuthfireFactory, $rootScope ) {
                        $rootScope.publicPart = false;
                        return AuthfireFactory.ngAuth().$requireAuth();
                    }
                }

            }) // дизайн


        ; // ~~~ $stateProvider ~~~
    }

})();


