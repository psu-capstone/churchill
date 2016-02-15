/**
 * Creating a user on Login Page
 */
app.directive('modal', function () {
    return {
        templateUrl: './widgets/modal.html',
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
app.directive('userUnique', ['dataFac', 'endpointFac', function (dataFac, endpointFac) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            element.bind('blur', function (e) {
                var current = element.val();
                ctrl.$setValidity('unique', false);
                dataFac.fetch(endpointFac.url_get_node('user', current)).then(function(data){
                    if(data["id"] == current) {
                        ctrl.$setValidity('unique', false);
                    } else {
                        ctrl.$setValidity('unique', true);
                    }
                });
            });
        }
    }
}]);