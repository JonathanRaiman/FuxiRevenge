# some tests can be built here.
ENV['RACK_ENV'] = "test"
%w(rack rack/test capybara/rspec capybara/dsl).map {|d| require(d)}
Capybara.app = Blog
RSpec.configure {|conf| conf.include Rack::Test::Methods}
#coding: utf-8
describe "App" do
	it 'should show a homeapge' do
		visit '/'
		expect(page).to have_content('Hello World')
	end
end