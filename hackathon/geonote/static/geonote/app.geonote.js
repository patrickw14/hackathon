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

		createNote: function(noteMsg, lat, lng, cat) {
			var url = urlTools.getURL('/create_note/', {
				content: noteMsg,
				lat: lat,
				lng: lng,
				category: cat
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

			var currLocationMarker = L.marker($scope.currPos).addTo($scope.map);

			var markers = L.markerClusterGroup();

			notePoller.startPolling();

			function updateLocation() {
				currLocationMarker.setLatLng($scope.currPos);
			}

			function updateAll() {
				if (geoLocation.locationReady()) {
					$scope.currPos = geoLocation.getLocation();
					updateLocation();
				}
				$scope.notes = notePoller.getNotes();

				angular.forEach($scope.notes, function(note) {
					 var redMarker = L.AwesomeMarkers.icon({
					    icon: 'cutlery',
					    markerColor: 'red'
					  });

					  var marker = L.marker([note.lat, note.lng], {icon: redMarker}).addTo($scope.map);
					  marker.bindPopup(note.content);
					  markers.addLayer(marker);
					  $("#events").append("<div class='row text-center'><i class='fa fa-cutlery'<h3>"+note.content+"</h3></i></div>")
				});
				$scope.map.addLayer(markers);
				$timeout(updateAll, 5100);
			}
		}
	}
});

app.directive("viewNotesInterface", function() {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, notePoller, geoLocation) {
			$scope.notes = [];

			$scope.$watch(notePoller.getNotes(), function() {

			})
		}
	}
});

app.directive("createNoteInterface", function() {
	return {
		restrict: 'A',
		replace: true,
		controller: function($scope, notePoller, geoLocation) {
			$scope.noteContent = "";
			$scope.categories = [{name: "Drinks"}, {name: "Friends"}, {name: "Love"}, {name: "Sports"}, {name: "Food"}, {name: "Misc"}];
			$scope.category = $scope.categories[5];

			$scope.createNote = function() {
				var latlng = geoLocation.getLocation();
				notePoller.createNote($scope.noteContent, latlng[0], latlng[1], $scope.category.name);
				$scope.noteContent = "";
			}
		}
	}
});

app.controller("GeonoteController", [ "$scope", 'notePoller', 'geoLocation', function($scope, notePoller, geoLocation) {


}]);
