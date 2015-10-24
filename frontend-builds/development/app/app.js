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
        .constant('CART_MAX_ITEMS', 99)
        .constant('ARRAY_OF_LIST_OPTIONS_FOR_CART', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99] )
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

    run.$inject = [
                    '$rootScope',
                    '$state',
                    'store',
                    'CART_MAX_ITEMS'
    ];

    function run(
                    $rootScope,
                    $state,
                    store,
                    CART_MAX_ITEMS
    ) {

        //$rootScope.arrayOfListOptionsForCart = [];
        //
        //for (var i = 1; i <= CART_MAX_ITEMS; i++ ) {
        //    $rootScope.arrayOfListOptionsForCart.push(i);
        //}

    } // ~~~ run ~~~


})();

