angular.module('bag2.fineUploader', []).directive('fineUploader', function() {
    return {
        restrict: 'A',
        scope: {
            uploaded: '=',
            destination: '=',
            placeholder: '=',
            extensions: '='
        },
        link: function($scope, element, attributes, ngModel) {
            var uploader = new qq.FineUploader({
                element: element[0],
                request: {
                    endpoint: $scope.destination,
                },
                validation: {
                    allowedExtensions: $scope.extensions ? $scope.extensions.split(',') : ''
                },
                text: {
                    uploadButton: '<i class="icon-upload icon-white"></i>&nbsp;' + ($scope.placeholder || 'Upload files')
                },
                template: '<div class="qq-uploader">' + '<pre class="qq-upload-drop-area"><span>{dragZoneText}</span></pre>' + '<div class="qq-upload-button btn btn-info" style="width:auto;">{uploadButtonText}</div>' + '<span class="qq-drop-processing"><span>{dropProcessingText}</span></span>' + '<ul class="qq-upload-list" style="margin-top: 10px; text-align: center;"></ul>' + '</div>',
                classes: {
                    success: 'alert alert-success',
                    fail: 'alert alert-error'
                },
                callbacks: {
                    onComplete: function(id, fileName, responseJSON) {
                        if ($scope.uploaded) {
                            //add the new objects
                            $scope.uploaded.push(responseJSON);

                            //queue a digest.
                            $scope.$apply();
                        }
                    }
                }
            });
        }
    }
});