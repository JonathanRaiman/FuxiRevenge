require 'yahoo_stock'
class YahooStock::Quote
	def get
		@interface.update
		@interface.get
		self
	end
end