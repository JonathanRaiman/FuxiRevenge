require 'sinatra/base'

class App < Sinatra::Base
	get '/' do
		erb :"main/index"
	end

	get '/stocks.json' do
		StockFinder.new.to_json
	end
end