//#################################### HISTOGRAM TABLE GRAPH FUNCTION ###########################
//This funtion wraps all the functions needed to paint the histogram table, creates the bins for the data and the dimension of the graph then it calles table function.
function histogramTableGraph(queryData){
	//Hold the initial link color before selection
	var linkColor;
	var columns;
	var xTooltipDisplacement = 20;
	var yTooltipDisplacement = 30;
	// Create margins
    var margin = {top: 2, right: 5, bottom: 16, left:15, nameLeft:30, histogramLeft: 0},
    	width = 245 - margin.left - margin.right,
   		height = 120 - margin.top - margin.bottom;
	//Order the data and launch tables
	sortObjects(queryData.links,".data.input.avg");
	//sortObjects(queryData.nodes,".data.input.avg");
	queryData.graphs.table.links = queryData.links;
	//queryData.graphs.table.nodes = queryData.nodes;
	columns = ["Links","Bandwidth Distribution (Gb/s)","Traffic Volume (Gb/s)","(A to Z) Bandwidth (Gb/s)", "(Z to A) Bandwidth (Gb/s)","Total Data (TB)"];
    startTable("links-"+counter,queryData.graphs.table.links);
    //columns = ["Nodes","Incoming Bandwidth (Gb/s)", "Outgoing Bandwidth (Gb/s)","Total Data (TB)"];
    //startTable("nodes-"+counter,queryData.graphs.table.nodes);
	//Convert to dragtable
	//$('table').dragtable();
	//Create static header
	// staticHeader("#multipleHistogram-links-"+counter);
	//staticHeader("#multipleHistogram-nodes-"+counter);

	//#################################### AUX FUNCTIONS ###########################
	//Create a static header for a table
	function staticHeader(tableName){
		table = $(tableName);
		table.after("<table id='header-fixed'></table>")
		var tableOffset = table.offset().top;
		var $header = $("#table-1 > thead").clone();
		var $fixedHeader = $("#header-fixed").append($header);

		$(window).bind("scroll", function() {
		    var offset = $(this).scrollTop();
		    if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
		        $fixedHeader.show();
		    }
		    else if (offset < tableOffset) {
		        $fixedHeader.hide();
		    }
		});
	}
	//############### Function to create custom binnings for the data ###############
	function createBins(data,type){
		var bins;
		switch(type){
			case "sqrRoot":
				bins = Math.ceil(Math.sqrt(data.data.input.histogram.length));
				break;
			case "rice":
				bins = Math.ceil(2 * Math.pow(data.data.input.histogram.length, 1/3));
				break;
			case "fd":
				bins = Math.ceil(2 * (data.data.input.percentile75 - data[0].data.input.percentile25)/ Math.pow(data[0].data.input.histogram.length, 1/3));
				break;
			default://Sturges
				bins= Math.ceil(Math.log2(data.data.input.histogram.length+1));
				break;
		}
		return bins;
	}
	//function to Create header of the Table, and row per data element. Creates the barebones of an html table that will fill up with the rest of the functions
	function startTable(tableName,data){
		function handleMouseOverRow(d,i){
			if(this.classList[0].split("-")[0]=="links"){
				linkColor = d3.select("#" + this.classList[0] + this.id)._groups[0][0].style["stroke"]
    			d3.select("#" + this.classList[0] + this.id)
    		 		.style("stroke", "red");
    		}else{
    			var nodeLinks="";
    			 //Change size of node
			    d3.select("#" + this.classList[0] + this.id)
			      .transition()
			      .duration(500)
			      .style('stroke-width','2')
			      .attr('r',15)
			    div = d3.select(".tableTooltip");
			    div.transition()
			       .duration(500)
			       .style("opacity", 0);
			    div.transition()
			       .duration(500)
			       .style("opacity", .9);
			        //Get the text for the links
				    for (var each in d.links){
				      nodeLinks = nodeLinks + ("<p>" + eval("queryObjects["+this.classList[0].split("-")[1]+"].links["+d.links[each]+"].node") + "- " + eval("queryObjects["+this.classList[0].split("-")[1]+"].links["+d.links[each]+"].intf") + "</p>")
				    }
				    div.selectAll("*").remove()
				    div.html("<p id ='mapTooltipname'>" + d.node + "</p>"+ nodeLinks )
				       .style("left", (parseInt(d3.select("#" + this.classList[0] + this.id).attr("cx"),10)) + "px")
				       .style("top", (parseInt(d3.select("#" + this.classList[0] + this.id).attr("cy"),10) + d3.select("#" + this.classList[0] + this.id)._groups[0][0].parentElement.parentElement.getBoundingClientRect().top) + "px");
  			}
    	}
    	function handleMouseOutRow(d,i){
    		if(this.classList[0].split("-")[0]=="links"){
				d3.select("#" + this.classList[0] + this.id)
    		  		.style("stroke", linkColor);
    		}else{
    			//return events on lines
			    d3.selectAll(".links")
			      .attr("pointer-events","auto")
			    d3.select("#" + this.classList[0] + this.id)
			      .transition()
			      .duration(500)
			      .style('stroke-width','1')
			      .attr('r',10)
			    var nodeLinks="";
			    div = d3.select(".tableTooltip");
			    div.transition()
			       .duration(1000)
			       .style("opacity", 0);
			}
		}
    	//Create bining for histogram
    	var numberBins= [];
    	for(j=0;j<data.length;j++)
    	{
    		numberBins.push(createBins(data[j],"rice"));
    	}
	    d3.select("#AppRegion"+counter).append("div")
			.attrs({
				"id":"multipleHistogram-" + tableName,
				"class":"multipleHistogram"
			});
		var hisTable = d3.select("#multipleHistogram-" + tableName).append("table")
			thead = hisTable.append("thead"),
		    tbody = hisTable.append("tbody");
		var header = thead.append("tr");
		var rows = tbody.selectAll("tr")
	        .data(data)
	        .enter()
	        .append("tr")
	        .attrs({
	        	"id": function(d,i){
	        		return i },
	       		"class": tableName + " row"
	        	})
	        .style("background-color", function(d,i){ return ((i % 2 == 0) ? "rgba(63, 191, 127, 0.4)" : "rgba(63, 191, 127, 0.2)");})
	       	.on("mouseover",handleMouseOverRow)
	       	.on("mouseout",handleMouseOutRow);
			var div = d3.select("body").append("div")
			    .attrs({
			    	"id": tableName+"-tableTooltip",
			    	"class": "tableTooltip",
			    	"z-index":10
			    })
			    .style("opacity", 0);
	    dataGroup(tableName,0,data,numberBins,header,rows);
	}
	//###############Function that adds columns headers and corresponding cells (columns per each row) ###############
	function dataGroup(tableName,group,data,numberBins,header,rows){
		var group = group;
		header.selectAll(".head"+group)
			.data(columns)
			.enter()
			.append("th")
			.attrs({
				"class": function(d,i){
					return "head" + group;},
			})
			.text(function(d) {
			 	return d;
			 });
	    var cells = rows.selectAll()
	        .data(columns)
	        .enter()
	        .append("td")
	        .attrs({
	        	"class": function(d,i){return tableName + "-" + group + "-col" + i + " col" + i;}, //class: tableName-group-column
	        	"id": function(d,i){ return tableName + "-" + group + this.parentElement.id + "-" + i;} //id: tableName-group-column-cell
	        })
	        .styles({"width":(width + margin.left + margin.right ) + "px"})
		var selector = d3.selectAll(".col" + group + "-" + 0)
		    .append("input")
		    .attrs({
	    		"type":"checkbox",
	    		"name": function(d,i) { return (i)},
	    		"value": function(d,i) { return (i)},
	    		"checked":"checked"
	    	})
	    if(tableName.split("-")[0]=="links"){
			var names = d3.selectAll("." + tableName + "-" + group + "-col" + 0)
		    	.append("div")
		    	names.html(function(d,i){
		    		let link = data[i];
		    		let name;
		    		let origin;
		    		let destination;
		    		let linkSize;
		    		if(link.description){
		    			name = link.description.split(':')[0]
		    			origin = link.description.split(':')[1].split('to')[0]
		    			destination = link.description.split(':')[1].split('to')[1]
		    			if(link.description.split('100GE').length > 1){
					        destination = link.description.split(':')[1].split('to')[1].split('100GE')[0]
					          linkSize = "100GE"
					        }
				        else if(link.description.split('10GE').length > 1){
					        destination = link.description.split(':')[1].split('to')[1].split('10GE')[0]
					        linkSize = "10GE"
				        }else{
				          description = link.description;
				          linkSize ="";
				        }
		    		}else{
		    			name = link.node;
		    			origin = link['a_endpoint.name']
		    			destination =link['z_endpoint.name']
		    			linkSize = "100GE"
		    		}
		    		return "<p class = 'histogramRowName'>" + name + "</p> <p class = 'histogramOriginDestination'>" + origin + " to " + destination + "</p> <p class = 'histogramOriginDestination'> (A to Z) </p>"
		    	});
		}else{
			var names = d3.selectAll("." + tableName + "-" + group + "-col" + 0)
		    	.append("text")
		    	.text(function(d,i){
		    		return data[i].node});
		}
	    //FillTable
	   	fillTable(tableName,group,data,numberBins,columns);
	}
	//############### Function to fill the formatted data for each column ###############
	function fillTable(tableName,group,data,numberBins){
		var numberBins = numberBins;
		//Create Input and Output Sample Data
		sampleData(tableName,group,data);
		//Create Line Chart Column
		lineChartColumn(tableName,group,data);
		//Create Input and OutputHistogram
	    createHistogram(tableName,group,data,numberBins);
	    //TotalData
	    createTotalData(tableName,group,data);
	}
	//############### Function to draw sample data column ##############
	function sampleData(tableName,group,data){
		function handleMouseOver(d,i){
			function indexOfElement(d,i,link,type){
				var indices = [];
				var array;
				var idx;
				if(type==="Incoming"){
					array = queryObjects[0].links[link].data.input.histogram;
				}else if (type==="Outgoing"){
					array = queryObjects[0].links[link].data.output.histogram;
				}
				idx = array.indexOf(d);
				while(idx != -1){
					indices.push(idx);
					idx = array.indexOf(d,idx +1);
				}
				return indices;
			}
			let description;
			let linkSize;
			let xPos = d3.mouse(d3.select('body').node())[0] + xTooltipDisplacement;
        	let yPos = d3.mouse(d3.select('body').node())[1] + yTooltipDisplacement;
        	var type = this.parentElement.classList[1].split('-')[1];
			var linkID = this.parentElement.classList[1].split('-')[3];
			let link = eval("queryObjects[0].links[" + linkID + "]");
        	if(link.description.split('100GE').length > 1){
	          description = link.description.split('100GE')[0]
	          linkSize = "100GE"
	        }
	        else if(link.description.split('10GE').length > 1){
	          description = link.description.split('10GE')[0]
	          linkSize = "10GE"
	        }else{
	          description = link.description;
	          linkSize ="";
	        }
			div = d3.select(".tableTooltip");
			//Highlight of the dots in linechart need to see how to make it right
			var typeSelector;
			let changedot = d.toString().split('.');
			changedot = changedot[0] + "-" +changedot[1]
			if(type==="Incoming"){
				//Dont forget the space
				typeSelector = " .inputDataPlaceholder";
				description = description.split(":")[1].split("to")[0]
			}else if (type==="Outgoing"){
				typeSelector = " .outputDataPlaceholder";
				description = description.split(":")[1].split("to")[1]
			}
			d3.selectAll(".lineChartHistogram"+linkID+ " " + typeSelector + changedot )
				.transition()
				.duration(600)
				.attr("r","0.5em")
				.style("fill","rgba(247, 201, 132, 1)")
			div.transition()
   				.duration(600)
   				.style("opacity", 1);
			div.html("<p class ='mapTooltipname'> <span class='mapTooltipDescription'>To " + description + "</span> <span style='display:inline-block; width: 6em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>" +
					 "<p class = 'mapTooltipValue'>"+ d + " Gb/s" )
		       .style("left", xPos + "px")
		       .style("top", yPos + "px");
		}
		function handleMouseOut(d,i){
			div = d3.select(".tableTooltip");
			d3.selectAll(".lineChartHistogram .dataPlaceholder")
				.transition()
    			.duration(200)
    			.attr("r","0em")
    			.style("fill","none")
			div.transition()
   				.duration(200)
   				.style("opacity", 0);
		}
		function createLegend(tableName,type,data,colData){
			if(colData=="inputDataLayouts"){
				x = xIncoming;
			}else{
				x=xOutgoing;
			}
			var histogramLegend = {width:width - 65,height:16}
	    	var histoLegend = graph.append("g")
						    	.attrs({
						    		class: "histoLegend",
						    		transform:  "translate(" + histogramLegend.width + "," + histogramLegend.height + ")"
						    	})
						    	.append("text");
	    	histoLegend.append("tspan")
	    			   .attrs({
	    			   		x:10,
	    			   		class: tableName + " max",
	    			   		id: function(d,i){ return i;}
	    				})
	    				.text(function(d,i){
	    						return "Max: " + eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0]+"[" + this.id + "].data." + type + ".max.toFixed(2)");
	    				});
	    	histoLegend.append("tspan")
	    			   .attrs({
	    			   		class: tableName + " avg",
	    			   		id: function(d,i){ return i;},
	    			   		x:10,
	    			   		dy: 15
	    				})
	    			   .text(function(d,i){
	    						return "Avg: " + eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0]+"[" + this.id + "].data." + type + ".avg.toFixed(2)");
	    				});
	    	var lineGuides = graph.append("g")
	    	 	.attrs({
	    	 		"class":"lineGuides"
	    	 	});
	    	lineGuides.append("line")
	    	 	.attrs({
	    	 		"class":"maxGuide",
	    	 		"x1":function(d,i){return x[i](eval("data[i].data."+ type +".max"))},
	    	 		"y1":height,
	    	 		"x2":function(d,i){return x[i](eval("data[i].data."+ type +".max"))},
	    	 		"y2":0
	    	 	})
	    	 	.styles({
	    	 		"stroke":"red",
	    	 		"stroke-width":1
	    	 	})
	    	lineGuides.append("line")
	    		.attrs({
	    			"class":"minGuide",
	    			"x1":function(d,i){return x[i](eval("data[i].data."+ type +".avg"))},
	    	 		"y1":height,
	    	 		"x2":function(d,i){return x[i](eval("data[i].data."+ type +".avg"))},
	    	 		"y2":0,
	    		})
	    		.styles({
	    	 		"stroke":"green",
	    	 		"stroke-width":1
	    	 	})
		}
		var barwidth = 30;
		var position ={position1:height/4,position2:height-height/3};

		//Calculate Max values for scales
	    var maxXIncoming = [];
	    var maxXOutgoing = [];
	    var maxX;
	    for (each in data){
	    	maxXIncoming.push(d3.max(data[each].data.input.histogram));
	    	maxXOutgoing.push(d3.max(data[each].data.output.histogram));
	    }
	   	maxXIncoming = d3.max(maxXIncoming);
	   	maxXOutgoing = d3.max(maxXOutgoing);
	   	//Give a bit of margin on the maximun so that it shows in the graph
	   	maxXIncoming = Math.ceil(maxXIncoming);
	   	maxXOutgoing = Math.ceil(maxXOutgoing);
	   	maxX = d3.max([maxXIncoming,maxXOutgoing]);
	    //Set up scales
	    var x = d3.scaleLinear()
	        .domain([0, maxX])
	        .range([0, width])
	        .nice();

	    var xAxis = d3.axisBottom()
	        .scale(x);

	    var svg=d3.selectAll("." + tableName + "-" + group + "-col1").append("svg")
	   		.attrs({
	      		"width": width + margin.left + margin.right,
	      		"height": height + margin.top + margin.bottom,
	    	})
	    var graph = svg.append("g")
	        .attrs({
	        	"class": "sampleData",
	        	"transform": "translate(" + margin.left + "," + (0) + ")"
	        })
	    //Creates incoming Data bar
	    var incoming = graph.append("g")
	        .attr("class", tableName + "sampleIncoming");
	    incoming.append("rect")
	    	.attrs({
	    		"transform": "translate(0," + position.position1 + ")",
			  	"height": barwidth,
			  	"class":"totalDataBar",
			  	"width": function(d){ return x(maxXIncoming); }
			})
		//Creates a line per sample in the data inside the bar
		 var sample = graph.append("g")
	        .attr("class", function(d,i){ return "sampleLineIncoming sampleLine-Incoming-Group-" +i })
	        .selectAll(".sampleLineIncoming")
	        .data(function(d,i){
	        	return eval(data[i].data.input.histogram);
	        })
	        .enter().append("line")
	        .attrs({
	        	"class": "sampleLineIncoming",
	        	"x1": function(d){
	        		return x(d)},
	        	"x2": function(d){return x(d)},
	        	"y1": position.position1+barwidth,
	        	"y2":position.position1,
	        	"stroke":"rgba(52, 100, 222, 0.3)"
	        })
	        .on("mouseover",handleMouseOver)
		    .on("mouseout",handleMouseOut)
	    //Creates outgoing Data bar
	    var outgoing = graph.append("g")
	        .attr("class", tableName + "sampleOutgoing");
	    outgoing.append("rect")
	    	.attrs({
	    		"transform": "translate(0," + position.position2 + ")",
			  	"height": barwidth,
			  	"class":"totalDataBar",
			  	"width": function(d){ return x(maxXOutgoing); }
			})
		//Creates a line per sample in the data inside the bar
		 var sample = graph.append("g")
	         .attr("class", function(d,i){ return "sampleLineOutgoing sampleLine-Outgoing-Group-" +i })
	        .selectAll(".sampleLineOutgoing")
	        .data(function(d,i){
	        	return eval(data[i].data.output.histogram);
	        })
	        .enter().append("line")
	        .attrs({
	        	"class": "sampleLineOutgoing",
	        	"x1": function(d){
	        		return x(d)},
	        	"x2": function(d){return x(d)},
	        	"y1": position.position2+barwidth,
	        	"y2":position.position2,
	        	"stroke":"rgba(52, 100, 222, 0.3)"
	        })
	        .on("mouseover",handleMouseOver)
		    .on("mouseout",handleMouseOut)
	    graph.append("g")
	      .attrs({
	      	"class": "xAxis",
	      	"transform": "translate(0," + height + ")"
	      })
	      .call(xAxis);
	}
	//############### Function to draw line charts column ##############
	function lineChartColumn(tableName,group,data){
    	function handleMouseOut(d,i){
    		div = d3.select(".tableTooltip");
    		d3.selectAll(".lineGuide").remove();
    		// d3.select(this).selectAll(".dataPlaceholder").transition()
    		// 	.duration(200)
    		// 	.attr("r","0em")
    		// 	.style("fill","none")
			div.transition()
   				.duration(200)
   				.style("opacity", 0);
    	}
    	function handleMouseOver(d,i){
			let description;
			let linkSize;
        	let xPos = d3.mouse(d3.select('body').node())[0] + xTooltipDisplacement;
        	let yPos = d3.mouse(d3.select('body').node())[1] + yTooltipDisplacement;
    		var type = this.children[0].id.split("-")[1]; // 0 = input; 1= output
    		var linkID = +this.parentElement.parentElement.id;
    		var circles = d3.select(this).selectAll(".dataPlaceholder");
    		var circlesCX = [];
    		var mouseX = d3.mouse(this)[0] - 15;
    		var index;
    		var dataPoints;
    		let link = eval("queryObjects[0].links[" + linkID + "]");
    		//Date formaters for the tooltip
    		let parseWeekDay = d3.timeFormat('%A');
    		let parseDay = d3.timeFormat('%d');
    		let parseMonth = d3.timeFormat('%B');
    		let parseYear = d3.timeFormat('%Y');
    		let parseTime = d3.timeFormat('%H:%M:%S')
    		let direction = this.classList.value.split('svgLine')[1];
    		if(link.description.split('100GE').length > 1){
	          description = link.description.split('100GE')[0]
	          linkSize = "100GE"
	        }
	        else if(link.description.split('10GE').length > 1){
	          description = link.description.split('10GE')[0]
	          linkSize = "10GE"
	        }else{
	          description = link.description;
	          linkSize ="";
	        }
    		div = d3.select(".tableTooltip");
    		//To hide tooltip when the line draw
    		//div.style("opacity", 0);
    		//Get all x coordinates of circles and select the closer to the mouse by using d3.bisect
    		circles._groups[0].forEach(function(circle){
    			circlesCX.push(+circle.attributes.cx.value);
    		})

    		d3.selectAll(".lineGuide").remove();

    		//Do not draw line if we are over the left of the first element or the right of the last element (out of the line)
    		if(mouseX>circlesCX[0] && mouseX<circlesCX[circlesCX.length-1])
    		{
	    		//Create vertical line
	    		d3.select(this).append("line")
		    	 	.attrs({
		    	 		"class":"lineGuide",
		    	 		"x1":mouseX+15,
		    	 		"y1":height,
		    	 		"x2":mouseX+15,
		    	 		"y2":0
		    	 	})
		    	 	.styles({
		    	 		"stroke":"black",
		    	 		"stroke-width":1
		    	 	})
	    		//get the data to show in the tooltip
	    		if(type==="0"){
	    			dataPoints = link.data.input.values;
	    		}else{
	    			dataPoints = link.data.output.values;
	    		}
	    		index = d3.bisectLeft(circlesCX,mouseX);
	    		if(direction==="In"){
	    			description = description.split(":")[1].split("to")[0]
	    		}else{
	    			description = description.split(":")[1].split("to")[1]
	    		}
				div.transition()
	   				.duration(200)
	   				.style("opacity", 1);
	   			div.html("<p class ='mapTooltipname'> <span class='mapTooltipDescription'>To " + description + "</span> <span style='display:inline-block; width: 6em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>" +
   						 "<p class='.textTotalData'>" + parseWeekDay(dataPoints[index][0]) +" </p> <hr>" +
   						 "<p class='textTotalData'> <span>" + parseDay(dataPoints[index][0]) + "</span> <span>" + parseMonth(dataPoints[index][0]) + "</span> <span>" + parseYear(dataPoints[index][0]) + "</span> <p>" +
   						 "<p class='textTotalData'> " + parseTime(dataPoints[index][0]) + " </p> <hr>" +
   						 "<p class='mapTooltipValue'> " + dataPoints[index][1] + " Gb/s </p>")
		       .style("left", xPos + "px")
		       .style("top", yPos + "px");
			}
    	}
    	function handleMouse2(d,i){
    		var bisectDate = d3.bisector(function(d) { return d[0]; }).left;
			var x0 = x.invert(d3.mouse(this)[0]);
			var index = [];
			var d0 = [];
			var d1 = [];
			var d = [];
			//Calculate all dates Positions
			for (var j=0;j<queryObjects[0].links.length;j++){
				index.push(bisectDate(queryObjects[0].links[j],x0,1));
				d0.push(queryObjects[0].links[j].data.input[index[j]-1]);
				d1.push(queryObjects[0].links[j].data.input[index[j]]);
				d.push(x0 - d0[0] > d1[0] - x0 ? d1 :d0);
			}
			d3.select(this)
			.data(d)
			.enter().append("circle")
			.attrs({
				"class": "y",
				"r":2,
				"transform": function(d,i) {
					return "translate(" + x(d[0]) + "," + yIncoming(d[1])+ ")"}
			})
			.styles({
				"fill":"none",
				"stroke": "blue"
			})
    	}
		//var data = data;
		//Calculate Max values for scales
		var maxIncoming = [];
		var maxOutgoing = [];
		var max;
		for (each in data){
	    	maxIncoming.push(d3.max(data[each].data.input.histogram));
	    	maxOutgoing.push(d3.max(data[each].data.output.histogram));
	    }
	    max = d3.max([d3.max(maxIncoming),d3.max(maxOutgoing)]);
	    maxIncoming = d3.max(maxIncoming);
	    maxOutgoing = d3.max(maxOutgoing);
	    //LineCharts are wider
	    let lineGraphWidth = width + 20;
	    var x = d3.scaleTime().domain([data[0].data.minDate,data[0].data.maxDate]).range([0, lineGraphWidth]);
	    var yIncoming = d3.scaleLinear().domain([0,maxIncoming]).range([0.3 * height, 0]);
	    var yOutgoing = d3.scaleLinear().domain([0,maxOutgoing]).range([0.3 * height, 0]);
		var xAxis = d3.axisBottom()
		    .scale(x)
		    .ticks(5);
		var yAxisIncoming = d3.axisLeft()
		    .scale(yIncoming)
		    .ticks(3);
		var yAxisOutgoing = d3.axisLeft()
		    .scale(yOutgoing)
		    .ticks(3);
		//Functions to draw the lines one for each scale
		var lineIncoming = d3.line()
		    //.curve(d3.curveLinear)
		    .x(function(d) { return x(d[0]); })
		    .y(function(d) {
		    	if(d[0] !==null ) return yIncoming(d[1]);
		    	else{
		    		return yIncoming(0);
		    	}
		    });
		var lineOutgoing = d3.line()
		    //.curve(d3.curveLinear)
		    .x(function(d) {return x(d[0]); })
		    .y(function(d) {
		    	if(d[0] !==null ) return yOutgoing(d[1]);
		    	else return yOutgoing(0);
		    });

	    //Input Graph
	    var svg=d3.selectAll("." + tableName + "-" + group + "-col" + "2").append("svg")
	   		.attrs({
	   			"class": "svgLineIn",
	      		"width": lineGraphWidth + margin.left + margin.right,
	      		"height": 0.3 * (height + margin.top + margin.bottom),
	    	})
	    	.on("mousemove",handleMouseOver)
	    	.on("mouseout",handleMouseOut);
	   	var graph = svg.append("g")
	        .attrs({
	        	"class": function(d,i) { return "lineChartHistogram lineChartHistogram" +i},
	        	// "id": function(d,i){ return "line-"+i},
	        	"transform": "translate(" + (margin.left) + "," + margin.top + ")"
	        })
		graph.append("g")
		      .attr("class", "y axis")
		      .call(yAxisIncoming)
		//Create Lines
		var inputNode = graph.selectAll(".inputLine")
		      .data(function(d,i){
		      	//Important to add the [] to form array if not it doesnt work properly.
	        	return eval([data[i].data.input.values]);
	          })
		      .enter().append("g")
		      .attrs({
		    	class: function(d,i){ return "inputLine " + "inputLine" + i + " node";},
		    	"id": function(d,i){ return "input" + i },
		    	"transform": "translate(" + (2) + "," + 0 + ")"
		      })
		inputNode.append("path")
		      .attr("class", function(d,i){ return "line " + "line" + i})
		      .attr("d", function(d) { return lineIncoming(d); });
		//Create Circles
		var inputDataPoints = graph.selectAll(".inputDataPoints")
			.data(function(d,i){
		      	//Important to add the [] to form array if not it doesnt work properly.
	        	return eval([data[i].data.input.values]);
	          })
		      .enter().append("g")
		      .attrs({
		    	class: function(d,i){ return "inputDataPoints";},
		    	"id": function(d,i){ return "inputDataPoints" + i },
		      })
		    .data(function(d,i){
	        	return eval(data[i].data.input.values);
	        })
	      	.enter().append("circle")
	      	.attrs({
            	cx: function (d,i) {return x(d[0]); },
            	cy: function (d,i) { return yIncoming(d[1]); },
            	class: function(d,i){
            		if(d[1]!==null){
	            		let changedot = d[1].toString().split('.');
						changedot = changedot[0] + "-" +changedot[1]
	            	 	return "dataPlaceholder inputDataPlaceholder" + changedot;
	            	 }
            	 },
           	 	id: function(d,i){ return "inputDataPlaceholder" + i;},
            	"r":"0em",
            	"transform": "translate(" + 2 + ",0)"
         	})
		    //.on("mouseover",handleMouseOver)
		    //.on("mouseout",handleMouseOut)
		//Output Graph
		var svg=d3.selectAll("." + tableName + "-" + group + "-col" + "2").append("svg")
	   		.attrs({
	   			"class":"svgLineOut",
	      		"width": lineGraphWidth + margin.left + margin.right,
	      		"height": 0.3 * (height + margin.top + margin.bottom),
	    	})
	    	.on("mousemove",handleMouseOver)
	    	.on("mouseout",handleMouseOut);
	   	var graph = svg.append("g")
	        .attrs({
	        	"class": function(d,i) { return "lineChartHistogram lineChartHistogram"+i},
	        	// "id": function(d,i){ return "line"+i},
	        	"transform": "translate(" + (margin.left) + "," + margin.top + ")"
	        });
		//We only add one xAxis at the middle of both graphs
		graph.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + (-23) + ")")
		      .call(xAxis);
		graph.append("g")
		      .attr("class", "y axis")
		      .call(yAxisOutgoing)
		//Create Lines
		var outputNode = graph.selectAll(".outputLine")
		      .data(function(d,i){
		      	//Important to add the [] to form array if not it doesnt work properly.
	        	return eval([data[i].data.output.values]);
	          })
		      .enter().append("g")
		      .attrs({
		    	class: function(d,i){ return "outputLine " + "outputLine" + i + " node";},
		    	"id": function(d,i){ return "input"+i },
		    	"transform": "translate(" + (2) + "," + 0 + ")"
		      })

		outputNode.append("path")
		      .attr("class", function(d,i){ return "line " + "line" + i})
		      .attr("d", function(d) { return lineOutgoing(d); })
		//Create Circles
		var outputDataPoints = graph.selectAll(".outputDataPoints")
			.data(function(d,i){
		      	//Important to add the [] to form array if not it doesnt work properly.
	        	return eval([data[i].data.output.values]);
	          })
		      .enter().append("g")
		      .attrs({
		    	class: function(d,i){ return "outputDataPoints " + "outputDataPoints" + i;},
		    	"id": function(d,i){ return "outputDataPoints" + i },
		      })
		      .data(function(d,i){
	        	return eval(data[i].data.output.values);
	          })
		      .enter().append("circle")
		      .attrs({
                cx: function (d,i) { return x(d[0]); },
                cy: function (d,i) { return yOutgoing(d[1]); },
                class: function(d,i){
                	if(d[1]!==null){
                		let changedot = d[1].toString().split('.');
						changedot = changedot[0] + "-" +changedot[1];
            	 		return "dataPlaceholder outputDataPlaceholder" + changedot;
            	 	}
            	},
                id: function(d,i){ return "outputDataPlaceholder" + i;},
                "r":"0em",
                "transform": "translate(" + 2 + ",0)"
             })
		     //.on("mouseover",handleMouseOver)
		     //.on("mouseout",handleMouseOut)
	}
	//############### Function to draw total data column ###############
	function createTotalData(tableName,group,data){
    	function handleMouseOver(d,i){
    		var split= this.id.split("-");
    		let link = eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0] + "[" + this.id.split("-")[3] + "]");
    		let description;
        	let linkSize;
        	let xPos = d3.mouse(d3.select('body').node())[0] + xTooltipDisplacement;
        	let yPos = d3.mouse(d3.select('body').node())[1] + yTooltipDisplacement;
	        if(link.description.split('100GE').length > 1){
	          description = link.description.split('100GE')[0]
	          linkSize = "100GE"
	        }
	        else if(link.description.split('10GE').length > 1){
	          description = link.description.split('10GE')[0]
	          linkSize = "10GE"
	        }else{
	          description = link.description;
	          linkSize ="";
	        }
    		div = d3.select(".tableTooltip");
			div.transition()
   				.duration(200)
   				.style("opacity", 1);
   			if(this.classList[1]=="iData"){
   				div.html("<p class ='mapTooltipname'> <span class='mapTooltipDescription'>" + description + "</span> <span style='display:inline-block; width: 0em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>" +
   						 "<p class='mapTooltipValue'>" + (link.data.totalData[0]/1024/8).toFixed(1) + " TB</p> " +
   						 "<p> <span class='totalDataPercentageValue'>" + (100 * eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0]+"[" + this.id.split("-")[3] + "].data.totalData[0]")/totalDataIn).toFixed(2) + " % </span> <span class='textTotalData'> of </span>  <span style='display:inline-block; width: 0em;'> </span> <span> " + (totalDataIn/1024/8).toFixed(1) + " TB" + " </span> <p>" )
		       .style("left", xPos + "px")
		       .style("top", yPos + "px");
		   }else{
		   		div.html("<p class ='mapTooltipname'> <span class='mapTooltipDescription'>" + description + "</span> <span style='display:inline-block; width: 0em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>" +
   						 "<p class='mapTooltipValue'>" + (link.data.totalData[1]/1024/8).toFixed(1) + " TB</p> " +
   						 "<p> <span class='totalDataPercentageValue'>" + (100 * eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0]+"[" + this.id.split("-")[3] + "].data.totalData[0]")/totalDataOut).toFixed(2) + " % </span> <span class='textTotalData'> of </span> <span style='display:inline-block; width: 0em;'> </span> <span> " + (totalDataOut/1024/8).toFixed(1) + " TB" + " </span> <p>" )
		   		.style("left", xPos + "px")
		       	.style("top", yPos + "px");
		   }
    	}
    	function handleMouseOut(d,i){
		    div = d3.select(".tableTooltip");
		    div.transition()
		       .duration(500)
		       .style("opacity", 0);
    	}

    	//Calculate Max values for scales and Total data transmitted accross all elements
	    var totalDataIn=0, totalDataOut=0;
	    for (each in data){
	    	totalDataIn += eval("queryObjects[" + tableName.split("-")[1] + "].graphs.table." + tableName.split("-")[0] + "[each].data.totalData[0]");
	    	totalDataOut += eval("queryObjects[" + tableName.split("-")[1] + "].graphs.table." + tableName.split("-")[0] + "[each].data.totalData[1]");
	    }
	   	var maxX = d3.max([totalDataIn,totalDataOut]);
	   	let digitSize = (maxX/1024/8).toFixed(1).toString().length;

	   	width = width/2;
	   	let svgWidth, incomingXPos, outgoingXPos,graphPos;
	   	if(digitSize<5){
	   		svgWidth = width * 2 + 70;
	   		graphPos = 80;
	   		incomingXPos = 0;
	   	}else if(digitSize<7){
	   		svgWidth = width * 2 + 100;
	   		graphPos = 100;
	   		incomingXPos = -15;
	   	}else{
	   		svgWidth = width * 2 + 140;
	   		graphPos = 125;
	   		incomingXPos = -20;
	   	}
    	var barwidth = 30;
    	var position = {position1: height/4 , position2: height - height/3}

	    //Set up scales
	    var x = d3.scaleLinear()
	        .domain([0, maxX])
	        .range([0, width])
	        .nice();

	    var xAxis = d3.axisBottom()
	        .scale(x);

	    var svg=d3.selectAll("." + tableName + "-" + group + "-col" + "5").append("svg")
	   		.attrs({
	      		"width": svgWidth,
	      		"height": height + margin.top + margin.bottom,
	    	})
	    var graph = svg.append("g")
	        .attrs({
	        	"class": "graph",
	        	"transform": "translate(" + (graphPos) + "," + (height/2 - barwidth/2 + 10) + ")"
	        });
	    //totalInput
	    var totalInput = graph.append("g")
	        .attr("class", tableName + " totalInput")
	        .attrs({
	        		"transform": " translate(" + (width/2 - 4) + ", " + (height/2 - barwidth/2) + ") rotate(180) ",
	        	});
		//Creates totalData input Bar
	    totalInput.append("rect")
	    	.attrs({
			  	"height": barwidth,
			  	"class":"totalDataBar",
			  	"width": function(d){ return x(totalDataIn); }
			})
		graph.append("text")
	      	.attrs({
	      		"class":"totalDataText",
	      		"x": width/2 - 90,
	      		"y": 0,
	      	})
	      	.text(function(d,i) { return "To " + queryObjects[0].links[i]["a_endpoint.name"]; });
	      	//.text("Incoming")
	    graph.append("text")
	      	.attrs({
	      		"class": "totalDataTotalValue",
	      		"x": function(d){ return x(maxX) - (x(totalDataIn) + x(totalDataOut)) + incomingXPos;},
	      		"y": 25
	      	})
	      	.text(function(d,i) { return (totalDataIn/1024/8).toFixed(1) + " TB"; } );
	      	//Fills up the totalDatabar input for each individual element
	    	totalInput.append("rect")
	    	.attrs({
	    		"class": tableName + " iData",
	    		"id": function(d,i){
	    			return this.classList[0] + "-totalIn-" + i;},
	    		"transform": "translate(0,2.25)",
				"height": barwidth - 5,
				"width": function(d,i){ return x(eval("queryObjects[" + this.classList[0].split("-")[1] + "]." + this.classList[0].split("-")[0]+"[i].data.totalData[0]")); }
			  })
			.on("mouseover",handleMouseOver)
			.on("mouseout",handleMouseOut)
		//totalOutput
		var totalOutput = graph.append("g")
	        .attrs({
	        	"class": "totalOuput",
	        	"transform": " translate(" + (width/2 + 4) + ", " + 6 + ")",
	        })
		//Creates totalData input Bar
	    totalOutput.append("rect")
	    	.attrs({
				"height": barwidth,
				"class": "totalDataBar",
				"width": function(d){ return x(totalDataOut);}
			})
		totalOutput.append("text")
	      	.attrs({
	      		"class":"totalDataText",
	      		"x": 30,
	      		"y": -25,
	      		"dy": barwidth/1.5
	      	})
	      .text(function(d,i) { return "To " + queryObjects[0].links[i]["z_endpoint.name"]; });
	      	//.text("Outgoing")
	    totalOutput.append("text")
	    	.attrs({
	    		"class": "totalDataTotalValue",
	      		"x": function(d){ return x(totalDataOut) + 10;},
	      		"y": 22,
	     	})
	     	.text(function(d,i) { return (totalDataOut/1024/8).toFixed(1) + " TB"; });
	     	//Fills up the totalDatabar output for each individual element
	    totalOutput.append("rect")
	    	.attrs({
	    	  	"class": tableName + " oData ",
	    	  	"id": function(d,i){ return this.classList[0] + "-totalOut-" + i;},
	    	  	"transform": "translate(0,2.5)",
				"height": barwidth - 5,
			  	"width": function(d,i){ return x(eval("queryObjects[" + this.classList[0].split("-")[1] + "]." + this.classList[0].split("-")[0]+"[i].data.totalData[1]")); }
			})
			.on("mouseover",handleMouseOver)
			.on("mouseout",handleMouseOut)
	}
	//############### Function to create the histogram ###############
	function createHistogram(tableName,group,data,numberBins){
		    ///Histogram distributions
		    var histogramSetUp = [];
		    for(j=0;j<numberBins.length;j++)
		    {
		    	histogramSetUp.push(d3.histogram().thresholds(numberBins[j]));
		    }
		    var inputDataLayouts = [];
		    var outputDataLayouts = [];
		    for (j=0;j<data.length;j++){
		      inputDataLayouts.push(histogramSetUp[j](data[j].data.input.histogram));
		      outputDataLayouts.push(histogramSetUp[j](data[j].data.output.histogram));
		    }
		    //Calculate Max values for scales
		    var maxXIncoming=[];
		    var maxYIncoming=[];
		    var maxXOutgoing=[];
		    var maxYOutgoing=[];
		    for (each in data){
		    	maxXIncoming.push(d3.max(data[each].data.input.histogram));
				maxYIncoming.push(d3.max(inputDataLayouts[each], function(d) { return d.length; }));
				maxXOutgoing.push(d3.max(data[each].data.output.histogram))
				maxYOutgoing.push(d3.max(outputDataLayouts[each], function(d) { return d.length; }))
		    }
		   	//var maxX=d3.max(maxX);
		   	//var maxY=d3.max(maxY);

		    //Set up scales
		    var xIncoming = [];
		    var yIncoming = [];
		    var xAxisIncoming = [];
		    var yAxisIncoming = [];
		    var xOutgoing = [];
		    var yOutgoing = [];
		    var xAxisOutgoing = [];
		    var yAxisOutgoing = [];
		    for (j=0;j<data.length;j++)
		    {
		    	xIncoming.push(d3.scaleLinear()
		        .domain([0, maxXIncoming[j]])
		        .range([0, 0.7 * width])
		        .nice());

		        yIncoming.push(d3.scaleLinear()
		        .domain([0, maxYIncoming[j]])
		        .range([height, 0]));

		        xAxisIncoming.push(d3.axisBottom()
		        .scale(xIncoming[j])
		        .ticks(7));

		   		yAxisIncoming.push(d3.axisLeft()
		      	.scale(yIncoming[j]));

		      	xOutgoing.push(d3.scaleLinear()
		        .domain([0, maxXOutgoing[j]])
		        .range([0, 0.7 * width])
		        .nice());

		        yOutgoing.push(d3.scaleLinear()
		        .domain([0, maxYOutgoing[j]])
		        .range([height, 0]));

		        xAxisOutgoing.push(d3.axisBottom()
		        .scale(xOutgoing[j])
		        .ticks(7));

		   		yAxisOutgoing.push(d3.axisLeft()
		      	.scale(yOutgoing[j]));
		    }
		    //Input
		    fillHistogramColumn(tableName,"." + tableName + "-" + group + "-col3","inputDataLayouts","input",inputDataLayouts,outputDataLayouts,xIncoming,xOutgoing,yIncoming,yOutgoing,xAxisIncoming,xAxisOutgoing,yAxisIncoming,yAxisOutgoing,data);
		    //Output
		    fillHistogramColumn(tableName,"." + tableName + "-" + group + "-col4","outputDataLayouts","output",inputDataLayouts,outputDataLayouts,xIncoming,xOutgoing,yIncoming,yOutgoing,xAxisIncoming,xAxisOutgoing,yAxisIncoming,yAxisOutgoing,data);
	}
	//############### function to draw the histogram Column ###############
    function fillHistogramColumn(tableName,colName,colData,legend,inputDataLayouts,outputDataLayouts,xIncoming,xOutgoing,yIncoming,yOutgoing,xAxisIncoming,xAxisOutgoing,yAxisIncoming,yAxisOugoing,data){
		function handleMouseOver(d,i){
			var x;
			var dataInColumn=[];
			let linkNumber = +this.parentElement.classList[1].split('histogram')[1];
			let link = eval("queryObjects[0].links[" + linkNumber + "]");
			let description;
			let linkSize;
        	let xPos = d3.mouse(d3.select('body').node())[0] + xTooltipDisplacement;
        	let yPos = d3.mouse(d3.select('body').node())[1] + yTooltipDisplacement;
        	let column = this.parentElement.parentElement.parentElement.parentElement.parentElement.classList[1];
        	let direction;
        	if(link.description.split('100GE').length > 1){
	          description = link.description.split('100GE')[0]
	          linkSize = "100GE"
	        }
	        else if(link.description.split('10GE').length > 1){
	          description = link.description.split('10GE')[0]
	          linkSize = "10GE"
	        }else{
	          description = link.description;
	          linkSize ="";
	        }
			div = d3.select(".tableTooltip");
			div.transition()
					.duration(200)
					.style("opacity", 1);
			if(column==='col4'){
				direction = description.split(":")[1].split("to")[0]
			}else{
				direction = description.split(":")[1].split("to")[1]
			}
		   	div.html("<p class='mapTooltipname'> <span class='mapTooltipDescription'> To " + direction + "</span> <span style='display:inline-block; width: 7em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>" +
   						 "<p> <span class='textTotalData'> " + d.length + " elements</span> <span style='display:inline-block; width: 4em;'></span> <span>" + d3.min(d) + "-" + d3.max(d) + " Gb/s</span> <hr> </p>" +
   						// "<p class='textTotalData'>" + d.length + " elements</p> <hr> " +
   						 "<p>Avg:<p>"+
   						 "<p><span class='mapTooltipValue'>" + d3.mean(d).toFixed(2) + " Gb/s </span></p>")
		       .style("left", xPos + "px")
		       .style("top", yPos + "px");
		}
		function handleMouseOut(d,i){
	    	div = d3.select(".tableTooltip");
	    	div.transition()
	       .duration(500)
	       .style("opacity", 0);
		}
		function createLegend(tableName,type,data,colData){
			if(colData=="inputDataLayouts"){
				x = xIncoming;
			}else{
				x=xOutgoing;
			}
			var histogramLegend = {width: 0.7 * width - 6 * (margin.left - margin.right) , height: margin.bottom}
	    	var histoLegend = graph.append("g")
						    	.attrs({
						    		class: "histoLegend",
						    		transform:  "translate(" + histogramLegend.width + "," + histogramLegend.height + ")"
						    	})
						    	.append("text");
	    	histoLegend.append("tspan")
	    			   .attrs({
	    			   		x:10,
	    			   		class: tableName + " max",
	    			   		id: function(d,i){ return i;}
	    				})
	    				.text(function(d,i){
	    						return "Max: " + eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0]+"[" + this.id + "].data." + type + ".max.toFixed(2)");
	    				});
	    	histoLegend.append("tspan")
	    			   .attrs({
	    			   		class: tableName + " avg",
	    			   		id: function(d,i){ return i;},
	    			   		x:10,
	    			   		dy: 15
	    				})
	    			   .text(function(d,i){
	    						return "Avg: " + eval("queryObjects[" + this.classList[0].split("-")[1] + "].graphs.table." + this.classList[0].split("-")[0]+"[" + this.id + "].data." + type + ".avg.toFixed(2)");
	    				});
	    	var lineGuides = graph.append("g")
	    	 	.attrs({
	    	 		"class":"lineGuides"
	    	 	});
	    	lineGuides.append("line")
	    	 	.attrs({
	    	 		"class":"maxGuide",
	    	 		"x1":function(d,i){return x[i](eval("data[i].data."+ type +".max"))},
	    	 		"y1":height,
	    	 		"x2":function(d,i){return x[i](eval("data[i].data."+ type +".max"))},
	    	 		"y2":40
	    	 	})
	    	 	.styles({
	    	 		"stroke":"red",
	    	 		"stroke-width":2
	    	 	})
	    	lineGuides.append("line")
	    		.attrs({
	    			"class":"minGuide",
	    			"x1":function(d,i){return x[i](eval("data[i].data."+ type +".avg"))},
	    	 		"y1":height,
	    	 		"x2":function(d,i){return x[i](eval("data[i].data."+ type +".avg"))},
	    	 		"y2":40,
	    		})
	    		.styles({
	    	 		"stroke":"green",
	    	 		"stroke-width":2
	    	 	})
		}
		var svg=d3.selectAll(colName).append("svg")
	   		.attrs({
	      		"width": 0.7 * (width + margin.left + margin.right),
	      		"height": height + margin.top + margin.bottom,
	    	})
	    var graph = svg.append("g")
	        .attrs({
	        	"id": function(d,i) {return "graph"+colData+i;},
	        })
	    if(colData=="inputDataLayouts"){
				x = xIncoming;
				y= yIncoming;
				xAxis = xAxisIncoming;
			}else{
				x=xOutgoing;
				y=yOutgoing;
				xAxis = xAxisOutgoing;
			}
	    for(var j=0;j<eval(colData + ".length");j++)
	    {
		    var bar = d3.select("#graph"+colData+j).append("g")
		        .attr("class", "histogram")
		        .selectAll(".bar")
		        .data(eval(colData+"[j]"))
		        .enter().append("g")
		        .attrs({
		        	"class": "bar histogram" + j,
		        	"transform": function(d,i) {
		        		if(isNaN(d.x0)){
							d.x0=0;
							d.x1=0;
						}
						return "translate(" + x[j](d.x0) + "," + y[j](d.length) + ")"; }
		        })
		        .append("rect")
		        .attrs({
		        	"x": 1,
		        	"width": function(d,i){ return Math.abs((x[j](d.x1) - x[j](d.x0))-1)},
			        "height": function(d) { return height - y[j](d.length); }
		        })
		        .on("mouseover",handleMouseOver)
			  	.on("mouseout",handleMouseOut)

		    d3.select("#graph"+colData+j).append("g")
		      .attrs({
		      	"class": "xAxis",
		      	"transform": "translate(0," + height + ")"
		      })
		      .call(xAxis[j]);
		 }
	    createLegend(tableName,legend,data,colData);
	}
	//#################################### END AUX FUNCTIONS ###########################
}