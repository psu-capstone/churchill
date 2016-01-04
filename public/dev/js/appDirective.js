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
                        ['strongly disagree', 30, 200, 200, 400, 150, 250],
                        ['disagree', 130, 100, 100, 200, 150, 50],
                        ['no opinion', 230, 200, 200, 300, 250, 250],
                        ['agree', 75, 100, 450, 0, 300, 200],
                        ['strongly agree', 250, 300, 20, 85, 430, 500],
                        ['you', 75, 50, 320, 100, 750, 175]

                    ],
                    type: 'bar',
                    types: {
                        you: 'scatter'
                    },
                    order: null,
                    colors: {
                      'strongly disagree': '#920000',
                      disagree: '#ec1b1b',
                      'no opinion': '#dbd9d9' ,
                      agree: '#0087d8',
                      'strongly agree': '095983',
                      you: '#000000'

                    },
                    groups: [
                        ['strongly disagree', 'disagree', 'no opinion', 'agree', 'strongly agree', 'you']
                    ]
                },
                axis: {
                    rotated: true,
                    y:{
                        max: 1300,
                        min: -200
                    },
                },
                grid: {
                    x2: {
                        show: true
                    }
                }
            });

            /*
                Animation stuff, may or may not be useful
             */
            //setTimeout(function () {
            //    chart.load({
            //        columns: [['fly_in', 50, 20, 400, 30, 600, 50]]
            //    });
            //}, 1500);
            //
            //setTimeout(function () {
            //    chart.groups([['strongly disagree', 'disagree', 'no opinion', 'agree', 'strongly agree', 'you', 'fly_in']])
            //}, 2000);
        }
    };
});