function main() {
	window.maxDataLength = 100;

	window.rangeSize = 10;
	window.counts = [];

	initRatingsChart();
	initQuestionsChart();
	
	getClasses();
	drawGraph();
}

function initRatingsChart() {
    var ctx = document.getElementById("ratingsChart");
    window.ratingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["0 - 10", "10 - 20", "20 - 30", "30 - 40", "40 - 50", "50 - 60", "60 - 70", "70 - 80", "80 - 90", "90 - 100"],
			datasets: [{
                label: 'Ratings Per Bucket',
                data: [],
	            backgroundColor: [
	                'rgba(255, 0, 0, 0.5)',
	                'rgba(255, 50, 0, 0.5)',
	                'rgba(255, 100, 0, 0.5)',
	                'rgba(255, 150, 0, 0.5)',
					'rgba(255, 240, 0, 0.6)',
					'rgba(255, 240, 0, 0.6)',
					'rgba(150, 255, 0, 0.5)',
					'rgba(100, 255, 0, 0.5)',
					'rgba(50, 255, 0, 0.5)',
					'rgba(0, 255, 0, 0.5)'
	            ]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
	window.ratingsChartData = window.ratingsChart.data.datasets[0];
}

function initQuestionsChart() {
    var ctx = document.getElementById("questionsChart");
	window.answerCounts = [];
    window.questionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
    		labels: ["Question answers will appear here"],
			datasets: [{
                label: '# of Students',
                data: [0]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
	window.questionsChartData = window.questionsChart.data.datasets[0];
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
		if(window.currentRef)
			window.currentRef.off()
		
		window.currentRef = firebase.database().ref('/Classes/' + classId + '/Students');	
		window.currentRef.on('value', function(snapshot) {
			var sumRating = 0;
			var totalWeight = 0;
			snapshot.forEach(function(childSnapshot) {
				var rating = childSnapshot.child("rating").val();
				var timestamp = childSnapshot.child("timestamp").val();

				// Decrease weight for each rating by a factor of 2 every five minutes, until
				// 500 minutes have passed.
				var weight;
				if((Date.now() / 1000.0 - timestamp) < 30000) {
					weight = Math.pow(2, (timestamp - Date.now() / 1000.0) / 300.0);
				} else {
					weight = Math.pow(2, -100);
				}

				sumRating += rating * weight;
				totalWeight += weight;
				console.log(rating + ", " + (Date.now() / 1000.0 - timestamp) + ", " + weight);
				console.log(Date.now() / 1000);
			});

			// Add fake data to fill chart
			while(window.data.length < window.maxDataLength) {
				var newItem = {time: (Date.now() / 1000) + (window.data.length - window.maxDataLength), val: 0};
				window.data.push(newItem);
			}
			window.data.push({time: Date.now() / 1000, val: parseInt(sumRating / totalWeight )});
			
			updateLineChart();
			drawAverage();
			getCurrentRatingsAndDrawInstant();
		});
	}
	else {
		updateLineChart();
		for(var i = 0; i < window.maxDataLength; i++) {
			window.data.push({time: (Date.now() / 1000) - window.maxDataLength + i,
				 val: 0});
		}
		
		drawAverage();
		getCurrentRatingsAndDrawInstant();
	}
}

function updateLineChart() {
	d3.select("svg.line").selectAll("*").remove();
	
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

		for(var i = 0; i < window.maxVal / window.rangeSize; i++)
			window.counts.push(0);
		
		console.log("Counts: " + window.counts);
		window.ratingsChartData.data = window.counts;
		window.ratingsChart.update();
		
	} else {
		//console.log("Getting ratings for: " + classId);
		firebase.database().ref('/Classes/' + classId + '/Students').once('value').then(function(snapshot) {
			window.studentData = snapshot.val();
			var ratings = [];
			for(studentId in window.studentData) {
				ratings.push(window.studentData[studentId].rating);
			}
			
			//console.log("Ratings = " + ratings);
			window.counts = getCounts(ratings);			
			window.ratingsChartData.data = window.counts;
			window.ratingsChart.update();
		});
	}

	console.log("Counts: " + window.counts.length)
}

function getCounts(data) {
	var countObject = {};
	for (var i = 0; i <= window.maxVal / window.rangeSize; i++)
		countObject[i] = 0;

	for(var i = 0; i < data.length; i++)
		countObject[parseInt(data[i] / window.rangeSize)] += 1;
	
	console.log(countObject);
	
	var countsArray = [];
	for(var i = 0; i < window.maxVal / window.rangeSize; i++)
		countsArray.push(countObject[i]);
		
	countsArray[(window.maxVal / window.rangeSize) - 1] += countObject[window.maxVal / window.rangeSize];
	return countsArray;
}

// Gets all available courses and adds them to the dropdown selector
function getClasses() {
	//document.getElementById('selectClass').options.length = 0;
	firebase.database().ref('Classes').once('value').then(function(snapshot) {
		var cids = Object.keys(snapshot.val());
		var select = document.getElementById("selectClass"); 

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
	var e = document.getElementById("selectClass");
	return e.options[e.selectedIndex].value;
}

function initMap() {
	console.log("came here$$$");

	window.map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 13,
	  center: {lat:33.645278, lng: -117.831287}
});

// Create an array of alphabetical characters used to label the markers.

// Add some markers to the map.
// Note: The code uses the JavaScript Array.prototype.map() method to
// create an array of markers based on a given "locations" array.
// The map() method here has nothing to do with the Google Maps API.

}

function addMarker(locations){
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			console.log(locations);

	var markers = locations.map(function(location, i) {
		return new google.maps.Marker({
    		position: location,
    		label: labels[i % labels.length]
  		});
	});

	// Add a marker clusterer to manage the markers.
	var markerCluster = new MarkerClusterer(window.map, markers,
	    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}


function getQuestions() {
	console.log(current_cid(),"classid****");
	console.log("Got the questions");
	drawGraph();
	var allGeoData = [];

	firebase.database().ref('Classes/' + current_cid() + '/Attendence').on('value',function(snapshot) {
	   snapshot.forEach(function(childSnapshot) {
		      var key = childSnapshot.key;
		      // childData will be the actual contents of the child
		      var childData = childSnapshot.val();
		      console.log(childData);
		      console.log(childData["lat"]);
		      allGeoData.push(childData);
		      console.log(allGeoData,"ALLgEOdATA");
		  });
	   addMarker(allGeoData);
	});

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
	
	firebase.database().ref('Classes/' + current_cid() + '/studentQuestions').on('value', function(snapshot) {
		var value = "";
		window.messages = snapshot.val();
		for(messageId in window.messages) {
			messageText = window.messages[messageId].text;
			value += messageText + "\n\n";
		}
		document.getElementById("textBox").value = value;
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
	
	var questionRef = firebase.database().ref('Classes/' + current_cid() + '/questions/' + current_qid());
	window.questionData = [];
	questionRef.once('value').then(function(snapshot) {
		window.answerCounts = [];
		var answerTexts = [];
		window.questionData = snapshot.val();
		window.questionsChartData.title = window.question.text;
		for(answerId in window.questionData.answers) {
			var answerText = window.questionData.answers[answerId].text;
			answerTexts.push(answerText);
			
			var users = window.questionData.answers[answerId].users;
			window.answerCounts.push(Object.keys(users).length);
		}
		
		console.log("Adding answerCountData");
		window.questionsChartData.data = window.answerCounts;
		window.questionsChart.data.labels = answerTexts;
		window.questionsChart.update();
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
	y.domain([0, window.maxVal]);

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


function addQuestion(txt, correct, wrong1, wrong2, wrong3, wrong4) {
	alert("Question added!");
	question = firebase.database().ref('Classes/' + current_cid() + '/questions').push();
	question.set({
		text: txt
	});
	console.log('1')
	question.push().set({
		text: correct,
		correct: true
	});
	question.push().set({
		text: wrong1,
		correct: false
	}); 
	question.push().set({
		text: wrong2,
		correct: false
	});
	question.push().set({
		text: wrong3,
		correct: false
	});
	question.push().set({
		text: wrong4,
		correct: false
	});
}

function printData() {
	return window.data;
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
