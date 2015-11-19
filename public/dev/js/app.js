var app = angular.module("democracy-lab-app", ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/default.html',
            controller  : 'main-controller'
        })
        .when('/home', {
            templateUrl : 'pages/default.html',
            controller  : 'main-controller'
        })
        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'login-controller'
        })
        .when('/issue', {
            templateUrl : 'pages/default.html',
            controller  : 'issue-controller'
        })
        .when('/explore', {
            templateUrl : 'pages/d3graph.html',
            controller  : 'explore-controller'
        });
});

app.controller("main-controller", function($scope) {
    $scope.title = "Home";
});

app.controller("login-controller", function($scope) {
    $scope.title = "Login or Create Account";
    $scope.authorized = false;
    $scope.username= "admin";
    $scope.password= "1234";
    $scope.authenticate = function() {
        console.log($scope.username + " " + $scope.password);
        if ($scope.username == "admin") {
            $scope.authorized = true;
        }
    };
    $scope.go = function(path) {
        console.log("frame issue");
        $location.path(path);
    };
});

app.controller("issue-controller", function($scope) {
    $scope.title = "Weigh in on an issue";
});

app.controller("explore-controller", function($scope) {
    $scope.title = "Explore the issues";
});
