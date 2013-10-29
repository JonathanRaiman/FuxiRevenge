require 'yahoo_stock'
# fixing broken functionality in Yahoo Stock gem:
class YahooStock::Quote
	def get
		@interface.update
		@interface.get
		self
	end
end