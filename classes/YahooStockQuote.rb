class YahooStock
	class Quote
		def get
			@interface.update
			@interface.get
			self
		end
	end
end