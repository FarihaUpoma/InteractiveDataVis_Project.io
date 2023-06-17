function parachart(svg_id, data) {
    var margin = {top: 30, right: 10, bottom: 10, left: 0},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(svg_id)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    data.then(data => {

      // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
      dimensions = d3.keys(data[0]).filter(function(d) { return d != "class" })
//console.log(dimensions);
      // For each dimension, I build a linear scale. I store all in a y object
      var y = {}
      for (i in dimensions) {
        name = dimensions[i];
        y[name] = d3.scaleLinear()
          .domain( d3.extent(data, function(d) {
           return +d[name]; }) )
          .range([height, 0])
      }

      // Build the X scale -> it find the best position for each Y axis
      x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
      function path(d) {
          return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
      }

      // Draw the lines
      svg
        .selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "blueviolet")
        .style("opacity", 0.5)

      // Draw the axis:
      svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function(d) { return d; })
          .style("fill", "black")

    });
}

function horibox(svg_id, data) {

    var margin = {top: 10, right: 30, bottom: 50, left: 70},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(svg_id)
      .append("svg")
        .attr("width", width + margin.left + margin.right+100)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Read the data and compute summary statistics for each specie
    data.then(data => {

      // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
      var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) {
        console.log("d.class: ", d.class);
        return d.class;})
        .rollup(function(d) {

          q1 = d3.quantile(d.map(function(g) { return g.sl;}).sort(d3.ascending),.25)
          median = d3.quantile(d.map(function(g) { return g.sl;}).sort(d3.ascending),.5)
          q3 = d3.quantile(d.map(function(g) { return g.sl;}).sort(d3.ascending),.75)
          interQuantileRange = q3 - q1
          min = q1 - 1.5 * interQuantileRange
          max = q3 + 1.5 * interQuantileRange
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)
        sumstat.pop();
console.log("sumstat: ", sumstat);
      // Show the Y scale
      var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(["setosa", "versicolor", "virginica"])
        .padding(.4);
      svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
//        .select(".domain").remove()

      // Show the X scale
      var x = d3.scaleLinear()
        .domain([4,8])
        .range([0, width])
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
//        .select(".domain").remove()

      // Color scale
      var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([4,8])

      // Add X axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height + margin.top + 30)
          .text("Sepal Length");

      // Show the main vertical line
      svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
          .attr("x1", function(d){
          console.log("d.value.min: ", x(d.value.min));
          return(x(d.value.min))})
          .attr("x2", function(d){
          console.log("d.value.max: ", x(d.value.max));
          return(x(d.value.max))})
//          .attr("x1", 200)
//          .attr("x2", 400)
          .attr("y1", function(d){return( y(d.key.replace("Iris-", "")) + y.bandwidth()/2)})
          .attr("y2", function(d){return( y(d.key.replace("Iris-", "")) + y.bandwidth()/2)})
          .attr("stroke", "black")
          .style("width", 40)

      // rectangle for the main box
      svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){
//            console.log(x(d.value.q1)) ;
            return(x(d.value.q1))}) // console.log(x(d.value.q1)) ;
            .attr("width", function(d){
//             console.log(x(d.value.q3)-x(d.value.q1));
             return(x(d.value.q3)-x(d.value.q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
            .attr("y", function(d) { return y(d.key.replace("Iris-", "")); })
            .attr("height", y.bandwidth() )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
            .style("opacity", 0.3)


      // Show the median
      svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
          .attr("y1", function(d){return(y(d.key.replace("Iris-", "")))})
          .attr("y2", function(d){return(y(d.key.replace("Iris-", "")) + y.bandwidth()/2)})
          .attr("x1", function(d){return(x(d.value.median))})
          .attr("x2", function(d){return(x(d.value.median))})
          .attr("stroke", "black")
          .style("width", 80)

      // create a tooltip
      var tooltip = d3.select(svg_id)
        .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("font-size", "16px")
      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 1)
        tooltip
            .html("<span style='color:grey'>Sepal length: </span>" + d.sl) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]+30) + "px")
      }
      var mousemove = function(d) {
        tooltip
          .style("left", (d3.mouse(this)[0]+30) + "px")
          .style("top", (d3.mouse(this)[1]+30) + "px")
      }
      var mouseleave = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }
data.pop();
      // Add individual points with jitter
      var jitterWidth = 50
      svg
        .selectAll("indPoints")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function(d){ return(x(d.sl))})
          .attr("cy", function(d){
          return( y(d.class.replace("Iris-", "")) + (y.bandwidth()/2) - jitterWidth/2 + Math.random()*jitterWidth )})
          .attr("r", 4)
          .style("fill", function(d){ return(myColor(+d.sl)) })
          .attr("stroke", "black")
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)


    });
}

