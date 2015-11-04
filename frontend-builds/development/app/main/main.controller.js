/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module(
            'ngWestSibStudio.main'
        //,
        //    [
        //        'ngAnimate'
        //    ]
        )
        .controller('MainCtrl', mainCtrl)
        .controller('OpenModalAboutManufacturerCtrl', openModalAboutManufacturerCtrl)
        .controller('FormPostAddCtrl', formPostAddCtrl)
        .controller('AllPostsMainPageCtrl', allPostsMainPageCtrl)
        .controller('AllBrandsAndProductsMainPageCtrl', allBrandsAndProductsMainPageCtrl)
        .controller('HeaderMainPageCtrl', headerMainPageCtrl)
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

    // контроллердля запуска модалки корзины и генерации ее же
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
                                      _equipmentName
                                    ) {

            if ( $rootScope.maxItemsInCart >= CART_MAX_ITEMS ) {
                return false;
            } // ограничение товаров в корзине

            var isCurrentItem = false,
                isNewItem = false;

            _equipmentPrice = _equipmentPrice.replace(".00" , "");
            _equipmentPrice = parseInt(_equipmentPrice);

            vm.cartTotalPrice = vm.cartTotalPrice + _equipmentPrice;
            $log.debug('Общая цена товаров в корзине = ', vm.cartTotalPrice);

            if ( vm.cartTotalPrice >= CART_MAX_PRICE ) {
                vm.cartTotalPrice = vm.cartTotalPrice - _equipmentPrice;

                //todo сюда перевод фразы о превышении лимита по Paypal
                alert('Стоимость выбранного количества товаров превышает лимит для оплаты PayPal. разделите ваш заказ на две или более частей');

                return false;
            } // ограничение суммы для транзакции по палке

            function pushDataInTheCart (_a, _b, _c, _d, _e) {

                vm.currentCart.selectItems.push({
                    'equipmentID'     : _a,
                    'equipmentName'   : _b,
                    'equipmentPrice'  : _c,
                    'equipmentAmount' : 1,
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


    allPostsMainPageCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    'AuthfireFactory', 'FIREBASE_URL',
                                    '$log', '$firebaseObject',
                                    '$firebaseArray', '$q',
                                    'toastr' ];

    function allPostsMainPageCtrl( $scope, $rootScope,
                           ngfitfire, $modal,
                           AuthfireFactory, FIREBASE_URL,
                           $log, $firebaseObject,
                           $firebaseArray, $q,
                           toastr ) {

        var vm = this;

        $rootScope.allPosts = {};
        // for easy access
        $rootScope.allPostsData = $rootScope.allPosts;
        // boolean flag to indicate api call success
        $rootScope.allPostsData.dataLoaded = false;

        // запрос всех постов для главной страницы
        //todo сделать errorCallBack
        $q.all( [
            ngfitfire.getPosts2(),
            ngfitfire.getAvatars2() ] )
        .then(
            function (results) {

                $log.debug( 'comments = results[0] =', results[0] );
                $log.debug( 'avatars = results[1] =', results[1] );


                $rootScope.allPosts = ngfitfire.processingMainDataOfQALL( results );
                $rootScope.allPostsData.dataLoaded = true;

                $log.debug( '$rootScope.allPosts =', $rootScope.allPosts );
                //$log.debug( 'данные нового добавленного поста typeof(results) =', typeof(results) );
                //$log.debug( 'данные нового добавленного поста results =', results );
                //$log.debug( 'vm.allPosts =', vm.allPosts );
                //$log.debug( 'results[0] =', results[0] );
                //$log.debug( '$rootScope.currentUser =', $rootScope.currentUser );
            }
        ); // $q.all

        vm.commentEdit = function ( _comment, _post ) {
            $log.debug( 'Редактировать, выбранный коммент _comment =', _comment );
            $log.debug( 'Редактировать, post =', _post );

            ////e.preventDefault();
            vm.modalCaption = 'Редактировать комментарий';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: '/app/components/edit-modal/comment-edit-modal.html',
                    controller: 'ModalCommentEditCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        },
                        commentData: function () {
                            return _comment;
                        },
                        postData: function () {
                            return _post;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~

        }; // ~~~ vm.commentEdit ~~~

        vm.postEdit = function ( _elementIndex, _post ) {
            $log.debug( 'Редактировать, выбранный пост имеет индекс =', _elementIndex );
            $log.debug( 'Редактировать, _post =', _post );

            //e.preventDefault();
            vm.modalCaption = 'Редактировать пост';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: '/app/components/edit-modal/post-edit-modal.html',
                    controller: 'ModalPostEditCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        },
                        postData: function () {
                            return _post;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~

        }; // ~~~ vm.postEdit ~~~

        vm.postDelete = function ( _element, _postID ) {
            $log.debug( 'удалить, выбранный пост имеет индекс =', _element );

            ngfitfire.postDelete( _postID, _element );

        }; // ~~~ vm.postDelete ~~~

        // показать форму
        vm.addNewCommentFunc = function ( _post ) {
            $log.debug('Открыта форма добавления нового комментария');
            $scope.addNewCommentSelected = _post;
            vm.newComment = null;
        }; // vm.addNewCommentFunc ~~~ показать форму

        // скрыть форму
        vm.cancelCommentFunc = function () {
            $log.debug('Закрыта форма добавления нового комментария');
            $scope.addNewCommentSelected = false;
            vm.newComment = null;
        }; // vm.cancelCommentFunc ~~~ скрыть форму

        // условие для того чтобы открывалась форма добавления комментария, только в конкретном посте
        vm.isSelectedFormAddNewComment = function ( _post ) {
            return $scope.addNewCommentSelected === _post;
        }; // ~~~ vm.isSelectedFormAddNewComment ~~~

        // кнопка submit добавления нового поста
        vm.addNewComment = function ( _commentText, _postID ) {
            if ( typeof(_commentText) === 'undefined' ) {
                $log.debug( 'вы пытаетесь добавить пустой комментарий! это невозможно');
                toastr.warning('Вы пытаетесь добавить пустой комментарий, это невозможно', 'Внимание!' );
                return false;
            } else {
                $log.debug( 'вы пытаетесь добавть новый комментарий с текстом =', _commentText, 'в пост-айди', _postID );
                $log.debug(
                    'инфа о пользователе =',
                    $rootScope.currentUser.id,
                    $rootScope.currentUser.name
                );

                vm.submittedNewComment = {
                    'commentText': _commentText
                };
                vm.submittedNewComment = extend( {},
                                     vm.submittedNewComment,
                                     {
                                        'dateTime': Math.round(new Date().getTime() / 1000),   //10
                                        'ownerId': $rootScope.currentUser.id,
                                        'ownerName': $rootScope.currentUser.name
                                     }
                );

                ngfitfire
                    .newCommentAdd(
                        vm.submittedNewComment,
                        _postID,
                        function () {
                            vm.submittedNewComment = null;
                            $scope.addNewCommentSelected = false;
                            vm.newComment = null;
                            //vm.isShowExistedComments( _postID );
                        }
                );
            }
        }; // ~~~ vm.addNewComment ~~~

        // показать комменты поста
        vm.showExistedComments = function ( _post ) {
            $scope.showCommentsInPost = _post;
        }; // vm.showExistedComments ~~~ показать комменты поста

        // скрыть комменты поста
        vm.hideExistedComments = function () {
            $scope.showCommentsInPost = false;
        }; // vm.hideExistedComments ~~~ скрыть комменты поста

        // условие для того чтобы открывалась форма добавления комментария, только в конкретном посте
        vm.isShowExistedComments = function ( _post ) {
            return $scope.showCommentsInPost === _post;
        }; // ~~~ vm.isSelectedFormAddNewComment ~~~

        // удаление комментария
        vm.deleteThisComment = function ( _comment, _post ) {
            ngfitfire.commentDelete( _post.postID, _comment.commentID );
        }; // ~~~ vm.deleteThisComment ~~~


    } // ~~~ allPostsMainPageCtrl ~~~

    formPostAddCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    'AuthfireFactory', 'FIREBASE_URL',
                                    '$log', 'toastr' ];

    function formPostAddCtrl( $scope, $rootScope,
                           ngfitfire, $modal,
                           AuthfireFactory, FIREBASE_URL,
                           $log, toastr ) {
        var vm = this;

        vm.addNewPost = true;

        vm.addNewPostFunc = function () {
            $log.debug('Открыта форма добавления нового поста');
            vm.newpost = null;
            vm.addNewPost = false;
        }; // vm.addNewPostFunc ~~~ показать форму

        vm.cancelPostFunc = function () {
            $log.debug('Закрыта форма добавления нового поста');
            vm.addNewPost = true;
        }; // vm.cancelPostFunc ~~~ скрыть форму

        vm.submitNewPost = function ( _postCaption, _postText ) {

            $log.debug( 'vm.newpost', vm.newpost );

            if ( typeof( _postCaption ) === 'undefined' || typeof( _postText ) === 'undefined' || vm.newpost === null ) {
                $log.debug( 'вы пытаетесь добавить пустой пост! это невозможно');
                toastr.warning('Вы пытаетесь добавить пустой пост, это невозможно', 'Внимание!' );
                return false;
            } else {
                vm.newpost = extend( {},
                                     vm.newpost,
                                     {
                                        'dateTime': Math.round(new Date().getTime() / 1000),   //10
                                        'ownerId': $rootScope.currentUser.id,
                                        'ownerName': $rootScope.currentUser.name
                                     }
                );

                $log.debug( '$rootScope.currentUser =', $rootScope.currentUser );
                $log.debug('Добавлен новый пост', vm.newpost);
                ngfitfire
                    .newPostAdd(
                        vm.newpost,
                        function () {
                            vm.newpost = null;
                            vm.addNewPost = true;
                        }
                );
            }
        }; // vm.submitNewPost ~~~ добавить новый пост

    } // ~~~ formPostAdd ~~~


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

        //vm.openModalSingUp = function ( e ) {
        //    e.preventDefault();
        //    vm.modalCaption = 'Регистрация';
        //    $modal.open(
        //        {
        //            animation: vm.animationsEnabled,
        //            templateUrl: '/app/components/auth-modal/sign-up-modal.html',
        //            controller: 'ModalSingUpCtrl',
        //            resolve: {
        //                modalCaption: function () {
        //                    return vm.modalCaption;
        //                }
        //            }
        //        }
        //    ); // ~~~ $modal.open ~~~
        //}; // ~~~ openModalSingUp ~~~
        //
        //
        //vm.logout = function (  ) {
        //    AuthfireFactory.logout();
        //}; // ~~~ vm.logout ~~~

    } // ~~~ openModalAboutManufacturerCtrl ~~~

})();


