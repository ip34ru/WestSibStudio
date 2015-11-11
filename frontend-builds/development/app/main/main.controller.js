/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module(
            'ngWestSibStudio.main'
        )
        .controller('MainCtrl', mainCtrl)
        .controller('OpenModalAboutManufacturerCtrl', openModalAboutManufacturerCtrl)
        .controller('AllBrandsAndProductsMainPageCtrl', allBrandsAndProductsMainPageCtrl)
        .controller('HeaderMainPageCtrl', headerMainPageCtrl)
        .controller('NewsCtrl', newsCtrl)
        .filter('deleteTwoSymbolsFilter', function(){
                return function (input) {
                    return input.replace(".00" , "")
                }
            }
        )
        .filter("sanitize", ['$sce', function($sce) {
                return function(htmlCode){
                    return $sce.trustAsHtml(htmlCode);
                }
            }]
        )
        .
        animation(
            '.animate-new', function () {
                return {
                    enter: function ( _element, _done ) {

                        var offset = jQuery( _element ).offset().top;
                        jQuery('html, body').animate({scrollTop: (offset - 50 )},800);

                    }
                    //,
                    //leave: function ( _element, _done ) {
                    //
                    //}
                }
            }
        )
    ;

    // extend function: https://gist.github.com/katowulf/6598238
    function extend(base) {
        var parts = Array.prototype.slice.call(arguments, 1);
        parts.forEach(function (p) {
            if (p && typeof (p) === 'object') {
                for (var k in p) {
                    if (p.hasOwnProperty(k)) {
                        base[k] = p[k];
                    }
                }
            }
        });
        return base;
    } // ~~~ extend function: https://gist.github.com/katowulf/6598238 ~~~

    // контроллер для обработки новостей
    newsCtrl.$inject = [
                                    'ARRAY_OF_LIST_OPTIONS_FOR_CART',
                                    'NEWS_URL',
                                    '$rootScope',
                                    '$log',
                                    '$modal',
                                    '$http'
    ];

    function newsCtrl (
                                    ARRAY_OF_LIST_OPTIONS_FOR_CART,
                                    NEWS_URL,
                                    $rootScope,
                                    $log,
                                    $modal,
                                    $http
    ) {

        var vm = this;

        // запрос новостей с бекэнда
        $http({method: 'GET', url: NEWS_URL}).
            success(function(data, status, headers, config) {
                vm.newsJSON = data;
                $log.debug('News is', data);
            }).
            error(function(data, status, headers, config) {
                $log.debug('Error when i retrieve news from backend!', status);
        }); // $http

        vm.scrollToEquips = function ( e ) {
            e.preventDefault();

            var offset = jQuery( '.header__scroll' ).offset().top;
            jQuery('html, body').animate({scrollTop: (offset - 0 )},800);

        }; // vm.scrollToEquips

        vm.animationsEnabled = true;

        vm.openModalNews = function ( e, _newsHeader, _newsText ) {
            e.preventDefault();

            vm.modalCaption = _newsHeader;
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: 'static/dist/app/components/modal-windows/news-modal.html',
                    controller: 'ModalNewsCtrl',
                    size: 'lg',
                    resolve: {
                        modalCaption: function () {
                            //return vm.modalCaption;
                            return {
                                'newsHeader': vm.modalCaption,
                                'newsText': _newsText
                            };
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~

        }; // ~~~ openModalCart ~~~;


    } // newsCtrl

    // контроллер для запуска модалки корзины и генерации ее же
    headerMainPageCtrl.$inject = [
                                    'ARRAY_OF_LIST_OPTIONS_FOR_CART',
                                    '$rootScope',
                                    '$log',
                                    '$modal'
    ];

    function headerMainPageCtrl (
                                    ARRAY_OF_LIST_OPTIONS_FOR_CART,
                                    $rootScope,
                                    $log,
                                    $modal
    ) {

        var vm = this;

        vm.animationsEnabled = true;

        vm.scrollToNews = function ( e ) {
            e.preventDefault();

            var offset = jQuery( '.news__scroll' ).offset().top;
            jQuery('html, body').animate({scrollTop: (offset - 0 )},800);

        }; // vm.scrollToNews


        vm.openModalCart = function ( e ) {
            e.preventDefault();

            $log.debug('openModalCart rootScope =', $rootScope.currentCart );
            $log.debug( 'ARRAY_OF_LIST_OPTIONS_FOR_CART = ', ARRAY_OF_LIST_OPTIONS_FOR_CART );

            if ( $rootScope.currentCart.itemsInCart > 0 ) {

                vm.modalCaption = 'Cart';
                $modal.open(
                    {
                        animation: vm.animationsEnabled,
                        templateUrl: 'static/dist/app/components/modal-windows/cart-modal.html',
                        controller: 'ModalCartCtrl',
                        size: 'lg',
                        resolve: {
                            modalCaption: function () {
                                return vm.modalCaption;
                            }
                        }
                    }
                ); // ~~~ $modal.open ~~~

            } else if ( $rootScope.currentCart.itemsInCart === 0 ) {
                alert('Your cart is empty. Please add equipment to cart');
            }

        }; // ~~~ openModalCart ~~~;


    } // headerMainPageCtrl

    // контроллер для товаров и брендов с главной страницы
    allBrandsAndProductsMainPageCtrl.$inject = [
                                                '$scope',
                                                '$rootScope',
                                                '$log',
                                                '$q',
                                                'BRANDS_URL',
                                                'CART_MAX_ITEMS',
                                                'CART_MAX_PRICE',
                                                'NEWS_URL',
                                                'store',
                                                '$http'
    ];

    function allBrandsAndProductsMainPageCtrl(
                                                $scope,
                                                $rootScope,
                                                $log,
                                                $q,
                                                BRANDS_URL,
                                                CART_MAX_ITEMS,
                                                CART_MAX_PRICE,
                                                NEWS_URL,
                                                store,
                                                $http
    ) {

        var vm = this;

        vm.showEquipmentSection = false;
        vm.cartTotalPrice = 0;

        store.set('currentCart', null);
        $rootScope.currentCart = null;

        vm.currentCart = {
            itemsInCart: 0,
            selectItems: [],
            totalPrice: 0
        };
        store.set('currentCart',  vm.currentCart);
        $rootScope.currentCart =  vm.currentCart;
        $rootScope.maxItemsInCart =  0;

        // запрос данных о товарах и произволдителях с бекэнда
        $http({method: 'GET', url: BRANDS_URL}).
            success(function(data, status, headers, config) {
                vm.dataJSON = data;
                $log.debug('Data is', data);
            }).
            error(function(data, status, headers, config) {
                $log.debug('Error when i retrieve main data from backend!', status);
        }); // $http

        // отображение информации о товаре
        vm.showInfoThisEquipment = function ( _equipmentID, _manufacturerID ) {
            $log.debug('ID-выбранного товара =', _equipmentID);
            vm.showEquipmentSection = true;
            vm.equipmentID = _equipmentID;
            vm.manufacturerID = _manufacturerID;
        }; // vm.showInfoThisEquipment

        vm.collapseEquipment = function () {
            vm.showEquipmentSection = false;
            vm.equipmentID = 0;
            vm.manufacturerID = 0;
        }; // vm.collapseEquipment

        // добавить товар в корзину
        vm.addItemToCart = function ( _equipmentID,
                                      _equipmentPrice,
                                      _equipmentName,
                                      _equipmentPriceDiscont
                                    ) {

            if ( $rootScope.maxItemsInCart >= CART_MAX_ITEMS ) {
                return false;
            } // ограничение товаров в корзине

            if ( _equipmentPriceDiscont != '' ) {
                _equipmentPrice = _equipmentPriceDiscont;
            } // условие того есть ли скидка на товар или нет

            var isCurrentItem = false,
                isNewItem = false;

            _equipmentPrice = _equipmentPrice.replace(".00" , "");
            _equipmentPrice = parseInt(_equipmentPrice);

            vm.cartTotalPrice = vm.cartTotalPrice + _equipmentPrice;
            $log.debug('Общая цена товаров в корзине = ', vm.cartTotalPrice);

            if ( vm.cartTotalPrice >= CART_MAX_PRICE ) {
                vm.cartTotalPrice = vm.cartTotalPrice - _equipmentPrice;
                alert('The product\'s price goes over the limit for payment PayPal. Please, separate your order into parts');
                return false;
            } // ограничение суммы для транзакции по палке

            function pushDataInTheCart (_a, _b, _c, _d, _e) {

                vm.currentCart.selectItems.push({
                    'equipmentID'     : _a,
                    'equipmentName'   : _b,
                    'equipmentPrice'  : _c,
                    'equipmentAmount' : 1,
                    'oldEquipmentAmount' : 1,
                    'equipmentSum'    : 1 * _d
                });
                vm.currentCart.totalPrice = vm.currentCart.totalPrice + ( _e );

            } // pushDataInTheCart


            //vm.currentCart.itemsInCart = ++$rootScope.currentCart.itemsInCart;
            $rootScope.currentCart.itemsInCart = ++$rootScope.currentCart.itemsInCart;
            $rootScope.maxItemsInCart = ++$rootScope.maxItemsInCart;

            if ( vm.currentCart.selectItems.length === 0 ) {
                pushDataInTheCart( _equipmentID, _equipmentName, _equipmentPrice, _equipmentPrice, _equipmentPrice);
                isNewItem = true;
            }

            (function ( _equipmentID ) {

                if (!isNewItem) {
                    vm.currentCart.selectItems.forEach(function (element, index) {
                        if (element.equipmentID === _equipmentID) {
                            element.equipmentAmount = ++element.equipmentAmount;
                            element.oldEquipmentAmount = element.equipmentAmount;
                            element.equipmentSum = element.equipmentAmount * element.equipmentPrice;
                            isCurrentItem = true;
                            vm.currentCart.totalPrice = vm.currentCart.totalPrice + element.equipmentPrice;
                        }
                    });
                }

            })( _equipmentID );

            if (!isCurrentItem && !isNewItem) {
                pushDataInTheCart( _equipmentID, _equipmentName, _equipmentPrice, _equipmentPrice, _equipmentPrice);
            }

            store.set('currentCart',  vm.currentCart);
            $rootScope.currentCart =  vm.currentCart;

            _equipmentID = null;
            _equipmentPrice = null;
            _equipmentName = null;
            isCurrentItem = false;
            isNewItem = false;

            $log.debug('Данные корзины =',  vm.currentCart);

        }; // vm.addItemToCart


    } //allBrandsAndProductsMainPageCtrl

    mainCtrl.$inject = [ '$scope', '$rootScope',
                     'ngfitfire', '$modal',
                     'AuthfireFactory' ];

    function mainCtrl( $scope, $rootScope,
                       ngfitfire, $modal,
                       AuthfireFactory ) {

        var vm = this;

        $rootScope.curPath = 'main';
        $rootScope.publicPart = true;
        $rootScope.publicPartWorkout = false;

        vm.animationsEnabled = true;

    } // ~~~ mainCtrl ~~~

    openModalAboutManufacturerCtrl.$inject = [
                                                '$scope',
                                                '$rootScope',
                                                'ngfitfire',
                                                '$modal',
                                                'AuthfireFactory',
                                                'FIREBASE_URL'
    ];

    function openModalAboutManufacturerCtrl(
                                             $scope,
                                             $rootScope,
                                             $modal
    ) {

        var vm = this;

        vm.animationsEnabled = true;

        vm.openModalAboutManufacturer = function ( e ) {
            e.preventDefault();
            vm.modalCaption = 'Вход в личный кабинет';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: 'app/components/modal-windows/about-manufacturer-modal.html',
                    controller: 'ModalSingInCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalSingIn ~~~

    } // ~~~ openModalAboutManufacturerCtrl ~~~

})();


