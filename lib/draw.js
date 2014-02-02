if (require !== 'undefined') {
	var d3 = require('d3');
	var capitalize = require('capitalize');
}

var Graph = {};




/*--------------------------------------
helpers
---------------------------------------*/
Graph.drawSvg = function () {

	// var	svg = d3.select(this.get('el'))
	var	svg = this.get('el')
		.classed(this.get('type') + " basegraph-container " + this.get('id'), true)
		.append("svg")
			.attr("id", this.get('svgElId'))
			.classed("basegraph" , true)
			.style("left", this.get('svgLeft') + "px") // optionally center graph
			.attr("width", this.get('svgWidth'))
			.attr("height", this.get('svgHeight'))
			// append inner graph
			.append("g")
				.attr('class', 'basegraph-maingroup')
				// set inner graph to area to be inside of axes
				// set xy to start bottom left of inner area (instead of top left)
				.attr("transform", "translate(" + this.get('yAxisWidth') + "," + this.get('xAxisHeight') + ")");

	return this.set('svg', svg);
};

/*--------------------------------------
axis
---------------------------------------*/
Graph.drawAxis = function () {

	var svg = this.get('svg');

	// Add the X Axis
	svg.append("g")
		.attr("class", "x axis")
		// set x axis to be on bottom of graph (is on top by default)
		.attr("transform", "translate(0," + this.get('graphHeight') + ")")
		.call(this.get('xAxis'));

	// Add the Y Axis
	svg.append("g")
		.attr("class", "y axis")
		.call(this.get('yAxis'));

	return this;
};



Graph.drawAxisLabels = function () {

	// Add the Y Axis
	var	wContainer = this.get('widthContainerActual'),
		narrowY = wContainer < 950,
		narrowX = wContainer > 410 && wContainer < 515,
		insetAxisLabels = this.get('insetAxisLabels'),
		insetYLabel = insetAxisLabels && insetAxisLabels.indexOf('y') !== -1,
		yLabelX = - ((this.get('svgHeight') / 2) - this.get('xAxisHeight')),
		yLabelY = - this.get('yAxisWidth') / 2,
		yLabelDy = narrowY ? '-0.5em' : 0,
		yClasses = 'axis-label axis-label-y',
		// xClasses = 'axis-label axis-label-y',
		xAxisLabel, yAxisLabel;


	if (insetYLabel) {
		yLabelY = 0;
		yLabelX = 0;
		yClasses += ' inset-y';
		yLabelDy = '1.2em';
	}


	// Add the Y Axis Label
	yAxisLabel = this.get('svg')
		.append("text")
			.classed(yClasses, true)
			.attr('x', yLabelX)
			.attr('y', yLabelY)
				// reduce by a further amount (half of text height)
				.attr('dy', yLabelDy)
			.text(capitalize(this.get('yDataKey')));


	// Add the X Axis Label
	xAxisLabel = this.get('svg')
		.append("text")
			.classed("axis-label axis-label-x " + this.get('xAxisLabelClasses'), true)
			.attr('x', this.get('graphWidth') / 2)
			.attr('y', this.get('svgHeight') - this.get('xAxisHeight'))
			.attr('dy', narrowX ? '-0.5em' : 0)
			// .attr('dy', '-0.25em')
			.text(capitalize(this.get('xDataKey')));

	return this;
};


/*--------------------------------------
grid
---------------------------------------*/
Graph.drawGridLines = function () {

	var svg = this.get('svg');

	// another early return, sorry again angus
	if (!this.get('gridLines')) { return this; }

	// Add the X Grid Lines
	// svg.append("g")
	svg.insert("g", ":first-child")
		.attr("class", "x-grid grid")
		// set x axis to be on bottom of graph (is on top by default)
		.attr("transform", "translate(0," + this.get('graphHeight') + ")")
		.call(this.get('xAxis')
			.tickSize(- this.get('graphHeight'), 0, 0)
			.tickFormat("")
		);

	// Add the Y Grid Lines
	svg.insert("g", ":first-child")
	// svg.append("g")
		.attr("class", "y-grid grid")
		.call(this.get('yAxis')
			.tickSize(- this.get('graphWidth'), 0, 0)
			.tickFormat("")
		);

	return this;
};


/*--------------------------------------
title
---------------------------------------*/
Graph.drawTitle = function (title) {

	var topOffset    = (this.get('svgHeight') - this.get('graphHeight')) / 2,
		graphTitle   = (this.get('title') || title),
		y            = this.get('y'),
		numberTicksY = this.get('yTicks'),
		tickArr      = y.ticks(numberTicksY), // eg returns -> [6, 7, 8, 9, 10, 11, 12]
		tickDistance = y(tickArr[tickArr.length - 1]) - y(tickArr[tickArr.length - 2]);

	// early return, sorry angus
	if (!graphTitle || !this.get('graphTitle')) { return this; }

	this.get('svg')
		// .insert('text', ':first-child')
		.append('text')
			.attr("x", (this.get('graphWidth') / 2))
			.attr("y", topOffset - (tickDistance / 2))
			// http://hdnrnzk.me/2012/07/04/creating-a-bar-graph-using-d3js/
			// font-size = 14px, line height = 17px
			// 14/17 = 0.82
			// 0.82 / 2 = 0.41
			// .attr("dy", "-0.41em")
			.attr("dy", "-0.25em") // actually this magic number looks better

			// .attr("y", topOffset / 2)
			.attr("text-anchor", "middle")
			.attr("class", "graph-title")
			.text(graphTitle);

	return this;
};


/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}