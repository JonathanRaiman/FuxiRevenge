Fuxi Revenge
============
*Linked Data Ventures Mini Project*

A novel way to inferface with Linked Data and stocks. Using Yahoo stock prices and dbpedia to create a mash up that extends the linked data and shows it on a map.


**collaborators**
*    Mitchell Kates,
*    Jonathan Raiman


Installation
------------


1.    Run

	    	bundle install

	from the directory

2.	You'll also need **rdf/raptor** to process RDF files:

	    	brew install raptor

	Now you are ready, you can type:

	    	ruby app.rb

	to get started.

3.	Navigate to ``localhost:4567`` and let the magic begin.

Tests
-----

for Capybara and route testing do:

    rspec specs/pageTest.rb
for backend testing:

	rspec specs/SymbolSpecTest.rb

Issues
------
???
