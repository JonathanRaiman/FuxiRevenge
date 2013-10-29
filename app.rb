require 'sinatra'
require 'sinatra/static_assets'
require_relative 'routes/routes.rb'
require 'yahoo_stock'

class App < Sinatra::Base
	SITENAME = "Fuxi Revenge"
	register Sinatra::StaticAssets
	set :root, File.dirname(__FILE__)
end

if __FILE__ == $0
	App.run!
end