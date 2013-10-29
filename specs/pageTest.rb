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
end