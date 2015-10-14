// author: taksenov@gmail.com

// initialize material design js
;$.material.init();

(function(){
    'use strict';

    $.material.init();

    // модуль и конфигурирование
    angular
        .module('ngWestSibStudio', [

            'ngWestSibStudio.main',

            //'ngWestSibStudio.error404',
            //'ngWestSibStudio.firebase.service',
            'ngWestSibStudio.modal-windows',
            //'ngWestSibStudio.edit-modal',
            'ui.router',
            'ui.bootstrap',
            'angular-storage'
        ])
        .constant('BRANDS_URL', '/ajax/brands/')
        .config(ngGFConfig)
        .run(run);

    ngGFConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider'];

    function ngGFConfig($stateProvider, $urlRouterProvider, $locationProvider, $logProvider){
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $logProvider.debugEnabled( true );

        //$urlRouterProvider.otherwise(function ($injector, $location) {
        //    $injector.invoke(['$state', function ($state) { $state.go('error'); }]);
        //    return true;
        //}); // ~~~ $urlRouterProvider ~~~

        $urlRouterProvider
            .when('', '/')
        ; // ~~~ $urlRouterProvider ~~~

    } // ~~~ ngGFConfig ~~~

    run.$inject = ['$rootScope', '$state', 'store'];

    function run($rootScope, $state, store) {
        $rootScope.currentUser  = store.get('currentUser');
    } // ~~~ run ~~~


})();

