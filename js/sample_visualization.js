
function load_sample_visualization(svg_name,data,y_field){

    // General Variables
    let chart = d3.select(svg_name);
    let chart_width  = $(svg_name).width();
    let chart_height = $(svg_name).height();

    // x position scale
	let x = d3.scaleLinear()
    		  .domain([0,data.length-1])
		      .range([10,chart_width-10]);

	// y position scale
	let y = d3.scaleLinear()
			.domain(d3.extent(data,function(d){ return d[y_field]; }))
			.range([chart_height-10,10]);

	// generate points
	let points = chart.selectAll("circle")
					.data(data).enter()
						.append("circle")
							.attr("fill-opacity",0.85)
							.attr("r",5)
							.attr("stroke-width","0px")
							.attr("cx",function(d,i){ return x(i); })
							.attr("cy",function(d){ return y(d[y_field]); })

	// return chart data that can be used later
	return {
		chart : chart,
		chart_width : chart_width,
		chart_height : chart_height,
		x_scale : x,
		y_scale : y,
		points : points
	}
}