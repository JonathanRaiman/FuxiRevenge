ENV['RACK_ENV'] = "test"
require './app.rb'
%w(rack rack/test capybara/rspec capybara/dsl).map {|d| require(d)}
Capybara.app = App
RSpec.configure {|conf| conf.include Rack::Test::Methods}
include Capybara::DSL

describe "App" do
	it 'should show a homepage', :type => :feature  do
		visit '/'
		expect(page).to have_content('Hello World')
	end

	it 'should return a json with stock info', :type => :feature do
		visit '/stocks.json'
		stocks = StockFinder.new.retrieve_stocks
		appleStockIndex = stocks.index {|i| i[:symbol] == "AAPL"}
		json_parsed = JSON.parse(page.body)
		json_parsed[appleStockIndex].keys.each do |key|
			json_parsed[appleStockIndex][key].should eql stocks[appleStockIndex][key.to_sym]
		end
	end
end