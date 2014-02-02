if (require !== 'undefined') {
	var d3 = require('d3');
}

var Graph = {};

Graph.yearIntervals = function (data, xDataKey) {
	var step = 5,
		minMax = d3.extent(data, function(d) {return d[xDataKey];});
	// return d3.time.year.utc.range(minMax, step);
	return d3.time.day.utc.range(minMax, step);
};

Graph.setOriginal = function (keyName) {
	return function (row) {
		// console.dir(row);
		if (row[keyName + 'original']) {
			row[keyName] = row[keyName + 'original'];
		} else {
			row[keyName + 'original'] = row[keyName];
		}
		return row;
	};
};

Graph.setData = function (data) {

	var xDataKey = this.get('xDataKey'),
		yDataKey = this.get('yDataKey');

	data
		.map(this.setOriginal(xDataKey))
		.map(this.setOriginal(yDataKey))
		.map(function(row) {
			row[yDataKey] = +row[yDataKey];
			// row[xDataKey] = row.time.format.utc("%Y").parse(row[xDataKey] + "");
			row[xDataKey] = new Date(row[xDataKey], 0);
			// console.log("row[xDataKey]", row[xDataKey]);
		});

	return this.set('data', data);
};

// must set scale BEFORE axis or domain (because need this.get('x') + this.get('y'))
Graph.setScale = function (data) {

	return this.set({
		x: d3.time.scale().range([0, this.get('graphWidth')]),
		y: d3.scale.linear().range([this.get('graphHeight'), 0])
	});
};

/*--------------------------------------
method depends on above
---------------------------------------*/
Graph.setDataFns = function () {

	var	xDataKey = this.get('xDataKey'),
		yDataKey = this.get('yDataKey');

	return this.set({
		xDataFn: function(d) {
			return d[xDataKey];
		},
		yDataFn: function(d) {
			return d[yDataKey];
		}
	});
};


/*--------------------------------------
below methods depend on above
---------------------------------------*/
Graph.setDomain = function (data) {

	var x = this.get('x'),
		y = this.get('y'),
		xDataFn = this.get('xDataFn'),
		yDataFn = this.get('yDataFn'),
		minY = d3.min(data, yDataFn),
		maxY = d3.max(data, yDataFn),
		buffer = (maxY - minY) * 0.20; // 20% of total range

	// Scale the range of the data
	x.domain(d3.extent(data, xDataFn));
	y.domain([minY - buffer, maxY + buffer]);

	return this.set({
		minY: minY,
		maxY: maxY
	});
};

Graph.setTicks = function (data) {

	var	gW = this.get('graphWidth'),
		gWRound = Math.round(gW/100)*100,
		ticksTable = {
			"300" : 4,
			"400" : 5,
			"500" : 8,
			"600" : 8,
			"700" : 10,
			"800" : 14,
			"900" : 14,
			"1000" : 18,
			"1100" : 18,
			"1200" : 18
		},
		yTickMultiplier = (this.get('graphHeight') / this.get('graphWidth')) * this.get('yTickWeighting'),
		ticks;

	if (gWRound >= 300 && gWRound <= 1200) {
		ticks = ticksTable[gWRound];
	} else {
		ticks = (gWRound < 300) ? 3 : 20;
	}

	return this.set({
		xTicks: ticks,
		yTicks: Math.round(ticks * yTickMultiplier)
	});
};


Graph.setAxis = function () {

	return this.set({
		xAxis: d3.svg.axis().scale(this.get('x')).orient("bottom").ticks(this.get('xTicks')),
		yAxis: d3.svg.axis().scale(this.get('y')).orient("left").ticks(this.get('yTicks'))
	});
};


Graph.setDataCoordsFns = function () {

	var x = this.get('x'),
		y = this.get('y'),
		xDataKey = this.get('xDataKey'),
		yDataKey = this.get('yDataKey');

	return this.set({
		xDataCoordsFn: function(d) {
			return x(d[xDataKey]);
		},
		yDataCoordsFn: function(d) {
			return y(d[yDataKey]);
		}
	});
};

/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}