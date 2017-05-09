function drawTopTalkers(data){
	// chord(data.chord);
	// sankey(data.sankey);
	function sankey(data){
		var units = "Bits";
		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 10, bottom: 10, left: 10},
		    width = window.innerWidth - margin.left - margin.right,
		    height = data.nodes.length * 40 - margin.top - margin.bottom;

		// format variables
		var formatNumber = d3.format(",.0f"),    // zero decimal places
		    format = function(d) { return formatNumber(d) + " " + units; },
		    color = d3.scaleOrdinal(d3.schemeCategory20);
  		d3.select("body").append("div")
			.attrs({
				"id":"sankey",
				"class":"sankey"
			});
		// append the svg object to the body of the page
		var svg = d3.select("#sankey").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform",
		          "translate(" + margin.left + "," + margin.top + ")");

		// Set the sankey diagram properties
		var sankey = d3.sankey()
		    .nodeWidth(36)
		    .nodePadding(40)
		    .size([width, height]);

		var path = sankey.link();

		  sankey
		      .nodes(data.nodes)
		      .links(data.links)
		      .layout(2000);

		// add in the links
		  var link = svg.append("g").selectAll(".link")
		      .data(data.links)
		    .enter().append("path")
		      .attr("class", "link")
		      .attr("d", path)
		      .styles({
		      	"stroke-width": function(d) { return Math.max(1, d.dy)},
		      	"stroke": function(d,i) {
		      		return color(d.source.node)}
		      	})
		      .sort(function(a, b) { return b.dy - a.dy; });

		// add the link titles
		  link.append("title")
		        .text(function(d) {
		    		return d.source.name + " → " + 
		                d.target.name + "\n" + format(d.value); });

		// add in the nodes
		  var node = svg.append("g").selectAll(".node")
		      .data(data.nodes)
		    .enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { 
				  return "translate(" + d.x + "," + d.y + ")"; })
		      .call(d3.drag()
		        .subject(function(d) {
		          return d;
		        })
		        .on("start", function() {
		          this.parentNode.appendChild(this);
		        })
		        .on("drag", dragmove));

		// add the rectangles for the nodes
		  node.append("rect")
		      .attr("height", function(d) { return d.dy; })
		      .attr("width", sankey.nodeWidth())
		      .style("fill", function(d) { 
				  return d.color = color(d.node); })
		      .style("stroke", function(d) { 
				  return d3.rgb(d.color).darker(2); })
		    .append("title")
		      .text(function(d) { 
				  return d.name + "\n" + format(d.value); });

		// add in the title for the nodes
		  node.append("text")
		      .attr("x", -6)
		      .attr("y", function(d) { return d.dy / 2; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", "end")
		      .attr("transform", null)
		      .text(function(d) { return d.name; })
		    .filter(function(d) { return d.x < width / 2; })
		      .attr("x", 6 + sankey.nodeWidth())
		      .attr("text-anchor", "start");

		// the function for moving the nodes
		  function dragmove(d) {
		    d3.select(this)
		      .attr("transform", 
		            "translate(" 
		               + d.x + "," 
		               + (d.y = Math.max(
		                  0, Math.min(height - d.dy, d3.event.y))
		                 ) + ")");
		    sankey.relayout();
		    link.attr("d", path);
		  }
	}

	function chord(data){
		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 10, bottom: 10, left: 10},
		    width = window.innerWidth - margin.left - margin.right,
		    height = 1000 - margin.top - margin.bottom;
		var max =0;
		let tempMax=0;
		for(let i=0;i<data.matrix.length;i++){
			tempMax = d3.max(data.matrix[i]);
			max = d3.max([max,tempMax]);
		}
		var scale = d3.scaleLinear()
					  .domain([0,max])
					  .range([0,100])

		for(let i=0;i<data.matrix.length;i++){
			for(let j=0;j<data.matrix[i].length;j++){
				data.matrix[i][j] = scale(data.matrix[j][j]);
			}
		}

		// var data ={
		//   "nodes":["Australia","USA","GER","BRASIL","Peter","LAker","Revolt","Mangosta","Scarlett","Determinant","Spain","Congo","Korea"],
		//   "matrix":[
		//               [11975,  5871, 8916, 2868,0,0,0,0,0,0,1,1,2],
		//               [ 1951, 10048, 2060, 6171,0,0,0,0,0,10,2,3,4],
		//               [ 8010, 16145, 8090, 8045,0,0,10,0,10,10,5,6,3],
		//               [ 8010, 16145, 8090, 8045,0,0,0,10,10,10,4,5,6],
		//               [ 8010, 1623145, 8090, 8045,10,10,10,10,10,10,1,6,5],
		//               [ 23442, 16145, 8090, 8045,10,10,10,10,10,10,2,4,5],
		//               [ 8010, 2342342342, 8090, 8045,10,0,0,10,10,10,5,4,3,2],
		//               [ 8010, 16145, 8090, 8045,10,10,10,10,10,10,3,4,5],
		//               [ 2342342, 16145, 8090, 8045,10,10,10,10,10,10,5,6,7],
		//               [ 8010, 16145, 8090, 8045,10,10,10,10,10,10,2,3,4],
		//                [ 23342, 16145, 8090, 8045,10,10,10,10,10,10,2,3,4],
		//                 [ 2334, 16145, 2334, 2344,10,10,10,10,10,10,2,3,4],
		//                  [ 8010, 1234234, 8090, 2334,10,10,10,10,10,10,2,3,4]
		//           ]
		// }

		var div = d3.select("body").append("div")
			.attrs({
				"id":"chord",
				"class":"chord"
			});

		var svg = div.append("svg")
			.attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    .attr("transform",
		          "translate(" + margin.left + "," + margin.top + ")");
		var outerRadius = Math.min(width, height) * 0.5 - 60;
		var innerRadius = outerRadius - 30;

		var formatValue = d3.formatPrefix(",.0", 1e3);

		var chord = d3.chord()
		    .padAngle(0.05)
		    .sortSubgroups(d3.descending);

		var arc = d3.arc()
		    .innerRadius(innerRadius)
		    .outerRadius(outerRadius);

		var ribbon = d3.ribbon()
		    .radius(innerRadius);

		var color = d3.scaleOrdinal()
		    .domain(d3.range(4))
		    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

		var g = svg.append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		    .datum(function(){
		        let matrix = chord(data.matrix);
		        for(var i=0;i<matrix.length;i++){
		           matrix[i].source.name = data.nodes[matrix[i].source.index];
		           matrix[i].target.name = data.nodes[matrix[i].target.index];
		        }
		        return matrix;
		    });

		var group = g.append("g")
		    .attr("class", "groups")
		  .selectAll("g")
		  .data(function(chords) {
		    for(var i = 0; i<chords.groups.length; i++){
		      chords.groups[i].name = data.nodes[chords.groups[i].index];
		    }
		    return chords.groups;
		  })
		  .enter().append("g");

		  group.append("text")
		  .attr("transform", function(d) { 
		    return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ") translate(" + (outerRadius + 20) + ",0)"; })
		  .styles({"font-size": "20px"})
		  .text(function(d,i){
		    return d.name;
		  })

		group.append("path")
		    .style("fill", function(d) { return color(d.index); })
		    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
		    .attr("d", arc);

		var groupTick = group.selectAll(".group-tick")
		  .data(function(d) { return groupTicks(d, 1e3); })
		  .enter().append("g")
		    .attr("class", "group-tick")
		    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

		groupTick.append("line")
		    .attr("x2", 6);

		groupTick
		  .filter(function(d) { return d.value % 5e3 === 0; })
		  .append("text")
		    .attr("x", 8)
		    .attr("dy", ".35em")
		    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
		    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		    .text(function(d) { return formatValue(d.value); });

		g.append("g")
		    .attr("class", "ribbons")
		  .selectAll("path")
		  .data(function(chords) { return chords; })
		  .enter().append("path")
		    .attr("d", ribbon)
		    .style("fill", function(d) { return color(d.target.index); })
		    .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });

		// Returns an array of tick angles and values for a given group and step.
		function groupTicks(d, step) {
		  var k = (d.endAngle - d.startAngle) / d.value;
		  return d3.range(0, d.value, step).map(function(value) {
		    return {value: value, angle: value * k + d.startAngle};
		  });
		}
	}
}