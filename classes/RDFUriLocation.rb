require 'rdf'
require 'rdf/raptor'

class RDF::URI

	def obtain_lat_long
		# for addresses pointing to a URI instead of a String we can obtain the dbpedia node
		# and retrieve its lat-long coordinates and return those as a hash in the JSON.
		graph = RDF::Graph.load(self.to_s)
		location = {}
		# The graph created here is made to find the triple using the latitude position as a predicate
		graph.query([
			RDF::URI.new(self.to_s),
			RDF::URI.new("http://www.w3.org/2003/01/geo/wgs84_pos#lat")]).each do |lat|
			location[:lat] = lat[2].object
		end
		# The graph created here is made to find the triple using the longitude position as a predicate
		graph.query([
			RDF::URI.new(self.to_s),
			RDF::URI.new("http://www.w3.org/2003/01/geo/wgs84_pos#long")]).each do |long|
			location[:long] = long[2].object
		end
		location
	end

end