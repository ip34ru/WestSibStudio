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





