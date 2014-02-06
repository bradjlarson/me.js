
me = {
	addCommas : function (n){
	    var rx=  /(\d+)(\d{3})/;
	    return String(n).replace(/^\d+/, function(w){
	        while(rx.test(w)){ w= w.replace(rx, '$1,$2'); }
	        return w;
	    });
	}, 
	add_helper : function(k, f) { return Handlebars.registerHelper(k, f); },
	add_helpers : function(o) { return _.each(o, function(value, key, list) { me.add_helper(key, value);}); },
	add_event : function(e, v, f) { return $(e)[v](f); },
	add_click : function(e, f) { return $(e).click(f); },
	add_clicks : function(o) { return _.each(o, function(value, key, list) { me.add_click(key, value);}); },
	add_routes : function() {
	    $("[class*=route]").each(function() {
	        var classes = $(this).attr('class').split(' ');
	        var routes = _.filter(classes, function(c) { return (c.indexOf('route') != -1); });
	        var e = this;
	        _.each(routes, function(r) {
	            var opts = r.split('-');
	            var args = _.map(opts.slice(2), function(o) { return $(e).attr(o) || o; });
	            me.add_event(e, opts[1], function() { route.apply(undefined, args); }); 
	        });
	    });
	},
	as: function(coll, mappings) {
	    return _.map(coll, function(val) { 
	        var obj = val;
	        _.each(mappings, function(val, key) { obj[val] = obj[key]; delete obj[key]; });
	        return obj; });
	},   
	bookend : function bookend(pre, fix, post) { return pre + fix + post; },
	butLast : function butLast(a) { return a.slice(0,-1); },
	cat : function() { 
		var head = _.first(arguments); 
		if (existy(head)) { return head.concat.apply(head, _.rest(arguments)); }
		else { return []; }	
	},
	check: function() {
		var obj = _.first(arguments);
		var keys = _.rest(arguments);
		return _.every(_.map(keys, function (key) { return _.has(obj, key); }));
	},	
	construct : function(head, tail) { return cat([head], _.toArray(tail)); },
	contains : function(x, y) { return (x.indexOf(y) != -1); },
	defaults : function(d) { return function(o,k) { var val = fnull(_.identity, d[k]); return o && val(o[k]); }; },
	dist : function(coll, key) { return _.reduce(_.pluck(coll, key), function(memo, num) { (num in memo) ? memo[num]+=1 : memo[num] = 1; return memo; }, {}); },
	distinct : function(coll, key) { return _.reduce(_.pluck(coll, key), function(memo, num) { if ($.inArray(num, memo) == -1) { memo.push(num);  } return memo; }, []); },
	dollar : function(n) { return '$' + me.addCommas(n); },
    escp : function(str) { return str.replace(/'/g, "&#39;&#39;"); },
	escp_obj : function(obj) { return _.reduce(obj, function(memo, val, key) { memo[key] = me.escp(val); return memo; }, {}); },
	excluding : function(coll, key) {return _.map(coll, function(obj) { delete obj[key]; return obj; }); },
	existy : function existy(o) { return !(_.isNull(o) || _.isUndefined(o)); },
	fnull : function(fun /*, defaults */) { var defaults = _.rest(arguments); return function(/* args */) { var args = _.map(arguments, function(e, i) { return existy(e) ? e : defaults[i]; }); return fun.apply(null, args); }; },
	get_JSON : function(file, sync) {
	   sync = typeof async !== 'undefined' ? true : false;
	   return $.parseJSON($.ajax({
	        type:'GET',
	        url: file,
	        async: false,
	        cache : true,
	        }).responseText);
	},
	get_local : function(k) { return localStorage.getItem(k); },
	get_local_obj : function(k) { return JSON.parse(localStorage.getItem(k)); },
	get_session_obj : function(k) { return JSON.parse(sessionStorage.getItem(k)); },	
	get_session : function(k) { return sessionStorage.getItem(k); },
	keep : function(data, text) { return contains(data, text) ? data.slice(position(data, text)+1) : false; },
	interpose : function(inter, coll) { return butLast(mapcat(function(e) { return construct(e, [inter]); }, coll)); },
	label : function(label, coll) { var obj = {}; obj[label] = coll; return obj; },
	make_alert : function (type, text) {
    var this_alert = '<div class="alert alert-'+ type +' alert-dimsissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+ text +'</div>';
    $('#alert_box').append(this_alert);
	},
	make_template : function(e) { var source = $(e).html(); return Handlebars.compile(source); },	
	mapcat : function(fun, coll) { return cat.apply(null, _.map(coll, fun)); },	
	mapVal : function(coll, prop) { return _.map(coll, function(val) { return val[prop]; }); },
	match : function(col, cond) { return _.findWhere(col, cond); },
	merge : function(obj1, obj2) { _.each(obj2, function(value, key) { obj1[key] = value; }); return obj1; },
	position : function(data, text) { return data.indexOf(text); },
	put_local : function(k, v) { return localStorage.setItem(k, v); },
	put_local_obj : function(k, v) { return localStorage.setItem(k, JSON.stringify(v)); },
	put_session : function(k, v) { return sessionStorage.setItem(k, v); },
	put_session_obj : function(k, v) { return sessionStorage.setItem(k, JSON.stringify(v)); },
	render : function(e, t) { $(e).html(t); me.add_routes(); },
	repeatStr : function repeat(s, n) { var a = []; while(a.length < n) { a.push(s); } return a.join(''); },
	repeat : function repeat(fun, n) { for (i=0; i <n; i++) { fun(); } }, 
	select: function() { 
	    var coll = _.first(arguments);  
	    var keys = _.rest(arguments);
	    return _.map(coll, function(val) {
	        var obj = {};
	        _.each(keys, function(k) { if (me.check(val, k)) {obj[k] = val[k] } });
	        return obj; });
	},
    short_date : function(d) { return d.toJSON().slice(0,d.toJSON().indexOf('T')); },
	size_est : function( object ) {
	    var objectList = [], stack = [ object ], bytes = 0;
	    while ( stack.length ) {
	        var value = stack.pop();
	        if ( typeof value === 'boolean' ) { bytes += 4; }
	        else if ( typeof value === 'string' ) { bytes += value.length * 2; }
	        else if ( typeof value === 'number' ) { bytes += 8; }
	        else if ( typeof value === 'object' && objectList.indexOf( value ) === -1 ) { 
				objectList.push( value );
				for( i in value ) { stack.push( value[ i ] ); }
	        }
	    }
	    return bytes;
	},
	splat : function(fun) { return function(array) { return fun.apply(null, array); }; },
	strip : function(data, text) { return me.contains(data, text) ? data.slice(0, position(data, text)) : data; },
	sum_array : function sum_array(a) { return _.reduce(a, function(memo, next) { return memo + next; }, 0); },
	sum_property : function(coll, key) { return _.reduce(_.pluck(coll, key), function(memo, next) { return memo + Number(next); },0); },
	text_swap : function(text, find, replace) { var replace_regex = new RegExp(find, 'g'); return text.replace(replace_regex, replace); },
	toColl : function(dict) { return _.values(dict); },
	toString: function toString(coll, join) { return _.reduce(coll, function(memo, next) { return memo + next + join; }, ""); },
	truthy : function(x) { return (x !== false) && me.existy(x); },
	validate : function(exp, fail) { return (_.isNull(exp) == _.isNaN(exp) == _.isUndefined(exp) == false) ? exp : fail; },
};

