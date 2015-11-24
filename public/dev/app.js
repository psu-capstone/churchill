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
            templateUrl : 'pages/issue.html',
            controller  : 'issue-controller'
        })
        .when('/explore', {
            templateUrl : 'pages/d3graph.html',
            controller  : 'explore-controller',
            directive   : 'bars'
        });
});

app.controller("main-controller", [function() {
    var self = this;
    self.title = "Home";
}]);

app.controller("login-controller", [function() {
    var self = this;
    self.title = "Login or Create Account";
    self.authorized = false;
    self.username= "admin";
    self.password= "1234";
    self.authenticate = function() {
        console.log(self.username + " " + self.password);
        if (self.username == "admin") {
            self.authorized = true;
        }
    };
    self.go = function(path) {
        console.log("frame issue");
        $location.path(path);
    };
}]);

app.controller("issue-controller", [function() {
    var self = this;
    self.title = "Weigh in on an issue";
}]);

app.controller("explore-controller", [function() {
    var self = this;
    self.title = "Explore the issues";
}]);

app.directive('bars', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        link: function (scope, element, attrs) {
            var data = attrs.data.split(','),
                chart = d3.select('#chart')
                    .append("div").attr("class", "chart")
                    .selectAll('div')
                    .data(data).enter()
                    .append("div")
                    .transition().ease("elastic")
                    .style("width", function(d) { return d + "%"; })
                    .text(function(d) { return d + "%"; });
        }
    };
});