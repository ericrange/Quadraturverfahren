function Chart(Id, A) {

  var w = document.body.clientWidth,
    h = 600,
    data = null,
    path = d3
    .select("#" + Id)
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("style", "overflow: visible");

  data = [], f;

  function f(x) {
    return (x / Math.pow(stdabw, 2)) * Math.pow(Math.E, -(Math.pow(x, 2) / (2 * Math.pow(stdabw, 2))));
  }

  var stdabw = 1;
  for (var i = 0; i <= 5; i += 0.01) {
		data.push({
      x: i,
      y: f(i)
    });
  }

  var maxX = _.max(data, function(data) {
    return data.x;
  }).x;
  var maxY = _.max(data, function(data) {
    return data.y;
  }).y;

  var x = d3.time.scale()
    .domain([-maxX, maxX])
    .range([0, w]);

  var y = d3.scale.linear()
    .domain([-1, 1])
    //.domain([-5, 5])
    .range([h, 0]);

  var line = d3.svg.line()
    .x(function(d) {
      return x(d.x);
    })
    .y(function(d) {
      return y(d.y);
    });

  if(A == 1) {
    path.append("rect")
      .attr("x", x(0))
      .attr("y", (h / 2) - y(f(1.5)))
      .attr("width", x(3) - x(0))
      .attr("height", y(f(1.5)));
  }

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
