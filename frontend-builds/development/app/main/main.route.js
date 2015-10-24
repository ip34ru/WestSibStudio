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
                        //static/dist/app/components/header/header.html
                        //controller: 'HeaderMainPageCtrl',
                        //controllerAs: 'vm'
                    },
                    'footerMainPage' : {
                        templateUrl: 'static/dist/app/components/footer/footer.html',
                        //static/dist/app/components/header/header.html
                        //controller: 'HeaderMainPageCtrl',
                        //controllerAs: 'vm'
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
                    'mainContent' : {
                        //templateUrl: 'app/main/main.html',
                        //controller: 'MainCtrl',
                        //controllerAs: 'vm'
                    }
                }

            }) // main
        ;
    }

})();
