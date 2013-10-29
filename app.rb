require 'rubygems'
require 'sinatra'
require 'sinatra/static_assets'
require './classes/routes/routes.rb'
require './classes/StockFinder.rb'

class App < Sinatra::Base
	SITENAME = "Fuxi Revenge"
	register Sinatra::StaticAssets
	set :root, File.dirname(__FILE__)
end

if __FILE__ == $0
	App.run!
end