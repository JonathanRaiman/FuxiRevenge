#coding: utf-8

require './app.rb'

describe StockSymbolAcquirer do
	it 'should obtain stock symbols' do
		StockSymbolAcquirer.new.stocks.should include({:symbol => "AAPL", :company => "Apple Inc."})
	end
end