var x, y, debutFrise, finFrise, counter, categoryIndex;
var heightLost = 2;
var margin = { top: 20, right: 20, bottom: 20, left: 0 },
	padding = { top: 0, right: 0, bottom: 0, left: 0 },
	outerWidth = window.screen.availWidth * 0.7,
	outerHeight = screen.availHeight - (window.outerHeight - window.innerHeight) - heightLost,
	innerWidth = outerWidth - margin.left - margin.right,
	innerHeight = outerHeight - margin.top - margin.bottom,
	width = innerWidth - padding.left - padding.right,
	height = innerHeight - padding.top - padding.bottom;

function tableToArray(tableid) {
	var rows = [].slice.call($('table#' + tableid)[0].rows)

	var keys = [].map.call(rows.shift().cells, function (e) {
		return e.textContent.replace(/\s/g, '')
	})

	var result = rows.map(function (row) {
		return [].reduce.call(row.cells, function (o, e, i) {
			o[keys[i]] = e.textContent
			return o
		}, {})
	})

	return result;
}

function show_svg(svgId, evt) {
    var svg = document.getElementById(svgId);
    var serializer = new XMLSerializer();
    var svg_blob = new Blob([serializer.serializeToString(svg)],
                            {'type': "image/svg+xml"});
    var url = URL.createObjectURL(svg_blob);

    var svg_win = window.open(url, "svg_win");
}

var sortChrono = function Chronologically(a, b) {
	if (a[3][categoryIndex] < b[3][categoryIndex]) return -1;
	if (a[3][categoryIndex] > b[3][categoryIndex]) return 1;
	return 0;
}

var sortAZ = function Alphabetically(a, b) {
	if (a[0] < b[0]) return -1;
	if (a[0] > b[0]) return 1;
	return 0;
}

function isCategory(element) {
	return element == category;
}

function calculateMinMax(periods) {
	finFrise = (new Date()).getFullYear();
	debutFrise = finFrise;
	for (var j = 0; j < periods.length; j++) {
		if (periods[j][3][0] < debutFrise) debutFrise = periods[j][3][0];
	}
	return [debutFrise, finFrise, counter]
}

function renderGrid(minmax, id) {
	debutFrise = minmax[0];
	finFrise = minmax[1];
	counter = minmax[2];

	//SVG initialisatie
	var svg = d3.select("#" + id).append("svg")
		.attr("width", outerWidth)
		.attr("height", outerHeight)
		.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var g = svg.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	x = d3.scaleTime()
		.domain([new Date(debutFrise, 0), new Date(finFrise, 11)])
		.range([0, width]);
	y = d3.scaleLinear()
		.domain([1, counter])
		.range([0, height]);

	var xAxis = d3.axisBottom()
		.scale(x)
		.ticks(d3.timeYear.every(10));
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	var xAxis2 = d3.axisTop()
		.scale(x)
		.ticks(d3.timeYear.every(10));
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, 0)")
		.call(xAxis2);

	var gridlines = d3.axisTop()
		.ticks(d3.timeYear.every(5))
		.tickFormat("")
		.tickSize(- height)
		.scale(x);
	svg.append("g")
		.attr("class", "grid")
		.call(gridlines);

	return svg;
}

function renderBars(svg, collections, category) {
	var periodes;
	var categories = ["all", "A", "V", "D", "I", "O"];
	var kleuren = ["Plum", "LemonChiffon", "LightCoral", "lightgreen", "lightblue", "lightgrey"];
	categoryIndex = categories.findIndex(isCategory);
	kleur = kleuren[categoryIndex];

	//CHOOSE between all collections, or only collections that have material of active category
	var selection = [];
	if (document.getElementById('collapse').checked) {
		for (j = 0; j < collections.length; j++) {
			if (collections[j][2][categoryIndex] == "bestaat") selection.push(collections[j]);
		}
		periodes = selection;
	}
	else periodes = collections;

	var countSelection = periodes.length;
	var bar = height / countSelection;

	//SORT
	periodes = periodes.sort(eval(document.querySelector('input[name="sort"]:checked').value));

	//maak gradient van gekozen kleur
	var lingrad = svg.append('defs').append('linearGradient').attr("id", "beginGradient").attr("class", "grad " + category);
	lingrad.append('stop').attr('offset', '0%').style('stop-color', kleur).style('stop-opacity', '1.0');
	lingrad.append('stop').attr('offset', '50%').style('stop-color', kleur).style('stop-opacity', '0.3');
	lingrad.append('stop').attr('offset', '100%').style('stop-color', kleur).style('stop-opacity', '0.0');

	//MAAK de BARS
	var bars = svg.append("g").selectAll(".periode").data(periodes);
	bars.enter()
		.append("rect")
		.attr("class", "periode " + category)
		.attr("x", function (d) {
			return x(new Date(d[3][categoryIndex], 0));
		})
		.attr("y", function (d, i) {
			return i * bar;
		})
		.attr("width", function (d) {
			if (d[4][categoryIndex] >= d[3][categoryIndex]) return x(new Date(d[4][categoryIndex], 11)) - x(new Date(d[3][categoryIndex], 0));
			else return x(new Date(finFrise, 11)) - x(new Date(d[3][categoryIndex], 0));
		})
		.attr("height", bar)
		.attr("stroke", function (d) {
			if (d[4][categoryIndex] >= d[3][categoryIndex]) return "lightgrey";
		})
		.attr("fill", function (d) {
			if (d[4][categoryIndex] >= d[3][categoryIndex]) return kleur;
			else return "url(#beginGradient)";

		});

	//MAAK de LABELS
	var labels = svg.append("g").selectAll(".nomPeriode").data(periodes);
	labels.enter()
		.append("a")
		.attr("xlink:href", "#")
		.append("text")
		.text(function (d) {
			if (d[2][categoryIndex] == "bestaat") return d[0] + " (" + d[1] + ")";
		})
		.attr("class", "nomPeriode")
		.attr("id", function (d) {
			return d[0];
		})
		.attr("text-anchor", "left")
		.attr("x", function (d) {
			return x(new Date(d[3][categoryIndex], 0));
		})
		.attr("y", function (d, i) {
			return (i + 1) * bar;
		})
		.style("font-size", function (d) {
			if (Number.isFinite(d[3][categoryIndex])) return "1.2em";
			else return "1.0em";
		})
		.style("fill", function (d) {
			if (Number.isFinite(d[3][categoryIndex])) return "black";
			else return "grey";
		})
}