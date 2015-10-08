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
                    'formPostAdd' : {
                        //templateUrl: 'app/components/post-form/post-form.html',
                        //controller: 'FormPostAddCtrl',
                        //controllerAs: 'vm'
                    },
                    'allPostsMainPage' : {
                        //templateUrl: 'app/components/all-posts/all-posts.html',
                        //controller: 'AllPostsMainPageCtrl',
                        //controllerAs: 'vm'
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
