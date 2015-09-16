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


