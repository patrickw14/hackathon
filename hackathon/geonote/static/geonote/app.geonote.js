var app = angular.module("geonote", []);

app.factory("urlTools", function (){
	"use strict";

	function getURL(name, parameters) {
		var url = name;

		var i = 0;

		angular.forEach(parameters, function(key, value) {
			if (i == 0)
				url += ('?' + value + '=' + key)
			else
				url += ('&' + value + '=' + key)
		});

		console.log(url);

		return url;
	}

	return {
		getURL: getURL,
	};
});

app.service("notePoller", function($timeout, $http, urlTools) {
	var notes = [];
	var polling = false;

	var poller = {
		startPolling: function() {
			console.log("lets start!!");
			polling = true;
			poll();
		},

		stopPolling: function() {
			polling = false;
		},

		getNotes: function() {
			return notes;
		},

		createNote: function() {

		}
	}

	function poll() {
		if (!polling) return;

		var url = urlTools.getURL('/get_notes/', {
			ne_lat: 5.0,
			ne_long: 5.0,
			sw_lat: 5.0,
			sw_long: 5.0
		});

		$.ajax({
		  url: url,
		  success: success,
		  dataType: 'json'
		});

		$timeout(poll, 2000);
	}

	function success(data) {
		console.log(data);
	}

	return poller;
})

app.service("geoLocation", function() {
	var lat = "0";
	var lng = "0";
	var locationReady = false;

	var locationServices = {
		computeLocation: function() {
			if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(setPosition);
		    } else {
		    	//set location to ucsd center
		    }
		},

		getLocation: function() {
			return [lat, lng];
		},

		locationReady: function() {
			return locationReady;
		}
	}

	function setPosition(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		locationReady = true;
	}

	return locationServices;
});


app.directive("mapHandler", function() {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, $rootScope, notePoller, geoLocation, $timeout) {
			$scope.currPos = ["32.879996", "-117.237046"];
			$scope.notes = [];

			geoLocation.computeLocation();

			$timeout(function() {
				if (geoLocation.locationReady()) {
					$scope.currPos = geoLocation.getLocation();
					updateLocation();
					$scope.notes = notePoller.getNotes();
				}

			}, 2000);


			$scope.map = L.map('map').setView($scope.currPos, 15);

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
				maxZoom: 18,
				id: 'examples.map-i875mjb7'
			}).addTo($scope.map);


			notePoller.startPolling();

			function updateLocation() {
				$scope.map.panTo($scope.currPos);
				$scope.map.setZoom(17);
			}
		}
	}
});

app.controller("GeonoteController", [ "$scope", 'notePoller', 'geoLocation', function($scope, notePoller, geoLocation) {


}]);