function OnInteractiveChart() {
  document.getElementById("intro-container").classList.remove("active");
  document.getElementById("increment-container").classList.remove("active");
  document.getElementById("interactive-container").classList.add("active");
  d3.select("increment-chart").select("svg").remove();
  document.getElementById("increment-chart").innerHTML = "";
  d3.select("interactive-chart").select("svg").remove();
  document.getElementById("interactive-chart").innerHTML = "";

  document.getElementById("yearRadio").checked = true;
  document.getElementById("popRadio").checked = true;

  DrawLineChart(1950, 1975, 'Population');

}

async function DrawLineChart(stYear, endYear, graphType) {

  if (graphType == 'Population') {

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");

    const margin = { top: 20, right: 20, bottom: 60, left: 90 },
      width = 800 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

    // Set up the x and y scales

    const x = d3.scaleLinear()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    // Create the SVG element and append it to the chart container

    const svg = d3.select("#interactive-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // // Load and Process Data

    d3.csv("World_Population_Growth.csv").then(function (data) {

      //Define the x and y domains
      x.domain([stYear, endYear]);
      y.domain([65000, d3.max(data, d => d.Population)]);

      const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Population));

      // Add the x-axis

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .scale(x)
          .ticks(10));


      // Add the y-axis

      svg.append("g")
        .call(d3.axisLeft(y)
          .tickFormat(function (d) {

            if (d > 1000000) {
              d = d / 1000000;
            }
            d = d + 'M';
            return d;
          }))

      // Create the line generator


      // Add the line path to the SVG element

      var path = svg.append("path")
        .datum(data.filter(function (d) { return (d.Year >= stYear) && (d.Year <= endYear); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);


      // Get the total length of the path
      var totalLength = path.node().getTotalLength();

      // Set initial styles for animation
      path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)  // Duration of the animation in milliseconds
        .ease(d3.easeLinear)  // Linear easing for constant speed
        .attr("stroke-dashoffset", 0);  // Transition to fully drawn path

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 2)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Population");

      svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", (width / 2) + margin.top)
        .attr("y", height + margin.top + 40)
        .text("Year");

      const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");
      // create a listening rectangle

      const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height);

      // create the mouse move function

      listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.Year).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
        const xPos = x(d.Year);
        const yPos = y(d.Population);


        // Update the circle position

        circle.attr("cx", xPos)
          .attr("cy", yPos);

        //console.log(xPos)

        // Add transition for the circle radius

        circle.transition()
          .duration(50)
          .attr("r", 5);

        // add in  our tooltip

        tooltip
          .style("display", "block")
          .style("left", `${xPos + 100}px`)
          .style("top", `${yPos + 150}px`)
          .html(`<strong>Date:</strong> ${d.Year}<br><strong>Population:</strong> ${d.Population !== undefined ? (d.Population / 1000).toFixed(0) + 'k' : 'N/A'}`)
      });
      // listening rectangle mouse leave function

      listeningRect.on("mouseleave", function () {
        circle.transition()
          .duration(50)
          .attr("r", 0);

        tooltip.style("display", "none");
      });

    });
    const annot = [
      {
        note: {
        label: "Population has consistently increased over time",
        title: "World Population"
        },
        x: 600,
        y: 150,
      }
    ]
    svg.append("g").call(d3.annotation().annotations(annot));
    svg.append("g").call(d3.annotation().annotations(annot));
    svg.append("g")
          .append("text")
          .attr("x", 480)
          .attr("y", -5)
          .style('fill', '#c95824e3')
          .text("** Hover over the line for tooltip");
  }
  else {
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");

    const margin = { top: 20, right: 20, bottom: 60, left: 90 },
      width = 800 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

    // Set up the x and y scales

    const x = d3.scaleLinear()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    // Create the SVG element and append it to the chart container

    const svg = d3.select("#interactive-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // // Load and Process Data

    d3.csv("World_Population_Growth.csv").then(function (data) {

      //Define the x and y domains
      x.domain([stYear, endYear]);
      y.domain([65000, d3.max(data, d => d.Number)]);

      const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Number));

      // Add the x-axis

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .scale(x)
          .ticks(10));


      // Add the y-axis

      svg.append("g")
        .call(d3.axisLeft(y)
          .tickFormat(function (d) {

            if (d > 1000000) {
              d = d / 1000000;
            }
            d = d + 'M';
            return d;
          }))

      // Create the line generator


      // Add the line path to the SVG element

      var path = svg.append("path")
        .datum(data.filter(function (d) { return (d.Year >= stYear) && (d.Year <= endYear); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);


      // Get the total length of the path
      var totalLength = path.node().getTotalLength();

      // Set initial styles for animation
      path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)  // Duration of the animation in milliseconds
        .ease(d3.easeLinear)  // Linear easing for constant speed
        .attr("stroke-dashoffset", 0);  // Transition to fully drawn path

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 2)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Increment");

      svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "end")
        .attr("x", (width / 2) + margin.top)
        .attr("y", height + margin.top + 40)
        .text("Year");

      const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");
      // create a listening rectangle

      const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height);

      // create the mouse move function

      listeningRect.on("mousemove", function (event) {

        
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.Year).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        if(d0.Year == 'undefined' || d1.Year == 'undefined'){
          console.log("d0" + d0);
          console.log("d1" + d1);
          console.log("x0" + x0);
        }
        const d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
        const xPos = x(d.Year);
        const yPos = y(d.Number);
        



        // Update the circle position

        circle.attr("cx", xPos)
          .attr("cy", yPos);

        //console.log(xPos)

        // Add transition for the circle radius

        circle.transition()
          .duration(50)
          .attr("r", 5);

        // add in  our tooltip

        tooltip
          .style("display", "block")
          .style("left", `${xPos + 100}px`)
          .style("top", `${yPos + 150}px`)
          .html(`<strong>Date:</strong> ${d.Year}<br><strong>Increment:</strong> ${d.Number !== undefined ? (d.Number / 1000).toFixed(0) + 'k' : 'N/A'}`)
      });
      // listening rectangle mouse leave function

      listeningRect.on("mouseleave", function () {
        circle.transition()
          .duration(50)
          .attr("r", 0);

        tooltip.style("display", "none");
      });    

    });
    const annot = [
      {
        note: {
        label: "The graph has fluctuations in the growth pattern",
        title: "Increment in World Population"
        },
        x: 600,
        y: 120,
      }
    ]
    svg.append("g").call(d3.annotation().annotations(annot));
    svg.append("g")
          .append("text")
          .attr("x", 480)
          .attr("y", -5)
          .style('fill', '#c95824e3')
          .text("** Hover over the line for tooltip");
    
  }    

}
document.addEventListener("DOMContentLoaded", async function () {
  d3.selectAll('input[name="InputYears"]').on("change", function () {
    d3.select("interactive-chart").select("svg").remove();
    document.getElementById("interactive-chart").innerHTML = "";
    var tempGType = d3.selectAll('input[name="GraphType"]:checked').node().value;
    //console.log(tempGType);
    if (this.value == '1950-1975')
      DrawLineChart(1950, 1975, tempGType);
    else if (this.value == '1976-1990')
      DrawLineChart(1976, 1990, tempGType);
    else if (this.value == '1991-2005')
      DrawLineChart(1991, 2005, tempGType);
    else if (this.value == '2006-2025')
      DrawLineChart(2006, 2025, tempGType);
    else if (this.value == '1950-2025')
      DrawLineChart(1950, 2025, tempGType);
  });

  d3.selectAll('input[name="GraphType"]').on("change", function () {
    d3.select("interactive-chart").select("svg").remove();
    document.getElementById("interactive-chart").innerHTML = "";
    var tempYears = d3.selectAll('input[name="InputYears"]:checked').node().value;
    //console.log(tempYears);
    if (tempYears == '1950-1975')
      DrawLineChart(1950, 1975, this.value);
    else if (tempYears == '1976-1990')
      DrawLineChart(1976, 1990, this.value);
    else if (tempYears == '1991-2005')
      DrawLineChart(1991, 2005, this.value);
    else if (tempYears == '2006-2025')
      DrawLineChart(2006, 2025, this.value);
    else if (tempYears == '1950-2025')
      DrawLineChart(1950, 2025, this.value);
  });
});
