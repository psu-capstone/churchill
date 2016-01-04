/**
 * Directive for handling new buttons added
 * TODO 1.) support to backend and saving
 * TODO 2.) Fix refreshing issue
 * 2.) can be fixed when we tie this to the backend since we will look for issues added by
 * the community and look to the database to populate the frontend issues
 */
app.directive("issuenew", function($compile) {
    var count = 0;  //in case we want to limit the amount of issues that can be added
    var link = function (scope) {
        scope.populateissue = function () {
            if (count >= 3) {
                console.log("limit reached");
            } else {
            angular.element(document.getElementById('space-for-issues'))
                .append($compile("<div class='issue row'><div class='issue'>" +
                "<button class='btn btn-primary btn-block'>{{issue.new_title}}</button>" +
                "</div><h5>{{issue.new_description}}</h5></div>")(scope));
                count++;
            }
        };
    };
    return {
        restrict: "E",
        link: link,
        template: "<button ng-click='populateissue()' type='button' class='btn btn-success'>Add New Issue</button>"
    }
});


/**
 * D3 directive that is embedded in explore-controller.
 */
app.directive("bars", function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        link: function (scope, element, attrs) {
            var chart = c3.generate({
                data: {
                    columns: [
                        ['data1', -30, 200, 200, 400, -150, 250],
                        ['data2', 130, 100, -100, 200, -150, 50],
                        ['data3', -230, 200, 200, -300, 250, 250],
                        ['dot', 50, 20, 400, -30, 600, 50]
                    ],
                    type: 'bar',
                    types: {
                        dot: 'scatter'
                    },
                    groups: [
                        ['data1', 'data2']
                    ]
                },
                grid: {
                    y: {
                        lines: [{value:0}]
                    },
                    y2: {
                        show: true
                    }
                }
            });
            setTimeout(function () {
                chart.groups([['data1', 'data2', 'data3']])
            }, 1000);

            setTimeout(function () {
                chart.load({
                    columns: [['data4', 100, -50, 150, 200, -300, -100]]
                });
            }, 1500);

            setTimeout(function () {
                chart.groups([['data1', 'data2', 'data3', 'data4']])
            }, 2000);
        }
    };
});