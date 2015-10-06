// author: taksenov@gmail.com

// initialize material design js
;$.material.init();

(function(){
    'use strict';

    $.material.init();

    // модуль и конфигурирование
    angular
        .module('ngNoReddit', [
            'firebase',
            'ngNoReddit.main',
            //'ngNoReddit.profile',
            'ngNoReddit.error404',
            'ngNoReddit.firebase.service',
            'ngNoReddit.auth-modal',
            'ngNoReddit.edit-modal',
            'authfire.factory',
            'ui.router',
            'ui.bootstrap',
            'angular-storage',
            'toastr'
        ])
        .constant('FIREBASE_URL', 'https://ngnoreddit2.firebaseio.com/')
        .config(ngGFConfig)
        .run(run);

    ngGFConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider'];

    function ngGFConfig($stateProvider, $urlRouterProvider, $locationProvider, $logProvider){
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $logProvider.debugEnabled( true );

        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(['$state', function ($state) { $state.go('error'); }]);
            return true;
        }); // ~~~ $urlRouterProvider ~~~

        $urlRouterProvider
            .when('', '/')
        ; // ~~~ $urlRouterProvider ~~~

    } // ~~~ ngGFConfig ~~~

    run.$inject = ['$rootScope', '$state', 'store'];

    function run($rootScope, $state, store) {
        $rootScope.currentUser  = store.get('currentUser');
    } // ~~~ run ~~~


})();


/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.error404', ['ui.router']);

})();



/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.main', [
            'ui.router',
            'ngNoReddit.auth-modal',
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
        .module('ngNoReddit.error404')
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
        .module('ngNoReddit.error404')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('error', {
                views : {
                    'navbarPublick' : {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/error/error.html',
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
        .module('ngNoReddit.main')
        .controller('MainCtrl', mainCtrl)
        .controller('OpenModalSingInCtrl', openModalSingInCtrl)
        .controller('FormPostAddCtrl', formPostAddCtrl)
        .controller('AllPostsMainPageCtrl', allPostsMainPageCtrl)
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

    openModalSingInCtrl.$inject = [ '$scope', '$rootScope',
                                    'ngfitfire', '$modal',
                                    'AuthfireFactory', 'FIREBASE_URL' ];

    function openModalSingInCtrl( $scope, $rootScope,
                                  ngfitfire, $modal,
                                  AuthfireFactory, FIREBASE_URL ) {

        var vm = this;

        vm.animationsEnabled = true;

        vm.openModalSingIn = function ( e ) {
            e.preventDefault();
            vm.modalCaption = 'Вход в личный кабинет';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: '/app/components/auth-modal/sign-in-modal.html',
                    controller: 'ModalSingInCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalSingIn ~~~

        vm.openModalSingUp = function ( e ) {
            e.preventDefault();
            vm.modalCaption = 'Регистрация';
            $modal.open(
                {
                    animation: vm.animationsEnabled,
                    templateUrl: '/app/components/auth-modal/sign-up-modal.html',
                    controller: 'ModalSingUpCtrl',
                    resolve: {
                        modalCaption: function () {
                            return vm.modalCaption;
                        }
                    }
                }
            ); // ~~~ $modal.open ~~~
        }; // ~~~ openModalSingUp ~~~


        vm.logout = function (  ) {
            AuthfireFactory.logout();
        }; // ~~~ vm.logout ~~~

    } // ~~~ openModalSingInCtrl ~~~

})();



/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngNoReddit.main')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                views : {
                    'navbarPublick' : {
                        templateUrl: 'app/components/navbar-public/navbar-public.html',
                        controller: 'OpenModalSingInCtrl',
                        controllerAs: 'vm'
                    },
                    'formPostAdd' : {
                        templateUrl: 'app/components/post-form/post-form.html',
                        controller: 'FormPostAddCtrl',
                        controllerAs: 'vm'
                    },
                    'allPostsMainPage' : {
                        templateUrl: 'app/components/all-posts/all-posts.html',
                        controller: 'AllPostsMainPageCtrl',
                        controllerAs: 'vm'
                    },
                    'mainContent' : {
                        templateUrl: 'app/main/main.html',
                        controller: 'MainCtrl',
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


