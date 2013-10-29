require 'sinatra'
require 'yahoo_stock'

SITENAME = "Fuxi Revenge"

get '/' do
	erb :"main/index"
end