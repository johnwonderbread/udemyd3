/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750); 

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
var yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0]);


d3.json("data/revenues.json").then(function(data){
    // console.log(data);

    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue
        d.profit = +d.profit;
    });

    console.log(data);    

    d3.interval(function(){
        var newData = flag ? data : data.slice(1);

        update(newData)
        flag = !flag
    }, 1000);

    update(data);
});

function update(data) {
    var value = flag ? "revenue" : "profit"; 

    x.domain(data.map(function(d){ return d.month }))
    y.domain([0, d3.max(data, function(d) { return d[value] })])

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return "$" + d; });
    yAxisGroup.transition(t).call(yAxisCall);

    // Join new data with old elements
    var rects = g.selectAll("circle")
        .data(data, function(d){
            return d.month;
        }); 

    // Exit old elements
    rects.exit()
        .attr("fill", "red")
    .transition(t)
        .attr("cy", y(0))
        .remove();

    // Enter new data onto the screen
    rects.enter()
        .append("circle")
            .attr("cx", function(d){ return x(d.month) })
            .attr("width", function(d){return x(d.month) + x.bandwidth() / 2})
            .attr("fill", "grey")
            .attr("cy", y(0))
            .attr("r", 5)
            .merge(rects)
            .transition(t)
                .attr("cy", function(d){ return y(d[value]); })
                .attr("cx", function(d){return x(d.month) + x.bandwidth() / 2}); 

    var label = flag ? "Revenue" : "Profit"; 

    yLabel.text(label);

}







