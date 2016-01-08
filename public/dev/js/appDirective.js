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
                    x:'x',
                    columns: scope.exp.data,
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
                      'strongly agree': '#095983',
                      you: '#000000'
                    },
                    groups: [
                        ['strongly disagree', 'disagree', 'no opinion', 'agree', 'strongly agree', 'you']
                    ]
                },
                point: {
                    r: 5
                },
                axis: {
                    rotated: true,
                    y:{
                        max: 1300
                    },
                    x:{
                        type: 'categorized'
                    }
                },
                onrendered: function () {
                    d3.selectAll("circle")
                        .style("opacity", 1)
                        .style("stroke", "white");
                }
            });
        }
    };

});