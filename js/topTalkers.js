function drawTopTalkers(data){
	sankey(data);
	function sankey(data){
		var units = "Bits";
		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 10, bottom: 10, left: 10},
		    width = window.innerWidth - margin.left - margin.right,
		    height = data.nodes.length * 30 - margin.top - margin.bottom;

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
}