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






