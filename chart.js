function Chart(Id, A, n, pp) {

	var w = document.body.clientWidth,
		h = 400,
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
	for (var Step = 1; Step <= 3; Step += Tick) {
		Ticks.push(Step);
	}

	function f(x) {
		return (x / Math.pow(stdabw, 2)) * Math.pow(Math.E, -(Math.pow(x, 2) / (2 * Math.pow(stdabw, 2))));
	}

	function g(x) {
		var s = 0.5;
		var t = 1;
		return (1 / Math.PI) * (s / (Math.pow(s, 2) + Math.pow((x - t), 2)));
	}

	var stdabw = 1;
	for (var i = 0; i <= 5; i += 0.001) {
		data.push({
			x: i,
			y: f(i)
		});
	}

	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}

	function calcIntegralMidRule(Points) {
		var a = Points[0];
		var b = Points[1];
		return f((a + b) / 2) * (b - a);
	}

	function calcIntegralTrapezoidRule(Points) {
		var a = Points[0];
		var b = Points[1];
		var m = (f(b) - f(a)) / (b - a);
		var c = (-m * a) + f(a);
		return ((m * (Math.pow(b, 2) - Math.pow(a, 2))) / 2) + c * (-a + b);
	}

	function calcIntegralSimpsonRule(Points) {
		var a = Points[0];
		var b = Points[1];
		var m = (a + b) / 2;
		return ((b - a) / 6) * (f(a) + 4 * f(m) + f(b));
	}

	function f_TrapezoidRule(Points, x) {
		var a = parseFloat(Points[0]);
		var b = Points[1];
		var m = (f(b) - f(a)) / (b - a);
		var c = (-m * a) + f(a);
		return x >= a && x <= b ? m * x + c : 0;
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

	if (pp == 1) {
		data = [], vergleich = [];
		var N = 10000;
		var Ratio = 0;

		if (A == 6) {
			g = function (x) {
				return 1 / (3 - 1);
			}
		}

		if (A == 10) {
			g = function (x) {
				var Lamda = 0.9289;
				return Math.pow(Lamda * Math.E, -Lamda * x);
			}
		}


		for (var m = 1; m <= N; m++) {
			var RandomX = getRandomArbitrary(1, 3);
			Ratio += (f(RandomX) / g(RandomX));
			if (A == 8) Ratio -= 1;
			data.push({
				x: m,
				y: (Ratio / (m))
			});
			vergleich.push({
				x: m,
				y: TrueInt
			});
		}
		console.log("Der Erwartungswert geht gegen: " + Ratio / N);


	}

	var maxX = _.max(data, function (data) {
		return data.x;
	}).x;
	var maxY = _.max(data, function (data) {
		return data.y;
	}).y;

	if (pp == 1) {
		maxX /= 2;
	}

	var x = d3.time.scale()
		.domain([-maxX, maxX])
		.range([0, w]);

	var y = d3.scale.linear()
		.domain([-1, 1])
		.range([h, 0]);

	var line = d3.svg.line()
		.x(function (d) {
			return x(d.x);
		})
		.y(function (d) {
			return y(d.y);
		});

	if (A == 1) {
		var rectHeight = 0;
		var area = 0;
		for (var k = 0; k < Ticks.length - 1; k++) {
			var mid = (Ticks[k + 1] + Ticks[k]) / 2;
			rectHeight = -y(f(mid)) + h / 2;
			path.append("rect")
				.attr("x", x(Ticks[k]))
				.attr("y", (h / 2) - rectHeight)
				.attr("width", (x(mid) - x(Ticks[k])) * 2)
				.attr("height", rectHeight);

			area += calcIntegralMidRule([Ticks[k], Ticks[k + 1]]);
		}

		console.log("Komplette Fläche nach Midpoint-Rule Approximation: " + area + " bei n=" + n + " Delta=" + (TrueInt - area));
	}

	if (A == 2) {
		var area = 0;
		for (var k = 0; k < Ticks.length - 1; k++) {
			var tmp = d3.svg.area()
				.x(function (d) {
					return x(d.x);
				})
				.y0(function (d) {
					return y(0);
				})
				.y1(function (d) {
					return y(f_TrapezoidRule([Ticks[k], Ticks[k + 1]], d.x));
				});

			path.append("g")
				.attr("class", "line2")
				.append("path")
				.datum([{
					x: Ticks[k],
					y: f(Ticks[k])
				}, {
					x: Ticks[k + 1],
					y: f(Ticks[k + 1])
				}])
				.transition()
				.duration(450)
				.attr("d", tmp);

			area += calcIntegralTrapezoidRule([Ticks[k], Ticks[k + 1]]);
		}
		console.log("Komplette Fläche nach Trapezoid-Rule Approximation: " + area + " bei n=" + n + " Delta=" + (TrueInt - area));
	}

	if (A == 3) {
		var area = 0;
		for (var k = 0; k < Ticks.length - 1; k++) {
			var tmp = d3.svg.area()
				.x(function (d) {
					return x(d.x);
				})
				.y0(function (d) {
					return y(0);
				})
				.y1(function (d) {
					return y(f_SimpsonsRule([Ticks[k], Ticks[k + 1]], d.x));
				});

			path.append("g")
				.attr("class", "line2")
				.append("path")
				.datum(data)
				.attr("d", tmp);
			area += calcIntegralSimpsonRule([Ticks[k], Ticks[k + 1]]);
		}
		console.log("Komplette Fläche nach Simpsons-Rule Approximation: " + area + " bei n=" + n + " Delta=" + (TrueInt - area));
	}

	if (A == 4) {

		var tmp = d3.svg.line()
			.x(function (d) {
				return x(d.x);
			})
			.y(function (d) {
				return y(g(d.x));
			});

		path.append("g")
			.attr("class", "line3")
			.append("path")
			.datum(data)
			.attr("d", tmp)
			.attr("stroke", "blue")
			.attr("stroke-width", "2px")
			.attr("fill", "none");

	}

	if (A == 5) {

		g = function (x) {
			var Lamda = 0.9289;
			return Math.pow(Lamda * Math.E, -Lamda * x);
		}

		var tmp = d3.svg.line()
			.x(function (d) {
				return x(d.x);
			})
			.y(function (d) {
				return y(g(d.x));
			});

		path.append("g")
			.attr("class", "line3")
			.append("path")
			.datum(data)
			.attr("d", tmp)
			.attr("stroke", "blue")
			.attr("stroke-width", "2px")
			.attr("fill", "none");
	}

	if (A == 555) {

		g = function (x) {
			var a = 1;
			var b = 3;
			return x >= a & x <= b ? 1 / (b - a) : 0;
		}

		var tmp = d3.svg.line()
			.x(function (d) {
				return x(d.x);
			})
			.y(function (d) {
				return y(g(d.x));
			});

		path.append("g")
			.attr("class", "line3")
			.append("path")
			.datum(data)
			.attr("d", tmp)
			.attr("stroke", "blue")
			.attr("stroke-width", "2px")
			.attr("fill", "none");
	}




	if (pp == 1) {
		path.append("g")
			.attr("class", "line3")
			.append("path")
			.datum(vergleich)
			.transition()
			.duration(450)
			.attr("d", line)
			.attr("stroke", "blue")
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
