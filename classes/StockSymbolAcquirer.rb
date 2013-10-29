require 'sparql/client'

class StockSymbolAcquirer
	# retrieves stocks symbols by running dbpedia queries
	DBPEDIA_NAMESPACE = "http://dbpedia.org/sparql"

	def initialize
		@sparql = SPARQL::Client.new(DBPEDIA_NAMESPACE)
	end

	def stocks
		@query = @sparql.query(<<-MAP
			SELECT distinct ?company, ?symbol
			WHERE {
				?companyNode dbpprop:type   dbpedia:Public_company.
				?companyNode dbpprop:symbol ?symbol.
				?companyNode dbpprop:name    ?company.
			}
			LIMIT 10000
		MAP
		).map {|i| i.to_hash }
		@query.each do |query|
			query.keys.each do |key|
				query[key] = query[key].object
			end
		end
		@query
	end
end