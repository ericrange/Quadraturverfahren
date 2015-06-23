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
  for (var i = 0; i <= 5; i += 0.001) {
		data.push({
      x: i,
      y: f(i)
    });
  }

  function f_TrapezoidRule(Points, x) {
    var a = Points[0];
    var b = Points[1];
    var m = (f(b)-  f(a)) / (b - a);
    var c = (y(a) - m) + f(a);
    return x > a && x < b ? m * x + c : 0;
  }

  function f_SimpsonsRule(Points, x) {
    var a = Points[0];
    var b = Points[1];
    var m = (a + b) / 2;

    var A = f(a) * (((x - m) * (x - b)) / ((a - m) * (a - b)));
    var B = f(m) * (((x - a) * (x - b)) / ((m - a) * (m - b)));
    var C = f(b) * (((x - a) * (x - m)) / ((b - a) * (b - m)));

    return x > Points[0] && x < Points[1] ? A + B + C : 0;
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
    var rectHeight = -y(f(2)) + h / 2;
    path.append("rect")
      .attr("x", x(1))
      .attr("y", (h / 2) -  rectHeight)
      .attr("width", x(2) - x(0))
      .attr("height",  rectHeight);
      console.log( rectHeight);
  }

  if(A==2) {

  var line2 = d3.svg.area()
      .x(function(d) {
        return x(d.x);
      })
      .y0(function(d) {
        return y(0);
      })
      .y1(function(d) {
        return y(f_TrapezoidRule([1,3], d.x));
      });

      path.append("g")
        .attr("class", "line2")
        .append("path")
        .datum(data)
        .transition()
        .duration(450)
        .attr("d", line2)
        .attr("stroke", "red")
        .attr("fill", "none");

  }

  if(A==3) {

  var line3 = d3.svg.area()
      .x(function(d) {
        return x(d.x);
      })
      .y0(function(d) {
        return y(0);
      })
      .y1(function(d) {
        return y(f_SimpsonsRule([1,3], d.x));
      });

      path.append("g")
        .attr("class", "line2")
        .append("path")
        .datum(data)
        .transition()
        .duration(450)
        .attr("d", line3)
        .attr("stroke", "red")
        .attr("fill", "none");

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
