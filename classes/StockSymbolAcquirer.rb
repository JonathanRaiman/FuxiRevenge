require 'sparql/client'
require './classes/RDFUriLocation.rb'

class StockSymbolAcquirer
	# retrieves stocks symbols by running dbpedia queries
	DBPEDIA_NAMESPACE = "http://dbpedia.org/sparql"

	def initialize
		@sparql = SPARQL::Client.new(DBPEDIA_NAMESPACE)
	end

	def stocks
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
		).map {|i| i.to_hash }
		@stocks.each do |query|
			query.keys.each do |key|
				if query[key].class == RDF::URI
					query[key] = query[key].obtain_lat_long
				else
					query[key] = query[key].object
				end
			end
		end
		@stocks
	end

	def stock_symbols
		if !@stocks then stocks end
		@stocks.map {|i| i[:symbol]}
	end
end