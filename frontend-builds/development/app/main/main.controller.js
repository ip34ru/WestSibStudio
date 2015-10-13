/**
 * Created by taksenov@gmail.com on 24.06.2015.
 */

;(function() {
    'use strict';

    angular
        .module('ngWestSibStudio.main')
        .controller('MainCtrl', mainCtrl)
        .controller('OpenModalAboutManufacturerCtrl', openModalAboutManufacturerCtrl)
        .controller('FormPostAddCtrl', formPostAddCtrl)
        .controller('AllPostsMainPageCtrl', allPostsMainPageCtrl)
        .controller('AllBrandsAndProductsMainPageCtrl', allBrandsAndProductsMainPageCtrl)
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

    allBrandsAndProductsMainPageCtrl.$inject = [
                                                '$scope',
                                                '$rootScope',
                                                '$log',
                                                '$q',
                                                '$http'
    ];

    function allBrandsAndProductsMainPageCtrl(
                                                $scope,
                                                $rootScope,
                                                $log,
                                                $q,
                                                $http
    ) {

        var vm = this;

        $http({method: 'GET', url: 'http://localhost:8000/ajax/brands/'}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                vm.dataJSON = data;
                $log.debug('Data is', data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $log.debug('Error when i retrieve main data from backend!', status);
        });

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


