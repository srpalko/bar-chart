const width = 1200;
const height = 700;
const padding = 50;

/* create the svg canvas */



fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
   .then(response => response.json())
   .then(data => {

      // map dates in data to Date objects
      const dates = data.data.map((entry) => { return new Date(entry[0] + "T00:00:00") });
      const dataSize = data.data.length;

      // set the scale of the bars
      const yScale = d3.scaleLinear();
      yScale.domain([0, d3.max(data.data, (d) => d[1])]).range([height - 100, 50]).nice(); // for nested max or min use (d) => d[n] as 2nd arg
      // set the scale of the y-axis
      const yAxisScale = d3.scaleLinear();
      yAxisScale.domain([0, d3.max(data.data, (d) => d[1])]).range([height - 100, 50]).nice();
      // set the scale of the x-axis
      const xScale = d3.scaleTime();
      xScale.domain([d3.min(dates), d3.max(dates)]).range([0, width - 100]).nice();

      const scaledValues = data.data.map((d) => yScale(d[1]));
      console.log(scaledValues);

      // create the axes
      let yAxis = d3.axisLeft(yScale).tickSize(-width + 100);
      let xAxis = d3.axisBottom(xScale);

      // create the <svg> element and append the axes
      const svg = d3.select("#chart-div")
         .append("svg")
         .attr("width", width)
         .attr("height", height)
         .append("g")
         .attr("id", "y-axis")
         .call(yAxis)
         .attr("transform", "translate(50,0)")
         .append("g")
         .attr("id", "x-axis")
         .call(xAxis);
      
      // takes a date in the YYYY-MM-DD format and returns YYYY Qn where Q = quarter
      function quarterizer(date) {
         switch (date.substring(5, 7)) {
            case '01':
               return (date.substring(0, 4) + ' Q1');
            case '04':
               return (date.substring(0, 4) + ' Q2');
            case '07':
               return (date.substring(0, 4) + ' Q3');
            case '10':
               return (date.substring(0, 4) + ' Q4');
         }
      };

      // formats the data for display in the tooltip
      function formatTooltip(data) {
         if (data[1] < 1000) {
            return `<p>${quarterizer(data[0])}<br> ${(data[1]).toFixed(1)} billion USD</p>`;
         } else {
            return `<p>${quarterizer(data[0])}<br> ${(data[1] / 1000).toFixed(4)} trillion USD</p>`;
         }
      };

      const toolTip = d3.select("#chart-div")
         .append("div")
         .attr("id", "tooltip")
         .style("opacity", 0);

      // create rects for bars on graph and map to data.
      svg.selectAll("rect")
         .data(data.data)
         .enter()
         .append("rect")
         .attr("x", (d, i) => xScale(dates[i])) // space out bars on x axis
         .attr("y", (d, i) => yScale(d[1])) // invert y axis (y = h - m * d)
         .attr("class", "bar")
         .attr("height", (d, i) => yScale(0) - yScale(d[1]))
         .attr("width", width / dataSize)
         .attr("data-date", (d) => d[0])
         .attr("data-gdp", (d) => d[1])
         .on("mouseover", function (event, d) {
            toolTip.transition()
               .duration(200)
               .style("opacity", .9);
            toolTip.html(formatTooltip(d))
               .style("left", (event.pageX + 20) + "px")
               .style("top", (event.pageY - 28) + "px")
               .attr("data-date", d[0]);
         })
         .on("mouseout", (d) => {
            toolTip.transition()
               .duration(500)
               .style("opacity", 0);
         })
   });














