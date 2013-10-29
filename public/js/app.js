if(!Object.keys) Object.keys = function(o){
   if (o !== Object(o))
	  throw new TypeError('Object.keys called on non-object');
   var ret=[],p;
   for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
   return ret;
}
String.prototype.strip=function(){
	var i = 0, j = this.length;
   	while (this.substring(i,i+1) == " "){i++}
   	while (this.substring(j-1,j) == " "){j--}
    return this.substring(i,j)
}
String.prototype.__ = function () {
	return this.replace(/&amp;/g,"&").replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&#39;/g,'\'').replace(/&quot;/g,'"');
}
var app = (function  () {var _app = _app || this; this.title = "Twend - Text Parser";return _app})();
app.edit = function (query, url, cb, cberror) {
	return $.ajax({
		url:url,
		timeout: 60000,
		method: "post",
		dataType: 'json',
		data: query,
		success: cb,
		error: cberror});
}
app.inform          = function (msg, type) {Messenger().post({message: msg,type: type || "info",id: "resultsStats"})}
app.notify          = function (msg, type) {Messenger().post({message: msg,type: type || "info",id: "actionStats"})}

app.semantics = (function () {
	var module = {};
	module.container = $("#nominal-group-holder");

	module.clean = function () {
		module.container.children().remove();
	}
	module.handleResults = function (_args) {
		app.notify("Parsed text in:"+_args.duration+"s", "success");
		module.clean();
		app.inform("Mean sentiment "+_args.mean_sentiment);
		var view = app.serveView({name: 'sentiment-box', params: {sentiment: _args.mean_sentiment}});
		module.container.append(view);
		module.container.append("<hr />");
		view = app.serveView({name: 'nominal-groups', params: {items: _args.topics}});
		module.container.append(view);
		view = app.serveView({name: 'extraneous-topics', params: {items: _args.unmatched_topics}});
		module.container.append(view);
	}

	return module;
})();


var textSpeed = 300;
Messenger.options = {
	extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
	theme: 'future'
};
$(document).on('submit', 'form[data-ajaxify]', function (e) {
	var form = $(this),
		form_params = form.serialize(),
		callback = form.attr("data-success"),
		callbackError = form.attr("data-error")
	$.ajax({
		url: form.attr("action"),
		type: form.attr("method"),
		dataType: form.attr("data-datatype") ? form.attr("data-datatype") : "html",
		data: form_params,
		success: function (response) {
			if (callback) (new Function ("_response","$scope", "form", "return "+callback))(response, app, form)
		},
		error: function (e) {
			if (callbackError) (new Function ("_response","$scope", "form", "return "+callbackError))(e, app, form)
		}
	});
	app.notify("Form submitted");
	e.preventDefault();
});
app.views = (function () {
	var views = {};
	// get views from server;
	$.ajax({
		url: "/views.html",
		success: function (r) {
			var fullView = $(r);
			fullView = fullView.first("div[data-views-top-level]");
			fullView.children().each( function () {
				views[$(this).attr("data-view-name")] = this.outerHTML;
			});
		},
		dataType: "html",
		error: function (e) {
			throw new Error("app.views could not retrieve views from server.");
		}
	});
	return views;
})();
app.serveView = function (_args) {
	var view = app.views[_args.name];
	if (view) {
		return view.replace(
			new RegExp( "\{\{([^\}]+)\}\}", "gi"),
			function($1,$2){
				$2 = $2.__();
				var rS;
				try {
					rS = (new Function ("_args","$scope", "return "+$2))(_args.params, app);
				} catch (e) {
					rS = "";
				}
				return rS;
			}
		).replace(
			new RegExp( "data-eval=\"%%([^%]+)%%\"", "gi"),
			function($1,$2){
				$2 = $2.__();
				var rS;
				try {
					rS = (new Function ("_args","$scope", "return "+$2))(_args.params, app);
				} catch (e) {
					rS = "";
				}
				return rS;
			}
		).replace(
			new RegExp( "%%([^%]+)%%", "gi"),
			function($1,$2){
				$2 = $2.__();
				var rS;
				try {
					rS = (new Function ("_args","$scope", "return "+$2))(_args.params, app);
				} catch (e) {
					rS = "";
				}
				return rS;
			}
		)
	}
	throw new Error("serveView(): view \""+_args.name+"\" could not be found.");
}
$(document).on('keyup', '[data-ajax-text]', function (e) {
	var el = $(this),
		callback = el.attr("data-success"),
		callbackError = el.attr("data-error")
		handleError = function (e) {
			if (callbackError) (new Function ("_response","$scope", "input", "return "+callbackError))(e, app, el)
			else {
				el.removeClass("saving").addClass("error-saving");
				if (e.status == 404)
					app.inform("Resource could not be located, could not save: \""+el.val().substring(0,100)+"\"","error")
				else if (e.status == 403)
					app.inform("Not authorized, could not save: \""+el.val().substring(0,100)+"\"","error")
				else
					app.inform("("+e.status+") Error saving \""+el.val().substring(0,100)+"\"","error")
			}
		},
		handleSuccess = function (_args) {
			if (callback) (new Function ("_response","$scope", "input", "return "+callback))(response, app, el)
			else {
				el.removeClass("saving").removeClass("error-saving");
				app.inform("Saved \""+el.val()+"\"","success")
			}
		};
	clearTimeout(this.XHRTimer);
	el.addClass("saving");
	if (this.XHRRequest && this.XHRRequest.abort) this.XHRRequest.abort()
	this.XHRTimer = setTimeout( function () {
		var params = {attrs: [{key:el.attr("data-key"), value: el.val()}]};
		el.attr("data-identifier") ? params[el.attr("data-identifier")] = el.attr("data-id") : "";
		el.addClass("saving").removeClass("error-saving");
		this.XHRRequest = app.edit(params, el.attr("data-href"), function (resp) {
			el.attr("data-success") ? (new Function ("_response","$scope", "input", "return "+el.attr("data-success")))(resp, app, el) : handleSuccess(resp, app, el)}, handleError)
	}, textSpeed);
});