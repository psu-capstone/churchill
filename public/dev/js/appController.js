/**
 * Main login controller, display a login form and save valid credentials
 */
app.controller("main-controller", [ '$http', '$location', '$cookies', 'accessFac', 'dataFac', 'endpointFac', 'utilsFac',
    function($http, $location, $cookies, accessFac, dataFac, endpointFac, utilsFac) {
        var self = this,

            authCallback = function(response) {
                if(response["success"] == true) {
                    accessFac.getPermission();
                    $cookies.put('currentUser',self.username);
                    $location.path('/issue');
                } else {
                    accessFac.rejectPermission();
                    self.reject = true;
                }
            };

        self.image = "./images/demoLab_logo.png";
        self.title = "Login or Create Account";
        self.unsuccessful = "Username or Password is incorrect";
        self.showCreateForm = false;
        self.showCreateIssue = false;

        // Show Issue creation modal
        self.createIssue = function() {
            self.showCreateIssue = !self.showCreateIssue;
        };

        // Show User creation modal
        self.createAccount = function() {
            self.showCreateForm = !self.showCreateForm;
        };

        // Just a test until changes submitted on backend, see commented out for
        // what this will actually be doing.
        self.checkAdmin = function() {
            return $cookies.get('currentUser') === "mark@democracylab.org";
            /**
             * dataFac.fetch(endpointFac.url_get_node('user, $cookies.get('currentUser')).then(function(data) {
              *     if(data["is_admin"]) {
              *        return true;
              *     } else {
              *        return false;
              *     }
              * });
             */
        };

        // Gain access if user+pass is valid
        self.getAccess = function(){
            var user_arg = JSON.stringify({
                username: self.username,
                password: self.password
            });
            dataFac.put(endpointFac.url_auth_user(), user_arg).then(function(data){authCallback(data);});
        };

        // Sending to API to save user data
        self.addUser = function () {
            var user_arg = JSON.stringify({
                username: self.new_user,
                password: self.new_pass,
                name:     self.name,
                city:     self.city
            });
            dataFac.put(endpointFac.url_post_user(), user_arg).then(function(data){utilsFac.echo(data)});
        };

        // Handle the top nav bar name
        self.loggedStatus = function() {
            if($cookies.get('currentUser')) {
                self.user = $cookies.get('currentUser');
                return true;
            } else {
                return false;
            }
        }
}]);

/**
 * Getting issues from the database and populate the page
 */
app.controller("issue-controller", ['dataFac', 'endpointFac',
    function(dataFac, endpointFac) {
        var self = this;
        self.title = "Weigh In On An Issue";
        self.voting = false;
        self.issuerows = [];

        // Grab issues from the database
        self.getIssues = function() {
             dataFac.fetch(endpointFac.url_get_issues('')).then(function(data){
                 for(var i = 0; i < data['nodes'].length; i++) {
                     var tempName = data['nodes'][i].name;
                     var tempDesc = data['nodes'][i].desc;
                     var tempId   = data['nodes'][i].node_id;
                     self.issuerows.push({name: tempName, description: tempDesc, voting: false, node_id:tempId, showRank: false});
                 }
             });
        };

        // All issues are initialized to false, aka buttons are not opened up on page load
        self.vote = function() {
            self.voting = true;
        };

        // Check to see if any of these issues have been ranked already and display the graph instead of ranking buckets
        self.checkForRank = function(row, showRankContent, showChartContent, showSankeyContent) {
            dataFac.fetch(endpointFac.url_get_rank('value', row.node_id)).then(function(data){
                if( data['nodes'].length === 0) {
                    showRankContent(row.node_id);
                    row.showRank = true;
                } else {
                    showChartContent(row.node_id);
                    showSankeyContent(row.node_id);
                    self.showRank = false;
                }
            });
        };
}]);

/**
 * Ranking issues
 */
