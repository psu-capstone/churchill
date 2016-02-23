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

        self.createIssue = function() {
            self.showCreateIssue = !self.showCreateIssue;
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
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", ['dataFac', 'endpointFac', '$cookies',
    function(dataFac, endpointFac, $cookies) {
        var self = this;
        self.title = "Weigh In On An Issue";
        self.voting = false;
        self.issuerows = [];

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

        self.vote = function() {
            self.voting = true;
        };

        self.checkForRank = function(row, showRankContent, showChartContent) {
            dataFac.fetch(endpointFac.url_get_rank('value', row.node_id)).then(function(data){
                if( data['nodes'].length === 0) {
                    showRankContent(row.node_id);
                    row.showRank = true;
                } else {
                    showChartContent(row.node_id);
                    row.showRank = false;
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
            //For local library and for gulp
            //Comment in for production deployment before build script is ran
            var c3 = require('c3');
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