require 'yahoo_stock'
# fixing broken functionality in Yahoo Stock gem (basically low level
# updating was not being done, so stock values were not refreshed)
class YahooStock::Quote
	def get
		@interface.update
		@interface.get
		self
	end
end