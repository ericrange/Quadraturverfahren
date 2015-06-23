function Chart() {

  var w = 600,
    h = 400,
    data = null,
    path = d3
    .select("#chart")
    .append("svg")
    .attr("width", w + "px")
    .attr("height", h + "px")
		.attr("style", "overflow: visible");

	data = [];

	for (var i = -100; i <= 100; i++) {
		data.push({
			x: i / 10,
			y: i / 10
		});
	}

  var x = d3.time.scale()
    .domain([-100, 100])
    .range([0, w]);

  var y = d3.scale.linear()
    .domain([-100, 100])
    .range([h, 0]);

  var line = d3.svg.line()
    .interpolate("bundle")
    .x(function(d) {
      return x(d.x);
    })
    .y(function(d) {
      return y(d.y);
    });

  path.append("g")
    .attr("class", "line")
    .append("path")
    .datum(data)
    .transition()
    .duration(450)
    .attr("d", line)
		.attr("stroke", "red")
		.attr("fill", "none");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var xAxis = d3.svg.axis()
    .scale(x)
		.tickFormat(d3.format("d"))
    .orient("bottom");

  path.append("g")
    .attr("class", "y axis")
		.attr("transform", "translate(" + (w / 2) + ", 0)")
		.attr("fill", "none")
		.attr("stroke", "#999")
    .call(yAxis);

  path.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + (h / 2) + ")")
		.attr("fill", "none")
		.attr("stroke", "#999")
    .call(xAxis);

  function drawDistribution(Distribution) {

  }

  function drawSquares(Squares) {

  }

};
