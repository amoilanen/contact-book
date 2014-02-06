/*
 * To reset the state of the application just access the following URL in the browser:
 * http://localhost:8000/api/debug/contacts/restoreDefaults
 */

var app = app || angular.module('ContactsBook', []);

app.factory('ContactService', ['$http', function($http) {

    function on(eventName, callbacks) {
        return function(data, status, headers, config) {
            if (eventName === "error") {
                console.error(data);
            }
            if (callbacks && callbacks[eventName]) {
                callbacks[eventName](data);
            }
        };
    }

    return {
        getAll: function(callbacks) {
            $http({
                method: 'GET',
                url: "api/contacts"
            }).success(on("success", callbacks))
            .error(on("error", callbacks));
        },
        storeAll: function(contacts, callbacks) {
            console.log("Storing all contacts...");
            $http({
                method: 'POST',
                url: "api/contacts",
                data: JSON.stringify(contacts)
            }).success(on("success", callbacks))
            .error(on("error", callbacks));
        }
    };
}]);