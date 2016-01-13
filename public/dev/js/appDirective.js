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
                },
                legend: {
                    item: {
                        onclick: function (id) { return;  }
                    }
                }
            });
        }
    };
});