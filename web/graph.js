function drawGraph() {
	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
	    width = 600 - margin.left - margin.right,
	    height = 270 - margin.top - margin.bottom;
	window.height = height;

	// Set the ranges
	window.x = d3.time.scale().range([0, width]);
	window.y = d3.scale.linear().range([height, 0]);

	// Define the axes
	window.xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);

	window.yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);

	// Define the line
	window.valueline = d3.svg.line()
	    .x(function(d) { return x(d.time); })
	    .y(function(d) { return y(d.val); });
    
	// Adds the svg canvas
	window.svg = d3.select("body")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// Create random data
	/*window.data = [];
	window.currTime = 0;
	var initSize = 100;
	for (var i = 0; i < initSize; i++) {
		window.data[i] = {time: currTime, val: Math.random()};
		currTime += 1;
	}*/
	
	// Get Firebase data
	window.currTime = 0;
	window.data = [];
	var databaseRef = firebase.database().ref('/Classes/1/Students');
	databaseRef.on('value', function(snapshot) {
		var totalStudents = snapshot.numChildren();
		console.log(totalStudents);
		var sumRating = 0;
		snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.child("rating").val();

			sumRating += childData;
		});

		window.data.push({time: currTime, val: sumRating/totalStudents})
		update();
	});
}

function update() {
	var maxLength = 100;
	svg.selectAll("*").remove();
	if(window.data.length > maxLength)
		window.data.shift();
	window.currTime += 1;
	draw();
}

function draw() {
    // Scale the range of the data
    x.domain(d3.extent(window.data, function(d) { return d.time; }));
    y.domain([0, d3.max(window.data, function(d) { return d.val; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}
