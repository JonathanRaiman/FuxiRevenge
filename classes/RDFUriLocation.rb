require 'rdf'
require 'rdf/raptor'

class RDF::URI

	def obtain_lat_long
		graph = RDF::Graph.load(self.to_s)
		location = {}
		graph.query([
			RDF::URI.new(self.to_s),
			RDF::URI.new("http://www.w3.org/2003/01/geo/wgs84_pos#lat")]).each do |lat|
			location[:lat] = lat[2].object
		end
		graph.query([
			RDF::URI.new(self.to_s),
			RDF::URI.new("http://www.w3.org/2003/01/geo/wgs84_pos#long")]).each do |long|
			location[:long] = long[2].object
		end
		location
	end

end