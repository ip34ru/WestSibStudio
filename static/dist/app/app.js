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











/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.error404', ['ui.router']);

})();



/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.main', [
            'ui.router',
            'ngWestSibStudio.modal-windows',
            'ui.bootstrap'
        ]);

})();



/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.auth-modal', [
            'ngNoReddit.main',
            'ui.bootstrap'
        ]);

})();

/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.edit-modal', [
            'ngNoReddit.main',
            'ui.bootstrap'
        ]);

})();

/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.modal-windows', [
            'ngWestSibStudio.main',
            'ui.bootstrap'
        ]);

})();

/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.news', [
            'ngWestSibStudio.main',
            'ui.bootstrap'
        ]);

})();

/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.profile', [])
    ;

})();

/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.error404')
        .controller('Error404Ctrl', error404Ctrl);

    error404Ctrl.$inject = ['$scope', '$rootScope'];

    function error404Ctrl($scope, $rootScope) {
        $rootScope.curPath = 'error';
        $rootScope.publicPart = true;
        $rootScope.publicPartWorkout = false;
    } // ~~~ error404Ctrl ~~~

})();



/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.error404')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('error', {
                views : {
                    'allBrandsAndProductsMainPage' : {
                        templateUrl: 'static/dist/app/error/error.html',
                        controller: 'Error404Ctrl',
                        controllerAs: 'vm'
                    }
                }
            }) // 404 error
        ;
    }

})();






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
        .controller('FooterMainPageCtrl', footerMainPageCtrl)
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

    //контроллер для даты в футере
    footerMainPageCtrl.$inject = [
                                    '$http',
                                    'NOW_YEAR_URL',
                                    '$log'
    ];

    function footerMainPageCtrl (
                                    $http,
                                    NOW_YEAR_URL,
                                    $log
    ) {

        var vm = this;

        // запрос текущего года для футера
        $http({method: 'GET', url: NOW_YEAR_URL})
            .then(function successCallback(response) {
                vm.nowYearJSON = response.data;
                $log.debug('Now Year is', response.data);
            }, function errorCallback(response) {
                $log.debug('Error when i retrieve data of now year from backend!', response.status);
        }); // $http

    } // footerMainPageCtrl


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

        // запрос новостей с бекэнда (ИСПОЛЬЗУЙ В БУДУЩЕМ ЕГО)
        $http({method: 'GET', url: NEWS_URL})
            .then(function successCallback(response) {
                vm.newsJSON = response.data;
                $log.debug('NEW_METHOD News is', response.data);
            }, function errorCallback(response) {
                $log.debug('Error when i retrieve news from backend!', response.status);
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
                                                '$modal',
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
                                                $modal,
                                                store,
                                                $http
    ) {

        var vm = this;

        vm.showEquipmentSection = false;
        vm.cartTotalPrice = 0;
        vm.animationsEnabled = true;

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

        vm.openModalAboutManufacturerInfo = function ( e, _manufacturerName, _manufacturerText ) {
            e.preventDefault();

            vm.modalCaption = 'About ' + _manufacturerName;
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: 'static/dist/app/components/modal-windows/about-manufacturer-modal.html',
                    controller: 'ModalAboutManufacturerCtrl',
                    size: 'lg',
                    resolve: {
                        modalCaption: function () {
                            //return vm.modalCaption;
                            return {
                                'manufacturerHeader': vm.modalCaption,
                                'manufacturerText': _manufacturerText
                            };
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~

        }; // ~~~ openModalAboutManufacturerInfo ~~~;


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



/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.main')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                views : {
                    'aboutManufacturerModal' : {
                        //templateUrl: 'app/components/modal-windows/about-manufacturer-modal.html',
                        controller: 'OpenModalAboutManufacturerCtrl',
                        controllerAs: 'vm'
                    },
                    'headerMainPage' : {
                        templateUrl: 'static/dist/app/components/header/header.html',
                        controller: 'HeaderMainPageCtrl',
                        controllerAs: 'vm'
                    },
                    'floatHeaderMainPage' : {
                        templateUrl: 'static/dist/app/components/header-float/header-float.html',
                        controller: 'HeaderMainPageCtrl',
                        controllerAs: 'vm'
                    },
                    'footerMainPage' : {
                        templateUrl: 'static/dist/app/components/footer/footer.html',
                        controller: 'FooterMainPageCtrl',
                        controllerAs: 'vm'
                    },
                    'footerIP34MainPage' : {
                        templateUrl: 'static/dist/app/components/footer-ip34/footer-ip34.html',
                        //static/dist/app/components/header/header.html
                        //controller: 'HeaderMainPageCtrl',
                        //controllerAs: 'vm'
                    },
                    'allBrandsAndProductsMainPage' : {
                        templateUrl: 'static/dist/app/components/brands-products-mainpage/brands-products-mainpage.html',
                        controller: 'AllBrandsAndProductsMainPageCtrl',
                        controllerAs: 'vm'
                    },
                    'news' : {
                        templateUrl: 'static/dist/app/components/news/news.html',
                        controller: 'NewsCtrl',
                        controllerAs: 'vm'
                    }
                }

            }) // main
        ;
    }

})();

/**
 * Created by taksenov@gmail.com on 29.06.2015.
 */

