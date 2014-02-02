if (require !== 'undefined') {
	var d3 = require('d3');
}

var Graph = {};

/*--------------------------------------
colors
http://www.nytimes.com/interactive/2012/11/30/us/tax-burden.html?_r=1&
---------------------------------------*/
Graph.setColor = function (color) {

	var switchObj = {
		"blue": {
			lineColor: '#1f77b4',
			areaColor: '#1f77b4'
			// lineColor: 'steelblue',
			// areaColor: 'lightsteelblue'
		},
		"red": {
			lineColor: '#d62728',
			areaColor: '#d62728'
		},
		"orange": {
			lineColor: '#ff7f0e',
			areaColor: '#ff7f0e'
		},
		"green": {
			lineColor: '#2ca02c',
			areaColor: '#2ca02c'
		}
	};
	return switchObj[color] || switchObj.blue;
};


Graph.setMultipliers = function (widthContainerActual) {

	var switchObj = {
		"a": {
			heightDivisor: 1.8,
			axisMultiplier: {
				x: 0.20,
				y: 0.20
				// y: 0.17
				// y: 0.14
			}
		},
		"b": {
			heightDivisor: 2,
			axisMultiplier: {
				x: 0.14,
				y: 0.12
			}
		},
		"c": {
			heightDivisor: 2,
			axisMultiplier: {
				x: 0.11,
				y: 0.08
			}
		},
		// default = 1200 if greater than 800
		"default": {
			heightDivisor: 2,
			axisMultiplier: {
				x: 0.09,
				y: 0.06
			}
		}
	}, multipliers = switchObj["default"];
// console.log("widthContainerActual:" + widthContainerActual);
	// need less height + bigger margins on small screens
	if (widthContainerActual < 520) {
		multipliers = switchObj["a"];
		(widthContainerActual > 400) && (multipliers.axisMultiplier.y = 0.14);
	} else {
		if (widthContainerActual < 1100) {
			multipliers = (widthContainerActual < 880) ? switchObj["b"] : switchObj["c"];
			// multipliers = (widthContainerActual < 720) ? switchObj["b"] : switchObj["c"];
		}
	}

	return multipliers;
};

Graph.setOpts = function () {

	var insetAxisLabels = this.get('insetAxisLabels'),
		insetYLabel = insetAxisLabels && insetAxisLabels.indexOf('y') !== -1,
		el = this.get('el');

	// check if el is a DOM node or not
	if (!el.nodeType) {
		el = d3.select(this.get('el'));
	}

	return this.set({
		'insetYLabel': insetYLabel,
		'el': el,
		'alreadyInserted': el && el.children && el.children.length
	});
};

Graph.setDimensions = function () {

	var buffer               = 0.05,
		widthContainerActual = parseInt(this.get('width') || this.get('el').style('width'), 10),
		// widthContainerActual = parseInt(this.get('width') || d3.select(this.get('el')).style('width'), 10),
		svgWidth             = widthContainerActual,
		widthContainer       = parseFloat((widthContainerActual * (1 - buffer))),
		svgLeft              = (this.get('centerGraph')) ? widthContainer * (buffer / 2) : 0,
		multipliers          = this.setMultipliers(widthContainerActual),
		heightContainer      = this.get('height') || (widthContainer / multipliers.heightDivisor),
		yAxisMultiplier      = (this.get('insetYLabel')) ? multipliers.axisMultiplier.y / 2 : multipliers.axisMultiplier.y,
		xAxisMultiplier      = (this.get('xAxisLabelClasses')) ? multipliers.axisMultiplier.x / 2 : multipliers.axisMultiplier.x,
		yAxisWidth           = widthContainer * yAxisMultiplier,
		xAxisHeight          = heightContainer * xAxisMultiplier,
		// reduce graph width by same amount as transform + 0.5 to stop antialiasing - 20 for 1/2 a label width
		graphWidth           = widthContainerActual - yAxisWidth + 0.5 - 18,
		// reduce graph height by same amount as transform
		graphHeight          = heightContainer - (xAxisHeight * 2),
		dimensions			 = {
			widthContainerActual: widthContainerActual,
			graphWidth: (widthContainerActual < 380) ? graphWidth : graphWidth - 10,
			svgWidth: svgWidth,
			graphHeight: graphHeight,
			yAxisWidth: yAxisWidth,
			xAxisHeight: xAxisHeight,
			svgLeft: svgLeft,
			svgHeight: heightContainer,
			gradientStyle: 'url("#'+ this.get('gradientId') + '")'
		};
	return this.set(dimensions);
};
/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}