'use strict';

angular.module('repository', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/repositories', {
            templateUrl: 'app/repositories/repositories.html',
            controller: 'RepositoriesCtrl'
        });
    }])
    .controller('RepositoriesCtrl', ['$rootScope', '$scope', '$modal', '$location', '$routeParams', 'Helpers', 'Docker', 'Registry', function ($rootScope, $scope, $modal, $location, $routeParams, Helpers, Docker, Registry) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.showRepositoryLogin = function (size) {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'app/repositoryLogin/repositoryLogin.html',
                    controller: 'RepositoryLoginCtrl',
                    //size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    // dismiss
                });
            };

            $scope.searchImageName = '';
            $scope.repositorySearching = false;
            $scope.repositorySearchingError = false;
            $scope.selectAllImagesFlag = false;
            $scope.searchImage = function () {
                $scope.repositorySearching = true;
                $scope.repositorySearchingError = false;
                $scope.searchText = $scope.searchImageName;
                var searchResults = Docker.images().search({term: $scope.searchText}, function () {
                    $scope.repositorySearching = false;
                    $scope.searchResults = searchResults;
                    searchResults.forEach(function (searchResult) {
                        searchResult.selected = false;
                        searchResult.tagsLoaded = false;
                        searchResult.selectedTag = '';
                        var tags = Registry.tags().get({imageName: searchResult.name}, function () {
                            searchResult.tags = tags;
                            searchResult.tagsLoaded = true;
                            // trying to find latest...
                            tags.forEach(function (tag) {
                                if (tag.name == 'latest') {
                                    searchResult.selectedTag = tag.name;
                                }
                            });
                            // default tag
                            if (searchResult.selectedTag.length == 0) {
                                searchResult.selectedTag = tags[0].name;
                            }
                        });

                    });

                }, function (error) {
                    $scope.repositorySearching = false;
                    $scope.repositorySearchingError = true;
                    $scope.error = error;
                });


            };
            $scope.downloadImage = function (searchResult) {
                var imageName = searchResult.name;
                var imageTag = searchResult.selectedTag;
                toastr["info"]('Pulling image ' + imageName + ':' + imageTag, 'Check the progress on tasks');
                oboe({
                    url: $rootScope.hostUrl + '/images/create?fromImage=' + imageName + '&tag=' + imageTag,
                    method: 'POST'
                })
                    .node('*', function (item) {


                        if (typeof item == "object" && !Helpers.isEmpty(item) && !Helpers.isEmpty(item.status)) {

                            var tasks = $rootScope.tasks;
                            var pos = null;
                            $rootScope.taskInProgress = false;
                            tasks.forEach(function (task, index) {
                                if (task.id == item.id) {
                                    pos = index;
                                }
                                if (!task.finished) {
                                    $rootScope.taskInProgress = true;
                                }
                            });
                            //
                            if (pos == null && !Helpers.isEmpty(item.id)) {
                                var newTask = {};
                                newTask.id = item.id;
                                newTask.finished = false;
                                newTask.start = null;
                                //
                                updateTaskStatus(newTask, item);
                                //
                                tasks.push(newTask);
                            } else {
                                var newTask = tasks[pos];
                                updateTaskStatus(newTask, item);
                                tasks[pos] = newTask;
                            }
                            $rootScope.$apply(function () {
                                $rootScope.tasks = tasks;
                            });
                        }
                    })
                    .done(function (things) {
                        console.log('there are', things.item.length, 'things to read');
                    });
            };

            $scope.downloadSelectedImages = function () {
                var searchResults = $scope.searchResults;
                searchResults.forEach(function (searchResult) {
                    if (searchResult.selected) {
                        if (searchResult.selectedTag.length > 0) {
                            $scope.downloadImage(searchResult);
                        } else {
                            toastr["warning"]("Can't pull image " + searchResult.name, "No tag selected!");
                        }
                    }
                });
            };

            $scope.switchSelectAllImagesFlag = function () {
                $scope.selectAllImagesFlag = !$scope.selectAllImagesFlag;
                var searchResults = $scope.searchResults;
                searchResults.forEach(function (searchResult) {
                    searchResult.selected = $scope.selectAllImagesFlag;
                });
                $scope.searchResults = searchResults;
            };

            $scope.selectImageFlag = function (image) {
                image.selected = !image.selected;
                $scope.selectAllImagesFlag = false;
            };

        }

        function updateTaskStatus(newTask, item) {
            newTask.status = item.status;
            if (item.status == 'Download complete' || item.status == 'Pull complete' || item.status == 'Already exists') {
                newTask.finished = true;
                newTask.percent = 100;
            } else {
                if (item.progressDetail.total == -1) {
                    newTask.progress = item.progressDetail.current;
                    newTask.total = 0;
                    newTask.start = task.progressDetail.start;
                } else {
                    newTask.progress = item.progressDetail.current;
                    newTask.total = item.progressDetail.total;
                    newTask.percent = 100 * newTask.progress / newTask.total;
                    newTask.start = null;
                }
            }

        }
    }
    ])
;

