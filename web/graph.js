function main() {
	getClasses()
	//getQeustion()
	drawGraph()
}

function drawGraph() {
	
	// Set the dimensions of the canvas / graph
	window.margin = {top: 30, right: 20, bottom: 30, left: 50};
	window.widthAverage = 600 - margin.left - margin.right;
	window.widthInstant = 300 - margin.left - margin.right;
	window.height = 270 - margin.top - margin.bottom;
	
	// Get Firebase data
	window.maxVal = 100;
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
		drawInstant();
		drawAverage();
	});
}

function update() {
	var maxLength = 100;
	// var dar = new Date();
	d3.select("svg").selectAll("*").remove();
	if(window.data.length > maxLength)
		window.data.shift();
	window.currTime += 1;
}

function drawInstant() {
	// Set counts
	var counts = getCounts(window.data);
	window.counts = counts;
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

	for(i = 0; i <= window.maxVal; i++) {
		var bar = chart.append("rect")
			.attr("x", i * barWidth)
			.attr("y", window.height - counts[i])
	    	.attr("width", barWidth - 1)
	    	.attr("height", counts[i]);
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
	firebase.database().ref('Classes/' + current_cid() + '/questions').once('value').then(function(snapshot) {
		var qids = Object.keys(snapshot.val());
		var select = document.getElementById("selectQuestion"); 

		for(var i = 0; i < qids.length; i++) {
		    var opt = qids[i];
		    var el = document.createElement("option");
		    el.textContent = opt;
		    el.value = opt;
		    select.appendChild(el);
		}
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

function getCounts(data) {
	var counts = {};
	for (i = 0; i <= window.maxVal; i++) {
		// Create fake counts
		counts[i] = i;
		// counts[i] = 0;
	}

	for(i = 0; i < data.length; i++) {
		counts[data[i]['val']] += 1;
	}
	
	return counts;
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