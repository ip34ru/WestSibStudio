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

                // changeTotalPrice

                $rootScope.currentCart.itemsInCart = 0;

                $rootScope.currentCart.selectItems.forEach(function (element, index) {
                    $rootScope.currentCart.totalPrice
                        =
                        $rootScope.currentCart.totalPrice
                        +
                        element.equipmentSum;
                    $rootScope.currentCart.itemsInCart = $rootScope.currentCart.itemsInCart + element.equipmentAmount
                }); // changeTotalPrice

                if ( $rootScope.currentCart.totalPrice >= CART_MAX_PRICE ) {
                    $rootScope.currentCart.selectItems[_index].equipmentSum = $rootScope.currentCart.selectItems[_index].oldEquipmentSum;
                    $rootScope.currentCart.selectItems[_index].equipmentAmount = $rootScope.currentCart.selectItems[_index].oldEquipmentAmount;
                    $rootScope.currentCart.totalPrice = $rootScope.currentCart.oldTotalPrice;
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


