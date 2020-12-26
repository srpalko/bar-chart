

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
   .then(response => response.json())
   .then(data => {
/* decide the size of SVG element */
const width = 1400;
const height = 700;
const padding = 30;

const yScale = d3.scaleLinear();
yScale.domain([d3.max(data.data, (d) => d[1]), 0]).range([height - padding, padding]); // for nested max or min use (d) => d[n] as 2nd arg
const xScale = d3.scaleLinear();
xScale.domain([1947, 2016]).range([0, width]);
const yearScale = d3.scaleBand();
yearScale.domain(data.data.map((d) => d)).rangeRound([0, width]);

const dates = data.data.map((entry) => {return new Date(entry[0] + "T00:00:00")});
//console.log(dates);

let yAxis = d3.axisLeft(yScale);
let xAxis = d3.axisBottom(xScale).tickFormat(d3.format(" d"));


/* create the svg canvas */
const svg = d3.select("#chart-div")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("id", "y-axis")
              .call(yAxis)
              .append("g")
              .attr("id", "x-axis")
              .call(xAxis);

// create rects for bars on graph and map to data.
svg.selectAll("rect")
   .data(data.data)
   .enter()
   .append("rect")
   .attr("x", (d, i) => i * yearScale.bandwidth()) // space out bars on x axis
   .attr("y", (d) => height - yScale(d[1])) // invert y axis (y = h - m * d)
   .attr("class", "bar")
   .attr("height", (d) => yScale(d[1]))
   .attr("width", yearScale.bandwidth() - 2)
   .append("title") // add a tooltip
   .text((d) => `${d[0]}, $${d[1]} Billion`);
   });








    