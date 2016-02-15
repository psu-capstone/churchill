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
        self.username = "";
        self.password = "";
        self.new_user = "";
        self.new_pass = "";
        self.name = "";
        self.city = "";
        self.showCreateForm = false;

        self.getAccess = function(){
            var user_arg = JSON.stringify({
                username: self.username,
                password: self.password
            });

            dataFac.put(endpointFac.url_auth_user(), user_arg).then(function(data){authCallback(data);});
        };

        self.createAccount = function() {
            self.showCreateForm = !self.showCreateForm;
        };

        self.addUser = function () {
            //Sending to API to save user data
            var user_arg = JSON.stringify({
                username: self.new_user,
                password: self.new_pass,
                name:     self.name,
                city:     self.city
            });


            dataFac.put(endpointFac.url_post_user(), user_arg).then(function(data){utilsFac.echo(data)});
        };
}]);

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", ['dataFac', 'endpointFac',
    function(dataFac, endpointFac) {
        var self = this;
        self.title = "Weigh in on an issue";
        self.voting = false;
        self.issuerows = [];
        self.showCreateIssue = false;
        self.createIssue = function() {
            self.showCreateIssue = !self.showCreateIssue;
        };
        self.showRank = null;


         self.getIssues = function() {
             dataFac.fetch(endpointFac.url_get_issues('')).then(function(data){
                 for(var i = 0; i < data['nodes'].length; i++) {
                     var tempName = data['nodes'][i].name;
                     var tempDesc = data['nodes'][i].desc;
                     var tempId   = data['nodes'][i].node_id;
                     self.issuerows.push({name: tempName, description: tempDesc, voting: false, node_id:tempId});
                 }
             });
        };

        self.vote = function() {
            self.voting = true;
        };

        self.checkForRank = function(issueId, showRankContent, showChartContent, showSankeyContent) {
            dataFac.fetch(endpointFac.url_get_rank('value', issueId)).then(function(data){
                if( data['nodes'].length === 0) {
                    showRankContent(issueId);
                    self.showRank = true;
                } else {
                    showChartContent(issueId);
                    showSankeyContent(issueId);
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

    self.submit = function (issueId, showGraphContent) {
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
                height: height + margin.top + margin.bottom
            })
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
         links.append("title")
            .text(function (d) {
                return d.source.name + " to " + d.target.name + " = " + d.value;
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
                    "text-anchor": "middle",
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
            //hacky fix to stop multiple charts needs to be moved once multiple issues is implemented
            //if(data === undefined)
            //{
                data = fetchdata;
                self.constructSankey(self.rowIndex);
            //}
    })};

}]);

/**
 * Processing the visualization data
 */
app.controller("explore-controller", ['endpointFac', 'utilsFac', 'dataFac', '$scope',
    function(endpointFac, utilsFac, dataFac, $scope) {

    var self = this,
        tempData = null,
        endpoints = utilsFac.endpointPfx,
        charts = {},

        parseOpinions = function(which, data) {
            var temp;
            self.opinions[which] = [];
            temp = self.opinions[which];
            for(var i in data){
                temp.push(data[i].rank)
            }
        },
    //TODO, work with raw data, not against it
        parseData = function(data) {
            for(var i in data){
                tempData.push(data[i].data);
            }
        },

        transpose = function(){
            var length,
                transposed = [];
                length = tempData[0].length;
            for(var idx = 0; idx < length; idx++){
                transposed.push([]);
            }

            for(var i in tempData){
                length = tempData[i].length;
                for(var j = 0; j < length; j++){
                    transposed[j].push(tempData[i][j]);
                }
            }
            tempData = transposed;
        },

        /* This function will compute the sum of each array in data and
           return the largest.
         */
        maxArraySums = function(data) {
            var col = data.length - 1,
                rows = data[0].length,
                sums = [],
                buffer = null;

            for (var i = 1; i < rows; ++i) {
                sums.push(0);
                buffer = i - 1;
                for (var j = 1; j < col; ++j) {
                    sums[buffer] += data[j][i];
                }
            }
            return Math.max.apply(null, sums);
        },

        /* this is so you can append the user opinion on the fly after
         * the rest of the data has been fetched
         */
        appendUserData = function() {
            var temp = [];
            self.opinion.forEach(function(x){temp.push(x);});
            tempData.push(temp);
        },

        scatterPositioning = function() {
            var buffer,
                opinionRow,
                centered,
                opinions = self.opinion,
                length = opinions.length,
                userColumn = tempData[5];

            for(var i = 0; i < length; ++i) {
                opinionRow = index(opinions[i]);
                centered = centerOpinionValue(opinionRow, i, tempData);
                buffer = sumBuffer(opinionRow - 1, i, tempData);
                userColumn[i] = centered + buffer;
            }
        },

        formatData = function() {
            var length = tempData.length,
                headers = ['x'];

            for(var i in tempData[0]){
                headers.push('Question ' + i.toString());
            }

            for(var i = 0; i < length - 1; ++i) {
                tempData[i].unshift(self.lik[i - 2]);
            }
            tempData[length -1].unshift('you');
            tempData.unshift(headers);
        },

        index = function(x) {
            return x + 2;
        },

        centerOpinionValue = function(x, y, data) {
            return data[x][y] * .5;
        },

        sumBuffer = function(x, y, data) {
            var sum = 0;
            for(;x>=0; --x) {
                sum += data[x][y]
            }
            return sum;
        },

        processData = function(which, rawData) {
            tempData = [];
            parseData(rawData.data);
            transpose();
            appendUserData();
            scatterPositioning();
            formatData();
            self.srcData[which] = tempData;

        },
        graph = function(index) {
            var you = 'you',
                lik = self.lik;
            return chart = c3.generate({
                bindto: '#chart-' + index.toString(),
                data: {
                    x: 'x',
                    columns: [],
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
                        [lik[-2], lik[-1], lik[0], lik[1], lik[2], you]
                    ]
                },
                point: {
                    r: 5
                },
                axis: {
                    rotated: true,
                    y: {
                        max: 100
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
                            if (id === you) {
                                value = lik[self.opinion[index]];
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

    self.showContent = function(issueId) {
        var chartIdx = self.rowIndex;
        var which = endpoints[self.currentSet];
        if(undefined == charts[chartIdx]) {
            charts[chartIdx] = graph(chartIdx);
        }
        if(self.opinions[which] === undefined || self.srcData[which] === undefined) {
            dataFac.fetch(endpointFac.url_get_rank(which, issueId)).then(function(opinionData){
                parseOpinions(which, opinionData['nodes']);
                self.opinion = self.opinions[which];
                dataFac.fetch(endpointFac.url_get_stacked(which, issueId)).then(function(chartData){
                    processData(which, chartData);
                    charts[chartIdx].axis.max(maxArraySums(self.srcData[which]));
                    charts[chartIdx].load({columns: self.srcData[which], unload: charts[chartIdx].columns});
                });
            });
        } else {
            self.opinion = self.opinions[which];
            charts[chartIdx].axis.max(maxArraySums(self.srcData[which]));
            charts[chartIdx].load({columns: self.srcData[which], unload: charts[chartIdx].columns});
        }
    };
}]);