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

        self.checkForRank = function(issueId, showRankContent, showChartContent) {
            dataFac.fetch(endpointFac.url_get_rank('value', issueId)).then(function(data){
                if( data['nodes'].length === 0) {
                    showRankContent(issueId);
                    self.showRank = true;
                } else {
                    showChartContent(issueId);
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
        $('#submitButton').prop('disabled', function() { return disable; });
    };

    self.submit = function (issueId, showGraphContent) {
        var url,
            rank,
            ready,
            which,
            bucket,
            ranked,
            rankingSet,
            userId = $cookies.get('currentUser');

        for(var i in self.buckets) {
            bucket = self.buckets[i];
            which = utilsFac.endpointPfx[i];
            url = endpointFac.url_rank_node(which);
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
                    dataFac.put(url, ready).then(function(){showGraphContent();});
                }
            }
        }
    };
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
                headers = ['x','Question1','Question2','Question3','Question4','Question5'];

            if(tempData[0].length == 8 ) {
                headers.push('Question6');
                headers.push('Question7');
                headers.push('Question8');
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
            charts[chartIdx].load({columns: self.srcData[which], unload: charts[chartIdx].columns});
        }
    };
}]);