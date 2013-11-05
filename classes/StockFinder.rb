require './classes/YahooStockQuote.rb'
require './classes/StockSymbolAcquirer.rb'
require 'json'

class StockFinder
	attr_reader :quote
	stock_symbol_acquirer = StockSymbolAcquirer.new
	@@stocks        = stock_symbol_acquirer.stocks
	@@stock_symbols = stock_symbol_acquirer.stock_symbols

	def retrieve_stocks
		if @quote
			@quote.get
		else
			@quote = YahooStock::Quote.new(
				:stock_symbols   => @@stock_symbols,
				:read_parameters => [:name, :symbol, :last_trade_price_only, :change_with_percent_change, :change, :previous_close, :change_in_percent, :open, :day_low, :day_high, :volume, :last_trade_with_time, :day_range, :ticker_trend, :ask, :average_daily_volume, :bid, :bid_size])
		end
		output = @quote.results(:to_hash).output
		# we can now include the location
		@@stocks.each_with_index do |stock,k|
			output[k][:address] = stock[:address]
			output[k][:name]    = stock[:company]
		end
		output
	end

	def initialize
		retrieve_stocks
	end

	def to_json
		retrieve_stocks.to_json
	end
end