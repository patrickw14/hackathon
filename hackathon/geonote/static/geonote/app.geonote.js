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
			i=i+1
		});

		return url;
	}

	return {
		getURL: getURL,
	};
});

app.service("notePoller", function($timeout, $http, urlTools) {
	var notes = [];
	var polling = false;
	var lastPollTime;

	var poller = {
		startPolling: function() {
			polling = true;
			poll();
		},

		stopPolling: function() {
			polling = false;
		},

		getNotes: function() {
			return notes;
		},

		createNote: function(noteMsg, lat, lng) {
			var url = urlTools.getURL('/create_note/', {
				content: noteMsg,
				lat: lat,
				lng: lng
			});

			$.ajax({
		  		url: url,
		  		success: successCreate,
		  		dataType: 'json'
			});
		}
	}

	function poll() {
		if (!polling) return;

		if (!lastPollTime) {
			console.log("1");
			lastPollTime = Math.round(new Date().getTime() / 1000);

			var url = urlTools.getURL('/get_notes', {
				ne_lat: 5.0,
				ne_long: 5.0,
				sw_lat: 5.0,
				sw_long: 5.0
			});

			$.ajax({
			  type:"get",
			  url: url,
			  success: successPoll,
			  dataType: 'json'
			});
		} else {
			console.log(lastPollTime);
			var url = urlTools.getURL('/get_recent_notes', {
				ne_lat: 5.0,
				ne_long: 5.0,
				sw_lat: 5.0,
				sw_long: 5.0,
				timestamp: lastPollTime
			});

			lastPollTime = Math.round(new Date().getTime() / 1000);

			$.ajax({
			  type:"get",
			  url: url,
			  success: successPoll,
			  dataType: 'json'
			});
		}

		$timeout(poll, 5000);
	}

	function successPoll(data) {
		console.log(data);
		notes = data;
	}

	function successCreate(data) {

	}

	return poller;
})

app.service("geoLocation", function() {
	var lat = "32.879996";
	var lng = "-117.237046";
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

			$timeout(updateAll, 2000);

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

			function updateAll() {
				if (geoLocation.locationReady()) {
					$scope.currPos = geoLocation.getLocation();
					updateLocation();
				}
				$scope.notes = notePoller.getNotes();

				angular.forEach($scope.notes, function(note) {
					var marker = L.marker([note.lat, note.lng]).addTo($scope.map);
					marker.bindPopup(note.content);
				});
				$timeout(updateAll, 5100);
			}
		}
	}
});

app.directive("viewNotesInterface", function() {

});

app.directive("createNoteInterface", function() {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, notePoller, geoLocation) {
			$scope.noteContent = "";

			$scope.createNote = function() {
				var latlng = geoLocation.getLocation();
				notePoller.createNote($scope.noteContent, latlng[0], latlng[1]);
				$scope.noteContent = "";
			}
		}
	}
});

app.controller("GeonoteController", [ "$scope", 'notePoller', 'geoLocation', function($scope, notePoller, geoLocation) {


}]);
