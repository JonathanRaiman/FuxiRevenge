


var stocks = function stocks(name,price) {
	this.name = name;
	this.price = price;
}
var active = [];

$(document).ready(function() {

	$(".chosen-select").chosen();
	updateFields();
	$("#stockselect").change(function() {
		active = $("#stockselect").val();
		var graphdata = [];
		$.getJSON( "/stocks.json", function( data ) {
			$.each( data, function( key, val ) {
				graphdata.push([{'symbol':val['symbol'],'tradeprice':val['last_trade_price_only']}]);
			});
			$.each(graphdata,function(index,value) {
		});
		$("#container").empty();
		//Make data highcharts readable
		var cats = [];
		var data = [];
		$.each(graphdata,function(index,value) {
			if (active.indexOf(value[0]['symbol']) >= 0) {
				cats.push(value[0]['symbol']);
				data.push(parseInt(value[0]['tradeprice']));
			}
		});
		$("#container").highcharts({
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
				categories: cats
			},
			yAxis: {
				title: {
					text: 'Stock Price'
				}
			},
			series: [{
				data: data
			}]
		});
		});
		
	});
	
});

var updateFields = function updateFields() {
	$("#stockselect").append("<option value='one'>One</option>");
	$("#stockselect").trigger("chosen:updated");
}

