var w = 500;
var h = 250;
var barPadding = 1;

/*
            var dataset = [ ];
            for (var i = 0; i < 25; i++) {
                var newNumber = Math.round(Math.random() * 20) + 5;
                dataset.push(newNumber);
            }
            
            
            d3.select("body").selectAll("div")
                .data(dataset)
                .enter()
                .append("div")
                .attr("class", "bar")
                .style("height", function(d) {
                    var barHeight = d * 5;
                    return barHeight + "px";
            });
            */
            
            /*
            var svg = d3.select("body").append("svg");
            
            svg.attr("width", w)
                .attr("height", h);
            
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                      return i * (w / dataset.length);
                })
                .attr("y", function(d) {
                    return h - (d* 4);
                })
                .attr("width", w / dataset.length - barPadding)
                .attr("height", function(d) {
                    return d * 4;
                })
                .attr("fill", function(d) {
                    return "rgb(0, 0, " + (d * 10) + ")";
            });
            
            svg.selectAll("text")
                .data(dataset)
                .enter()
                .append("text")
                .text(function(d) {
                    return d;
            })
                .attr("x", function(d, i) {
                    return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
            })
                .attr("y", function(d) {
                    return h - (d * 4) + 14;
            })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white")
                .attr("text-anchor", "middle");
            
            */
            
            /*
            var dataset2 = [ 5, 10, 15, 20, 25 ];
            
            var circles = svg.selectAll("circle")
                            .data(dataset2)
                            .enter()
                            .append("circle");
            
            
            circles.attr("cx", function(d, i) {
                        return (i * 50) + 25;
            })
                .attr("cy", h/2)
                .attr("r", function(d) {
                    return d;
            })
                .attr("fill", "yellow")
                .attr("stroke", "orange")
                .attr("stroke-width", function(d) {
                    return d/2;
            });
            */
            
            /*
            var dataset3 = [
                                [ 5,    20 ],
                                [ 480,  90 ],
                                [ 250,  50 ],
                                [ 100,  33 ],
                                [ 330,  95 ],
                                [ 410,  12 ],
                                [ 475,  44 ],
                                [ 25,   67 ],
                                [ 85,   21 ],
                                [ 220,  88 ],
                                [ 600, 150 ]
                ];
                */
            
            var dataset3 = [];
            var numDataPoints = 50;
            var xRange = Math.random() * 1000;
            var yRange = Math.random() * 1000;
            for (var i = 0; i < numDataPoints; i++) {
                var newNumber1 = Math.round(Math.random() * xRange);
                var newNumber2 = Math.round(Math.random() * yRange);
                dataset3.push([newNumber1, newNumber2]);
            }
            
            var svg = d3.select("body")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);
            var padding = 30;
            
            var xScale = d3.scale.linear()
                .domain([0, d3.max(dataset3, function(d) { return d[0]; })])
                .range([padding, w - padding * 2]);
            
            var yScale = d3.scale.linear()
                .domain([0, d3.max(dataset3, function(d) { return d[1]; })])
                .range([h - padding, padding]);
            
            var rScale = d3.scale.linear()
                .domain([0, d3.max(dataset3, function(d) { return d[1];})])
                .range([2,5]);
            
            svg.selectAll("circle")
                .data(dataset3)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return xScale(d[0]);
                    //return d[0];
            })
                .attr("cy", function(d) {
                    return yScale(d[1]);
                    //return d[1];
            })
                .attr("r", function(d) {
                    return rScale(d[1]);
                    //return 5;
            });
            
            /*
            svg.selectAll("text")
                .data(dataset3)
                .enter()
                .append("text")
                .text(function(d) {
                    return d[0] + "," + d[1];
            })
                .attr("x", function(d) {
                    return xScale(d[0]);
                    //return d[0];
            })
                .attr("y", function(d) {
                    return yScale(d[1]);
                    //return d[1];
            })
                .attr("font-family", "san-serif")
                .attr("font-size", "11px")
                .attr("fill", "red");
            */
            
            var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom")
                            .ticks(5);
            
            /*
            var formatAsPercentage = d3.format(".1%");
            
            xAxis.tickFormat(formatAsPercentage);
            */
            
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0, " + (h - padding) + ")")
                .call(xAxis);
            
            var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .ticks(5);
            
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);
                