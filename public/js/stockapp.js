function StockUpdater (selector, container, url) {
	this.url       = url;
	this.container = container;
	this.selector  = selector;
	this.stocks    = [];

	var updater = this;

	this.updateStocks = function () {
		updater.stocks = updater.selector.val();
		var graphdata = updater.obtainData( function (graphdata) {

			updater.emptyGraph();
			var cats = [];
			var data = [];
			$.each(graphdata, function(index,value) {
				if (updater.stocks.indexOf(value.symbol) > -1 && cats.indexOf(value.symbol) == -1) {
					cats.push(value.symbol);
					data.push(parseInt(value.tradeprice));
				}
			});
			updater.resetGraph({categories: cats, data: data});
		});
	};

	this.selector.chosen();
	this.selector.change(this.updateStocks);
	this.selector.append("<option value='one'>One</option>");
	this.selector.trigger("chosen:updated");

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
				type: 'bar'
		},
		legend: {
			enabled: false
		},
		title: {
			text: 'Stock Prices in Real Time'
		},
		xAxis: {
			categories: _args.categories
		},
		yAxis: {
			title: {
				text: 'Stock Price'
			}
		},
		series: [{
			data: _args.data
		}]
	});
};

$(document).ready(function() {
	new StockUpdater($(".chosen-select"),$("#container"),"/stocks.json");
});

