if (require !== 'undefined') {

	// public deps
	var mitsubishi = require('mitsubishi');
	var Configurable = require('configurable.js');

	// lib files > decorate prototype
	var setup = require('./setup.js');
	var data = require('./data.js');
	var draw = require('./draw.js');
}

var Graph = function (graphOpts) {

	// if (!(this instanceof Graph)) {
	// 	return new Graph(graphOpts);
	// }

	var defaults = {
		// el: 'body',
		el: '#d3-graph-container',
		svgElId: 'd3-graph',
		yTickWeighting: 1.5,
		gradientId: 'temperature-gradient',
		fill: true,
		gridLines: true,
		graphTitle: true,
		xAxisLabelClasses: 'hidden',
		insetAxisLabels: ['y']

		// color: 'red', // defaults to blue
		// centerGraph: true,
		// gradient: true,
		// lineColor: 'red'
	};

	// set defaults
	Configurable(this);
	this.set(defaults);
	if (typeof graphOpts === 'object') {
		this.set(graphOpts);
	}

	// set the color
	this.set(this.setColor(this.get('color'))); // defaults to blue

	return this.setup();
};

// mixin obj literals into prototype
mitsubishi.props(Graph.prototype, [setup, data, draw]);


/*--------------------------------------
main accessor methods
---------------------------------------*/
Graph.prototype.setup = function () {
	return this.setOpts()
				.setDimensions();
};

Graph.prototype.draw = function () {
	return this.drawSvg()
				.drawAxis()
				.drawAxisLabels()
				.drawGridLines() // gridlines
				.drawData(); // drawData() -> .drawGradient() && drawValueLine() && drawArea()
};

Graph.prototype.dataProcess = function (data) {
	return this.setData(data)
				.setScale(data)
				// depends on above
					.setDataFns()
					.setDomain(data)
					.setTicks(data)
					// depend on above
						.setAxis()
						.setDataCoordsFns();
};


/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}
