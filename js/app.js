/**
 * Created by brijesh on 21/08/17.
 */


var app = angular.module('contactListApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/view1.html",
            controller: "HomeController"
        })
        .when("/addItem", {
            templateUrl: "views/view2.html",
            controller: "ListItemController"
        })
        .when("/addItem/:id", {
            templateUrl: "views/view2.html",
            controller: "ListItemController"
        })
        .when("/addItem/edit/:id", {
            templateUrl: "views/view2.html",
            controller: "ListItemController"
        })
        .otherwise({
            redirectTo: "/"
        })

});

app.service("ContactService", function($http) {
    var contactService = {};
    contactService.contactItem = [];

    $http.get("data/data.json")
        .success(function(data) {
            console.log(data);
            contactService.contactItem = data;
        })
        .error(function(data, status) {
            alert("Something went wrong with file.");
        })

    contactService.findById = function(id) {
        for (var item in contactService.contactItem) {
            if (contactService.contactItem[item].id == id) {
                return contactService.contactItem[item];
            }
        }
    }

    contactService.getNewId = function() {
        if (contactService.newId) {
            contactService.newId++;
            return contactService.newId;
        } else {
            var max = _.max(contactService.contactItem, function(entry) {
                return entry.id;
            });
            contactService.newId = max.id + 1;
            return contactService.newId;
        }
    }

    contactService.save = function(entry) {
        var updatedItem = contactService.findById(entry.id);
        if (updatedItem) {
            updatedItem.completed = false;
            updatedItem.firstName = entry.firstName;
            updatedItem.lastName = entry.lastName;
            updatedItem.contactNo = entry.contactNo;
            updatedItem.emailId = entry.emailId;
        } else {
            contactService.contactItem.push(entry);
        }
    }

    contactService.removeItem = function(entry) {
        var index = contactService.contactItem.indexOf(entry);
        contactService.contactItem.splice(index, 1);
    }

    return contactService;
});

app.controller('HomeController', ["$scope", "ContactService", function($scope, ContactService) {
    $scope.appTitle = "Contact list app";
    $scope.contactItem = ContactService.contactItem;

    $scope.removeItem = function(entry) {
        ContactService.removeItem(entry);
    };

    $scope.$watch(function() { return ContactService.contactItem; }, function(contactItem) {
        $scope.contactItem = contactItem;
    });
}]);


app.controller('ListItemController', ["$scope", "$routeParams", "$location", "ContactService", function($scope, $routeParams, $location, ContactService) {
    if (!$routeParams.id) {
        $scope.contactItems = { id: 0, completed: false, firstName: "" };
    } else {
        $scope.contactItems = _.clone(ContactService.findById($routeParams.id));
    }
    $scope.save = function() {
        ContactService.save($scope.contactItems);
        $location.path("/");
    };
}]);

app.directive("tbItemList", function() {
    return {
        restrict: "E",
        templateUrl: "views/contactItem.html"
    }
});