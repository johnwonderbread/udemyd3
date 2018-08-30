/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var margin = {top: 10, left: 100, bottom: 100, right: 10}

var width = 600 - margin.left - margin.right; 
var height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area") 
	.append("svg")
		.attr("width", width + margin.left + margin.right) 
		.attr("height", height + margin.top + margin.bottom)
	.append("g") 
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	// X label 
g.append("text") 
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px") 
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");

	// Y label 
g.append("text") 
	.attr("y", -40)
	.attr("x", - (height/2)) 
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)");

	// X scale
var x = d3.scaleLog() 
	.domain([300, 150000])
	.range([0, width]);

	// Y scale
var y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

	//X Axis Call
var xAxisCall = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));
g.append("g") 
	.attr("class", "x axis") 
	.attr("transform", "translate(0, " + height + ")") 
	.call(xAxisCall);

	//Y Axis Call
var yAxisCall = d3.axisLeft(y);
g.append("g")
	.attr("class", "y axis") 
	.call(yAxisCall);

d3.json("data/data.json").then(function(data){
	console.log(data);

	//clean data
	const formattedData = data.map(function(year){
		return year["countries"].filter(function(country){
			var dataExists = (country.income && country.life_exp);
			return dataExists;
		}).map(function(country){
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});
	
	console.log(formattedData);
	
	data = formattedData
	
	console.log(data);

	var circles = g.selectAll("circle")
		.data(data)

	circles.enter()
		.append("circle")
			.attr("cy", function(d){return y(d.life_exp); })
			.attr("cx", function(d){return x(d.income); })
			.attr("r", function(d){return d.population})
});
