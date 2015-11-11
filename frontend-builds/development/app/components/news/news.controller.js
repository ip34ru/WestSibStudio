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


