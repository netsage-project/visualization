function lineChart(data){
	var links = data.links;
	var nodes = data.nodes;
	createLineCharts(links,"links");
	//I need to create one of this for all linecharts.
		d3.select("#lineChart")
		  .append('div')
		  .attrs({
		  	id:'tooltip'
		  })
		  .style("opacity", 0);
	//createLineCharts(nodes,"nodes");
	function createLineCharts(data,type){
		var margin = {top: 40, right: 10, bottom: 30, left: 40},
	    	width = 610 - margin.left - margin.right,
	    	height = 450 - margin.top - margin.bottom;

		//Scales and Colors
		////Calculate Max values for scales
	    var maxX=[];
	    for (element in data){
	    		maxX.push(data[element].data.input.max);
	    		maxX.push(data[element].data.output.max);
	    }
	    //This max value might need to change depending on what scale is the bigest number in the scale I tried to based in on a percentage so that it aligns but not sure about it.
	    maxX = d3.max(maxX);
	    maxX = maxX + Math.ceil(0.01 * maxX);
	    var x = d3.scaleTime().domain([data[0].data.minDate,data[0].data.maxDate]).range([0, width]);
		var y = d3.scaleLinear().domain([0,maxX]).range([height, 0]);
		var color = d3.scaleOrdinal(d3.schemeCategory10);
		color.domain(data);

		var xAxis = d3.axisBottom()
		    .scale(x);
		    //.ticks(20);

		var yAxis = d3.axisLeft()
		    .scale(y);

		var line = d3.line()
		    .curve(d3.curveLinear)
		    .x(function(d) {
		    	return x(d[0]); })
		    .y(function(d) {
		    	return y(d[1]); });


		var lineChart = d3.select(".applicationRegion").append("div")
		  .attr("id","lineChart")

		//INPUT
		var svgInput = lineChart.append("svg")
			.attr("id","input")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		   	svgInput.append("g")
		   			.attr("class","lineChartTitle")
		   			.attr("transform","translate("+ 10 +", " + 10 + ")")
		   			.append("text")
		   			.text("Input for the last 3 hours (Gb/s)")

		  svgInput.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  svgInput.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Gb/s");

		  var inputNode = svgInput.selectAll(".inputLine")
		      .data(data)
		    .enter().append("g")
		    .attrs({
		    	class: function(d,i){ return "inputLine" + i + " node";},
		    	"id": function(d,i){ return "input"+i },
		    	"transform": "translate(" + margin.left + ",0)"
		    })

		  inputNode.append("path")
		      .attr("class", function(d,i){ return "line " + "line" + i})
		      .attr("d", function(d) { return line(d.data.input.values); })
		      .style("stroke", function(d,i) { return color(i);})
		      .on("mouseover", handleMouseOver)
	      	  //.on("mouseout",handleMouseOut);
			  createLegend(svgInput, color,data,width-margin.left);
		  // svgInput.selectAll(".inputLine")
		  //     .data(data)
		  //   .enter().append("g")
			 //  		.attrs({
			 //  			"class": "dataCircles"
			 //  		})
			 //  		.data(data)
				// 	.append("circle")
			 //      	.attrs({
			 //      		"class":"inputDataPoints",
			 //      		"id": function(d,i){ return "inputDataPoints"+i },
			 //      		cx: function (d,i) {
	   //                		return x(d.data.input.values[i][0]); },
	   //              	cy: function (d,i) { return y(d.data.input.values[i][1]); },
	   //              	r: 5
			 //      	})


		//OUTPUT
		var svgOutput = lineChart.append("svg")
			.attr("id","output")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		    svgOutput.append("g")
		   			.attr("class","lineChartTitle")
		   			.attr("transform","translate("+ 10 +", " + 10 + ")")
		   			.append("text")
		   			.text("Output for the last 3 hours (Gb/s)")

		  svgOutput.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  svgOutput.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Gb/s");

		  var outputNode = svgOutput.selectAll(".outputLine")
	      .data(data)
		    .enter().append("g")
		    .attrs({
		    	class: function(d,i){ return "outputLine" + i + " node";},
		    	"id": function(d,i){ return "output"+i},
		    	"transform": "translate(" + margin.left + ",0)"
		    })

		  outputNode.append("path")
		      .attr("class", function(d,i){ return "line " + "line" + i})
		      .attr("d", function(d,i) { return line(d.data.output.values); })
		      .style("stroke", function(d,i) { return color(i); })
		      .on("mouseover", handleMouseOver)
	      	  //.on("mouseout",handleMouseOut);
			  createLegend(svgOutput, color,data,width-margin.left);
		function createLegend(svgGroup,colorScale,data,width){
		    //Create gradients the id assigned has to be the same that appears in the fill parameter of the rectangle
		    var legend = svgGroup.append('g')
		                         .attrs({
		                            "class":"lineChartLegend",
		                            "transform": "translate(" + (width) + "," + 20 + ")",
		                         })
		    //Add max and minimum value to Legend
		    if(type=="links"){
			    legend.selectAll(".lineChartLegendNames")
			      .data(data)
			      .enter().append("text")
			            .attrs({
			              "transform": function(d,i){ return "translate(" + (-150)  + "," + (i*15) + ")"},
			              "class": "lineChartLegendNames"
			            })
			            .styles({
			            	'font-size':"0.75em",
			            	'stroke': function(d,i){ return colorScale(i);}
			            })
			            .text(function(d){return d.description;});
			}else{
				legend.selectAll(".lineChartLegendNames")
			      .data(data)
			      .enter().append("text")
			            .attrs({
			              "transform": function(d,i){ return "translate(" + (-100)  + "," + (i*15) + ")"},
			              "class": "lineChartLegendNames"
			            })
			            .styles({
			            	'font-size':"0.75em",
			            	'stroke': function(d,i){ return colorScale(i);}
			            })
			            .text(function(d){return d.node;});
			}
		}
		function handleMouseOver(d,i){
			div = d3.select('#tooltip')
			div.transition()
	       	   .duration(500)
	           .style("opacity", .9);
	        if(type=="links") div.html("<p id ='mapTooltipname'> name: " + d.description + "</p>");
	        else div.html("<p id ='mapTooltipname'> name: " + d.node + "</p>");
	        div.style("position","absolute")
	           .style("left", (d3.event.pageX - 50) + "px")
	           .style("top", (d3.event.pageY -1200) + "px");
		}
		function handleMouseOut(d,i){
			div = d3.select('#tooltip')
			div.transition()
	       	   .duration(500)
	           .style("opacity", 0);
		}
		function redrawPath(){
			//Difuse other lines fading away with a transition
	      	d3.selectAll(".node")
	      	  .transition()
	          .duration(1000)
	          .style("opacity", 0.2)
	      	//Length of path for the animation http://bl.ocks.org/duopixel/4063326
	      	var totalLength = this.getTotalLength();
			//We animate the selected path
			d3.selectAll(this)
				.attr("stroke-dasharray", totalLength + " " + totalLength)
					.attr("stroke-dashoffset", totalLength)
					.transition()
				.duration(4000)
				.attr("stroke-dashoffset", 0)
			//We set the opacity of the animated path to one again so that it pops out.
			d3.selectAll(this)
			  .transition()
	          .duration(1000).style("opacity", 1)
		}
	}
}