;(function(){
    'use strict';

    angular
        .module( 'authfire.factory', [ 'firebase' ] )
        .factory( 'AuthfireFactory', authfireFactory )
    ;

    authfireFactory.$inject = [ '$firebaseAuth', '$rootScope',
                         'FIREBASE_URL', '$log',
                         '$firebaseObject', 'store',
                         '$location' ];

    function authfireFactory( $firebaseAuth, $rootScope,
                       FIREBASE_URL, $log,
                       $firebaseObject, store,
                       $location ) {

        var ref = new Firebase( FIREBASE_URL );
        var auth = $firebaseAuth( ref );
        var authObj = {

            twitterLogin: function ( _user, authHandler ) {

                authHandler = typeof authHandler !== 'undefined' ? authHandler : twitterSocialAuthHandle;

                ref.authWithOAuthPopup( "twitter", authHandler, {} )

            }, // ~~~ twitterLogin ~~~

            facebookLogin: function ( _user, authHandler ) {

                authHandler = typeof authHandler !== 'undefined' ? authHandler : facebookSocialAuthHandle;

                ref.authWithOAuthPopup( "facebook", authHandler, {
                    scope: "public_profile,\ " +          // https://developers.facebook.com/docs/facebook-login/permissions/v2.3
                           "email"                        // https://developers.facebook.com/docs/facebook-login/permissions/v2.3
                } )

            }, // ~~~ facebookLogin ~~~

            googleLogin: function ( _user, authHandler ) {

                authHandler = typeof authHandler !== 'undefined' ? authHandler : googleSocialAuthHandle;

                ref.authWithOAuthPopup( "google", authHandler, {
                    scope: "profile,\ " +                 // userinfo.profile
                           "email"                        // userinfo.email
                } )

            }, // ~~~ googleLogin ~~~

            login: function( _user, authHandler ) {

                authHandler = typeof authHandler !== 'undefined' ? authHandler : authHandle;

                auth.$authWithPassword( _user )
                    .then( authHandler )
                    .catch( function ( error ) {
                        $log.error( 'Authentication error: ', error );
                        $rootScope.authError = 'Вы ошиблись при вводе пары логин/пароль';
                        $rootScope.authErrorBool = true;
                    })
                ; // ~~~ auth.$authWithPassword ~~~

            },  // ~~~ login ~~~

            logout: function (  ) {
                ref.unauth();
                store.set('currentUser', null);
                $rootScope.currentUser = null;
            },  // ~~~ logout ~~~

            isSignedIn: function (  ) {
                return !!ref.getAuth(); // проверка на то,
                                        // залогинен ли пользователь, возвращает булевское значение
            }, // ~~~ isSignedIn ~~~

            getAuth: function (  ) {
                return ref.getAuth();
            }, // ~~~ getAuth ~~~

            signUp: function ( _user ) {
                return auth.$createUser({
                    email: _user.email,
                    password: _user.password
                })
                .then( function ( userData ) {
                    $log.debug( 'User ' + userData.uid + ' created!' );
                    $log.debug( 'User registration data ',  _user );

                    var userRef = ref.child('users').child(userData.uid);
                    var avatarRef = ref.child('avatars').child( userData.uid.replace("simplelogin:", "") );

                    avatarRef.set({
                        avatar: '../img/nggirlsfit-no-avatar.jpg'
                    });

                    userRef.set({
                        name: _user.name,
                        email: _user.email,
                        id: userData.uid.replace("simplelogin:", ""),
                        uid: userData.uid,
                        avatar: '../img/nggirlsfit-no-avatar.jpg',
                        date: Firebase.ServerValue.TIMESTAMP
                    });

                    return auth.$authWithPassword({
                               email: _user.email,
                               password: _user.password
                            }).then( function () {
                                // закрыть модальное окно
                                $rootScope.modalInstance.close();
                                $rootScope.modalInstance = null;
                            });
                }) // ~~~ then ~~~
                .catch( function ( error ) {
                    $log.error( 'Create user errror ', error );
                    $rootScope.authError = 'В процессе регистрации возникли ошибки. Попробуйте повторить попытку позже';
                    $rootScope.signUpErrorBool = true;
                }); // ~~~ catch ~~~
            } // ~~~signUp ~~~

            ,
            ngAuth: function () {
                return auth
            }

        };  // ~~~ authObj ~~~

        function authDataCallBack ( authData ) {
            if ( authData ) {

                var userRef;
                var user;
                var userPicDefault;
                var currentUser;
                var avatarRef;

                if ( authData.google && authData.google.id ) {
                    userRef = ref.child('users').child( authData.google.id );
                    avatarRef = ref.child('avatars').child( authData.google.id );
                    user = $firebaseObject(userRef);
                    user.$loaded().then(
                        function () {
                            userPicDefault = user.avatar;
                            avatarRef.set({
                                avatar: user.avatar
                            });
                        }
                    );
                } else if ( authData.facebook && authData.facebook.id ) {
                    userRef = ref.child('users').child( authData.facebook.id );
                    avatarRef = ref.child('avatars').child( authData.facebook.id );
                    user = $firebaseObject(userRef);
                    user.$loaded().then(
                        function () {
                            userPicDefault = user.avatar;
                            avatarRef.set({
                                avatar: user.avatar
                            });
                        }
                    );
                } else if ( authData.twitter && authData.twitter.id ) {
                    userRef = ref.child('users').child( authData.twitter.id );
                    avatarRef = ref.child('avatars').child( authData.twitter.id );
                    user = $firebaseObject(userRef);
                    user.$loaded().then(
                        function () {
                            userPicDefault = user.avatar;
                            avatarRef.set({
                                avatar: user.avatar
                            });
                        }
                    );
                } else {
                    userRef = ref.child('users').child(authData.uid);
                    user = $firebaseObject(userRef);
                    userPicDefault = '../img/nggirlsfit-no-avatar.jpg';
                }

                user.$loaded().then( function (  ) {
                    var currentUser = {
                        id: user.$id.replace("simplelogin:", ""),
                        email: user.email,
                        name: user.name,
                        weight: user.weight,
                        height: user.height,
                        birthdate: user.birthdate,
                        avatar: userPicDefault,
                        token: user.token,
                        uid: user.uid,
                        expires: user.expires,
                        accesstoken: user.accesstoken,
                        lastactivity: user.lastactivity
                    };
                    store.set('currentUser', currentUser);
                    $rootScope.currentUser = currentUser;
                });
            } else {
                store.set('currentUser', null);
                $rootScope.currentUser = null;
            }
        } // ~~~ authDataCallBack ~~~

        function authHandle ( authData ) {
            $log.debug( 'Authenticated success!', authData );
            // закрыть модальное окно
            $rootScope.modalInstance.close();
            $rootScope.modalInstance = null;
        } // ~~~ authHandle ~~~

        function twitterSocialAuthHandle ( error, authData ) {
            if ( error ) {
                $log.error( 'Twitter Social Authentication error: ', error );
            } else {
                $log.debug( 'Twitter Authentication data: ', authData );
                var userRef = ref.child('users').child( authData.twitter.id );
                var user = $firebaseObject( userRef );

                user.$loaded( function () {
                    if ( user.username ) {
                        userRef.child( 'lastactivity').set( Firebase.ServerValue.TIMESTAMP );
                    } else {
                        userRef.set({
                            'username': authData.twitter.username,
                            'name': authData.twitter.displayName,
                            'avatar': authData.twitter.cachedUserProfile.profile_image_url, // https://dev.twitter.com/overview/api/users
                            'id': authData.twitter.id,
                            'token': authData.token,
                            'uid': authData.uid,
                            'expires': authData.expires,
                            'accesstoken': authData.twitter.accessToken,
                            'lastactivity': Firebase.ServerValue.TIMESTAMP
                        });
                    }
                });

            }
        } // ~~~ twitterSocialAuthHandle ~~~

        function facebookSocialAuthHandle ( error, authData ) {
            if ( error ) {
                $log.error( 'Facebook Social Authentication error: ', error );
            } else {
                $log.debug( 'Facebook Authentication data: ', authData );
                var userRef = ref.child('users').child( authData.facebook.id );
                var user = $firebaseObject( userRef );

                user.$loaded( function () {
                    if ( user.email ) {
                        userRef.child( 'lastactivity').set( Firebase.ServerValue.TIMESTAMP );
                    } else {
                        userRef.set({
                            'email': authData.facebook.email,
                            'name': authData.facebook.displayName,
                            'avatar': authData.facebook.cachedUserProfile.picture.data.url, // https://developers.facebook.com/docs/graph-api/reference/user/
                            'id': authData.facebook.id,
                            'token': authData.token,
                            'uid': authData.uid,
                            'expires': authData.expires,
                            'accesstoken': authData.facebook.accessToken,
                            'lastactivity': Firebase.ServerValue.TIMESTAMP
                        });
                    }
                });

            }
        } // ~~~ facebookSocialAuthHandle ~~~

        function googleSocialAuthHandle ( error, authData ) {
            if ( error ) {
                $log.error( 'Google Social Authentication error: ', error );
            } else {
                $log.debug( 'Google Authentication data: ', authData );
                var userRef = ref.child('users').child( authData.google.id );
                var user = $firebaseObject( userRef );

                user.$loaded( function () {
                    if ( user.email ) {
                        userRef.child( 'lastactivity').set( Firebase.ServerValue.TIMESTAMP );
                    } else {
                        userRef.set({
                            'email': authData.google.email,
                            'name': authData.google.displayName,
                            'avatar': authData.google.cachedUserProfile.picture,
                            'id': authData.google.id,
                            'token': authData.token,
                            'uid': authData.uid,
                            'expires': authData.expires,
                            'accesstoken': authData.google.accessToken,
                            'lastactivity': Firebase.ServerValue.TIMESTAMP
                        });
                    }
                });

            }
        } // ~~~ googleSocialAuthHandle ~~~


        ref.onAuth( authDataCallBack );

        $rootScope.isSignedIn = function (  ) {
            return authObj.isSignedIn();
        };

        return authObj;

    } // ~~~ authfireFactory ~~~

})();







