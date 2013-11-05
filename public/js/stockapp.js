function StockUpdater (selector, container, url) {
	this.url       = url;
	this.container = container;
	this.selector  = selector;
	this.stocks    = [];

	var updater = this;

	this.pickRandomValue = function () {
		var options = updater.selector.find("option"),
			chosenOption = $(options[Math.floor(Math.random()*options.length)]);
		updater.selector.val(chosenOption.val());
		updater.selector.trigger("chosen:updated");
		updater.selector.trigger("change");
	};

	this.updateStocks = function () {
		updater.stocks = updater.selector.val();
		var graphdata = updater.obtainData( function (graphdata) {

			updater.emptyGraph();
			var cats = [];
			var data = [];
			$.each(graphdata, function(index,value) {
				if (updater.stocks.indexOf(value.symbol) > -1 && cats.indexOf(value.symbol) == -1) {
					cats.push(value.symbol);
					data.push(parseInt(value.tradeprice, 10));
				}
			});
			updater.resetGraph({categories: cats, data: data});
		});
	};

	this.selector.chosen();
	this.selector.change(this.updateStocks);
	this.pickRandomValue();

}

StockUpdater.prototype.obtainData = function (callback) {
	var data = [];
	$.getJSON(this.url, function (response) {
		$.each( response, function (k,v) {
			data.push({
				symbol:     v['symbol'],
				tradeprice: v['last_trade_price_only']
			});
		});
		callback(data);
	});
};

StockUpdater.prototype.emptyGraph = function () {
	this.container.empty();
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
		title: {
			text: 'Stock Prices in Real Time',
			style: {
				fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif;', // default font
				fontSize: '14px',
				color: '#333'
			}
		},
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
	new StockUpdater($("#stockselect"),$("#container"),"/stocks.json");
	var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var mapOptions = {
		zoom: 4,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	// To add the marker to the map, use the 'map' property
	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title:"Hello World!"
	});
});

