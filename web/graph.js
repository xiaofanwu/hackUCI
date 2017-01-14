function main() {
	window.maxDataLength = 100;
	getClasses();
	drawGraph();
}

function drawGraph() {	
	// Set the dimensions of the canvas / graph
	window.margin = {top: 30, right: 20, bottom: 30, left: 50};
	window.widthAverage = 600 - margin.left - margin.right;
	window.widthInstant = 300 - margin.left - margin.right;
	window.height = 270 - margin.top - margin.bottom;
	
	// Get Firebase data
	window.maxVal = 100;
	window.data = [];
	
	var classId = current_cid();
	if(classId != "Choose a Course") {
		firebase.database().ref('/Classes/' + classId + '/Students').once('value', function(snapshot) {
			var totalStudents = snapshot.numChildren();
			console.log(totalStudents);
			var sumRating = 0;
			snapshot.forEach(function(childSnapshot) {
				var childData = childSnapshot.child("rating").val();

				sumRating += childData;
			});

			window.data.push({time: Date.now() / 1000, val: parseInt(sumRating / totalStudents)})
			update();
			drawAverage();
			getCurrentRatingsAndDrawInstant();
		});
	}
	else {
		for(var i = 0; i < window.maxDataLength; i++) {
			window.data.push({time: (Date.now() / 1000) - window.maxDataLength + i,
				 val: 0});
		}
		
		drawAverage();
		getCurrentRatingsAndDrawInstant();
	}
}

function update() {
	d3.select("svg.line").selectAll("*").remove();
	d3.select("svg.bar").selectAll("*").remove();
	if(window.data.length > window.maxDataLength)
		window.data.shift();
}

function getCounts(data) {
	var counts = {};
	for (var i = 0; i <= window.maxVal; i++)
		counts[i] = 0;

	for(var i = 0; i < data.length; i++)
		counts[data[i]] += 1;
	
	return counts;
}

function getCurrentRatingsAndDrawInstant() {
	var classId = current_cid();
	if(classId == "Choose a Course") {
		console.log("Default course");
		window.counts = [];
		for(var i = 0; i <= window.maxVal; i++)
			window.counts.push(0);
		drawInstant();
	} else {
		console.log("Getting ratings for: " + classId);
		firebase.database().ref('/Classes/' + classId + '/Students').once('value').then(function(snapshot) {
			window.studentData = snapshot.val();
			var ratings = [];
			for(studentId in window.studentData) {
				ratings.push(window.studentData[studentId].rating);
			}
			
			console.log("Ratings = " + ratings);
			window.counts = getCounts(ratings);
			drawInstant();
		});
	}
}

function drawInstant() {
	// Set counts
	console.log("Drawing instant graph");
	var barWidth = window.widthInstant / window.maxVal;

	var x = d3.scale.linear()
	    .domain([0, window.maxVal + 1])
	    .range([0, window.widthInstant]);
	var y = d3.scale.linear().range([window.height, 0]);

	var chart = d3.select("svg.bar")
	    .attr("width", window.widthInstant)
	    .attr("height", barWidth * (window.maxVal + 1));
		
	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);
	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);
	
    // Add the X Axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + window.height + ")")
        .call(xAxis);

    // Add the Y Axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

	for(var i = 0; i <= window.maxVal; i++) {
		var bar = chart.append("rect")
			.attr("x", i * barWidth)
			.attr("y", window.height - 10 * window.counts[i])
	    	.attr("width", barWidth - 1)
	    	.attr("height", 10 * window.counts[i]);
	}
}

// Gets all available courses and adds them to the dropdown selector
function getClasses() {
	firebase.database().ref('Classes').once('value').then(function(snapshot) {
		var cids = Object.keys(snapshot.val());
		var select = document.getElementById("selectNumber"); 

		for(var i = 0; i < cids.length; i++) {
		    var opt = cids[i];
		    var el = document.createElement("option");
		    el.textContent = opt;
		    el.value = opt;
		    select.appendChild(el);
		}
	});
}

function current_cid() {
	var e = document.getElementById("selectNumber");
	return e.options[e.selectedIndex].value;
}

function getQuestions() {
	console.log("Got the questions")
	drawGraph();
	firebase.database().ref('Classes/' + current_cid() + '/questions').once('value').then(function(snapshot) {
		var qids = Object.keys(snapshot.val());
		
		/*var select = document.getElementById("selectQuestion"); 
		for(var i = 0; i < qids.length; i++) {
		    var opt = qids[i];
		    var el = document.createElement("option");
		    el.textContent = opt;
		    el.value = opt;
		    select.appendChild(el);
		}*/
		
		
	});
}

function current_qid() {
	var e = document.getElementById("selectQuestion");
	return e.options[e.selectedIndex].value;
}

function showQuestion() {
	firebase.database().ref('Classes/' + current_cid()).update({
		current:current_qid()
	});
}

function removeQuestion() {
	firebase.database().ref('Classes/' + current_cid() + '/current').remove();
}

function drawAverage() {
	// Set the ranges
	console.log("Drawing average graph");
	var x = d3.time.scale().range([0, window.widthAverage]);
	var y = d3.scale.linear().range([window.height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);
	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);

	// Define the line
	var valueline = d3.svg.line()
	    .x(function(d) { return x(d.time); })
	    .y(function(d) { return y(d.val); });

	// Adds the svg canvas
	var svg = d3.select("svg.line")
	        .attr("width", window.widthAverage + window.margin.left + window.margin.right)
	        .attr("height", window.height + window.margin.top + window.margin.bottom)
	    .append("g")
	        .attr("transform", 
				"translate(" + window.margin.left + "," + window.margin.top + ")");
				
    // Scale the range of the data
    x.domain(d3.extent(window.data, function(d) { return d.time; }));
    y.domain([0, d3.max(window.data, function(d) { return d.val; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(window.data));

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

function addQuestion(question, correct, wrong1, wrong2, wrong3) {
	alert("Question added!");
    firebase.database().ref('Classes/' + current_cid() + '/questions').push().set({
		text: question,
    	correct: correct,
    	wrong1: wrong1,
		wrong2: wrong2,
		wrong3: wrong3
    });
}

function printData() {
	return window.data;
}