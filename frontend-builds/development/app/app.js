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
            'ngCookies',
            //'ngWestSibStudio.error404',
            //'ngWestSibStudio.firebase.service',
            'ngWestSibStudio.modal-windows',
            //'ngWestSibStudio.edit-modal',
            'ui.router',
            'ui.bootstrap',
            'angular-storage'
        ])
        .constant('BRANDS_URL', '/ajax/brands/')
        .constant('CART_POST_URL', '/ajax/cart/')
        .constant('CART_MAX_ITEMS', 9)
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

// todo
// 1) при открытии полной инфы о товаре, кнопка collapse голубая, info
// 2) количество товара ограниченго 9 позициями в корзине и 9-ю позициями по конкретной позиции в корзине для товара!
// 3) одна транзакция на палке ограничена ~8500$
// 4) основной текст новости кинуть в модалку, на главной странице в блоке новостей, только тизер
// 5) корзина на сайте должна обновлять значение в зависимости от того что поправили внутри корзины!