/**
 * Created by taksenov@gmail.com on 25.06.2015.
 */

;(function(){
    'use strict';

    angular
        .module('ngNoReddit.firebase.service', ['firebase'])
        .service('ngfitfire', ngfitfire);

    ngfitfire.$inject = [ 'FIREBASE_URL', '$firebaseObject',
                          '$firebaseArray', '$log',
                          '$rootScope', '$q',
                          'toastr' ];

    function ngfitfire( FIREBASE_URL, $firebaseObject,
                        $firebaseArray, $log,
                        $rootScope, $q,
                        toastr ){

        var self = this;

        var ref = new Firebase( FIREBASE_URL );
        var usersRef = ref.child('users');
        var allPostsRef = ref.child( 'posts' );
        var allCommentsRef = ref.child( 'comments' );
        var allAvatarsRef = ref.child( 'avatars' );

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

        // проверка объекта на пустоту
        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        } // isEmpty

        // получение списка всех постов
        self.getAllPosts = function(call_back){
            var allPostsArr = $firebaseArray( allPostsRef );

            return allPostsArr.$loaded( call_back );
        };
        // ~~~ self.getUserExercises ~~~

        // выборка всех постов для главной страницы (по рекомендации от Романа Cпиридонова)
        // позволяет избавиться от extend() и использовать AngularFire API
        self.getPosts2= function () {
            var allPostsArr = $firebaseArray( allPostsRef );
            var records = [];
            var i = 1; //внимание!
            var def = $q.defer();

            allPostsArr.$loaded(function(_allPosts){
                angular.forEach(_allPosts, function(_onePost){
                    _onePost.postID = _onePost.$id;
                    records[ i++ ] = _onePost;
                });
                def.resolve(records);
            });
            return def.promise;
        };
        // ~~~ self.getPosts2

        // выборка всех аватар для главной страницы
        self.getAvatars2 = function () {
            var allAvatarsArr = $firebaseArray( allAvatarsRef );
            var records = [];
            var i = 1; //внимание!
            var def = $q.defer();

            allAvatarsArr.$loaded(function(_allAvatars){
                angular.forEach(_allAvatars, function(_oneAvatar){
                    _oneAvatar.ownerID = _oneAvatar.$id;
                    records[ i++ ] = _oneAvatar;
                });
                def.resolve(records);
            });
            return def.promise;
        };
        // ~~~ self.getAvatars2


        // выборка всех аватар для главной страницы
        self.getAvatars = function () {
            var def = $q.defer();
            ref.child('avatars').once('value', function( snap ) {
                var records = {};

                snap.forEach(
                    function(childSnap) {
                        records[ childSnap.key() ] = ( childSnap.val() );
                    } // function(childSnap)
                );
                def.resolve(records);
            });
            return def.promise;
        };
        // ~~~ self.getAvatars

        // добавление нового поста
        self.newPostAdd = function ( _newPostData, _ifAllSuccess ) {
            var newPostRef = allPostsRef.push( _newPostData );
            var postID = newPostRef.key();
            var onComplete = function(error) {
                if (error) {
                    $log.debug('addNewPost: Synchronization failed');
                    toastr.error('Попробуйте добавить новый пост позднее', 'Ошибка!');
                } else {
                    $log.debug('addNewPost: Synchronization succeeded');

                    $q.all( [
                            self.getPostFromID( postID ),
                            self.getCommentsFromID( postID ),
                            self.getAvatars() ] )
                    .then(
                        function ( _results ) {
                            $rootScope.allPosts2 = self.processingNewPostDataOfQALL( _results );
                            $rootScope.allPosts[$rootScope.allPosts.length] = $rootScope.allPosts2;

                            //$log.debug( 'данные нового добавленного поста $rootScope.allPosts =', $rootScope.allPosts );
                            //$log.debug( 'данные нового добавленного поста $rootScope.allPosts2 =', $rootScope.allPosts2 );
                            //$log.debug( 'данные нового добавленного поста _results =', _results );
                            _ifAllSuccess();
                            toastr.success('Добавлен новый пост', 'Успех!');
                        }
                    );

                }
            }; // ~~~ onComplete ~~~

            allCommentsRef.child( postID ).set( { status: 'status=true' }, onComplete );
        };
        // ~~~ self.newPostAdd ~~~

        // добавление нового комментария
        self.newCommentAdd = function ( _newCommentData, _postID, _ifAllSuccess ) {
            var onComplete = function(error) {
                if (error) {
                    $log.debug('addNewComment: Synchronization failed');
                    toastr.error('Попробуйте добавить новый комментарий позднее', 'Ошибка!');
                } else {

                    $log.debug('addNewComment: Synchronization succeeded');
                    var commentID = newCommentRef.key();

                    $q.all( [
                            self.getAvatars() ] )
                    .then(
                        function ( _results ) {

                            var onComplete = function(error) {
                                if (error) {
                                    $log.debug('commentAddCommentID: Synchronization failed');
                                } else {
                                    $log.debug('commentAddCommentID: Synchronization succeeded');
                                }
                            };

                            allCommentsRef.child( _postID ).child( commentID ).update( { 'commentID': commentID }, onComplete );

                            // добаляем аватарку в объект с комментарием
                            if (  _newCommentData['ownerId'] !== undefined  ) {
                                _newCommentData['avatar'] = _results[0][ _newCommentData['ownerId'] ]['avatar'];
                            } // добаляем аватарку в объект с комментарием

                            $log.debug('данные внутри newCommentAdd _newCommentData =', _newCommentData);

                            // поиск объекта с постом в который добавлен комментарий в массиве объектов
                            for (var i = 0; i < $rootScope.allPosts.length; i++) {

                                ( $rootScope.allPosts[i]['comments'].$priority === null ) ? ( delete $rootScope.allPosts[i]['comments'].$priority ) : false;

                                if ( $rootScope.allPosts[i]['postID'] === _postID ) {
                                    $rootScope.allPosts[i]['comments'][commentID] = _newCommentData;
                                    $rootScope.allPosts[i]['comments'][commentID]['commentID'] = commentID;
                                    $rootScope.allPosts[i]['nocomments'] = false;
                                    $log.debug('$rootScope.allPosts ' + i + ' =', $rootScope.allPosts[i] );
                                }
                            } // поиск объекта с постом

                            $log.debug('$rootScope.allPosts =', $rootScope.allPosts );

                            _ifAllSuccess();
                            toastr.success('Добавлен новый комментарий', 'Успех!', {
                                timeOut: 1000
                            });

                        }
                    );

                }
            };

            var newCommentRef = allCommentsRef.child( _postID ).push( _newCommentData, onComplete );

            $log.debug(
                'добавляемые данные',
                _newCommentData,
                'в пост =',
                _postID
            );

        };
        // ~~~ self.newCommentAdd ~~~

        // обработка данных всех постов в запросе $q.all
        self.processingMainDataOfQALL = function ( results ) {
            var posts = [];
            var allPosts = {};

            for ( var ind in results[0] ) {
                // добаляем аватарку в объект

                $log.debug('results[0][ind][\'ownerId\'] =', results[0][ind]['ownerId'] );


                if (  results[1][ results[0][ind]['ownerId'] ] !== undefined  ) {
                    results[0][ind]['avatar'] = results[1][ results[0][ind]['ownerId'] ]['avatar'];
                } // добаляем аватарку в объект

                //allPosts[ind-1] = {
                //    'comments': results[1][ind]
                //};
                posts[ind-1] = extend({}, results[0][ind], allPosts[ind-1] );
                posts[ind-1] = extend({}, posts[ind-1], { 'elementIndex': ind-1 } );
            } // обработка постов

            return posts;
        };
        // ~~~ self.processingMainDataOfQALL ~~~

        // обработка данных нового добавленного поста в запросе $q.all
        self.processingNewPostDataOfQALL = function ( results ) {
            var posts = [];
            var allPosts = {};

            results[0]['nocomments'] = true;

            for ( var i in results[1] ) {
                for ( var i1 in results[1][i]  ) {
                    if ( results[1][i][i1] === 'status=true' ) {
                        //results[0][i]['nocomments'] = true;
                        delete results[1][i][i1];
                    }
                }
            } // обработка комментариев

            // добаляем аватарку в объект
            if (  results[2][ results[0]['ownerId'] ] !== undefined  ) {
                results[0]['avatar'] = results[2][ results[0]['ownerId'] ]['avatar'];
            } // добаляем аватарку в объект

            allPosts = {
                'comments': {}
            };
            posts = extend({}, results[0], allPosts );
            posts = extend({}, posts, { 'elementIndex': $rootScope.allPosts.length } );

            return posts;
        };
        // ~~~ self.processingMainDataOfQALL ~~~

        // удаление комментария
        self.commentDelete = function ( _postID, _commentID ) {

            var onComplete = function(error) {
                if (error) {
                    $log.debug('commentDelete: Synchronization failed');
                    toastr.error('Что-то пошло не так, попробуйте в другой раз', 'Ошибка!', {
                        timeOut: 1000
                    });
                } else {
                    $log.debug('commentDelete: Synchronization succeeded');

                    // поиск комментари в массиве объектов для удаления
                    for (var i = 0; i < $rootScope.allPosts.length; i++) {
                        if ( $rootScope.allPosts[i]['postID'] ===  _postID ) {
                            delete $rootScope.allPosts[i]['comments'][_commentID];
                            // есть комменты или нет
                            isEmpty( $rootScope.allPosts[i]['comments'] ) ? $rootScope.allPosts[i]['nocomments'] = true : $rootScope.allPosts[i]['nocomments'] = false;
                        }
                    } // поиск объекта с постом

                    toastr.info('Комментарий удален', 'Внимание!', {
                        timeOut: 1000
                    });
                }
            };

            allCommentsRef.child( _postID ).child( _commentID ).remove( onComplete );

        };
        // ~~~ self.commentDelete ~~~

        // удаление поста
        self.postDelete = function ( _postID, _elementIndex ) {

            var onComplete = function(error) {
                if (error) {
                    $log.debug('commentDelete: Synchronization failed');
                    toastr.error('Что-то пошло не так, попробуйте в другой раз', 'Ошибка!', {
                        timeOut: 1000
                    });
                } else {
                    $log.debug('commentDelete: Synchronization succeeded');

                    allCommentsRef.child( _postID ).remove();
                    $rootScope.allPosts.splice( _elementIndex, 1 );

                    $log.debug('commentDelete: $rootScope.allPosts', $rootScope.allPosts);

                    toastr.info('Ваш пост удален', 'Внимание!', {
                        timeOut: 1000
                    });
                }
            };

            allPostsRef.child( _postID ).remove( onComplete );

        };
        // ~~~ self.postDelete ~~~

        // редактирование поста
        self.postEdit = function ( _postId, _postCaption, _postText ) {
            var onComplete = function(error) {
                if (error) {
                    $log.debug('exerciseEdit Synchronization failed');
                    toastr.error('Что-то пошло не так, попробуйте в другой раз', 'Ошибка!', {
                        timeOut: 3000
                    });
                } else {
                    $log.debug('exerciseEdit Synchronization succeeded');
                    toastr.info('Пост отредактирован', 'Внимание!', {
                        timeOut: 2000
                    });
                    $rootScope.modalInstance.close();
                    $rootScope.modalInstance = null;
                }
            };

            allPostsRef.child( _postId ).update(
                {
                    postCaption: _postCaption,
                    postText: _postText
                }, onComplete );
        };
        // ~~~ self.postEdit ~~~

        // редактирование комментария
        self.commentEdit = function ( _postId, _commentID, _commentText ) {
            var onComplete = function(error) {
                if (error) {
                    $log.debug('exerciseEdit Synchronization failed');
                    toastr.error('Что-то пошло не так, попробуйте в другой раз', 'Ошибка!', {
                        timeOut: 3000
                    });
                } else {
                    $log.debug('exerciseEdit Synchronization succeeded');
                    toastr.info('Комментарий отредактирован', 'Внимание!', {
                        timeOut: 2000
                    });
                    $rootScope.modalInstance.close();
                    $rootScope.modalInstance = null;
                }
            };

            allCommentsRef.child( _postId ).child( _commentID ).update(
                {
                    commentText: _commentText
                }, onComplete );
        };
        // ~~~ self.postEdit ~~~

        // редактирование пользователя
        self.accountProfileEdit = function ( _userid, _userData ) {
            usersRef.child( _userid ).set( _userData );
        };
        // ~~~ self.accountProfileEdit ~~~
    }

})();


