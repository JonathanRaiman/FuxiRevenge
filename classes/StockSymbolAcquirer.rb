require 'sparql/client'
require './classes/RDFUriLocation.rb'

class StockSymbolAcquirer
	# retrieves stocks symbols by running dbpedia queries
	DBPEDIA_NAMESPACE = "http://dbpedia.org/sparql"
	@@stock_path = File.dirname(__FILE__)+"/../stocks.hash"

	def initialize
		@sparql = SPARQL::Client.new(DBPEDIA_NAMESPACE)
	end

	def store_in_hash
		File.open(@@stock_path, 'w') do |f|
	    	Marshal.dump(@stocks, f)
	    end
	    self
	end

	def retrieve_from_hash
		stocks_hash = File.open(@@stock_path, 'r')
      	@stocks = Marshal.load(stocks_hash)
	end

	def stocks
		if File.exists?(@@stock_path) then retrieve_from_hash
		else
			@stocks = @sparql.query(<<-MAP
				SELECT distinct ?company, ?symbol, ?address
				WHERE {
					?companyNode dbpprop:type         dbpedia:Public_company.
					?companyNode dbpprop:symbol       ?symbol.
					?companyNode dbpprop:name         ?company.
					?companyNode dbpprop:locationCity ?address.
				}
				LIMIT 10000
			MAP
			).map {|i| i.to_hash }.uniq {|i| i[:symbol]}
			@stocks.each do |query|
				query.keys.each do |key|
					if query[key].class == RDF::URI
						query[key] = query[key].obtain_lat_long
					else
						query[key] = query[key].object
					end
				end
			end
			store_in_hash
		end
		@stocks
	end

	def stock_symbols
		if !@stocks then stocks end
		@stocks.map {|i| i[:symbol]}
	end
end