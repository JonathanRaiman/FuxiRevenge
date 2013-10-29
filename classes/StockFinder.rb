require './classes/YahooStockQuote.rb'
require './classes/StockSymbolAcquirer.rb'

class StockFinder
	attr_reader :quote

	def self.get_stock_symbols
		@@stock_symbols = StockSymbolAcquirer.new.stocks
	end

	def retrieve_stocks
		if @quote
			@quote.get
		else
			@quote = YahooStock::Quote.new(
				:stock_symbols   => @@stock_symbols,
				:read_parameters => [:last_trade_price_only, :symbol])
		end
	end

	def initialize
		retrieve_stocks
	end

	def to_json

	end
end