var _chartEventName = "chartClicked";

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

function StockUpdater (selector, container, map_container, infobox, url) {
	this.url       = url;
	this.container = container;
	this.map_container = map_container;
	this.selector  = selector;
	this.stocks    = [];
	this.markers   = [];
	this.infobox   = infobox;

	var updater = this;

	this.pickRandomValue = function () {
		var options = updater.selector.find("option"),
			chosenOption = $(options[Math.floor(Math.random()*options.length)]);
		updater.selector.val(chosenOption.val());
		updater.selector.trigger("chosen:updated");
		updater.selector.trigger("change");
	};

	// this.formatStock = function (stock) {
	// 	return .format(stock.name, stock.tradeprice);
	// };

	this.resetMarkers = function (symbols) {
		var updater = this;
		for (var i=0;i < updater.markers.length ;i++) {
			if (symbols.indexOf(updater.markers[i]._id) == -1 ) {
				updater.markers[i].setMap(null);
				updater.markers.splice(i, 1);
				i--;
			}
		}
	};

	this.updateStocks = function () {
		updater.stocks = updater.selector.val() ? updater.selector.val() : [];
		var graphdata = updater.obtainData( function (graphdata) {

			updater.emptyGraph();
			var cats = [];
			var data = [];
			$.each(graphdata, function(index,stock) {
				if (updater.stocks.indexOf(stock.symbol) > -1 && cats.indexOf(stock.symbol) == -1) {
					cats.push(stock.symbol);
					data.push(parseInt(stock.tradeprice, 10));
					updater.createMarker(stock.symbol, stock.address, stock.name+' <span class="label label-inverse">'+stock.tradeprice+'</span>');
				}
			});
			updater.resetGraph({categories: cats, data: data});
			updater.resetMarkers(cats);
		});
	};

	this.initializeMap = function () {
		var styles = [
			{
				"featureType": "water",
				"stylers": [
					{ "weight": 0.1 },
					{ "hue": "#00ccff" }
				]
			},{
				"featureType": "landscape.natural",
				"stylers": [
					{ "gamma": 0.74 }
				]
			},{
				"featureType": "administrative",
				"stylers": [
				{ "visibility": "off" }
				]
			},{
				"featureType": "administrative.country",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "on" },
					{ "hue": "#00ff19" },
					{ "gamma": 0.47 },
					{ "weight": 0.2 },
					{ "lightness": -72 }
				]
			}],
			myLatlng = new google.maps.LatLng(-25.363882,131.044922),
			mapOptions = {
				zoom: 2,
				zoomControl: true,
				disableDefaultUI: true,
				center: myLatlng,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
				}
			},
			styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
		this.map = new google.maps.Map(this.map_container[0], mapOptions);
		this.map.mapTypes.set('map_style', styledMap);
		this.geocoder   = new google.maps.Geocoder();
		this.infowindow = new google.maps.InfoWindow();
		this.map.setMapTypeId('map_style');

		var updater = this;

		this.map_timeout = null;

		google.maps.event.addListener(this.map, 'center_changed', function() {
			updater.before_panning();
			clearTimeout(updater.map_timeout);
			updater.map_timeout = window.setTimeout(function() {
				updater.after_panning();
			}, 1500);
		});

		$(document).bind(_chartEventName, function (event, args) {
			updater.centerOnMarker(args.symbol);
		});

	};

	this.centerOnMarker = function (symbol) {
		$.each(updater.markers, function () {
			if (this._id == symbol) {
				updater.map.panTo(this.position);
				this._click_function();
				return;
			}
		});
	};

	this.after_panning = function () {
		this.infobox.animate({opacity: 0}, 500);
	};
	this.before_panning = function () {
		this.infobox.animate({opacity: 1}, 250);
	};

	this.createMarker = function (id, address, title, callback) {
		for (var i=0;i < this.markers.length;i++) {
			if (this.markers[i]._id == id) {
				return this.markers[i]._id;
			}
		}
		var updater = this;
		var marker,
			marker_click_function = function () {
				updater.infowindow.setContent(title);
				updater.infowindow.open(updater.map, marker);
				if (callback) callback(marker);
		};
		if (typeof(address) == 'string') {
			updater.geocoder.geocode({address: address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK && results[0]) {
					marker = new google.maps.Marker({
						position: results[0].geometry.location,
						map: updater.map
					});
					marker._id = id;
					marker._click_function = marker_click_function;
					updater.markers.push(marker);
					google.maps.event.addListener(marker, 'click', marker._click_function);
					updater.map.panTo(results[0].geometry.location);
					marker_click_function();
				}
			});
		} else if (address.lat && address.long) {
			marker = new google.maps.Marker({
				position:  new google.maps.LatLng(address.lat, address.long),
				map: updater.map
			});
			marker._id = id;
			marker._click_function = marker_click_function;
			updater.markers.push(marker);
			google.maps.event.addListener(marker, 'click', marker._click_function);
			updater.map.panTo(new google.maps.LatLng(address.lat, address.long));
			marker_click_function();
		}
		return marker;
	};

	this.selector.chosen({width: "100%"});
	this.selector.change(this.updateStocks);
	this.pickRandomValue();
	this.initializeMap();

}

StockUpdater.prototype.obtainData = function (callback) {
	var data = [];
	$.getJSON(this.url, function (response) {
		$.each( response, function (k,v) {
			data.push({
				symbol:     v['symbol'],
				tradeprice: v['last_trade_price_only'],
				address:    v.address,
				name:       v.name
			});
		});
		callback(data);
	});
};

StockUpdater.prototype.emptyGraph = function () {
	this.container.empty();
};
StockUpdater.prototype.highlightChart = function (event) {
	$(document).trigger(_chartEventName, {symbol: event.point.category});
};

StockUpdater.prototype.resetGraph = function (_args) {
	this.container.highcharts({
		chart: {
			type: 'bar',
			backgroundColor: '#fdfdfd',
			plotBackgroundColor: '#fdfdfd',
		},
		legend: {
			enabled: false
		},
		title: false, /*{
			text: 'Stock Prices in Real Time',
			style: {
				fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif;', // default font
				fontSize: '14px',
				color: '#333'
			}
		},*/
		xAxis: {
			categories: _args.categories,
			title: {
				style: {
					color: '#333'
				}
			}
		},
		style: {
			fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif;', // default font
			fontSize: '14px',
			color: '#333'
		},
		yAxis: {
			title: {
				text: 'Stock Price',
				style: {
					color: '#333'
				}
			}
		},
		plotOptions: {
			bar: {
				events: {
					click: this.highlightChart
				}
			}
		},
		colors: ['#d95b60','#c85c5e','#d6887f','#bb9066','#d8be83','#aea77c','#96b885','#519075','#409c86','#4b8e84'],
		pane: {
			background: '#fdfdfd'
		},
		labels: {
			style: {
				color: '#333'
			}
		},
		series: [{
			data: _args.data
		}]
	});
};



$(document).ready(function() {
	var su = new StockUpdater($("#stockselect"),$("#container"),$("#map-canvas"), $(".infobox").first(), "/stocks.json");

});

