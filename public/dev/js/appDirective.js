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
        template: '<div id="figure" style="margin-bottom: 50px;"></div>',
        link: function (scope, element, attrs) {
            var margin = JSON.parse(attrs.margin),
                width = 800 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom,
                border = 1,
                bordercolor = 'black';
            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .3);
            var x = d3.scale.linear()
                .rangeRound([0, width]);
            var color = d3.scale.ordinal()
                .range(["#ff0000", "#ffb3b3", "#ffffff", "#b3ffb3", "#66ff66"]);
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top");
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
            var svg = d3.select("#figure").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id", "d3-plot")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);
            d3.csv(attrs.source, function (error, data) {
                data.forEach(function (d) {
                    // calc percentages
                    d["Strongly disagree"] = +d[1] * 100 / d.N;
                    d["Disagree"] = +d[2] * 100 / d.N;
                    d["Neither agree nor disagree"] = +d[3] * 100 / d.N;
                    d["Agree"] = +d[4] * 100 / d.N;
                    d["Strongly agree"] = +d[5] * 100 / d.N;
                    var x0 = -1 * (d["Neither agree nor disagree"] / 2 + d["Disagree"] + d["Strongly disagree"]);
                    var idx = 0;
                    d.boxes = color.domain().map(function (name) {
                        return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]};
                    });
                });
                var min_val = d3.min(data, function (d) {
                    return d.boxes["0"].x0;
                });
                var max_val = d3.max(data, function (d) {
                    return d.boxes["4"].x1;
                });
                x.domain([min_val, max_val]).nice();
                y.domain(data.map(function (d) {
                    return d.Question;
                }));
                svg.append("g")
                    .attr("class", "x axis")
                    .call(xAxis);
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                var vakken = svg.selectAll(".question")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function (d) {
                        return "translate(0," + y(d.Question) + ")";
                    });
                var bars = vakken.selectAll("rect")
                    .data(function (d) {
                        return d.boxes;
                    })
                    .enter().append("g").attr("class", "subbar");
                bars.append("rect")
                    .attr("height", y.rangeBand())
                    .attr("x", function (d) {
                        return x(d.x0);
                    })
                    .attr("width", function (d) {
                        return x(d.x1) - x(d.x0);
                    })
                    .style("fill", function (d) {
                        return color(d.name);
                    })
                    .style("stroke", bordercolor)
                    .style("stroke-width", border);
                bars.append("text")
                    .attr("x", function (d) {
                        return x(d.x0);
                    })
                    .attr("y", y.rangeBand() / 2)
                    .attr("dy", "0.5em")
                    .attr("dx", "0.5em")
                    .style("font", "10px sans-serif")
                    .style("text-anchor", "begin")
                    .text(function (d) {
                        return d.n !== 0 && (d.x1 - d.x0) > 3 ? d.n : ""
                    });
                vakken.insert("rect", ":first-child")
                    .attr("height", y.rangeBand())
                    .attr("x", "1")
                    .attr("width", width)
                    .attr("fill-opacity", "0.5")
                    .style("fill", "#F5F5F5")
                    .attr("class", function (d, index) {
                        return index % 2 == 0 ? "even" : "uneven";
                    });
                svg.append("g")
                    .attr("class", "y axis")
                    .append("line")
                    .attr("x1", x(0))
                    .attr("x2", x(0))
                    .attr("y2", height);
                var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
                // this is not nice, we should calculate the bounding box and use that
                var legend_tabs = [0, 120, 200, 375, 450];
                var legend = startp.selectAll(".legend")
                    .data(color.domain().slice())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(" + legend_tabs[i] + ",-45)";
                    });
                legend.append("rect")
                    .attr("x", 0)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color)
                    .style("stroke", bordercolor)
                    .style("stroke-width", border);
                legend.append("text")
                    .attr("x", 22)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "begin")
                    .style("font", "10px sans-serif")
                    .text(function (d) {
                        return d;
                    });
                d3.selectAll(".axis path")
                    .style("fill", "none")
                    .style("stroke", "#000")
                    .style("shape-rendering", "crispEdges")
                d3.selectAll(".axis line")
                    .style("fill", "none")
                    .style("stroke", "#000")
                    .style("shape-rendering", "crispEdges")
                var movesize = width / 2 - startp.node().getBBox().width / 2;
                d3.selectAll(".legendbox").attr("transform", "translate(" + movesize + ",0)");
            });
        }
    };
});