// author: taksenov@gmail.com

// initialize material design js
;$.material.init();

(function(){
    'use strict';

    $.material.init();

    // модуль и конфигурирование
    angular
        .module('ngNoReddit', [
            'firebase',
            'ngNoReddit.main',
            //'ngNoReddit.profile',
            'ngNoReddit.error404',
            'ngNoReddit.firebase.service',
            'ngNoReddit.auth-modal',
            'ngNoReddit.edit-modal',
            'authfire.factory',
            'ui.router',
            'ui.bootstrap',
            'angular-storage',
            'toastr'
        ])
        .constant('FIREBASE_URL', 'https://ngnoreddit2.firebaseio.com/')
        .config(ngGFConfig)
        .run(run);

    ngGFConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider'];

    function ngGFConfig($stateProvider, $urlRouterProvider, $locationProvider, $logProvider){
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $logProvider.debugEnabled( true );

        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(['$state', function ($state) { $state.go('error'); }]);
            return true;
        }); // ~~~ $urlRouterProvider ~~~

        $urlRouterProvider
            .when('', '/')
        ; // ~~~ $urlRouterProvider ~~~

    } // ~~~ ngGFConfig ~~~

    run.$inject = ['$rootScope', '$state', 'store'];

    function run($rootScope, $state, store) {
        $rootScope.currentUser  = store.get('currentUser');
    } // ~~~ run ~~~


})();

