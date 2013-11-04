require 'sinatra/base'
require 'sinatra/static_assets'

class App < Sinatra::Base
	SITENAME = "Fuxi Revenge"
	register Sinatra::StaticAssets
	set :root, File.dirname(__FILE__)+"/../../"
end