/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.auth-modal')
        .controller('ModalSingInCtrl', modalSingInCtrl)
        .controller('ModalSingUpCtrl', modalSingUpCtrl)
    ;

    modalSingInCtrl.$inject = [
        '$scope', '$modal', '$log',
        '$rootScope', '$modalInstance', 'modalCaption',
        'AuthfireFactory', '$location'
    ];
    modalSingUpCtrl.$inject = [
        '$scope', '$modal', '$log',
        '$rootScope', '$modalInstance', 'modalCaption',
        'AuthfireFactory', '$location'
    ];

    function modalSingInCtrl ( $scope, $modal,
                               $log, $rootScope,
                               $modalInstance, modalCaption,
                               AuthfireFactory, $location ) {

        var vm = this;

        $rootScope.modalInstance = $modalInstance;
        $rootScope.authError = '';
        $rootScope.authErrorAllFields = false;
        $rootScope.authErrorBool = false;
        $scope.modalCaption = modalCaption;
        $scope.credentials = {
            email: null,
            password: null
        };

        vm.login = function (  ) {
            AuthfireFactory.login( $scope.credentials );

            $log.debug( 'Login!',
                'UserName =', $scope.credentials.email,
                'UserPassword =', $scope.credentials.password  );
        }; // ~~~ vm.login ~~~

        $scope.twitterLogin = function (  ) {

            AuthfireFactory.twitterLogin(  );
            $modalInstance.close();

        }; // ~~~ vm.twitterLogin ~~~

        $scope.facebookLogin = function (  ) {

            AuthfireFactory.facebookLogin(  );
            $modalInstance.close();

        }; // ~~~ vm.facebookLogin ~~~

        $scope.googleLogin = function (  ) {

            AuthfireFactory.googleLogin(  );
            $modalInstance.close();

        }; // ~~~ vm.googleLogin ~~~

        $scope.ok = function () {

            if ( !$scope.credentials.email || !$scope.credentials.password ) {
                $log.debug('Для входа необходимо ввести логин и пароль');
                $rootScope.authErrorAllFields = true;
                $rootScope.authErrorBool = false;
            } else {
                $rootScope.authErrorAllFields = false;
                vm.login();
            }

        }; //~~~ $scope.ok ~~~

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalSingInCtrl ~~~

    function modalSingUpCtrl ( $scope, $modal,
                               $log, $rootScope,
                               $modalInstance, modalCaption,
                               AuthfireFactory, $location ) {

        var vm = this;

        $rootScope.signUpErrorBool = false;
        $rootScope.modalInstance = $modalInstance;
        $rootScope.authError = '';
        $rootScope.signUpErrorAllFields = false;
        $rootScope.signUpErrorNonStrongPassword = false;
        $scope.modalCaption = modalCaption;
        $scope.newUserData = {
            name: null,
            email: null,
            password: null
        };

        vm.signUp = function (  ) {
            AuthfireFactory.signUp( $scope.newUserData );

            $log.debug( 'SignUp!',
                'UserName =', $scope.newUserData.name,
                'Email =', $scope.newUserData.email,
                'UserPassword =', $scope.newUserData.password  );
        }; // ~~~ vm.login ~~~

        $scope.twitterLogin = function (  ) {

            AuthfireFactory.twitterLogin(  );
            $modalInstance.close();

        }; // ~~~ vm.twitterLogin ~~~

        $scope.facebookLogin = function (  ) {

            AuthfireFactory.facebookLogin(  );
            $modalInstance.close();

        }; // ~~~ vm.facebookLogin ~~~

        $scope.googleLogin = function (  ) {

            AuthfireFactory.googleLogin(  );
            $modalInstance.close();

        }; // ~~~ vm.googleLogin ~~~

        $scope.ok = function () {

            var s = $scope.newUserData.password;

            //todo сделать эту громоздкую проверку директивой -----------------------------------------
            if ( !$scope.newUserData.email ||
                 !$scope.newUserData.password ||
                 !$scope.newUserData.name
            ) {
                $log.debug('Для регистрации должны быть заполнены все поля');
                $rootScope.signUpErrorAllFields = true;
                $rootScope.authErrorBool = false;
                $rootScope.signUpErrorNonStrongPassword = false;
            } else {

                if ( !(s.length > 7) ) {
                    $rootScope.signUpErrorNonStrongPassword = true;
                    $rootScope.signUpErrorAllFields = false;
                    $rootScope.authErrorBool = false;
                    $rootScope.authError = 'Пароль очень простой! Используйте пароль не менее 8 символов';
                    $log.debug('Пароль очень простой! Используйте пароль не менее 8 символов');
                } else if ( !(/[0-9]/.test(s)) ) {
                    $rootScope.signUpErrorNonStrongPassword = true;
                    $rootScope.signUpErrorAllFields = false;
                    $rootScope.authErrorBool = false;
                    $rootScope.authError = 'Пароль очень простой! Используйте пароль не менее 8 символов, состоящий из комбинации латинских прописных и заглавных букв, а так же цифр';
                    $log.debug('Пароль очень простой! Используйте пароль не менее 8 символов, состоящий из цифр');
                } else if ( !(/[A-Za-z]/.test(s)) ) {
                    $rootScope.signUpErrorNonStrongPassword = true;
                    $rootScope.signUpErrorAllFields = false;
                    $rootScope.authErrorBool = false;
                    $rootScope.authError = 'Пароль очень простой! Используйте пароль не менее 8 символов, состоящий из комбинации латинских прописных и заглавных букв, а так же цифр';
                    $log.debug('Пароль очень простой! Используйте пароль не менее 8 символов, состоящий из цифр и латинских букв');
                } else if ( (/[А-Яа-я]/.test(s)) ) {
                    $rootScope.signUpErrorNonStrongPassword = true;
                    $rootScope.signUpErrorAllFields = false;
                    $rootScope.authErrorBool = false;
                    $rootScope.authError = 'Пароль не подходит! Используйте только латинские буквы';
                    $log.debug('Пароль очень простой! Используйте только латинские буквы');
                } else {
                    $log.debug('Ваш пароль подходит!');
                    $rootScope.signUpErrorNonStrongPassword = false;
                    $rootScope.signUpErrorAllFields = false;
                    $rootScope.authErrorBool = false;
                    $rootScope.authError = '';
                    vm.signUp();
                }
            }
            //todo сделать эту громоздкую проверку директивой -----------------------------------------

        }; //~~~ $scope.ok ~~~

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalSingUpCtrl ~~~

})();



