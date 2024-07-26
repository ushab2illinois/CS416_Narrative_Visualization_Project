function OnLineChart1() {

  document.getElementById("intro-container").classList.remove("active");
  document.getElementById("increment-container").classList.remove("active");
  document.getElementById("population-container").classList.add("active");
  d3.select("population-chart").select("svg").remove();
  document.getElementById("population-chart").innerHTML = "";

  const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

  const margin = { top: 20, right: 20, bottom: 60, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  // Set up the x and y scales

  const x = d3.scaleTime()
    .range([0, width]);

  const y = d3.scaleLinear()
    .range([height, 0]);

  // Create the SVG element and append it to the chart container

  const svg = d3.select("#population-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // // Load and Process Data

  d3.csv("World_Population_Growth.csv").then(function (data) {

    // Parse the date and convert the population to a number 
    const parseDate = d3.timeParse("%Y")
    data.forEach(d => {
      d.Year = parseDate(d.Year);
      d.Population = +d.Population;
    });

    //console.log(data)

    // Define the x and y domains
    x.domain(d3.extent(data, d => d.Year));
    y.domain([65000, d3.max(data, d => d.Population)]);

    const line = d3.line()
      .x(d => x(d.Year))
      .y(d => y(d.Population));

    // Add the x-axis

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeYear.every(5))
        .tickFormat(d3.timeFormat("%Y")));


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
      .datum(data)
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
  });

  const sceneOne_annot = [
    {
      note: {
      label: "1960 to 1961",
      title: "The World Population Growth is less"
      },
      connector: {
        end: "dot",        // Can be none, or arrow or dot
        type: "line",      // ?? don't know what it does
        lineType : "vertical",    // ?? don't know what it does
        endScale: 15     // dot size
      },
      x: 100,
      y: 170,
      dy: 10,
      dx: 10
    }
  ]
  svg.append("g").call(d3.annotation().annotations(sceneOne_annot))
}

function OnHome(){  
  document.getElementById("intro-container").classList.add("active");
  document.getElementById("population-container").classList.remove("active");
  document.getElementById("interactive-container").classList.remove("active");
  document.getElementById("increment-container").classList.remove("active");
  d3.select("interactive-chart").select("svg").remove();
  document.getElementById("interactive-chart").innerHTML = "";
}

function OnLineChart2() {

  document.getElementById("population-container").classList.remove("active");
  document.getElementById("interactive-container").classList.remove("active");
  document.getElementById("increment-container").classList.add("active");
  document.getElementById("increment-chart").innerHTML = ""; 
  d3.select("increment-chart").select("svg").remove();


  const margin = { top: 20, right: 20, bottom: 60, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  // Set up the x and y scales

  const x = d3.scaleTime()
    .range([0, width]);

  const y = d3.scaleLinear()
    .range([height, 0]);

  // Create the SVG element and append it to the chart container

  const svg = d3.select("#increment-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
    d3.csv("World_Population_Growth.csv").then(function (data) {

      // Parse the date and convert the population to a number 
      const parseDate = d3.timeParse("%Y")
      data.forEach(d => {
        d.Year = parseDate(d.Year);
        d.Number = +d.Number;
      });
  
      //console.log(data)
  
      // Define the x and y domains
      x.domain(d3.extent(data, d => d.Year));
      y.domain([65000, d3.max(data, d => d.Number)]);
  
      const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Number));
  
      // Add the x-axis
  
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .ticks(d3.timeYear.every(5))
          .tickFormat(d3.timeFormat("%Y")));
  
  
      // Add the y-axis
  
      svg.append("g")
      .call(d3.axisLeft(y)
        .tickFormat(function (d) {

          if (d > 1000000) {
            d = d / 1000000;
          }
          d = d + 'M';
          return d;
        }));
  
      // Create the line generator
  
  
      // Add the line path to the SVG element
  
      var path = svg.append("path")
        .datum(data)
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
        .attr("y", 0 - margin.left)
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
  
    });

    const sceneTwo_annot = [
      {
        note: {
        label: "from 1960 to 1961",
        title: "The Growth in Population decreased"
        },
        connector: {
          end: "dot",        // Can be none, or arrow or dot
          type: "line",      // ?? don't know what it does
          lineType : "vertical",    // ?? don't know what it does
          endScale: 15     // dot size
        },
        x: 90,
        y: 120,
        dy: 10,
        dx: 10
      }
    ]
    svg.append("g").call(d3.annotation().annotations(sceneTwo_annot))  
    
    const sceneTwo_annot2 = [
      {
        note: {
        label: "in 1990",
        title: "The Growth in Population is Highest"
        },
        connector: {
          end: "dot",        // Can be none, or arrow or dot
          type: "line",      // ?? don't know what it does
          lineType : "vertical",    // ?? don't know what it does
          endScale: 15     // dot size
        },
        x: 370,
        y: 10,
        dy: 30,
        dx: 30
      }
    ]
    svg.append("g").call(d3.annotation().annotations(sceneTwo_annot2))  

}