app.controller('rank-controller', ['endpointFac','utilsFac', 'dataFac','$scope', '$cookies',
    function(endpointFac, utilsFac, dataFac, $scope, $cookies) {

    var self = this,
        endpoints = utilsFac.endpointPfx;

    self.buckets = [[[],[],[],[],[]], [[],[],[],[],[]],[[],[],[],[],[]]];
    self.title = ['Values', 'Objectives', 'Policies'];
    self.tgtData = self.buckets[0];
    self.buttonTitle = 'Submit';
    self.lik = utilsFac.likert;
    self.currentSet = 0;
    self.srcData = {};
    self.index = 0;
    self.showRank = null;

    self.sortableOptions = {
        connectWith: ".sort",
        scroll: false,
        stop: function() {self.showSubmitButton()}
    };

    self.tgtSortableOptions = {
        connectWith: ".sortSrc",
        scroll: false
    };

    self.srcSortableOptions = {
        connectWith: ".sortTgt",
        scroll: false
    };

    self.showContent = function(issueId) {
        var which = endpoints[self.currentSet];
        if(self.srcData[which] === undefined ) {
            dataFac.fetch(endpointFac.url_get_issue_items(which, issueId)).then(function(data) {
               self.srcData[which] = data;
            });
        }
        self.tgtData = self.buckets[self.currentSet];
    };

    self.getData = function(x) {
        return self.srcData[endpoints[x]];
    };

    self.getTitle = function(x) {
        return self.title[x];
    };

    self.showSubmitButton = function() {
        var source_bucket,
            disable = false;
        for(var which in endpoints) {
            source_bucket = self.srcData[endpoints[which]];
            if(source_bucket !== undefined) {
                if(source_bucket['nodes'].length != 0) {
                    disable = true;
                }
            } else {
                disable = true;
            }
        }
        $('#submitButton-' + self.index.toString()).prop('disabled', function() { return disable; });
    };

    self.submit = function (issueId, showGraphContent, showSankeyContent) {
        var url = [],
            rank,
            ready,
            which,
            bucket,
            ranked,
            rankingSet,
            model = [[],[],[]],
            userId = $cookies.get('currentUser');

        for(var i in self.buckets) {
            bucket = self.buckets[i];
            which = utilsFac.endpointPfx[i];
            url.push(endpointFac.url_rank_node(which));
            for(var j in bucket) {
                rankingSet = bucket[j];
                rank = (j - 2);
                for (; 0 < rankingSet.length;) {
                    ranked = rankingSet.pop();
                    ready = JSON.stringify({
                        user_id: userId,
                        node_id: ranked.node_id,
                        issue_id: issueId,
                        rank: rank
                    });
                    model[i].push(ready);
                }
            }
        }
        dataFac.multiPut(url[0], model[0]).then(function() {
            dataFac.multiPut(url[1], model[1]).then(function() {
                dataFac.multiPut(url[2], model[2]).then(function() {
                    showGraphContent(issueId);
                    showSankeyContent(issueId);
                })
            })
        });
    };
}]);

app.controller("sankey-controller", ['dataFac','endpointFac','$scope',
    function(dataFac, endpointFac, $scope) {

    var self = this,
    rowIndex,
    data;

    self.constructSankey = function(idx) {

         //need to get rid of this since we're supporting mobile
         var margin = {top: 1, right: 1, bottom: 6, left: 1};
         var width = 900 - margin.left - margin.right;
         var height = 500 - margin.top - margin.bottom;
         var color = d3.scale.category20();

         // SVG (group) to draw in.
         var svg = d3.select('#sankey-chart-' + idx.toString()).append("svg")
            .attr({
                width: width + margin.left + margin.right,
                height: height + margin.top + margin.bottom,
                display: "block",
                style: "margin-left:auto; margin-right:auto;"
            })
                .append("g")
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

         // Set up Sankey object.
         var sankey = d3.sankey()
            .nodeWidth(30)
            .nodePadding(10)
            .size([width, height])
            .nodes(data.nodes)
            .links(data.links)
            .layout(32);

         // Path data generator.
         var path = sankey.link();

         // Draw the links.
         var links = svg.append("g").selectAll(".link")
            .data(data.links)
            .enter()
            .append("path")
            .attr({
                "class": "link",
                d: path
            })
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .style("opacity", function(d) {
                if(d.isNeg === 1)
                    return 0.3;

                return 1;
            });
         links.append("title")
            .text(function (d) {
                var value = d.isNeg?(d.value * -1):d.value;
                return d.source.name + " to " + d.target.name + " = " + value;
            });

         // Draw the nodes.
         var nodes = svg.append("g").selectAll(".node")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr({
                "class": "node",
                transform: function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                }
            });
         nodes.append("rect")
            .attr({
                height: function (d) {
                    return d.dy;
                },
                width: sankey.nodeWidth()
            })
            .style({
                fill: function (d) {
                    return d.color = color(d.name.replace(/ .*/, ""));
                },
                stroke: function (d) {
                    return d3.rgb(d.color).darker(2);
                }
            })
            .append("title")
            .text(function (d) {
                return d.name;
            });
         nodes.append("text")
            .attr({
                x: sankey.nodeWidth() / 2,
                y: function (d) {
                    return d.dy / 2;
                },
                dy: ".35em",
                    "text-anchor":
                    function(d) {
                    //Need to make this a percentage of width instead of hard coded widths
                    if(d.x < 50)
                        { return "start"}
                    if(d.x < 700)
                        {return "middle"}
                    return "end"
                    },
                    transform: null
            })
            .text(function (d) {
                return d.name;
            });
    };

    $scope.$watch('rowIdx', function(value) {
        self.rowIndex = value;
    });

    self.showContent = function(issueId) {
        dataFac.fetch(endpointFac.url_get_sankey(issueId)).then(function(fetchdata){
                data = fetchdata;
                data.links.forEach(function(link){
                    if(link.value < 0){
                        link.isNeg = 1;
                        link.value = Math.abs(link.value);
                    }
                    else
                        link.isNeg = 0;
                });
                self.constructSankey(self.rowIndex);
    })};

}]);

