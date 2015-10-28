/**
 * Created by taksenov@gmail.com on 01.07.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.modal-windows')
        .controller('ModalCartCtrl', modalCartCtrl)
        .controller('ModalAboutManufacturerCtrl', modalAboutManufacturerCtrl)
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


    modalCartCtrl.$inject = [
                                '$scope',
                                'ARRAY_OF_LIST_OPTIONS_FOR_CART',
                                '$modal',
                                '$log',
                                '$rootScope',
                                '$modalInstance',
                                'modalCaption',
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

                $rootScope.currentCart.selectItems[_index].equipmentSum
                    =
                    $rootScope.currentCart.selectItems[_index].equipmentAmount
                    *
                    $rootScope.currentCart.selectItems[_index].equipmentPrice;

                $rootScope.currentCart.totalPrice = 0;

                // changeTotalPrice
                $rootScope.currentCart.selectItems.forEach(function (element, index) {
                        $rootScope.currentCart.totalPrice
                            =
                            $rootScope.currentCart.totalPrice
                            +
                            element.equipmentSum;
                }); // changeTotalPrice

            })( _index ); // changeEquipmentDataInTheCart

            $log.debug('$rootScope.currentCart =', $rootScope.currentCart );
            $log.debug('изменение количество товара =', $rootScope.currentCart.selectItems[_index] );

        }; // changeEquipmentAmountInSelect


        $scope.ok = function () {

            $scope.isSubmitBtnDisablet = true;

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
                $log.debug('Для оплаты необходимо ввести данные пользователя');
                $scope.isSubmitBtnDisablet = false;
            } else {

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

                var products = [
                    vm.orderedEquipment = extend(
                        {},
                        vm.orderedEquipment
                    )
                ];
                var userData =  $scope.userdata ;

                vm.data = {
                    'products' : products,
                    'userData' : userData
                };

                $log.debug('vm.data =', vm.data );

                vm.orderedEquipment = [];

                // todo сюда фигачить отправку на сервак и обработку аполученного ответа
                //
                //

                // todo раздисейбелить при получкении ссылки на палку
                $scope.isSubmitBtnDisablet = false;

            }

        }; //~~~ $scope.ok ~~~

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalCartCtrl ~~~


    modalAboutManufacturerCtrl.$inject = [
        '$scope', '$modal', '$log',
        '$rootScope', '$modalInstance', 'modalCaption',
        'AuthfireFactory', '$location'
    ];


    function modalAboutManufacturerCtrl ( $scope, $modal,
                               $log, $rootScope,
                               $modalInstance, modalCaption,
                               AuthfireFactory, $location ) {

        var vm = this;

        $scope.modalCaption = modalCaption;

        $scope.ok = function () {

        }; //~~~ $scope.ok ~~~

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }; //~~~ $scope.cancel ~~~

    } // ~~~ modalSingUpCtrl ~~~

})();


