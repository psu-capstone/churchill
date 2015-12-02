var app = angular.module("democracy-lab-app", ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'main-controller'
        })
        .when('/home', {
            templateUrl : 'pages/login.html',
            controller  : 'main-controller'
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

/**
 * Main login controller, display a login form and send valid credentials to DB
 */
app.controller("main-controller", ['$location', function($location) {
    var self = this;
    self.image = "/images/demoLab_logo.png";
    self.title = "Login or Create Account";
    self.authorized = false;
    self.username= "";
    self.password= "";
    self.authenticate = function() {
        console.log(self.username + " " + self.password);
        // Check for validity later (stretch goal)
        if (self.username == "admin" && self.password == "1234") {
            self.authorized = true;
            console.log("Login success");
            $location.path('/issue');
        } else {
            self.authorized = false;
            console.log("Login unsuccessful");
        }
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

app.directive("bars", function () {
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