/**
 * Processing the visualization data
 */
app.controller("explore-controller", ['endpointFac', 'utilsFac', 'dataFac', '$scope',
    function(endpointFac, utilsFac, dataFac, $scope) {

    var self = this,
        endpoints = utilsFac.endpointPfx,
        charts = {},

        parseData = function(which, chart) {
            var opinions = self.opinions[which],
                data = self.srcData[which],
                userRank,
                barData;
            for(var id in opinions) {
                userRank = opinions[id];
                barData = data[id].data;
                //append scatter positioning value
                barData.push(scatterPositioning(barData, userRank));
                //prepend the item title
                barData.unshift(data[id].name);
            }
            for(var i in data){
                chart.push(data[i].data);
            }
            chart.unshift(['x','strongly disagree', 'disagree', 'no opinion','agree', 'strongly agree', 'you']);
        },

        /* This function will compute the sum of each array in data and
           return the largest.
         */
        maxArraySums = function(data) {
            var sums = [],
                index,
                colLen = data.length,
                rowLen = data[0].length - 1;
            for(var i = 1; i < colLen; i++){
                sums.push(0);
                index = i-1;
                for(var j = 1; j < rowLen; j++){
                    sums[index] += data[i][j];
                }
            }
            return Math.max.apply(null, sums);
        },

        scatterPositioning = function(row, rank) {
            var buffer = 0,
                index = rank + 2,
                centered = row[index] * 0.5;

            for(var i = 0; i < index; i++) {
                buffer += row[i];
            }
            return buffer + centered;
        },

        processData = function(which) {
            var tempData = [];
            parseData(which, tempData);
            self.chartData[which] = tempData;
        },

        mapTooltip = function(data, opinions) {
            self.tooltipStrings = [];
            for(var id in data) {
                self.tooltipStrings.push(self.lik[opinions[id]]);
            }
        },

        graph = function(index) {
            var lik = self.lik;
            return chart = c3.generate({
                bindto: '#chart-' + index.toString(),
                data: {
                    x: 'x',
                    rows: [],
                    type: 'bar',
                    types: {
                        you: 'scatter'
                    },
                    order: null,
                    colors: {
                        'strongly disagree': '#920000',
                        disagree: '#ec1b1b',
                        'no opinion': '#dbd9d9',
                        agree: '#0087d8',
                        'strongly agree': '#095983',
                        you: '#000000'
                    },
                    groups: [
                        [lik[-2], lik[-1], lik[0], lik[1], lik[2], 'you']
                    ]
                },
                point: {
                    r: 5
                },
                axis: {
                    rotated: true,
                    y: {
                        max: 160
                    },
                    x: {
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
                        onclick: function () {
                            return;
                        }
                    }
                },
                tooltip: {
                    format: {
                        value: function (value, ratio, id, index) {
                            if (id === 'you') {
                                value = self.tooltipStrings[index];
                            }
                            return value;
                        }
                    }
                }
            });
        };

    $scope.$watch('rowIdx', function(value) {
        self.rowIndex = value;
    });

    self.title = "Explore the issues";
    self.lik = utilsFac.likert;
    self.srcData = {};
    self.currentSet = 0;
    self.opinions = {};
    self.xAxisMax = null;
    self.rowIndex = null;
    self.chartData = {};
    self.tooltipStrings = [];

    self.showContent = function(issueId) {
        var chartIdx = self.rowIndex;
        var which = endpoints[self.currentSet];
        if(undefined == charts[chartIdx]) {
            charts[chartIdx] = graph(chartIdx);
        }
        if(self.opinions[which] === undefined || self.srcData[which] === undefined) {
            dataFac.fetch(endpointFac.url_get_rank(which, issueId)).then(function(opinionData){
                var array = opinionData['nodes'],
                    length = array.length;
                self.opinions[which] = {};
                for(var i = 0; i < length; i++) {
                    self.opinions[which][array[i].node_id] = array[i].rank;
                }
                dataFac.fetch(endpointFac.url_get_stacked(which, issueId)).then(function(chartData){
                    self.srcData[which] = chartData.data;
                    processData(which);
                    mapTooltip(chartData.data, self.opinions[which]);
                    charts[chartIdx].axis.max(maxArraySums(self.chartData[which]));
                    charts[chartIdx].load({rows: self.chartData[which], unload: charts[chartIdx].rows});
                });
            });
        } else {
            mapTooltip(self.srcData[which], self.opinions[which]);
            charts[chartIdx].axis.max(maxArraySums(self.chartData[which]));
            charts[chartIdx].load({rows: self.chartData[which], unload: charts[chartIdx].rows});
        }
    };
}]);