/**
 * Creating a user on Login Page
 */
app.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '<h4 class="modal-title">{{ title }}</h4>' +
                    '</div>' +
                    '<div class="modal-body" ng-transclude></div>' +
                '</div>' +
                '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
                if(value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});

/**
 * Unique username check for account creation
 */
app.directive('userUnique', ['dataFac', function (dataFac) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            element.bind('blur', function (e) {
                var current = element.val();
                ctrl.$setValidity('unique', false);
                dataFac.getNode("api/user", current)
                    .success(function(data) {
                        if(data["id"] == current) {
                            console.log("Not Unique");
                            ctrl.$setValidity('unique', false);
                        } else {
                            console.log("Unique");
                            ctrl.$setValidity('unique', true);
                        }
                    })
                    .error(function(error) {
                        console.log("An error has occurred");
                    });
            });
        }
    }
}]);

/**
 * Pull issues from database
 */
app.directive('issueFills', ['dataFac', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: './widgets/issueTemplate.html',
        link: function(scope, element) {

        }
    }
}]);

/**
 * drag and drop likert scale ranking directive
 */
app.directive("sort", [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: './widgets/rank.html'
    };
}]);

/**
 * D3 directive that is embedded in explore-controller.
 */
app.directive("bars", function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        link: function (scope) {
            var unwatch = scope.$watch('exp.data', function(newVal){
                if (newVal.length > 0) {
                    var you = 'you',
                        scp = scope.exp,
                        opinion = scp.opinion,
                        lik = scp.lik,
                        chart = c3.generate({
                            data: {
                                x:'x',
                                columns: scp.data,
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
                                    [lik[-2], lik[-1], lik[0], lik[1], lik[2], you]
                                ]
                            },
                            point: {
                                r: 5
                            },
                            axis: {
                                rotated: true,
                                y:{
                                    max: 4
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
                                    onclick: function (id) { return; }
                                }
                            },
                            tooltip: {
                                format:{
                                    value: function (value, ratio, id, index) {
                                        if(id === you) {
                                            value = lik[opinion[index]];
                                        }
                                        return value;
                                    }
                                }
                            }
                        });
                    unwatch();
                }
            });
        }
    };
});