require 'sinatra'
require 'yahoo_stock'

SITENAME = "Fuxi Revenge"

get '/'
	erb :"main/index"
end