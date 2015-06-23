function Chart(Id, A, n) {

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

  var Ticks = [];
  var Tick = (3 - 1) / n;
  for (var Step = 1; Step <= 3; Step+=Tick) {
    Ticks.push(Step);
  }

  console.log(Ticks);

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

  function calcIntegralMidRule(Points) {
    var a = Points[0];
    var b = Points[1];
    return f((a + b) / 2) * (b - a);
  }

  function calcIntegralTrapezoidRule(Points) {
    var a = Points[0];
    var b = Points[1];
    var result = (b - a) * (f(a) + f(b)) / 2;
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
    .range([h, 0]);

  var line = d3.svg.line()
    .x(function(d) {
      return x(d.x);
    })
    .y(function(d) {
      return y(d.y);
    });

  if(A == 1) {
    var rectHeight = 0;
    var tmp = 0;
    for (var k = 0; k < Ticks.length - 1; k++) {
      var mid = (Ticks[k + 1] + Ticks[k]) / 2;
      rectHeight = -y(f(mid)) + h / 2;
      path.append("rect")
        .attr("x", x(Ticks[k]))
        .attr("y", (h / 2) -  rectHeight)
        .attr("width", (x(mid) - x(Ticks[k])) * 2)
        .attr("height",  rectHeight);

      tmp += calcIntegralMidRule([Ticks[k],Ticks[k + 1]]);
    }

    console.log("Komplette Fläche nach Midpoint-Rule Approximation: " + tmp + " bei n=" + n);
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

      calcIntegralTrapezoidRule([1,3]);

      path.append("g")
        .attr("class", "line2")
        .append("path")
        .datum(data)
        .attr("d", line2);

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
        .attr("d", line3);

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