/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.edit-modal')
        .controller('ModalCommentEditCtrl', modalCommentEditCtrl)
        .controller('ModalPostEditCtrl', modalPostEditCtrl)
    ;

    modalCommentEditCtrl.$inject = [
        '$scope', '$modal', '$log',
        '$rootScope', '$modalInstance', 'modalCaption',
        'AuthfireFactory', '$location', 'postData',
        'commentData', 'ngfitfire'
    ];
    modalPostEditCtrl.$inject = [
        '$scope', '$modal', '$log',
        '$rootScope', '$modalInstance', 'modalCaption',
        'AuthfireFactory', '$location',
        'postData', 'ngfitfire'
    ];

    function modalCommentEditCtrl ( $scope, $modal,
                               $log, $rootScope,
                               $modalInstance, modalCaption,
                               AuthfireFactory, $location,
                               postData, commentData, ngfitfire  ) {

        var vm = this;

        $scope.modalCaption = modalCaption;
        $scope.postData = postData;
        $scope.commentData = commentData;
        $scope.commentDataCommentText = commentData.commentText;

        $rootScope.modalInstance = $modalInstance;

        $log.debug( 'commentData =', commentData );
        $log.debug( 'postData =', postData );

        $scope.ok = function () {
            ngfitfire.commentEdit(
                $scope.postData.postID,
                $scope.commentData.commentID,
                $scope.commentData.commentText
            );
        }; //~~~ $scope.ok ~~~

        $scope.cancel = function () {
            commentData.commentText = $scope.commentDataCommentText;
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalSingInCtrl ~~~

    function modalPostEditCtrl ( $scope, $modal,
                               $log, $rootScope,
                               $modalInstance, modalCaption,
                               AuthfireFactory, $location,
                               postData, ngfitfire ) {

        var vm = this;

        $scope.modalCaption = modalCaption;
        $scope.postData = postData;
        $scope.postDataPostText = postData.postText;
        $scope.postDataPostCaption = postData.postCaption;
        $rootScope.modalInstance = $modalInstance;

        $scope.ok = function () {
            ngfitfire.postEdit(
                $scope.postData.postID,
                $scope.postData.postCaption,
                $scope.postData.postText
            );
        }; //~~~ $scope.ok ~~~

        $scope.cancel = function () {
            postData.postText = $scope.postDataPostText;
            postData.postCaption = $scope.postDataPostCaption;
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalSingUpCtrl ~~~

})();



/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.modal-windows')
        .controller('ModalCartCtrl', modalCartCtrl)
        .controller('ModalAboutManufacturerCtrl', modalAboutManufacturerCtrl)
        .controller('ModalErrorMessageCtrl', modalErrorMessageCtrl)
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

    modalErrorMessageCtrl.$inject = [
                                '$scope',
                                '$log',
                                '$rootScope',
                                'modalCaption'
    ];

    function modalErrorMessageCtrl (
                                    $scope,
                                    $log,
                                    $rootScope,
                                    modalCaption
    ) {
        $scope.cancel = function () {
            $rootScope.errorMessage = '';
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~
    } // modalErrorMessageCtrl


    modalCartCtrl.$inject = [
                                '$scope',
                                'ARRAY_OF_LIST_OPTIONS_FOR_CART',
                                '$modal',
                                '$log',
                                '$rootScope',
                                '$modalInstance',
                                'modalCaption',
                                'CART_POST_URL',
                                '$http',
                                'CART_MAX_PRICE',
                                'CART_MAX_ITEMS',
                                '$location'
    ];

    function modalCartCtrl (
                             $scope,
                             ARRAY_OF_LIST_OPTIONS_FOR_CART,
                             $modal,
                             $log,
                             $rootScope,
                             $modalInstance,
                             modalCaption,
                             CART_POST_URL,
                             $http,
                             CART_MAX_PRICE,
                             CART_MAX_ITEMS,
                             $location
    ) {

        var vm = this;

        $log.debug('modalCartCtrl rootScope =', $rootScope.currentCart );

        $scope.arrayOfOptions = ARRAY_OF_LIST_OPTIONS_FOR_CART;
        $scope.modalCaption = modalCaption;
        $scope.userdata = {
            name     : null,
            company  : null,
            phone    : null,
            email    : null,
            address  : null,
            town     : null,
            country  : null,
            zipcode  : null
        };
        vm.orderedEquipment = [];
        $scope.isSubmitBtnDisablet = false;

        $scope.changeEquipmentAmountInSelect = function ( _index ) {

            // changeEquipmentDataInTheCart
            (function ( _index ) {

                $rootScope.currentCart.selectItems[_index].oldEquipmentSum = $rootScope.currentCart.selectItems[_index].equipmentSum;
                $rootScope.currentCart.selectItems[_index].equipmentSum
                    =
                    $rootScope.currentCart.selectItems[_index].equipmentAmount
                    *
                    $rootScope.currentCart.selectItems[_index].equipmentPrice;

                $rootScope.currentCart.oldTotalPrice = $rootScope.currentCart.totalPrice;
                $rootScope.currentCart.totalPrice = 0;
                $rootScope.currentCart.oldItemsInCart = $rootScope.currentCart.itemsInCart;

                // changeTotalPrice
                $rootScope.currentCart.itemsInCart = 0;

                $rootScope.currentCart.selectItems.forEach(function (element, index) {
                    $rootScope.currentCart.totalPrice
                        =
                        $rootScope.currentCart.totalPrice
                        +
                        element.equipmentSum;
                    $rootScope.currentCart.itemsInCart = $rootScope.currentCart.itemsInCart + element.equipmentAmount;
                }); // changeTotalPrice

                if ( $rootScope.currentCart.totalPrice >= CART_MAX_PRICE ) {
                    $rootScope.currentCart.selectItems[_index].equipmentSum = $rootScope.currentCart.selectItems[_index].oldEquipmentSum;
                    $rootScope.currentCart.selectItems[_index].equipmentAmount = $rootScope.currentCart.selectItems[_index].oldEquipmentAmount;
                    $rootScope.currentCart.totalPrice = $rootScope.currentCart.oldTotalPrice;
                    $rootScope.currentCart.itemsInCart = $rootScope.currentCart.oldItemsInCart;
                    alert('The product\'s price goes over the limit for payment PayPal. Please, separate your order into parts');
                    return false;
                } else {
                    $rootScope.currentCart.selectItems[_index].oldEquipmentAmount = $rootScope.currentCart.selectItems[_index].equipmentAmount;
                    $rootScope.maxItemsInCart = $rootScope.currentCart.itemsInCart;
                    if ( $rootScope.maxItemsInCart > CART_MAX_ITEMS ) {
                        $rootScope.maxItemsInCart = CART_MAX_ITEMS;
                        $rootScope.currentCart.itemsInCart = CART_MAX_ITEMS;
                    }
                    } // ограничение суммы для транзакции по палке

            })( _index ); // changeEquipmentDataInTheCart

            $log.debug('$rootScope.currentCart =', $rootScope.currentCart );
            $log.debug('количество товаров в корзине  =', $rootScope.currentCart.itemsInCart );

        }; // changeEquipmentAmountInSelect

        $scope.cartProceed = function () {

            $scope.isSubmitBtnDisablet = true;

            if ( $rootScope.currentCart.itemsInCart === 0 ) {
                $log.debug('Для оплаты необходимо ввести данные пользователя!');
                $scope.isNotItemsInCartError = true;
                $scope.isSubmitBtnDisablet = false;
                return false;
            } else {
                $scope.isNotItemsInCartError = false;
            } // проверка на отсутсвие товаров в корзине внутри самой корзины!

            if (
                 !$scope.userdata.name
                  ||
                 !$scope.userdata.phone
                  ||
                 !$scope.userdata.email
                  ||
                 !$scope.userdata.address
                  ||
                 !$scope.userdata.town
                  ||
                 !$scope.userdata.country
                  ||
                 !$scope.userdata.zipcode
            ) {
                $log.debug('Для оплаты необходимо ввести данные пользователя!');
                $scope.isValidateError2 = true;
                $scope.isSubmitBtnDisablet = false;
                return false;
            } else {

                $scope.isValidateError2 = false;

                if ( !$scope.userdata.company ) {
                    $scope.userdata.company = '';
                }

                // getDataFromEquipments
                $rootScope.currentCart.selectItems.forEach(function (element, index) {
                    vm.orderedEquipment.push({
                        'equipmentID'     : element.equipmentID,
                        'equipmentAmount' : element.equipmentAmount
                    });
                }); // getDataFromEquipments

                var products = vm.orderedEquipment;
                var userData =  $scope.userdata ;

                vm.data = {
                    'products' : products,
                    'userData' : userData
                };

                $log.debug('vm.data =', vm.data );

                vm.orderedEquipment = [];

                // отправка данных корзины на back-end
                $http({method: 'POST', data: vm.data, url: CART_POST_URL}).
                    success(function(data, status, headers, config) {

                        if ( typeof(data.errors) === 'undefined' ) {
                            //return link to paypal
                            $log.debug('RETURN FROM POST Data is =', data);
                            jQuery('body').append(data);
                            jQuery('#paypal_form_cont > form').submit();
                        } else {

                            // todo сделать проверку вот так как написано ниже
                            //[0:17:45] Nikolas Kost: errors = [12,22,34]
                            //if( errors.indexOf(34) >= 0 ) ……
                            //[0:18:09] Nikolas Kost: и числа заменить на константы

                            //return some errors from back-end
                            for (var i = 0; i < data.errors.length; i++) {
                                $log.debug('data.errors is =', data.errors[i]);
                                $scope.errorCode = 20;

                                if ( data.errors[i] === 10 || data.errors[i] === 11 || data.errors[i] === 11 ) {
                                    alert('No items in the cart');
                                    vm.data = {};
                                    $modalInstance.dismiss('cancel');
                                } else if ( data.errors[i] === 20 ) {
                                    alert('No user data');
                                    $scope.errorCodeName = true;
                                    $scope.errorCodePhone = true;
                                    $scope.errorCodeEmail = true;
                                    $scope.errorCodeAddress = true;
                                    $scope.errorCodeTown = true;
                                    $scope.errorCodeCountry = true;
                                    $scope.errorCodeZIP = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 21 ) {
                                    $scope.errorCodeName = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 22 ) {
                                    $scope.errorCodePhone = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 23 ) {
                                    $scope.errorCodeEmail = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 24 ) {
                                    $scope.errorCodeAddress = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 25 ) {
                                    $scope.errorCodeTown = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 26 ) {
                                    $scope.errorCodeCountry = true;
                                    $scope.isValidateError = true;
                                } else if ( data.errors[i] === 27 ) {
                                    $scope.errorCodeZIP = true;
                                    $scope.isValidateError = true;
                                }
                            }
                        }

                        $scope.isSubmitBtnDisablet = false;
                    }).
                    error(function(data, status, headers, config) {
                        $log.debug('STATUS. Error when i post cart-data =', status);
                        alert("We're sorry, a server error occurred. Please try your request later");
                        $scope.isSubmitBtnDisablet = false;
                }); // $http

            }

            $scope.errorCodeName = false;
            $scope.errorCodePhone = false;
            $scope.errorCodeEmail = false;
            $scope.errorCodeAddress = false;
            $scope.errorCodeTown = false;
            $scope.errorCodeCountry = false;
            $scope.errorCodeZIP = false;
            $scope.isValidateError = false;

        }; //~~~ $scope.cartProceed ~~~


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalCartCtrl ~~~


    modalAboutManufacturerCtrl.$inject = [
                                            '$scope',
                                            '$modal',
                                            '$log',
                                            '$rootScope',
                                            '$modalInstance',
                                            'modalCaption',
                                            '$location'
    ];


    function modalAboutManufacturerCtrl (
                                            $scope,
                                            $modal,
                                            $log,
                                            $rootScope,
                                            $modalInstance,
                                            modalCaption,
                                            $location
    ) {

        var vm = this;

        $scope.modalCaption = modalCaption;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalSingUpCtrl ~~~

})();



/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.news')
        .controller('ModalNewsCtrl', modalNewsCtrl)
    ;

    modalNewsCtrl.$inject = [
                                '$scope',
                                'ARRAY_OF_LIST_OPTIONS_FOR_CART',
                                '$modal',
                                '$log',
                                '$rootScope',
                                '$modalInstance',
                                'modalCaption',
                                'CART_POST_URL',
                                '$http',
                                'CART_MAX_PRICE',
                                'CART_MAX_ITEMS',
                                '$location'
    ];

    function modalNewsCtrl (
                             $scope,
                             ARRAY_OF_LIST_OPTIONS_FOR_CART,
                             $modal,
                             $log,
                             $rootScope,
                             $modalInstance,
                             modalCaption,
                             CART_POST_URL,
                             $http,
                             CART_MAX_PRICE,
                             CART_MAX_ITEMS,
                             $location
    ) {

        var vm = this;

        $log.debug( 'news modalCaption =', modalCaption );

        $scope.modalCaption = modalCaption;

        $scope.newsOk = function () {
        }; //~~~ $scope.newsOk ~~~

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalCartCtrl ~~~

})();



/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.profile')
        .controller('ProfileCtrl', profileCtrl)
        .controller('ProfileAccountCtrl', profileAccountCtrl)
        .controller('ProfilePasswordCtrl', profilePasswordCtrl)
        .controller('ProfileAchivmentsCtrl', profileAchivmentsCtrl)
        .controller('ProfileDesignCtrl', profileDesignCtrl);


    profileCtrl.$inject = [ '$scope', '$rootScope',
                            'AuthfireFactory' ];
    profileAccountCtrl.$inject = [ '$scope', '$rootScope',
                                   'ngfitfire', 'AuthfireFactory' ];
    profilePasswordCtrl.$inject = ['$scope', '$rootScope'];
    profileAchivmentsCtrl.$inject = ['$scope', '$rootScope'];
    profileDesignCtrl.$inject = ['$scope', '$rootScope'];

    function profileCtrl( $scope, $rootScope,
                          AuthfireFactory ) {

        var vm = this;

        $rootScope.curPath = 'profile';
        $rootScope.publicPart = false;
        $rootScope.publicPartWorkout = false;

        vm.logout = function (  ) {
            console.log( 'Пользователь должен выйти из системы.' );
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

    } // ~~~ profileCtrl ~~~

    function profileAccountCtrl( $scope, $rootScope,
                                 ngfitfire, AuthfireFactory ) {

        var vm = this;
        vm.userProfileObj = $rootScope.currentUser;

        console.log( '$rootScope.currentUser', $rootScope.currentUser );

        vm.accountProfileEdit = function () {
            for (var i in vm.userProfileObj) {
                if ( typeof( vm.userProfileObj[i] ) === 'undefined'  ) {
                    vm.userProfileObj[i] = '';
                }
            }
//            console.log( '$rootScope.currentUser', vm.userProfileObj );
            ngfitfire.accountProfileEdit( vm.userProfileObj.id, vm.userProfileObj );
        }; // ~~~ vm.accountProfileEdit ~~~


    } // ~~~ profileAccountCtrl ~~~

    function profilePasswordCtrl($scope, $rootScope) {

    } // ~~~ profilePasswordCtrl ~~~
    function profileAchivmentsCtrl($scope, $rootScope) {

    } // ~~~ profileAchivmentsCtrl ~~~
    function profileDesignCtrl($scope, $rootScope) {

    } // ~~~ profileDesignCtrl ~~~

})();

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


