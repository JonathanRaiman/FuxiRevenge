require 'sinatra/base'
require 'sinatra/static_assets'

class App < Sinatra::Base
	SITENAME = "Fuxi Revenge"
	GOOGLE_API_KEY = "AIzaSyAwVr-S25U1bdNZTD-CEjgu2fzxeaUuUHc"
	register Sinatra::StaticAssets
	set :root, File.dirname(__FILE__)+"/../../"
end