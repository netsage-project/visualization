function LoadData(queryDate,queryText,avgOver,queryType,queryMeasure,queryValue){
	//#################################### AUX FUNCTIONS ############################
	//Function return unique nodes from links
	function uniqNodes(a,links,queryMeasure) {
	    var seen = {};
	    var out = [];
	    var len = a.length;
	    var j = 0;
	    for(var i = 0; i < len; i++) {
	    	var object = a[i]
	         var item = a[i].lat;
	         if(seen[item] !== 1) {
	               seen[item] = 1;
	               out[j++] = object;
	         }else{
	         	for(var each in out){
	         		//Save unique links conected to this node
	         		if(out[each].lat == item){
	         			uniqFast(out[each].links.push(object.links[0]))
	         		}
	         	}
	         }
	    }
	    if(queryMeasure=="1" || queryMeasure==="2")
	    {
		    for (var element in out){
		    	var linkData = [];
		    	//We cleaned the data of the links so we only need to calculate the aggregate data for nodes getting it from their links.
		    	var nodeData = {};
		    	var nodeDataHistogram = [];
		    	for (var each in out[element].links){
		    		linkData.push(links[parseInt(out[element].links[each],10)]);
		    		nodeDataHistogram = nodeDataHistogram.concat(links[parseInt(out[element].links[each],10)].histogram);
		    	}
		    	out[element].data.linkData = linkData;
		    	out[element].data.histogram = nodeDataHistogram;
		    	//To get the data of the nodes I create an object where the index is the time and the value is the data, if the index exists add the data if it doesnt create it and add the data of the link
		    	//I need to do this because the links have different amount of times because not all of them started getting data at the same time.
		    	for(var i in out[element].links){
		    		console.log("here");
		    		for(var each in out[element].data.linkData[i].values){
		    			if (nodeData[out[element].data.linkData[i].values[each][0]] === undefined) nodeData[out[element].data.linkData[i].values[each][0]] = out[element].data.linkData[i].values[each][1];
		    			else nodeData[out[element].data.linkData[i].values[each][0]] += out[element].data.linkData[i].values[each][1];
		    		}
		    	}
		    	out[element].data.input.values = objToArray(nodeData);
		    	out[element].data.output.values = objToArray(outputNodeData);
		    }
		}else{
			for (var element in out){
		    	var linkData = [];
		    	//We cleaned the data of the links so we only need to calculate the aggregate data for nodes getting it from their links.
		    	var inputNodeData = {};
		    	var outputNodeData = {};
		    	var inputNodeDataHistogram = [];
		    	var outputNodeDataHistogram = [];
		    	for (var each in out[element].links){
		    		linkData.push(links[parseInt(out[element].links[each],10)].data);
		    		inputNodeDataHistogram = inputNodeDataHistogram.concat(links[parseInt(out[element].links[each],10)].data.input.histogram);
		    		outputNodeDataHistogram = outputNodeDataHistogram.concat(links[parseInt(out[element].links[each],10)].data.output.histogram);
		    	}
		    	out[element].data.linkData = linkData;
		    	out[element].data.input.histogram = inputNodeDataHistogram;
		    	out[element].data.output.histogram = outputNodeDataHistogram;
		    	//To get the data of the nodes I create an object where the index is the time and the value is the data, if the index exists add the data if it doesnt create it and add the data of the link
		    	//I need to do this because the links have different amount of times because not all of them started getting data at the same time.
		    	for(var i in out[element].links){
		    		for(var each in out[element].data.linkData[i].input.values){
		    			if (inputNodeData[out[element].data.linkData[i].input.values[each][0]] === undefined) inputNodeData[out[element].data.linkData[i].input.values[each][0]] = out[element].data.linkData[i].input[each][1];
		    			else inputNodeData[out[element].data.linkData[i].input.values[each][0]] += out[element].data.linkData[i].input.values[each][1];
		    			if (outputNodeData[out[element].data.linkData[i].output.values[each][0]] === undefined) outputNodeData[out[element].data.linkData[i].output.values[each][0]] = out[element].data.linkData[i].output[each][1];
		    			else outputNodeData[out[element].data.linkData[i].output.values[each][0]] += out[element].data.linkData[i].output.values[each][1];
		    		}
		    	}
		    	out[element].data.input.values = objToArray(inputNodeData);
		    	out[element].data.output.values = objToArray(outputNodeData);
		    }
		}
	    return out;
	}
	//Function to transform object to array
	function objToArray(obj){
		var dataArray = new Array;
		for(var i in obj) {
		    dataArray.push([new Date(i),obj[i]]);
		}
		return dataArray;
	}

	//Return unique links values for links[i].links array. (Removes repeated values.)
	function uniqFast(a) {
	    var seen = {};
	    var out = [];
	    var len = a.length;
	    var j = 0;
	    for(var i = 0; i < len; i++) {
	    	var object = a[i]
	         var item = a[i].name;
	         if(seen[item] !== 1) {
	               seen[item] = 1;
	               out[j++] = object;
	         }
	    }
	    return out;
	}
	//Helper function to create nodes Object
	function createNodes(nodes,links,queryMeasure){
		var links = links;
		var allNodes;
		console.log("here");
		for (var i in links){
			var linkArray =[];
			nodes.push ( {
				node: links[i]["a_endpoint.name"],
				lat: links[i]["a_endpoint.latitude"],
				lon: links[i]["a_endpoint.longitude"],
				links: [i],
				data: {
					input:{histogram:[]},
					output:{histogram:[]}
				}
			})
			nodes.push ( {
				node: links[i]["z_endpoint.name"],
				lat: links[i]["z_endpoint.latitude"],
				lon: links[i]["z_endpoint.longitude"],
				links: [i],
				data: {
					input:{histogram:[]},
					output:{histogram:[]}
				}
			})
		}
		return uniqNodes(nodes,links,queryMeasure);
	}

	//Function to clean data
	function scaleAndClean(dataPoint,queryMeasure,queryValue){
		if(queryMeasure==="0" && queryValue==="0") //SNMP data
		{
			var inputClean=[];
			var outputClean=[];
			var inputValues = [];
			var outputValues = [];
			//change this to the d3 assignment forEach
			for (each in dataPoint.input){
				if(dataPoint.input[each][1]!=null){
					dataPoint.input[each][1] = precise_round(dataPoint.input[each][1]/1024/1024/1024,2); // bit/Kbs/Mbs/Gbs
					inputClean.push(dataPoint.input[each][1]);
				}else{
					dataPoint.input[each][1] = null;
					//inputClean.push(0);
				}
				if(dataPoint.output[each][1]!=null){
					dataPoint.output[each][1] = precise_round(dataPoint.output[each][1]/1024/1024/1024,2);
					outputClean.push(dataPoint.output[each][1]);
				} else{
					dataPoint.output[each][1] = null;
					//outputClean.push(0);
				}
				inputValues.push([new Date (dataPoint.input[each][0]*1000),dataPoint.input[each][1]]);
				outputValues.push([new Date (dataPoint.output[each][0]*1000),dataPoint.output[each][1]]);
			}
			//Save the cleaned scaled values in the data
			dataPoint.input.histogram = inputClean;
			dataPoint.output.histogram = outputClean;
			dataPoint.input.values = inputValues;
			dataPoint.output.values = outputValues;
		}else if(queryMeasure==="1"){//losses
			var dataClean=[];
			var values=[];
			for(each in dataPoint.values){
				if(dataPoint.values[each][1]!=null){
					dataPoint.values[each][1] = dataPoint.values[each][1]*100; //To show in percentage
					dataClean.push(dataPoint.values[each][1]);
				}else{
					dataPoint.values[each][1] = null;
				}
				values.push([new Date (dataPoint.values[each][0]*1000),dataPoint.values[each][1]]);
			}
			//Save the cleaned scaled values in the data
			dataPoint.histogram = dataClean;
			dataPoint.values = values;
		}else if(queryMeasure==="2"){//latency
			var dataClean=[];
			var values=[];
			for(each in dataPoint.values){
				if(dataPoint.values[each][1]!=null){
					dataPoint.values[each][1] = dataPoint.values[each][1]; //Dont change anything value comes in ms.
					dataClean.push(dataPoint.values[each][1]);
				}else{
					dataPoint.values[each][1] = null;
				}
				values.push([new Date (dataPoint.values[each][0]*1000),dataPoint.values[each][1]]);
			}
			//Save the cleaned scaled values in the data
			dataPoint.histogram = dataClean;
			dataPoint.values = values;
		}else if(queryMeasure==="0" && queryType === "0" && (queryValue==="0" || queryValue==="1" || queryValue==="2" || queryValue==="3" || queryValue==="4") ){//Flow Data
			var dataClean=[];
			var values=[];
			for(each in dataPoint.input){
				if(dataPoint.input[each][1]!=null){
					dataPoint.input[each][1] = precise_round(dataPoint.input[each][1]/1024/1024/1024,2); // bit/Kbs/Mbs/Gbs
					dataClean.push(dataPoint.input[each][1]);
				}else{
					dataPoint.input[each][1] = 0;
				}
				values.push([new Date (dataPoint.input[each][0]*1000),dataPoint.input[each][1]]);
			}
			//I save twice now to simulate input and output that I hope I will get this is temporary
			dataPoint.input.histogram = dataClean;
			dataPoint.output.histogram = dataClean;
			dataPoint.input.values = values;
			dataPoint.output.values = values;
		}else if(queryMeasure==="0" && queryValue==="1" && queryType === "1"){
			var dataClean=[];
			var values=[];
			for(each in dataPoint["values.bits"]){
				if(dataPoint["values.bits"][each][1]!=null){
					dataPoint["values.bits"][each][1] = precise_round(dataPoint["values.bits"][each][1]/1024/1024/1024,2); // bit/Kbs/Mbs/Gbs
					dataClean.push(dataPoint["values.bits"][each][1]);
				}else{
					dataPoint["values.bits"][each][1] = null;
				}
				values.push([new Date (dataPoint["values.bits"][each][0]*1000),dataPoint["values.bits"][each][1]]);
			}
			//Save the cleaned scaled values in the data
			dataPoint.histogram = dataClean;
			dataPoint.values = values;
		}
		//Function to precise round the results so that they are numbers .toFixed() converts them to strings and misbehaves sometimes
		function precise_round(num,decimals){
			var t = Math.pow(10, decimals);
   			return Number((Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals));
		}
	}
	//Function to calculate Important Statistical values
	function calculateStatistics (dataPoint,sizeInterval,queryMeasure,queryValue,queryDate){
		if(queryMeasure==="0" && (queryValue==="0" || queryValue==="1" || queryValue==="2" || queryValue==="3" || queryValue==="4")) //SNMP data and Flow query 0
		{
			//Create other helper Statistical values
			dataPoint.input.max = d3.max(dataPoint.input.histogram);
			dataPoint.input.min = d3.min(dataPoint.input.histogram);
			dataPoint.input.avg = d3.mean(dataPoint.input.histogram);
			dataPoint.input.median = median(dataPoint.input.histogram);
			dataPoint.input.percentile25 = percentile(dataPoint.input.histogram,25);
			dataPoint.input.percentile75 = percentile(dataPoint.input.histogram,75);
			dataPoint.output.avg = d3.mean(dataPoint.output.histogram);
			dataPoint.output.median = median(dataPoint.output.histogram);
			dataPoint.output.percentile25 = percentile(dataPoint.output.histogram,25);
			dataPoint.output.percentile75 = percentile(dataPoint.output.histogram,75);
			dataPoint.output.max = d3.max(dataPoint.output.histogram);
			dataPoint.output.min = d3.min(dataPoint.output.histogram);

			if(dataPoint.input.histogram.length == 0){
				dataPoint.input.max = 0;
				dataPoint.input.min = 0;
				dataPoint.input.avg = 0;
				dataPoint.input.median = 0;
				dataPoint.input.percentile25 = 0;
				dataPoint.input.percentile75 = 0;
			}
			if (dataPoint.output.histogram.length == 0){
				dataPoint.output.max = 0;
				dataPoint.output.min = 0;
				dataPoint.output.avg = 0;
				dataPoint.output.median = 0;
				dataPoint.output.percentile25 = 0;
				dataPoint.output.percentile75 = 0;
			}

			dataPoint.totalData = [d3.mean(dataPoint.input.histogram)*sizeInterval,d3.mean(dataPoint.output.histogram)*sizeInterval];
			if(isNaN(dataPoint.totalData[0])) dataPoint.totalData[0]=0;
			if(isNaN(dataPoint.totalData[1])) dataPoint.totalData[1]=0;
		}else if(queryObjects[0].queryType === "1" && queryMeasure!=="0" ){ //PerfSonar and query 1 Flow
			//Create other helper Statistical values
			dataPoint.max = d3.max(dataPoint.histogram);
			dataPoint.min = d3.min(dataPoint.histogram);
			dataPoint.avg = d3.mean(dataPoint.histogram);
			dataPoint.median = median(dataPoint.histogram);
			dataPoint.percentile25 = percentile(dataPoint.histogram,25);
			dataPoint.percentile75 = percentile(dataPoint.histogram,75);

			if(dataPoint.histogram.length == 0){
				dataPoint.max = 0;
				dataPoint.min = 0;
				dataPoint.avg = 0;
				dataPoint.median = 0;
				dataPoint.percentile25 = 0;
				dataPoint.percentile75 = 0;
			}
		}
		//min and max dates (dates are the same for all and are the same for input and output)
		dataPoint.minDate = new Date(queryDate[0]);
		dataPoint.maxDate = new Date(queryDate[1]);
	}

	//Function to retrieve Dynamic Metadata on Start and fill up the first Overview. Sets the links and nodes to be visualized and parses data for the mapgraph and histogramTable.
	function snmpTSDSQuery(avgOver,queryMeasure,queryValue){
		//Set up the date
		var date = queryDate;
		var interval = { first: new Date(date[0]), second: new Date(date[1]) }
		var sizeIntervalSeconds = (interval.second - interval.first)/1000
		var avgOver = avgOver;
		var links;
		var nodes = [];
		var url;
		//We see what user wants to visualize
		if(queryValue==="0"){//IRNC LINKS
			//Query to retrieve metadata values
			url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get node, intf,  link_name as description, a_endpoint.name, a_endpoint.latitude, a_endpoint.longitude, z_endpoint.name, z_endpoint.latitude, z_endpoint.longitude, max_bandwidth between( "' + date[0] + '", "' + date[1] + '" ) by node, intf from interface where a_endpoint != null and z_endpoint != null';
			d3.json(url)
			.on("beforesend", function (request) {request.withCredentials = true;})
			.get(function(error,data)
			{
				links = data.results;
				queryObjects[counter].links = links;
				url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get node, intf, aggregate(values.input,' + avgOver + ', average) as input, aggregate(values.output,' + avgOver + ', average) as output between( "' + date[0] + '", "' + date[1] + '" ) by node, intf from interface where ( '
				for (var each in links){
					if (each != links.length-1) url = url + '( node = "' + links[each].node + '" and intf = "' + links[each].intf + '") or ';
					else url = url + '( node = "' + links[each].node + '" and intf = "' + links[each].intf + '") )';
				}
				d3.json(url)
				.on("beforesend", function (request) {request.withCredentials = true;})
				.get(function(error,data)
				{
					for (var element in queryObjects[counter].links){
						//Select appropiate data from array and attach it to the proper link
						var elementResult = data.results.filter(function( obj ) {
								return obj.node == queryObjects[counter].links[element].node;
						});
						//Add the data to the links object
						queryObjects[counter].links[element].data = elementResult[0];
						scaleAndClean(queryObjects[counter].links[element].data,queryMeasure,queryObjects[0].queryValue);
						calculateStatistics(queryObjects[counter].links[element].data,sizeIntervalSeconds,queryMeasure,queryObjects[0].queryValue,queryDate);
					}
					//Create the nodes from the links
					nodes = createNodes(nodes,links,queryMeasure);
					queryObjects[counter].nodes = nodes;
					for (var element in queryObjects[counter].nodes){
						calculateStatistics(queryObjects[counter].nodes[element].data,sizeIntervalSeconds,queryMeasure,queryObjects[0].queryValue,queryDate);
					}
					//Calculate IRNC Data
					queryObjects[counter].network = calculateIRNCData(queryObjects[counter]);
					//Create query text
					drawQueryText(queryText);
					if(queryObjects[counter].queryType==="0"){//Bandwith accross links
						//NetworkSummary
						drawNetworkSummary(queryObjects[counter]);
						//Create Map
						mapGraph(queryObjects[counter]);
						//Create Table
						histogramTableGraph(queryObjects[counter]);
						//if(window.location.pathname==="/dashboard.html" || window.location.pathname==="/netsage/dashboard.html")
						lineChart(queryObjects[counter]);
					}else if(queryObjects[counter].queryType==="1"){//Periodic Patterns
						periodicPattern(queryObjects[counter]);
					}
					iconClearWaiting();
				});
			});
		}else if(queryValue==="1" || queryValue==="2" || queryValue==="3" || queryValue==="4"){ //Flow Data
			if(queryValue==="1"){
				url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get src_organization, point_of_observation, values.bps, average(values.bps) as avg_bits between( "' + date[0] + '", "' + date[1] + '" ) by src_organization, point_of_observation from netflow_src_organization where point_of_observation = "*" limit 1000 offset 0 ordered by avg_bits desc';
			}else if(queryValue==="2"){
				url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get protocol, point_of_observation, values.bps, average(values.bps) as avg_bits between( "' + date[0] + '", "' + date[1] + '" ) by protocol, point_of_observation from netflow_protocol where point_of_observation = "*" limit 1000 offset 0 ordered by avg_bits desc';
			}else if(queryValue==="3"){
				url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get src_asn, point_of_observation, values.bps, average(values.bps) as avg_bits between( "' + date[0] + '", "' + date[1] + '" ) by src_asn, point_of_observation from netflow_src_asn where point_of_observation = "*" limit 1000 offset 0 ordered by avg_bits desc';
			}else if(queryValue==="4"){
				url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get src_country_name, point_of_observation, values.bps, average(values.bps) as avg_bits between( "' + date[0] + '", "' + date[1] + '" ) by src_country_name, point_of_observation from netflow_src_country_name where point_of_observation = "*" limit 1000 offset 0 ordered by avg_bits desc';
			}
			console.log(url);
			d3.json(url)
			.on("beforesend", function (request) {request.withCredentials = true;})
			.get(function(error,data)
			{
				//For flow data I need to query twice to get the input and the output of the data.
				let extraURL;
				let flowLinksSRC = data.results;
				let regularExpression;
				queryObjects[counter].links = flowLinksSRC;
				let loopCount =0;
				for (var element in queryObjects[counter].links){
					if(queryValue==="1"){
						queryObjects[counter].links[element].description = queryObjects[counter].links[element].src_organization;
						regularExpression = new RegExp("src_organization","g");
						extraURL = data.query.replace(regularExpression,"dst_organization");
						extraURL = extraURL.replace("netflow_src_organization","netflow_dst_organization");
						extraURL = extraURL.replace('where point_of_observation = "*"', 'where dst_organization ="' + queryObjects[counter].links[element].src_organization + '"');
					}else if (queryValue==="2"){
						queryObjects[counter].links[element].description = queryObjects[counter].links[element].protocol;
						//extraURL = extraURL.replace(""); //Dont know what to do with protocols yet.
					}else if(queryValue==="3"){
						queryObjects[counter].links[element].description = queryObjects[counter].links[element].src_asn;
						regularExpression = new RegExp("src_asn","g");
						extraURL = data.query.replace(regularExpression,"dst_asn");
						extraURL = extraURL.replace("netflow_src_asn","netflow_dst_asn");
					}else if(queryValue==="4"){
						queryObjects[counter].links[element].description = queryObjects[counter].links[element].src_country_name;
						regularExpression = new RegExp("src_country_name","g");
						extraURL = data.query.replace(regularExpression,"dst_organization");
						extraURL = extraURL.replace("netflow_src_country_name","netflow_dst_country_name");
					}
					queryObjects[counter].links[element].data = {};
					queryObjects[counter].links[element].data.input = queryObjects[counter].links[element]["values.bps"];
					queryObjects[counter].links[element].data.output = queryObjects[counter].links[element]["values.bps"];
 					scaleAndClean(queryObjects[counter].links[element].data,queryMeasure,queryObjects[counter].queryValue);
 					calculateStatistics(queryObjects[counter].links[element].data,sizeIntervalSeconds,queryMeasure,queryObjects[counter].queryValue,date);
					// d3.json('https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=' + extraURL)
					// .on("beforesend", function (request) {request.withCredentials = true;})
					// .get(function(error,data)
					// {
					// 	if(data){
					// 		for(var element in data.results){
					// 			if(data.results[element].point_of_observation==="*"){
					// 				queryObjects[counter].links[element].data.output = data.results[element]["values.bps"];
					// 				scaleAndClean(queryObjects[counter].links[element].data,queryMeasure,queryObjects[counter].queryValue);
					// 				calculateStatistics(queryObjects[counter].links[element].data,sizeIntervalSeconds,queryMeasure,queryObjects[counter].queryValue,date);
					// 			}
					// 		}
					// 	}
					// 	loopCount++;
					// 	if(loopCount===queryObjects[counter].links.length){
					// 		drawQueryText(queryText);
					// 		histogramTableGraph(queryObjects[counter]);
					// 		iconClearWaiting();
					// 	}
					// })
				}
				// d3.json('https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=' + extraURL)
				// .on("beforesend", function (request) {request.withCredentials = true;})
				// .get(function(error,data)
				// {
				// 	var flowLinksDST = data.results;
				// 	for (var element in flowLinksDST){
				// 		queryObjects[counter].links[element].data.output = flowLinksDST[element]["values.bps"];
				// 		scaleAndClean(queryObjects[counter].links[element].data,queryMeasure,queryObjects[counter].queryValue);
				// 		calculateStatistics(queryObjects[counter].links[element].data,sizeIntervalSeconds,queryMeasure,queryObjects[counter].queryValue,date);
				// 	}
				// 	drawQueryText(queryText);
				// 	histogramTableGraph(queryObjects[counter]);
				// 	iconClearWaiting();
				// })
				drawQueryText(queryText);
				histogramTableGraph(queryObjects[counter]);
				iconClearWaiting();
			});
		}
	}

	function drawQueryText(queryText){
		var count =0;
		var appRegion = d3.select("body").append("div")
		.attrs({
			"id": "AppRegion"+counter,
			"class": "applicationRegion"
		})
		.styles({
			"min-width": "98em"
		})
		if(window.location.pathname==="/dashboard.html" || window.location.pathname==="/netsage/dashboard.html"){
			appRegion.styles({
				"position": "relative",
				"top": "8em"
			})
		}
		var queryTextDiv = appRegion.append("div")
		.attrs({
			"id": "query"+counter,
			"class": "queryTextAppRegion"
		})
	}

	function calculateIRNCData(query){
		let network = {'totalData':0,'avg':0,'max':0,'min':0};
		let max=[], avg=[], min=[];
		//The input from a link is the output of another so we only iterate the inputs to calculate the values for the whole network
		for(let i=0;i<query.links.length;i++){
			max.push(query.links[i].data.input.max);
			avg.push(query.links[i].data.input.avg);
			min.push(query.links[i].data.input.min);
			network.totalData += (query.links[i].data.totalData[0] + query.links[i].data.totalData[1])
		}
	    //We store the total data in the network
	    network.totalData = (network.totalData)/1024/8;
		network.max = d3.max(max);
		network.min = d3.min(min);
		network.avg = d3.mean(avg);

		return network;
	}

	function drawNetworkSummary(query){
		//Variables to parse date
		let parseWeekDay = d3.timeFormat('%A');
		let parseDayMonthYear = d3.timeFormat('%d-%B-%Y');
		let parseTime = d3.timeFormat('%H:%M')
		//Variables to store dates
		let start = new Date(query.date[0]);
		let stop = new Date(query.date[1]);
		let netSummary = d3.select("#AppRegion"+counter)
	      .append("div")
	      .attrs({
	        "id":"topAppRegion"+counter,
	        "class":"topAppRegion"
	      })
	      .styles({
	      	"height":"34em"
	      })
	      .append("div")
	      .attrs({
	        "id":"NetworkSummary"+counter,
	        "class":"NetworkSummary"
	      })
	      d3.select("#topAppRegion"+counter).append("span")
			.attrs({
				class:"ui-icon ui-icon-info noShowInfo"
			})
		  .on("click",handleClick)
		  if(window.location.pathname==="/dashboard.html" || window.location.pathname==="/netsage/dashboard.html"){
				// d3.select("#topAppRegion"+counter).styles({
				// 	"position": "relative",
				// 	"left": "-5em"
				// })
			}
	      netSummary.html("<p class='mapTooltipValueType'> <span class='mapTooltipValueTypeIncoming'> <span style='display:inline-block; width: 2em;'></span> <span id='mapTooltipMax'>Max</span> <span style='display:inline-block; width: 3.3em;'></span> <span id='mapTooltipAvg'> Avg </span> <span style='display:inline-block; width: 3.3em;'></span> <span id='mapTooltipMin'>Min</span> </p>" +
           "<p class='valuesLine'> <span style='display:inline-block; width: 0.5em;'></span> <span class='mapTooltipValue Networkmax'>" + d3.format(".2f")(query.network.max) + "</span> <span style='display:inline-block; width: 2.2em;'></span> <span class='mapTooltipValue Networkavg'>" + d3.format(".2f")(query.network.avg) + "</span> <span style='display:inline-block; width: 2.2em;'></span> <span class='mapTooltipValue Networkmin'>" + d3.format(".2f")(query.network.min) + "</span> <span style='display:inline-block; width: 4em;'></span> </span>" +
           "<p class ='mapTooltipScale'> Gb/s </p> <hr>" +
           "<p class='mapTooltipDimension' id='mapTooltipTransferDimension'> Total Transferred</p><p class='mapTooltipValue'>" + d3.format(".0f")(query.network.totalData) + " TB </p> <hr>" +
           "<p class='networkTimeFrame'> <span> " + parseDayMonthYear(start) + "</span> <span style='display:inline-block; width: 1em;'> </span> <span> to </span> <span style='display:inline-block; width: 1em;'></span> <span>" + parseDayMonthYear(stop) + "</span></p>" +
           "<p class='networkTimeFrame' id='networkTimeFrameHour'> <span> " + parseTime(start) + "</span> <span style='display:inline-block; width: 7em;'></span> <span>" + parseTime(stop) + "</span></p>"+
           "<p class ='mapTooltipScale'> " + query.locale + "</p>")

	      function handleClick(){
			var text;
			if(this.classList[2]==="showInfo"){
				d3.select(this)
			  	  .attr("class","ui-icon ui-icon-info noShowInfo")
			}else{
				d3.select(this)
			  	  .attr("class","ui-icon ui-icon-info showInfo")
			}
			if(this.classList[2]==="showInfo")
			{
				if(window.location.pathname==="/dashboard.html" || window.location.pathname==="/netsage/dashboard.html"){
					text = createInfoText("0");
					d3.select("body").append("div")
				  		.attrs({
				  			"id": "infoDashboardDiv-map"
				  		})
						.html(text);
						text = createInfoText("01");
					d3.select("body").append("div")
				  		.attrs({
				  			"id": "infoDashboardDiv-table"
				  		})
						.html(text);
						text = createInfoText("02");
					d3.select("body").append("div")
				  		.attrs({
				  			"id": "infoDashboardDiv-line"
				  		})
						.html(text);
					text = createInfoText("13");
						d3.select("body").append("div")
					  		.attrs({
					  			"id": "infoDashboardDiv-networkSummary"
					  		})
						.html(text);
				}else{
					text = createInfoText("1");
					if(queryObjects[0].queryType==="1"){
						d3.select("body").append("div")
				  		.attrs({
				  			"id": "infoDiv-map"
				  		})
						.html(text);
					}
					else{
						d3.select("body").append("div")
					  		.attrs({
					  			"id": "infoDiv-map"
					  		})
							.html(text);
						text = createInfoText("12");
						d3.select("body").append("div")
					  		.attrs({
					  			"id": "infoDiv-table"
					  		})
							.html(text);
						text = createInfoText("13");
						d3.select("body").append("div")
					  		.attrs({
					  			"id": "infoDiv-networkSummary"
					  		})
							.html(text);
					}
				}
			}else{
				$("#infoDashboardDiv-map").remove();
				$("#infoDashboardDiv-table").remove();
				$("#infoDashboardDiv-line").remove();
				$("#infoDashboardDiv-line").remove();
				$("#infoDashboardDiv-networkSummary").remove();
				$("#infoDiv-map").remove();
				$("#infoDiv-table").remove();
				$("#infoDiv-networkSummary").remove();
			}

			function createInfoText(location){
				var text0,text01,text02;
				var text1,text12;
				if(queryObjects[0].queryType==="1"){
					text1= "<p>This query tries to visualize if any pattern exists for the selected measurement in the selected time period.</p><p>The visualization in the left shows heatmaps for the incoming and outcoming selected measurement values first for the IRNC links and then the IRNC nodes. On the y Axis time is represented as 1 hour steps showing the 24 hour period, the x Axis is represented as 1 day steps. Each square is colored using a blue scale based on the average measurement value for an hour H at a day D.</p><p> The visualizations in the right also show heatmaps of the selected measurement, but this time clustered by day of the week, the y Axis again represents the 24 hours in 1 hour steps, but in this visualization the x Axis represents each day of the week. Each square is colored using a blue scale based on the average measurement value for an hour H at an specific weekday W</p><p>Visualizations will appear incrementally <b>it is possible that it takes a bit of time to get all the visualizations</b> specially for long periods of time (longer than a few months) </p>";
				}else{
					text1 = "<p>The map visualization shows the states of the links and nodes, where the size of the links represent the relative size of the connection. Links are colored in a blue scale while nodes are colored using an orange scale, gray links and white nodes have no data for the selected time frame.</p> ";
					text12 = "<p>The table below shows more detailed information about the links and nodes.</p> <p> The first column shows the distribution of measurements for a specific link. Where the width of the rectangle represents the maximun and minimun measurements for the period selected. The top rectangle represents incoming data and the bottom rectangle represents outgoing data. Each vertical line represents a measurement for that specific link. The more measurements in the same region the darker it shows in the diagram. Allowing users to detect the operating regime for the specific network element </p> <p> The next column, shows the evolution in time of the measurements for a specific network element. The top graph represents incoming and the bottom graph represents outgoing data. </p> <p> The next two columns show bandwidth histograms of incoming and outgoing bandwidth for the links and nodes, as well as their maximum and average values.</p> <p> The last column of the table shows the incoming and outgoing data transferred per network element relative to the total incoming and outgoing data transmitted by all the network elements.</p> <p> Note that columns 1, 2 and 5 are aligned for all the network elements to allow fair comparison accross them. Column 3 and 4 are not aligned in order to help users understand the form of the distributions for each network element.</p>";
					text13 = "<p>The Network Summary Table. Shows the maximum, average and minimun values for the whole IRNC network. As well as the total transferred data through the whole IRNC network in the selected period of time. </p>"
				}
				text0 = "<p>The NetSage dashboard updates every 30 seconds showing the last 3 hours of information about IRNC Network. Click on Ask NetSage above to perform a custom query.</p> <p>The map shows the state of the links and nodes, where the size of the links represent the relative bandwidth of the connection. Links are colored in a blue scale while nodes are colored using an orange scale, gray links and white nodes have no data for the last 3 hours.</p>";
				text01 = "<p>The table below shows more detailed information about the links and nodes.</p> <p> The first column shows the distribution of measurements for a specific link. Where the width of the rectangle represents the maximun and minimun measurements for the period selected. The top rectangle represents incoming data and the bottom rectangle represents outgoing data. Each vertical line represents a measurement for that specific link. The more measurements in the same region the darker it shows in the diagram. Allowing users to detect the operating regime for the specific network element </p> <p> The next column, shows the evolution in time of the measurements for a specific network element. The top graph represents incoming and the bottom graph represents outgoing data. </p> <p> The next two columns show bandwidth histograms of incoming and outgoing bandwidth for the links and nodes, as well as their maximum and average values.</p> <p> The last column of the table shows the incoming and outgoing data transferred per network element relative to the total incoming and outgoing data transmitted by all the network elements.</p> <p> Note that columns 1, 2 and 5 are aligned for all the network elements to allow fair comparison accross them. Column 3 and 4 are not aligned in order to help users understand the form of the distributions for each network element.</p>";
				text02 = "<p>The charts below show the bandwidth of the incoming and outgoing transmissions made in the period selected. Because all the Network elements are present in the graph is easier to compare differeces betweem elements this way. </p>"

				if(location==="0") return text0;
				else if(location==="01") return text01;
				else if(location==="02") return text02;
				else if(location==="12") return text12;
				else if (location==="1") return text1;
				else if (location==="13") return text13;
			}
		}
	}

	//Function for TSDS PerfSonar Data
	function perfSonarTSDSQuery(avgOver,queryMeasure,queryValue){
		//Set up the date
		var date = queryDate;
		var interval = { first: new Date(date[0]), second: new Date(date[1]) }
		var sizeIntervalSeconds = (interval.second - interval.first)/1000
		var avgOver = avgOver;
		var links;
		var nodes = [];
		var idCount = 0;
		if (queryMeasure==="1")var url = 'https://netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get source, destination, aggregate(values.loss,3600, average) as values, max(aggregate(values.loss,3600, average)) as max_loss between( "' + date[0] + '", "' + date[1] + '" ) by source, destination, from ps_owamp having max_loss >0 limit 1000 offset 0 ordered by source,destination desc';
		else if(queryMeasure==="2") var url = 'https://netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get source, destination, aggregate(values.latency_avg,3600, average) as values, max(aggregate(values.latency_avg,3600, average)) as max_lat between( "' + date[0] + '", "' + date[1] + '" ) by source, destination, from ps_owamp having max_lat >0 limit 1000 offset 0 ordered by source,destination desc';
		else if(queryValue === "1") var url = 'https://netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get%20src_organization,%20point_of_observation,%20values.bits,%20average(values.bits)%20as%20avg_bits%20between("' + date[0] + '", "' + date[1] + '" )%20by%20src_organization,%20point_of_observation%20from%20netflow_src_organization%20where%20point_of_observation%20=%20%22*%22%20limit%201000%20offset%200%20ordered%20by%20avg_bits%20desc';
		d3.json(url)
			.on("beforesend", function (request) {request.withCredentials = true;})
			.get(function(error,data)
		{
			data.results.forEach(function(link){
				link.id = idCount;
				idCount++;
			})
			queryObjects[counter].links = data.results;
			for (var element in queryObjects[counter].links){
				//Add the data to the links object
				scaleAndClean(queryObjects[counter].links[element],queryMeasure,queryObjects[0].queryValue);
				calculateStatistics(queryObjects[counter].links[element],sizeIntervalSeconds,queryMeasure,queryObjects[0].queryValue,date);
			}
			queryObjects[counter].links = data.results;
			//Maybe I should move this call and/or the function and either save both results and toggle or call the function from the render.
			if(queryValue!=="1") queryObjects[counter].links = orderPerfsonarTests(queryObjects[counter].links); //We order if it is perfSonar data.
		/*	//Create the nodes from the links
			nodes = createNodes(nodes,queryObjects[counter].links,queryMeasure);
			queryObjects[counter].nodes = nodes;
			for (var element in queryObjects[counter].nodes){
				calculateStatistics(queryObjects[counter].nodes[element].data,sizeIntervalSeconds,queryMeasure);
			}
		*/
			//Create query text
			drawQueryText(queryText);
			// if(queryObjects[counter].queryType==="0"){//Bandwith accross links
			// 	//Create Map
			// 	mapGraph(queryObjects[counter]);
			// 	//Create Table
			// 	histogramTableGraph(queryObjects[counter]);
			// }else if(queryObjects[counter].queryType==="1"){
				periodicPattern(queryObjects[counter]);
				iconClearWaiting();
			// }
		});
		//Function orderPerfsonarTests in order to put A -> B and then B -> A
		function orderPerfsonarTests(tests){
			let outputArray = [];
			let src;
			let dest;
			let id;
			let inArray1;
			let inArray2 = false;
			tests.forEach(function(test,index){
				inArray1 = false;
				src = test.source;
				dest = test.destination;
				id = test.id;
				//Check if it is in output
				if(outputArray.length !== 0 ){
					outputArray.every(function(output){
						if(output.id === test.id){
							inArray1 = true;
							return false;
						}
						return true;
					})
					if(inArray1 === false){
						outputArray.push(test);
					}
				}else{
					outputArray.push(test);
				}
				tests.forEach(function(test){
					inArray2 = false;
					if(test.source === dest){
						if(test.destination === src){
							//Check if it is in output
							outputArray.every(function(output){
								if(output.id === test.id){
									inArray2 = true;
									return false;
								}
								return true;
							})
							if(inArray2 === false){
								outputArray.push(test);
							}
						}
					}
				})
			})
			return outputArray;
		}
	}

	function topTalkers(avgOver,queryMeasure,queryValue){
		let date = queryDate;
		let interval = { first: new Date(date[0]), second: new Date(date[1]) }
		let sizeIntervalSeconds = (interval.second - interval.first)/1000
		let links;
		let idCount = 0;
		let url;
		let inputValues;
		let outputValues;
		let src_fieldName;
		let dst_fieldName;
		let networkData={};
		if(queryMeasure==="0"){
			inputValues = "values.input_bits";
			outputValues = "values.output_bits";
		}else if(queryMeasure==="1"){
			inputValues = "values.input_loss";
			outputValues = "values.output_loss";
		}else if(queryMeasure==="2"){
			inputValues = "values.input_max_rtt";
			outputValues = "values.output_max_rtt";
		}
		if(queryValue==="1"){
			url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get src_organization, dst_organization, point_of_observation,' + inputValues + ',' + outputValues + ', average(' + inputValues + ') as input_avg_bits, average(' + outputValues + ') as output_avg_bits  between("' + date[0] + '", "' + date[1] + '" ) by src_organization, dst_organization, point_of_observation from netflow_src_organization_dst_organization where point_of_observation = "*" limit 1000 offset 0 ordered by avg_bits desc';
			src_fieldName = "src_organization";
			dst_fieldName = "dst_organization";
		}else if(queryValue==="4") {
			url = 'https://netsage-demo:d3m0!d3m0!@netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get src_country_name, dst_country_name, point_of_observation,' + inputValues + ',' + outputValues + ', average(' + inputValues + ') as input_avg_bits, average(' + outputValues + ') as output_avg_bits  between("' + date[0] + '", "' + date[1] + '" ) by src_country_name, dst_country_name, point_of_observation from netflow_src_country_name_dst_country_name where point_of_observation = "*" limit 1000 offset 0 ordered by avg_bits desc';
			src_fieldName = "src_country_name";
			dst_fieldName = "dst_country_name";
		}
		//Maybe I should look this URL for getting the groups directly
		//https://netsage-archive.grnoc.iu.edu/tsds/services-basic/query.cgi?method=query;query=get src_country_name as source,all(dst_country_name) as destinations between(now-180d,now ) by src_country_name from netflow_src_country_name_dst_country_name limit 10000
		console.log(url);
		d3.json(url)
			.on("beforesend", function (request) {request.withCredentials = true;})
			.get(function(error,data){
				queryObjects[counter].links = data.results;
				networkData.nodes =  createNetwork(queryObjects[counter].links,idCount);
				networkData.sankey = parseToSankeyFormat(networkData.nodes);
				networkData.chord = parseToChordFormat(networkData.sankey);
				console.log(networkData);
				drawTopTalkers(networkData);
				iconClearWaiting();
			})

			function createNetwork(data,id){
				var networkNodes = [];
				var srcNode;
				var dstNode;
				var dataFormated;
				data.forEach(function(record,index){
					//First we Check if flow is cero
					
					//Second we chek if the source is a Node
					if (notInArray(networkNodes,record[src_fieldName])){
						networkNodes.push(new createNodes(idCount,record[src_fieldName]));
						idCount++;
					}
					//Then we check the destination
					if (notInArray(networkNodes,record[dst_fieldName])){
						networkNodes.push(new createNodes(idCount,record[dst_fieldName]));
						idCount++;
					}
					//then we add the flow as a children
					srcNode = findNode(networkNodes,record[src_fieldName]);
					dstNode = findNode(networkNodes,record[dst_fieldName]);
					//We only want the output because input comes in another flow.
					srcNode.addFlow(dstNode.id,index,record.output_avg_bits,0);
					// srcNode.addFlow(dstNode.id,index,record.input_avg_bits,1);
					// dstNode.addFlow(srcNode.id,index,record.output_avg_bits,0);
					// dstNode.addFlow(srcNode.id,index,record.input_avg_bits,1);
				})
				console.log(networkNodes);
				for(let i=0;i<networkNodes.length;i++){
					for(let j=0;j<networkNodes[i].flows.length;j++){
						console.log("");
					}
				}
				return networkNodes;
			}
			//Aux Funtions
			function createNodes(id,name){
				this.id = id;
				this.name = name;
				this.flows = [];
				this.addFlow = function(id,connection,value,type){
					let inArray =false;
					if(this.flows.length===0){
						this.flows.push({"src":this.id,"dst":id,"connection":connection,"value":value,"type":type});
					}else{
						this.flows.forEach(function(element){
							if(element.id===id){
								inArray = true;
							}
						})
						if(inArray===false){
							this.flows.push({"src":this.id,"dst":id,"connection":connection,"value":value,"type":type});
						}
					}
				}
				this.childValue = function(){
					let sum=0;
					this.flows.forEach(function(element){
						sum += element.value;
					})
					return sum;
				}
			}
			function notInArray(array,value){
				let not = true;
				if(array.length !== 0){
					array.forEach(function(element){
						if(element.name === value){
							not = false;
						}
					})
				}
				return not;
			}
			function notInFlows(array,value){
				let not = true;
				if(array.length !== 0){
					array.forEach(function(element){
						if(element.src === value.src && element.dst ===value.dst){
							not = false;
						}
					})
				}
				return not;
			}

			function findNode(array,node){
				for(var i=0; i<array.length; i++){
					if(array[i].name === node){
						return array[i];
					}
				}
			}
			function parseToSankeyFormat(network){
				var sankeyObject = {"nodes":[],"links":[]};
				network.forEach(function(networkNode){
					//For each node Create a node for the sankey
					sankeyObject.nodes.push({"node":networkNode.id,"name":networkNode.name});
					networkNode.flows.forEach(function(childFlow){
						let inArray = false;
						let types = [];
						//For each flow in each node add it to the links but check that we dont duplicate the flow.
						//If one flow is the same flow already inserted from the same type we dont add it to dont duplicate
						//Each link is the sum of input and output flow.
						if(sankeyObject.links.length!==0){
							sankeyObject.links.forEach(function(link){
								let typeIn = false;
								if(link.id === childFlow.connection){
									inArray = true;
									link.type.forEach(function(type){
										if(type===childFlow.type){
											typeIn=true;
										}
									})
									if(typeIn=false){
										link.value += childFlow.value;
										link.type.push(childFlow.type);
									}
								}
							})
						}
						//If is not in array and src and dst are different (Sankey dsnt handle self nodes)
						if(inArray===false && childFlow.value!==null && childFlow.src !== childFlow.dst){
							types.push(childFlow.type);
							sankeyObject.links.push({"id":childFlow.connection,"source":childFlow.src,"target":childFlow.dst,"value":childFlow.value,"type":types});
						}else if(inArray===false && childFlow.value===null && childFlow.src !== childFlow.dst){
							types.push(childFlow.type);
							sankeyObject.links.push({"id":childFlow.connection,"source":childFlow.src,"target":childFlow.dst,"value":1,"type":types});
						}
					})
				})
				//There are still duplicated links that come from different nodes. The connection value is different because they come from different nodes. I delete them before returning the object
				for(var i=0;i<sankeyObject.links.length;i++){
					let src = sankeyObject.links[i].source;
					let dst = sankeyObject.links[i].target;
					let id = sankeyObject.links[i].id;
					// for(var j=0;j<sankeyObject.links.length;j++){
					// 	if(src===sankeyObject.links[j].source && dst===sankeyObject.links[j].target && id !== sankeyObject.links[j].id){
					// 		console.log(sankeyObject.links[j].source + "-" + sankeyObject.links[j].target + " : " + sankeyObject.links[j].value + "    "  + sankeyObject.links[i].source + "-" + sankeyObject.links[i].target + " : " + sankeyObject.links[i].value);
					// 		sankeyObject.links.splice(j, 1);
					// 	}
					// }
					for(var j=i;j<sankeyObject.links.length;j++){
						if(src===sankeyObject.links[j].target && dst===sankeyObject.links[j].source){
							console.log(sankeyObject.links[j].source + "-" + sankeyObject.links[j].target + " : " + sankeyObject.links[j].value + "    "  + sankeyObject.links[i].source + "-" + sankeyObject.links[i].target + " : " + sankeyObject.links[i].value);
							sankeyObject.links.splice(j, 1);
						}
					}
				}
				return sankeyObject;
			}
			function parseToChordFormat(network){
				let matrix = [];
				let nodes = [];
				let cleanNodes = [];
				for(let i = 0 ;i < network.length; i++){
					//Initialize an array per node with the size of network
					let array = new Array(network.length);
					for(let j=0; j < network[i].flows.length;j++){
						if(array[network[i].flows[j].dst]===undefined){
							array.splice(network[i].flows[j].dst, 1, network[i].flows[j].value);
						}
						else if(network[i].flows[j].value!==null){
							array[network[i].flows[j].dst] = array[network[i].flows[j].dst] + network[i].flows[j].value;
						}
					}
					//Clean undefined to 0
					for(let j=0; j< array.length;j++){
						if(array[j]===undefined || array[j]===null) array[j]=0;
					}
					matrix.push(array);
					nodes.push(network[i].name);
				}
				return {"nodes":network.nodes,"matrix":matrix};
			}
	}

	function iconClearWaiting(){
		$("#whiteButtonImg").remove();
		$("#queryButtonImg").remove();
	}
	//#################################### END AUX FUNCTIONS ############################
	//Check what measurement the user is asking for
	if(queryMeasure==="0" && queryType!=="2") snmpTSDSQuery(avgOver,queryMeasure,queryValue);////Loads the data for the snmp query
	else if(queryType === "2") topTalkers(avgOver,queryMeasure,queryValue)
	else perfSonarTSDSQuery(avgOver,queryMeasure,queryValue);////Loads the data for the perfSonar query
}