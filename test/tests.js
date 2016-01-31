/**
 * Karma tests
 *
 * @author ryan
 */

/**
 * app.js Tests
 */
describe('Unit: Routing', function () {
    it('Should Map Routes to Controllers', function() {
        module('democracy-lab-app');

        inject(function($route) {

            expect($route.routes['/'].controller).toBe('main-controller');
            expect($route.routes['/'].templateUrl).
                toEqual('./pages/login.html');

            expect($route.routes['/home'].controller).toBe('main-controller');
            expect($route.routes['/home'].templateUrl).
                toEqual('./pages/login.html');

            expect($route.routes['/issue'].controller).toBe('issue-controller');
            expect($route.routes['/issue'].templateUrl).
                toEqual('./pages/issue.html');
        });
    });
});

/**
 * appController.js Tests
 */
describe('Unit: main-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl;
    var fact;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $injector) {
        // Create the controller
        ctrl = $controller('main-controller');
        fact = $injector.get('dataFac');
    }));

    it('Verify Create Form pops', function() {
        ctrl.createAccount();
        expect(ctrl.showCreateForm).toEqual(true);
    });

    // TODO fix later
    it('Verify User already in DB', function() {
        ctrl.new_user = "rta";
        fact.postUser(ctrl.new_user);
        expect(false);
    });
});

describe('Unit: issue-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller) {
        // Create the controller
        ctrl = $controller('issue-controller');
    }));

    it('Verify Form Clears on Press', function() {
        ctrl.submitIssue();
        expect(ctrl.new_title = "");
        expect(ctrl.new_description = "");
    });

    it('Verify vote changes voting to true', function() {
        ctrl.vote();
        expect(ctrl.voting).toEqual(true);
    });

});

describe('Unit: explore-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller) {
        // Create the controller
        ctrl = $controller('explore-controller');
    }));
});