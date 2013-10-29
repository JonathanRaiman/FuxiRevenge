require 'sparql/client'

class StockSymbolAcquirer
	# retrieves stocks symbols by running dbpedia queries
	DBPEDIA_NAMESPACE = "http://dbpedia.org/sparql"

	def initialize
		@sparql = SPARQL::Client.new(DBPEDIA_NAMESPACE)
	end

	def stocks
		@query = sparql.query(<<-MAP
			SELECT distinct ?Company, ?Symbol
			WHERE {
				?Company dbpprop:type   dbpedia:Public_company.
				?Company dbpprop:symbol ?Symbol.
			}
			LIMIT 10000
		MAP
		)
	end
end