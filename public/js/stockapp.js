
$.rdf.databank()
  .base('http://www.example.org/')
  .prefix('rdf', 'http://purl.org/dc/elements/1.1/')
  .prefix('dbp', 'http://dbpedia.org/property/')
  .add('<photo1.jpg> dc:creator <http://www.blogger.com/profile/1109404> .')
  .add('<http://www.blogger.com/profile/1109404> foaf:img <photo1.jpg> .');

$(document).ready(function() {
	$(".chosen-select").chosen();
	updateFields();
});

var updateFields = function updateFields() {
	$("#stockselect").append("<option value='one'>One</option>");
	$("#stockselect").trigger("chosen:updated");
}