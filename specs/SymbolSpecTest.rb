#coding: utf-8

require './app.rb'

describe StockSymbolAcquirer do
	apple_symbol = "AAPL"
	it 'should obtain stock names and symbols' do
		StockSymbolAcquirer.new.stocks.should include({:symbol => apple_symbol, :company => "Apple Inc."})
	end

	it 'should return stock symbols' do
		StockSymbolAcquirer.new.stock_symbols.should include(*[apple_symbol, "MSFT"])
	end

	it 'should return reasonable stock values' do
		stockFinder = StockFinder.new
		stocks = stockFinder.retrieve_stocks
		appleStockIndex = stocks.index {|i| i[:symbol] == apple_symbol}
		stocks[appleStockIndex][:last_trade_price_only].to_f.should be_within(100).of 500
		# because that's where Apple is at right now :)
		# PS: this is an awful test by the way, kids look away.
	end

	it 'should return fantastic json representations of stock values' do
		stocks = StockFinder.new.retrieve_stocks
		appleStockIndex = stocks.index {|i| i[:symbol] == apple_symbol}
		json_parsed = JSON.parse(stocks.to_json)
		json_parsed[appleStockIndex].keys.each do |key|
			json_parsed[appleStockIndex][key].should eql stocks[appleStockIndex][key.to_sym]
		end
	end
end