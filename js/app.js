console.log("app.js loaded")

// Create a scatter plot between Healthcare vs Poverty
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our scatter plot
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/data.csv").then(function(healthData) {
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty) * 0.9,
      d3.max(healthData, d => d.poverty) * 1.1
    ])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)*1.1])
        .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

    // Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 12)
  .attr("fill", "teal")
  .attr("opacity", ".6");

// Add State abbreviation to circles 
chartGroup.selectAll("text.text-circles")
      .data(healthData)
      .enter()
      .append("text")
      .classed("text-circles",true)
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("dy",5)
      .attr("text-anchor","middle")
      .attr("font-size","12px")
      .attr("fill", "white");

// append y axis
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Lacks Healthcare (%)");
  
// append x axis
chartGroup.append("text")
  .attr("y", height + margin.bottom/2 - 10)
  .attr("x", width / 2)
  .attr("dy", "1em")
  .classed("aText", true)
  .text("In Poverty (%)");

});
