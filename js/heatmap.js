function periodicPattern(data,queryMeasure){
	var heatmapData;
	var dates = [];
	var minDate,maxDate;
	if(queryMeasure==="0"){
		//First we extract the max value for the color scale. To use the same scale accross all heatmaps. We also need to extract maximun date so that all normal day heatmaps end at the same date and scales are aligned.
		//We then calculate the weekdata per each element and calculate max values for the scales of weekdata so that all weekheatmaps graphs share the same scale.
		var maxValueLinks = [];
		var maxValueNodes = [];
		var maxWeekDataLinks = [];
		var maxWeekDataNodes = [];
		data.links.forEach(function(d){
			//Extract Normal heatmap Max per each element
			maxValueLinks.push(d.data.input.max);
			maxValueLinks.push(d.data.output.max);
			d.data.input.values.forEach(function(d){
				dates.push(d[0])
			})
			d.data.output.values.forEach(function(d){
				dates.push(d[0])
			})
			//Calculate Weekday Data per each element
			d.data.input.weekData = calculateWeekData(d.data.input.values);
			d.data.output.weekData = calculateWeekData(d.data.output.values);
			//Extract Max of each WeekdayData
			maxWeekDataLinks.push(d3.max(d.data.input.weekData.arrayOfValues));
			maxWeekDataLinks.push(d3.max(d.data.output.weekData.arrayOfValues));
		});
		if(data.nodes){
			data.nodes.forEach(function(d){
				////Extract Normal heatmap Max per each element
				maxValueNodes.push(d.data.input.max);
				maxValueNodes.push(d.data.output.max);
				d.data.input.values.forEach(function(d){
					dates.push(d[0]);
				})
				d.data.output.values.forEach(function(d){
					dates.push(d[0]);
				})
				//Calculate Weekday Data per each element
				d.data.input.weekData = calculateWeekData(d.data.input.values);
				d.data.output.weekData = calculateWeekData(d.data.output.values);
				//Extract Max of each WeekdayData
				maxWeekDataNodes.push(d3.max(d.data.input.weekData.arrayOfValues));
				maxWeekDataNodes.push(d3.max(d.data.output.weekData.arrayOfValues));
			});
		}
		//Calculate Max values
		maxValueLinks = d3.max(maxValueLinks);
		maxValueNodes = d3.max(maxValueNodes);
		maxWeekDataLinks = d3.max(maxWeekDataLinks);
		maxWeekDataNodes = d3.max(maxWeekDataNodes);
		maxDate = d3.max(dates);
		minDate = d3.min(dates);
		//we draw a heatmap per input and output for each of the links and then each of the nodes.
		var arrayIndexLinks = 0;
		var arrayIndexNodes = 0;
		for(var element in data.links){
			setTimeout(function(){
				var start = new Date().getTime();
				drawElementText("Input: " + data.links[arrayIndexLinks].description);
				heatmapData = data.links[arrayIndexLinks].data.input.values;
				heatmap(heatmapData,maxValueLinks,maxDate,minDate,queryMeasure);
				weekHeatmap(data.links[arrayIndexLinks].data.input.weekData,maxWeekDataLinks);
				drawElementText("Output: " + data.links[arrayIndexLinks].description);
				heatmapData = data.links[arrayIndexLinks].data.output.values;
				heatmap(heatmapData,maxValueLinks,maxDate,minDate,queryMeasure);
				weekHeatmap(data.links[arrayIndexLinks].data.output.weekData,maxWeekDataLinks);
				arrayIndexLinks++;
				var end = new Date().getTime();
				var time = end - start;
				console.log('Element: ' + arrayIndexLinks+ ' Execution time: ' + time);
			},element*4000)
		}
		setTimeout(function(){
			for(var element in data.nodes){
				setTimeout(function(){
					var start = new Date().getTime();
					drawElementText("Input: " + data.nodes[arrayIndexNodes].node);
					heatmapData = data.nodes[arrayIndexNodes].data.input.values;
					heatmap(heatmapData,maxValueNodes,maxDate,minDate,queryMeasure);
					weekHeatmap(data.nodes[arrayIndexNodes].data.input.weekData,maxWeekDataNodes);
					drawElementText("Output: " + data.nodes[arrayIndexNodes].node);
					heatmapData = data.nodes[arrayIndexNodes].data.output.values;
					heatmap(heatmapData,maxValueNodes,maxDate,minDate,queryMeasure);
					weekHeatmap(data.nodes[arrayIndexNodes].data.output.weekData,maxWeekDataNodes);
					arrayIndexNodes++;
					var end = new Date().getTime();
					var time = end - start;
					console.log('Element: ' + arrayIndexNodes+ ' Execution time: ' + time);
				},element*4000)
			}
		},(data.links.length*4000)+1000)
	}else if(queryMeasure==="1"){
		var maxValue =[];
		data.links.forEach(function(d){
			maxValue.push(d3.max(d.histogram));
			d.values.forEach(function(d){
				dates.push(d[0])
			})
		})
		maxValue = d3.max(maxValue);
		maxDate = d3.max(dates);
		minDate = d3.min(dates);
		var arrayIndex=0;
		for(var element in data.links){
			setTimeout(function(){
				var start = new Date().getTime();
				drawElementText("Link: " + data.links[arrayIndex].source +  " - " + data.links[arrayIndex].destination + ". <b>Max:</b> " + d3.format(".0f")(data.links[arrayIndex].max) + "% <b>Average:</b> " + d3.format(".2f")(data.links[arrayIndex].avg)+ "%");
				heatmapData = data.links[arrayIndex].values;
				heatmap(heatmapData,maxValue,maxDate,minDate,queryMeasure);
				//weekHeatmap(data.links[arrayIndex].weekData,maxWeekDataLinks);
				arrayIndexLinks++;
				var end = new Date().getTime();
				var time = end - start;
				//console.log('Element: ' + arrayIndex+ ' Execution time: ' + time);
				arrayIndex++;
			},element*4000)
		}
	}else if(queryMeasure==="2"){
		var maxValue =[];
		data.links.forEach(function(d){
			maxValue.push(d3.max(d.histogram));
			d.values.forEach(function(d){
				dates.push(d[0])
			})
		})
		maxValue = d3.max(maxValue);
		maxDate = d3.max(dates);
		minDate = d3.min(dates);
		var arrayIndex=0;
		for(var element in data.links){
			setTimeout(function(){
				var start = new Date().getTime();
				drawElementText("Link: " + data.links[arrayIndex].source +  " - " + data.links[arrayIndex].destination + " <b>Max:</b> " + d3.format(".0f")(data.links[arrayIndex].max) + " ms" + "<b> Average:</b> " + d3.format(".0f")(data.links[arrayIndex].avg) + " ms");
				heatmapData = data.links[arrayIndex].values;
				heatmap(heatmapData,maxValue,maxDate,minDate,queryMeasure);
				//weekHeatmap(data.links[arrayIndex].weekData,maxWeekDataLinks);
				arrayIndexLinks++;
				var end = new Date().getTime();
				var time = end - start;
				//console.log('Element: ' + arrayIndex+ ' Execution time: ' + time);
				arrayIndex++;
			},element*4000)
		}
	}
	d3.select('body')
	  .append('div')
	  .attrs({
	  	id:'heatmapTooltip'
	  })
	  .style("opacity", 0);
	//Function to calculate weekData each hour from data each day
	function calculateWeekData(data){
		var values = [];
		var arrayOfValues = [];
		var weekDaydata = {Mon:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0},Tue:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0},Wed:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0},Thu:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0},Fri:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0},Sat:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0},Sun:{"01":0,"02":0,"03":0,"04":0,"05":0,"06":0,"07":0,"08":0,"09":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"00":0}};
		var hoursInDay = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","00"];
		//Time formats definitions
		getDayOfWeek=d3.timeFormat('%a');
		getHour=d3.timeFormat('%H');
		//Calculate new data for each weekday at each hour
		for(var i=0; i<data.length; i++){
			weekDaydata[getDayOfWeek(data[i][0])][getHour(data[i][0])] +=data[i][1];
		}
		for(var each in weekDaydata){
			for(var element in hoursInDay){
				values.push({"day":each, "hour":hoursInDay[element], "val":weekDaydata[each][hoursInDay[element]]});
				arrayOfValues.push(weekDaydata[each][hoursInDay[element]]);
			}
		}
		//Array of values stores all the values in an array without dates, It is easier to extract max from here.
		return {"values":values,"arrayOfValues":arrayOfValues};
	}
	function handleMouseOver(d,i){
		d3.select(this)
		.styles({
			"stroke-width":1
		})
		div = d3.select('#heatmapTooltip')
		div.transition()
       	   .duration(500)
           .style("opacity", .9);
        if(d.val !== undefined) div.html("<p class ='heatmapTooltipname'>" + d.day + " at " + d.hour + ":</p><p>" + d3.format(".2f")(d.val) + " Gb/s</p>" );
        else div.html("<p class ='heatmapTooltipname'>" + String(d[0]).split(" ")[0] + " " + String(d[0]).split(" ")[1] + " " + String(d[0]).split(" ")[2] + " " + String(d[0]).split(" ")[3] + " at " + String(d[0]).split(" ")[4] + "</p><p>" + d3.format(".2f")(d[1]) + " Gb/s</p>");
        div.style("position","absolute")
           .style("left", (d3.event.pageX + 15) + "px")
           .style("top", (d3.event.pageY ) + "px");
	}
	function handleMouseOut(d,i){
		d3.select(this)
		.styles({
			"stroke-width":0
		})
		div = d3.select('#heatmapTooltip')
		div.transition()
       	   .duration(500)
           .style("opacity", 0);
	}
	function handleMouseOverLosses(d,i,queryMeasure){
		d3.select(this)
		.styles({
			"stroke-width":1
		})
		div = d3.select('#heatmapTooltip')
		div.transition()
       	   .duration(500)
           .style("opacity", .9);
    	if(d[1] !== undefined) div.html("<p class ='heatmapTooltipname'>" + d[0] + ":</p><p>" + d3.format(".2f")(d[1]) + " % of loss</p>" );
    	//else div.html("<p class ='heatmapTooltipname'>" + String(d[0]).split(" ")[0] + " " + String(d[0]).split(" ")[1] + " " + String(d[0]).split(" ")[2] + " " + String(d[0]).split(" ")[3] + " at " + String(d[0]).split(" ")[4] + "</p><p>" + d3.format(".2f")(d[1]) + " Mb/s</p>");
        div.style("position","absolute")
           .style("left", (d3.event.pageX + 15) + "px")
           .style("top", (d3.event.pageY ) + "px");
	}
	function handleMouseOverLatency(d,i,queryMeasure){
		d3.select(this)
		.styles({
			"stroke-width":1
		})
		div = d3.select('#heatmapTooltip')
		div.transition()
       	   .duration(500)
           .style("opacity", .9);
    	if(d[1] !== undefined) div.html("<p class ='heatmapTooltipname'>" + d[0] + ":</p><p>" + d3.format(".0f")(d[1]) + " ms</p>" );
    	//else div.html("<p class ='heatmapTooltipname'>" + String(d[0]).split(" ")[0] + " " + String(d[0]).split(" ")[1] + " " + String(d[0]).split(" ")[2] + " " + String(d[0]).split(" ")[3] + " at " + String(d[0]).split(" ")[4] + "</p><p>" + d3.format(".2f")(d[1]) + " Mb/s</p>");
        div.style("position","absolute")
           .style("left", (d3.event.pageX + 15) + "px")
           .style("top", (d3.event.pageY ) + "px");
	}
	function drawElementText(text){
		d3.select("#AppRegion"+counter)
		.append("p")
		.html(text);
	}

	function createLegend(svgGroup,colorScale,maxData,width,queryMeasure){
		//Create gradients the id assigned has to be the same that appears in the fill parameter of the rectangle
		createGradient("Gradient",svgGroup,colorScale(0),colorScale(maxData));
		var legend = svgGroup.append('g')
		                         .attrs({
		                            "class":"heatMapLegend",
		                            "transform": "translate(" + (width+15) + "," + 20 + ")",
		                         })
		legend.append("rect")
		            .attrs({
		              "class": "legend",
		              "height": 75,
		              "width": 13,
		              "fill": "url(#Gradient)",
		              "stroke":"rgb(0,0,0)",
		              "stroke-width":0.5
		            });
		if(queryMeasure==="2")
		{
		    //Add max and minimum value to Legend
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (-3) + "," + (-5) + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		            .text(Math.ceil(maxData));
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (15) + "," + (45) + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		            .text("ms");
		}else if(queryMeasure==="1"){
			//Add max and minimum value to Legend
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (3) + "," + (-5) + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		             .text(Math.ceil(maxData));
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (14) + "," + (45) + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		            .text("% of Loss");
		}else if(queryMeasure==="0"){
		    //Add max and minimum value to Legend
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (0) + "," + (-5) + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		            .text(Math.ceil(maxData))
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (15) + "," + (45) + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		            .text("Gb/s");
		}
		    legend.append("text")
		            .attrs({
		              "transform": "translate(" + (3) + "," + 90 + ")"
		            })
		            .styles({
		            	'font-size':"0.75em"
		            })
		            .text("0");
	    //Aux function to create an svg vertical Gradient for Legends
		function createGradient(id,svgGroup,startColor,endColor){
		    //Append a defs (for definition) element to your SVG
		    var defs = svgGroup.append("defs");

		    //Append a linearGradient element to the defs and give it a unique id
		    var linearGradient = defs.append("linearGradient")
		        .attr("id", id);
		    //Vertical gradient
		    linearGradient
		        .attrs({
		          "x1": "0%",
		          "y1": "0%",
		          "x2": "0%",
		          "y2": "100%"
		        });
		    //Set the color for the start (0%)
		    linearGradient.append("stop")
		        .attrs({
		          "offset": "0%",
		          "stop-color": endColor //Color bottom
		        })
		    //Set the color for the end (100%)
		    linearGradient.append("stop")
		        .attrs({
		          "offset": "100%",
		          "stop-color": startColor //Color top
		        })
		    return linearGradient;
		}
	}

	function heatmap(data,maxValue,maxDate,minDate,queryMeasure){
		//Margins and size
		var m = [20, 40, 40, 80];
		var w = 1000 - m[1] - m[3];
		var h = 405 - m[0] - m[2];
		var type;
		//Time formats definitions
		var monthFormat = d3.timeFormat("%B");
		var abbrebiatedMonthDayFormat = d3.timeFormat('%b-%d')
		var monthDayFormat = d3.timeFormat('%B-%d');
		var monthDayYearFormat = d3.timeFormat('%B-%d-%Y');
		var monthYearFormat = d3.timeFormat('%B-%Y');
		var monthDayTimeFormat = d3.timeFormat('%B-%d-%H');
		var getDay = d3.timeFormat('%d');
		var getHour = d3.timeFormat('%H');
		var getYear = d3.timeFormat('%Y');
		var getMonthInNumber = d3.timeFormat('%m');
		//Process data
		var dates = [];
		var values = [];
		var hoursInDay = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
		//Process data
		var dates = [];
		var values = [];
		data.forEach(function(d) {
		    d[1] = +d[1];
		    dates.push(d[0]);
		    values.push(d[1]);
		  });
		var endDate = maxDate;
		//We get the range of dates and values for scales.
		//var dateRange = [minDate.setDate(minDate.getDate()-1),maxDate.setDate(maxDate.getDate()+1)];
		var dateRange= [minDate,maxDate];
		var valueRange = d3.extent(values);
		var heatmapDates = [];
		var ticks;
		var ticksFormat;
		//Check range to make a monthly or custom viz depending on the range. We create 3 type of heatmaps weekly, monthly, yearly
		if(d3.timeMonth.count(dateRange[0], dateRange[1]) === 0){//less than a month
			//create month heatmap
			type='month';
			var numbOfDays= new Date(getYear(dateRange[0]), getMonthInNumber(dateRange[0]), 0).getDate();
			//For other browsers I need to set the second time this way
			var lastDate = new Date(dateRange[0]);
			lastDate.setMonth(lastDate.getMonth()+1);
			heatmapDates.push(new Date(monthFormat(dateRange[0]) + " 1 " + getYear(dateRange[0])));
			heatmapDates.push(new Date ( monthFormat(lastDate) + " 1 " + lastDate.getFullYear()));
			ticks=d3.timeDay;
			ticksFormat = abbrebiatedMonthDayFormat;
		}else{//more than a month
			heatmapDates.push(dateRange[0]);
			heatmapDates.push(dateRange[1]);
			ticks=20;
			ticksFormat = abbrebiatedMonthDayFormat;
		}
		//Scales
		var x = d3.scaleTime().domain([heatmapDates[0], heatmapDates[1]]).range([0, w]);
		var y = d3.scaleBand().domain(hoursInDay).range([h, 0]);
		//Color scale
		var colorScale = d3.scaleLinear().domain([0,maxValue])
	    .interpolate(d3.interpolateHcl)
	    .range([d3.rgb("#E1F5FE"), d3.rgb("#01579B")]);
		var cellHeight = y(getHour(data[0][0])) - y(getHour(data[1][0]));
		var cellWidth = x(addDays(data[0][0],1)) - x(data[0][0]);
		//Create viz
		//Initialize svg
		graph = d3.select("#AppRegion"+counter)
			.append('svg')
			.attrs({
				'class':'heatmap',
				'width': w + m[1] + m[3],
				'height':h + m[0] + m[2]
		});
		//Render Axis
		var xAxis = d3.axisBottom()
				      .scale(x)
				      .ticks(ticks)
		  			  .tickFormat(ticksFormat);
		var yAxis = d3.axisLeft()
				      .scale(y);
		//xAxis Text
		graph.append("g")
		      .attrs({
		      	'class': 'xAxis',
		      	'transform': "translate(" + m[1]+ "," + h + ")"
		      })
		      .call(xAxis)
		      .selectAll("text")
		      .attrs({
		      	'dx': -25,
		      	'dy':10,
		      	'transform': function(d) { return 'rotate(-65)';}
		})
	  	graph.append("g")
			  .attrs({
			  	"class": "yAxis",
			  	"transform": "translate(" + m[1] + ",0)"
			  })
			  .call(yAxis)
			  .selectAll("text")
		      .attrs({
		      	'fill': function(d,i){
		      		if(i<8 || i>20) return 'rgb(169, 178, 189)';
		      		else return 'black';
		      	}
		      })
		graph.append("g")
			 .attrs({
			 		"class": "yAxisLabel",
			 		"transform": "translate(" + 12 + "," + 150 + ")",
			 	})
			 .append("text")
		     .attrs({
		     	"text-anchor": "middle",
		     	"transform": function(d) { return 'rotate(-90)';},
		 	 })
		     .text("Time of day")
		//Append Squares
		if(queryMeasure==="1"){
			graph.append('g')
			.attrs({
				'transform': "translate(" + (m[1]+2) + ",0)"
			})
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attrs({
				'id': function(d,i){ return i;},
				'x': function(d) {
					return x(d3.timeDay.floor(d[0]))},
				'y': function(d) {return y(getHour(d[0]))},
				'height': function(d){return cellHeight},
				'width': function(d){return cellWidth},
				'stroke': function(){ return "black"},
				'stroke-width': function(){return 0},
				'fill': function(d){return colorScale(d[1])}

			})
			.on("mouseover", handleMouseOverLosses)
      		.on("mouseout",handleMouseOut);
		}else if(queryMeasure==="0"){
			graph.append('g')
			.attrs({
				'transform': "translate(" + (m[1]+2) + ",0)"
			})
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attrs({
				'id': function(d,i){ return i;},
				'x': function(d) {
					return x(d3.timeDay.floor(d[0]))},
				'y': function(d) {return y(getHour(d[0]))},
				'height': function(d){return cellHeight},
				'width': function(d){return cellWidth},
				'stroke': function(){ return "black"},
				'stroke-width': function(){return 0},
				'fill': function(d){return colorScale(d[1])}

			})
			.on("mouseover", handleMouseOver)
      		.on("mouseout",handleMouseOut);
		}else if(queryMeasure==="2"){
			graph.append('g')
			.attrs({
				'transform': "translate(" + (m[1]+2) + ",0)"
			})
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attrs({
				'id': function(d,i){ return i;},
				'x': function(d) {
					return x(d3.timeDay.floor(d[0]))},
				'y': function(d) {return y(getHour(d[0]))},
				'height': function(d){return cellHeight},
				'width': function(d){return cellWidth},
				'stroke': function(){ return "black"},
				'stroke-width': function(){return 0},
				'fill': function(d){return colorScale(d[1])}

			})
			.on("mouseover", handleMouseOverLatency)
      		.on("mouseout",handleMouseOut);
      	}createLegend(graph, colorScale,maxValue,w+m[3]/2,queryMeasure);
		function addDays(date, days) {
	    	var result = new Date(date);
	    	result.setDate(result.getDate() + days);
	    	return result;
		}
	}
	function weekHeatmap(data,maxValue){
		//Margins and size
		var m = [20, 40, 20, 80];
		var w = 600 - m[1] - m[3];
		var h = 405 - m[0] - m[2];
		var hoursInDay = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
		var weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		//We get the range of values for scales.
		var allValues = [];
		var valueRange = d3.extent(data.arrayOfValues);
		var heatmapDates = [];
		var ticks;
		//Scales
		var x = d3.scaleBand().domain(weekDays).range([0, w]);
		var y = d3.scaleBand().domain(hoursInDay).range([h, 0]);
		//Color scale
		var colorScale = d3.scaleLinear().domain([0,maxValue])
	    .interpolate(d3.interpolateHcl)
	    .range([d3.rgb("#E1F5FE"), d3.rgb("#01579B")]);
	    var cellHeight = y(hoursInDay[0])-y(hoursInDay[1]);
		var cellWidth = x(weekDays[1])-x(weekDays[0]);
		//Create viz
		//Initialize svg
		graph = d3.select("#AppRegion"+counter)
			.append('svg')
			.attrs({
				'class':'heatmap',
				'width': w + m[1] + m[3],
				'height':h + m[0] + m[2]
		});
		graph.append("text")
			 .attrs({
			 	'transform': "translate(" + (m[1]+1) + ",0)"
			 })
			 .text("Weekday Heatmap")
		//Render Axis
		var xAxis = d3.axisBottom()
				      .scale(x);
		var yAxis = d3.axisLeft()
				      .scale(y);
		graph.append("g")
		      .attrs({
		      	'class': 'xAxis',
		      	'transform': "translate(" + m[1]+ "," + h + ")",
		      })
		      .call(xAxis)
		      .selectAll("text")
		      .attrs({
		      	'dx': '0em',
		      	'dy':'1em',
		      })
	  	graph.append("g")
			  .attrs({
			  	"class": "yAxis",
			  	"transform": "translate(" + m[1] + ",0)"
			  })
			  .call(yAxis)
			  .selectAll("text")
		      .attrs({
		      	'fill': function(d,i){
		      		if(i<8 || i>20) return 'rgb(169, 178, 189)';
		      		else return 'black';
		      	}
		      });
		graph.append("g")
			 .attrs({
			 		"class": "yAxisLabel",
			 		"transform": "translate(" + 12 + "," + 150 + ")",
			 	})
			 .append("text")
		     .attrs({
		     	"text-anchor": "middle",
		     	"transform": function(d) { return 'rotate(-90)';},
		 	 })
		     .text("Time of day")
		//Append Squares
		graph.append('g')
			.attrs({
				'transform': "translate(" + (m[1]+1) + ",0)"
			})
			.selectAll("rect")
			.data(data.values)
			.enter()
			.append("rect")
			.attrs({
				'id': function(d,i){ return i;},
				'x': function(d) {
					return x(d.day)},
				'y': function(d) {
					return y(d.hour)},
				'height': function(d){return cellHeight},
				'width': function(d){return cellWidth},
				'stroke': function(){ return "black"},
				'stroke-width': function(){return 0},
				'fill': function(d,i){
					return colorScale(d.val)}

			})
			.on("mouseover", handleMouseOver)
      		.on("mouseout",handleMouseOut);
      	createLegend(graph, colorScale,maxValue,w + m[3]/2,queryMeasure);
	}
}