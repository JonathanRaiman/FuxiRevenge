require './classes/YahooStockQuote.rb'
require './classes/StockSymbolAcquirer.rb'

class StockFinder
	attr_reader :quote
	@@stock_symbols = StockSymbolAcquirer.new.stock_symbols

	def retrieve_stocks
		if @quote
			@quote.get
		else
			@quote = YahooStock::Quote.new(
				:stock_symbols   => @@stock_symbols,
				:read_parameters => [:symbol, :last_trade_price_only, :change_with_percent_change, :change, :previous_close, :change_in_percent, :open, :day_low, :day_high, :volume, :last_trade_with_time, :day_range, :ticker_trend, :ask, :average_daily_volume, :bid, :bid_size])
		end # => :name could be included... just saying.
		@quote.results(:to_hash).output
	end

	def initialize
		retrieve_stocks
	end

	def to_json
		retrieve_stocks.to_json
	end
end