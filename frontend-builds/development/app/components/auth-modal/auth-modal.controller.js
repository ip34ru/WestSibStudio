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


