function barchart(svg_id, data){


    var svg = d3.select(svg_id),
        margin = 100,
        width = $(svg_id).width() - margin,
        height = $(svg_id).height() - margin;

    var xScale = d3.scaleBand().range( [0, width] ).padding(0.4),
        yScale = d3.scaleLinear().range( [height, 0] );

    var g = svg.append("g")
                .attr("transform", "translate(" + 50 + "," + 50 + ")");

    var mFare = 0, fFare = 0, mc = 0, fc = 0;

    data.then(data=>{

        for (var i=0; i<data.length; i++){
            if ( data[i]["sex"] == "female") {
                fFare += data[i]["fare"];
                fc += 1;
//                console.log("fm: ", fAge, fc);
            }
            else {
                mFare += data[i]["fare"];
                mc += 1;
//                console.log("fm: ", mAge, mc);
            }

        };
        mFare = mFare / mc;
        fFare = fFare / fc;


        var info = [
            {xaxis: "Male", avgFare: mFare},
            {xaxis: "Female", avgFare: fFare},
//            {xaxis: "ACT", avg: act_count},
        ];
        horizon = info.map(function(object){
            return object.xaxis;
        });
        vertical = info.map(function(object){
            return object.avgFare;
        });

        var maxVal = d3.max(vertical);



        xScale.domain(horizon);
        yScale.domain([0, maxVal+5]);

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("value");

        var barColors = d3.scaleOrdinal()
            .domain(['Male', 'Female'])
            .range(["powderblue", "mediumpurple"])

        g.selectAll("bar")
            .data(info)
            .enter().append("rect")
            .attr("x", function(d) { return xScale(d.xaxis); })
            .attr("y", function(d) { return 0; })
            .attr("width", xScale.bandwidth() )
            .attr("height", function(d) { return 0; })
            .style("fill", function(d) { return barColors(d.xaxis) });

        g.selectAll("rect")
            .on("mouseover", function(d, i) {
//                d3.select(this).transition()
//                  .duration(500)
//                  .attr("d", arcOver);
                div.transition()
                        .duration(200)
                        .style("background-color",barColors(d.xaxis))
                        .style("opacity", .9);
                if (i == 0) {
                    div.html("Average fare for "+d.xaxis+": "+mFare)
                            .style("left", (width+118) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                }
                else if (i == 1) {
                    div.html("Average fare for "+d.xaxis+": "+fFare)
                            .style("left", (width+118) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                }
              })
            .on("mouseout", function(d) {
                div.style("opacity", 0);
//                d3.select(this).transition()
//                  .duration(500)
//                  .attr("d", arcGenerator);
              })
          .transition()
          .duration(800)
          .attr("y", function(d) { return yScale(d.avgFare); })
          .attr("height", function(d) {
//          return height - y(d.Value); })
             return height - yScale(d.avgFare); })
//          .delay(function(d,i){console.log(i) ; return(i*100)})



    });

}

function scatter(svg_id, data) {

    var svg = d3.select(svg_id),
        margin = 100,
        width = $(svg_id).width() - margin,
        height = $(svg_id).height() - margin;


    var g = svg.append("g")
                .attr("transform", "translate(" + 50 + "," + 50 + ")");

    data.then(data => {

        var maxAge = 0, maxFare = 0, maxGpa = 0;
        for( var i = 0 ; i < data.length ; i++) {
            if(data[i]["age"] > maxAge) {
                maxAge = data[i]["age"];
            }
            if(data[i]["fare"] > maxFare) {
                maxFare = data[i]["fare"];
            }

        };

//        console.log(maxAge, maxFare);

        var x = d3.scaleLinear()
            .domain([0, maxAge])
            .range([ 0, width ]);
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0, maxFare+ 100])
            .range([ height, 0]);
        g.append("g")
            .call(d3.axisLeft(y));

        var color = d3.scaleOrdinal()
            .domain(["FARE", "AGE" ])
            .range([ "#440154ff", "#21908dff"])

//        var info = d.satv + d.satm;
//        console.log(info);

        var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", -30)
            .attr("fill", "purple")
            .attr("font-weight", "bold")
            .attr("font-size", "24")
            .text("Fare Distribution per Age");

        g.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 30)
            .attr("font-weight", "bold")
            .attr("fill", "indianred")
            .text("Age");

        g.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -margin)
            .attr("font-weight", "bold")
            .attr("fill", "deepskyblue")
            .text("Fare")

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        g.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
//              .attr("class", function (d) { return "dot " + d.sex } )
              .attr("cx", function (d) { return x(d.age); } )
              .attr("cy", function (d) { return y(d.fare); } )
              .attr("r", 5)
              .style("fill", "lightcoral" )
              .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
            .on("mouseover", function(d) {
                d3.select(this).attr("r", 12).style("fill", "red");
                div.transition()
                    .duration(200)
                    .style("background-color","lightcoral")
                    .style("opacity", .9);
                div.html("Name: "+d.name+"<br/>"+
                "Home: "+d.place+"<br/>"+
                "Age: "+d.age + "<br/>"  +
                "Fare: "+ d.fare+"$")
                    .style("left", (width + 118) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
             .on("mouseout", function(d) {
                d3.select(this).attr("r", 5).style("fill", "lightcoral");
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })


    });

}

function barchartStack(svg_id, data) {

        var svg = d3.select(svg_id),
        margin = 100,
        width = $(svg_id).width() - margin,
        height = $(svg_id).height() - margin;

    var g = svg.append("g")
                .attr("transform", "translate(" + 50 + "," + 50 + ")");

    // Parse the Data
    data.then(data => {

        var alive1 = 0, dead1 = 0;
        var alive2 = 0, dead2 = 0;
        var alive3 = 0, dead3 = 0;

        for (var i=0; i<data.length; i++){
            if (data[i]["survived"]==1) {
                if (data[i]["class"] == 1) {
                    alive1 += 1;
                }
                else if (data[i]["class"] == 2) {
                    alive2 += 1;
                }
                else {
                    alive3 += 1;
                }
            }
            else{
                if (data[i]["class"] == 1) {
                    dead1 += 1;
                }
                else if (data[i]["class"] == 2) {
                    dead2 += 1;
                }
                else {
                    dead3 += 1;
                }
            }
        };

      // List of subgroups = header of the csv files = soil condition here
//      var subgroups = data.columns.slice(1);
      var subgroups = ["alive", "dead"];
      var info = [
            {class: 1, alive: alive1, dead: dead1},
            {class: 2, alive: alive2, dead: dead2},
            {class: 3, alive: alive3, dead: dead3},
        ];
      // List of groups = species here = value of the first column called group -> I show them on the X axis
      var groups = d3.map(data, function(d){return(d.class)}).keys()

      // Add X axis
      var x = d3.scaleBand()
          .domain(groups)
          .range([0, width])
          .padding([0.2])
      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 800])
        .range([ height, 0 ]);
      g.append("g")
        .call(d3.axisLeft(y));

      // color palette = one color per subgroup
      var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['limegreen','#377eb8'])

//#e41a1c
      //stack the data? --> stack per subgroup
      var stackedData = d3.stack()
        .keys(subgroups)
        (info)

      // Show the bars
      g.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return color(d.key); })
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(function(d) {
          return d; })
          .enter().append("rect")
            .attr("x", function(d) {
            return x(d.data.class); })
            .attr("y", function(d) { return 0; })
            .attr("height", function(d) { return 0; })
            .attr("width",x.bandwidth())

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

      g.selectAll("rect")
          .on("mouseover", function(d, i) {
//            d3.select(this).select("g").style("opacity", 1);
//                d3.select(this).transition()
//                  .duration(500)
//                  .attr("d", arcOver);
console.log("i tit: ", i);
            div.transition()
                    .duration(200)
//                    .style("background-color","lightsalmon")
                    .style("opacity", .9);
            if (i == 0) {
                div.html("Class 1 Passernger Survived: "+alive1)
                        .style("left", (width+118) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            else if (i == 1) {
                div.html("Class 2 Passernger Survived: "+alive2)
                        .style("left", (width+118) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            else if (i == 2) {
                div.html("Class 3 Passernger Survived: "+alive3)
                        .style("left", (width+118) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            else if (i == 3) {
                div.html("Class 1 Passernger Died: "+dead1)
                        .style("left", (width+118) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            else if (i == 4) {
                div.html("Class 2 Passernger Died: "+dead2)
                        .style("left", (width+118) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            else if (i == 5) {
                div.html("Class 3 Passernger Died: "+dead3)
                        .style("left", (width+118) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            }
            })
          .on("mouseout", function(d) {
            div.style("opacity", 0);
////                d3.select(this).transition()
////                  .duration(500)
////                  .attr("d", arcGenerator);
          })
          .transition()
          .duration(800)
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) {
//          return height - y(d.Value); })
             return y(d[0]) - y(d[1]); })
//          .delay(function(d,i){console.log(i) ; return(i*100)})

        var size = 20
        g.append("g")
        .selectAll("g")
        .data(stackedData)
          .enter()
          .append("rect")
            .attr("x", width-50)
            .attr("y", function(d,i){ return 5 + i*(size+5)-40}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d.key)})

        // Add one dot in the legend for each name.
        g.append("g")
        .selectAll("g")
        .data(stackedData)
          .enter()
          .append("text")
            .attr("x", width + size*1.2-50)
            .attr("y", function(d,i){ return 5 + i*(size+5) + (size/2)-37}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d.key)})
            .style("opacity", 0.7)
            .text(function(d){ return d.key})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


    });

}


function piechart(svg_id, data) {

    var width = 850,
            height = 450,
            margin = 40;

    var radius = Math.min(width, height) / 2 - margin;

    var svg = d3.select(svg_id)
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    data.then(data => {

        var mAlive = 0, mDead = 0;
        var fAlive = 0, fDead = 0;

        for (var i=0; i<data.length; i++){
            if (data[i]["survived"]==1) {
                if(data[i]["sex"] == "male") {
                    mAlive += 1;
                }
                else{
                    fAlive += 1;
                }
            }
            else{
                if(data[i]["sex"] == "male") {
                    mDead += 1;
                }
                else{
                    fDead += 1;
                }
            }
        };

//        console.log(mAlive);
//        console.log(mDead);


        var data = {"Male Survived": mAlive,"Female Survived": fAlive, "Male Died": mDead, "Female Died": fDead};

        var color = d3.scaleOrdinal()
          .domain(data)
          .range(d3.schemeSet1);

        var pie = d3.pie()
          .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data));
//        console.log("dr: ", data_ready);

        var arcGenerator = d3.arc()
          .innerRadius(0)
          .outerRadius(radius)

        var arcOver = d3.arc()
          .innerRadius(0)
          .outerRadius(radius + 30);

        var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);


        var duration = 250;

        var arcs = svg.selectAll('mySlices')
                    .data(data_ready)
                  .enter().append("g")
                    .attr("class", "arcGenerator")
                    .style('cursor', 'pointer')
//                    .on('mouseover', (event, v) => {
//                        d3.select(event.currentTarget)
//                            .transition()
//                            .duration(duration)
//                            .attr('transform', calcTranslate(v, 6));
//                        d3.select(event.currentTarget).select('path')
//                            .transition()
//                            .duration(duration)
//                            .attr('stroke', 'rgba(100, 100, 100, 0.2)')
//                            .attr('stroke-width', 4);
////                        d3.select('.card-back text').text(v.data.type);
//                    })
//                    .on('mouseout', (event, v) => {
//                      d3.select(event.currentTarget)
//                        .transition()
//                        .duration(duration)
//                        .attr('transform', 'translate(0, 0)');
//                      d3.select(event.currentTarget).select('path')
//                            .transition()
//                            .duration(duration)
//                            .attr('stroke', 'white')
//                            .attr('stroke-width', 1);
//                    });

        arcs.append("path")
            .attr('d', arcGenerator)
            .attr("fill", function(d) { return color(d.data.key); })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("mouseover", function(d, i) {
                d3.select(this).transition()
                  .duration(500)
                  .attr("d", arcOver);
                div.transition()
                        .duration(200)
                        .style("background-color",color(d.data.key))
                        .style("opacity", .9);
                if (i == 0) {
                    div.html(" Male Survived: "+d.data.value)
                            .style("left", (width+64) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                }
                else if (i == 1) {
                    div.html(" Female Survived: "+d.data.value)
                            .style("left", (width+64) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                }
                else if (i == 2) {
                    div.html(" Male Died: "+d.data.value)
                            .style("left", (width+64) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                }
                else if (i == 3) {
                    div.html(" Female Died: "+d.data.value)
                            .style("left", (width+64) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                }
              })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                  .duration(500)
                  .attr("d", arcGenerator);
              })
            .transition()
                .ease(d3.easeBounce)
                .duration(2000)
                .attrTween("d", tweenPie)


//        svg
//          .selectAll('mySlices')
//          .data(data_ready)
//          .enter()
//          .append('path')
//            .attr('d', arcGenerator)
//            .attr('fill', function(d){ return(color(d.data.key)) })
//            .attr("stroke", "black")
//            .style("stroke-width", "2px")
//            .style("opacity", 0.7)


        svg
          .selectAll('mySlices')
          .data(data_ready)
          .enter()
          .append('text')
          .text(function(d){ return d.data.value})
          .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
          .style("text-anchor", "middle")
          .style("font-size", 17)

        var size = 20
        svg.selectAll("mydots")
          .data(data_ready)
          .enter()
          .append("circle")
            .attr("cx", 250)
            .attr("cy", function(d,i){ return i*25- 200}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return color(d.data.key)})
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
          .data(data_ready)
          .enter()
          .append("text")
            .attr("x", 250 + size*1.2)
            .attr("y", function(d,i){ return i*(size+5) + (size/2) - 206}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d.data.key)})
            .text(function(d){ return d.data.key + ": "+ d.data.value})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


        function tweenPie(b) {
              b.innerRadius = 0;
              var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
              return function(t) { return arcGenerator(i(t)); };
        }



    });

}
