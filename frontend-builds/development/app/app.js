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
            'ngWestSibStudio.news',
            'ngCookies',
            'ngAnimate',
            'ngWestSibStudio.error404',
            'ngWestSibStudio.modal-windows',
            'ui.router',
            'ui.bootstrap',
            'angular-storage'
        ])
        .constant('BRANDS_URL', '/ajax/brands/')
        .constant('NEWS_URL', '/ajax/news/')
        .constant('NOW_YEAR_URL', '/ajax/nowyear/')
        .constant('CART_POST_URL', '/ajax/cart/')
        .constant('CART_MAX_ITEMS', 9)
        .constant('CART_MAX_PRICE', 8500)
        .constant('ARRAY_OF_LIST_OPTIONS_FOR_CART', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] )
        .config(ngGFConfig)
        .run(run);

    ngGFConfig.$inject = [
        '$httpProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$logProvider'
    ];

    function ngGFConfig(
        $httpProvider,
        $stateProvider,
        $urlRouterProvider,
        $locationProvider,
        $logProvider
    ){

        // get X-CSRF-token
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        // get X-CSRF-token

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $logProvider.debugEnabled( false );

        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(['$state', function ($state) { $state.go('error'); }]);
            return true;
        }); // ~~~ $urlRouterProvider ~~~

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

// todo
// todo 8) разместить кнопки с соц сетями










