function mapGraph(data){
  queryObjects[counter].graphs.map.links = data.links;
  queryObjects[counter].graphs.map.nodes = data.nodes;
  var links = data.links;
  var nodes = data.nodes;
  //#################################### AUX FUNCTIONS ############################
  function handleMouseOver(d,i){
    var xPos;
    var yPos;
    //For style purposes I can not move the tooltip more to the right it brakes the style so we set a maximun value
    if(d3.event.layerX < 1000) xPos =d3.event.layerX - 100;
    else xPos = 1000;
    yPos =d3.event.layerY - 100;
    div = d3.select(".mapTooltip");
    div.transition()
       .duration(500)
       .style("opacity", .9);
    var nodeLinks="";
    //If mouseoverNode
    if(this.classList[0]==="nodes" || this.classList[0]==="nodesPlaceholder"){
      //Change size of node
      d3.select(this)
        .transition()
        .duration(500)
        .style('stroke-width','2')
        .attr('r',15)
      if(this.classList[0]==="nodes"){
          div.html("<p class ='mapTooltipname'> <span>" + d.node + "</span> </p>" +
            " <hr> " +
            " <p> <span class='mapTooltipDimension'> Total Transfer : </span> <span class='mapTooltipValue'>" + d3.format(".2f")((d.data.totalData[0] + d.data.totalData[1])/1024/8) + " TB </span> </p>")
            .style("left", xPos + "px")
            .style("top", yPos + "px");
      }else{
        div.html("<p class ='mapTooltipname'> <span>" + d.node + "</span> </p>")
            .style("left", xPos + "px")
            .style("top", yPos + "px");
      }
    }else if(this.classList[0]==="links" || this.classList[0]==="linksPlaceholder"){
        let description;
        let linkSize;
        let origin;
        let destination;
        if(this.classList[0]==="links"){
          if(data.links[i].description.split('100GE').length > 1){
            description = data.links[i].description.split('100GE')[0]
            linkSize = "100GE"
            origin = description.split(":")[1].split("to")[0]
            destination = description.split(":")[1].split("to")[1]
          }
          else if(data.links[i].description.split('10GE').length > 1){
            description = data.links[i].description.split('10GE')[0]
            linkSize = "10GE"
            origin = description.split(":")[1].split("to")[0]
            destination = description.split(":")[1].split("to")[1]
          }else if(data.links[i].description.split('30GE').length > 1){
            description = data.links[i].description.split('30GE')[0]
            linkSize = "30GE"
            origin = "Washington"
            destination=" Frankfurt"
          }else{
            description = link[i].description;
            linkSize ="";
          }
        }
        else if(this.classList[0]==="linksPlaceholder"){
          if(d.name.split('100GE').length > 1){
            description = d.name.split('100GE')[0]
            linkSize = "100GE"
          }
          else if(d.name.split('10GE').length > 1){
            description = d.name.split('10GE')[0]
            linkSize = "10GE"
          }else{
            description = d.name;
            linkSize ="";
          }
        }
      //If Mouseover Link with Data
      if(this.classList[0]==="links"){
        div.html("<p class ='mapTooltipname'> <span class='mapTooltipDescription'>" + description + "</span> <span style='display:inline-block; width: 14em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>" +
           "<p class='mapTooltipDimension' > <span style='display:inline-block; width: 1.0em;'> </span> <span>  To " + origin + " </span> <span style='display:inline-block; width: 7.0em;'></span> <span> To" + destination + " </span> </p>"+
           "<p class='mapTooltipValueType'> <span class='mapTooltipValueTypeOutgoing'> <span id='mapTooltipMax'>Max</span> <span style='display:inline-block; width: 1.5em;'></span> <span id='mapTooltipAvg'> Avg </span> <span style='display:inline-block; width: 1.8em;'></span> <span id='mapTooltipMin'>Min</span> </span> <span class='mapTooltipValueTypeIncoming'> <span style='display:inline-block; width: 0.2em;'></span> <span id='mapTooltipMax'>Max</span> <span style='display:inline-block; width: 1.5em;'></span> <span id='mapTooltipAvg'> Avg </span> <span style='display:inline-block; width: 1.8em;'></span> <span id='mapTooltipMin'>Min</span> <span style='display:inline-block; width: 2.7em;'></span> </span> </p>" +
           "<p> <span class='mapTooltipValueOutgoing'> <span class='mapTooltipValue'>" + d3.format(".2f")(data.links[i].data.input.max) + " </span> <span style='display:inline-block; width: 1em;'></span> <span class='mapTooltipValue'>" + d3.format(".2f")(data.links[i].data.input.avg) + " </span> <span style='display:inline-block; width: 1em;'></span> <span class='mapTooltipValue'>" + d3.format(".2f")(data.links[i].data.input.min) + " </span> </span>" +  " <span style='display:inline-block; width: 0.3em;'></span> <span class='mapTooptipValueIncoming'> <span class='mapTooltipValue'>" + d3.format(".2f")(data.links[i].data.output.max) + "</span> <span style='display:inline-block; width: 1em;'></span> <span class='mapTooltipValue'>" + d3.format(".2f")(data.links[i].data.output.avg) + "</span> <span style='display:inline-block; width: 1em;'></span> <span class='mapTooltipValue'>" + d3.format(".2f")(data.links[i].data.output.min) + "</span> <span style='display:inline-block; width: 4em;'></span> </span>" +
           "<p class ='mapTooltipScale'> Gb/s </p> <hr>" +
           "<p id='mapTooltipTransferDimension'> Total Transferred</p><p class='mapTooltipValue'>" + d3.format(".2f")((data.links[i].data.totalData[0] + data.links[i].data.totalData[1])/1024/8) + " </p> <p class ='mapTooltipScale' > TB </p>")
           .style("left", xPos + "px")
           .style("top", yPos + "px");
      }else{
        div.html("<p class ='mapTooltipname'> <span class='mapTooltipDescription'>" + description + "</span> <span style='display:inline-block; width: 14em;'> </span> <span class='mapTooltipSize'>" + linkSize + " </span> </p> <hr>")
           .style("left", xPos + "px")
           .style("top", yPos + "px");
      }
    }
  }
  function handleMouseOut(d,i){
    //return events on lines
    //d3.selectAll(".links")
    //  .attrs("pointer-events","auto")
    if(this.classList[0]==="nodes" || this.classList[0]==="nodesPlaceholder"){
      d3.select(this)
        .transition()
        .duration(500)
        .style('stroke','black')
        .style('stroke-width','1')
        .attr('r',10)
      var nodeLinks="";
    }
    div = d3.select("#mapTooltip");
    div.transition()
       .duration(500)
       .style("opacity", 0);
  }

  function createLegend(svgGroup, colorNodes, colorLinks,maxDataLinks,maxDataNodes){
    //Create gradients the id assigned has to be the same that appears in the fill parameter of the rectangle
    createGradient("linkGradient",svgGroup,colorLinks(0),colorLinks(maxDataLinks));
    createGradient("nodesGradient",svgGroup,colorNodes(0),colorNodes(maxDataNodes));
    var legend = svgGroup.append('g')
                         .attrs({
                            "class":"mapLegend",
                            "transform": "translate(" + (width - 150) + "," + (height - 110) + ")",
                         })
    legend.append("rect")
            .attrs({
              "id": "linksLegend",
              "height": 100,
              "width": 20,
              "fill": "url(#linkGradient)",
              "stroke":"rgb(0,0,0)",
              "stroke-width":0.5
            });
    //Add max and minimum value to link Legend
    legend.append("text")
            .attrs({
              "transform": "translate(" + (-43) + "," + 10 + ")"
            })
            .text(Math.ceil(maxDataLinks) + " Gb/s")
    legend.append("text")
            .attrs({
              "transform": "translate(" + (-40) + "," + 98 + ")"
            })
            .text("0 Gb/s")
    //Add max and minimum value to link Legend
    legend.append("text")
            .attrs({
              "transform": "translate(" + 65 + "," + 10 + ")"
            })
            .text(Math.ceil(maxDataNodes) + " Gb/s")
    legend.append("text")
            .attrs({
              "transform": "translate(" + 65 + "," + 98 + ")"
            })
            .text("0 Gb/s")
    legend.append("rect")
            .attrs({
              "class": "mapLegend2",
              "id": "nodesLegend",
              "transform": "translate(" + (40) + "," + 0 + ")",
              "height": 100,
              "width": 20,
              "fill": "url(#nodesGradient)",
              "stroke":"rgb(0,0,0)",
              "stroke-width":0.5
            })
  }
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
  //#################################### END AUX FUNCTIONS ########################
  // Define the div for the tooltip
  var div = d3.select("#topAppRegion"+counter).append("div")
    .attrs({
      "class": "mapTooltip",
      "id":"mapTooltip"
    })
    .style("opacity", 0);
  var margin = {top: 0, right: 0, bottom: 0, left: 60},
        width = 1150 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  var svgMap = d3.select("#topAppRegion"+counter)
      .append("div")
      .attrs({
        "id":"map"+counter,
        "class":"map"
      })
      .append("svg")
      .attrs({
        width:width + margin.left + margin.right,
        height:height + margin.top + margin.bottom
      })
  var map = svgMap.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("world.json", function(error, world) {
    if (error) return console.error(error);
    var subunits = topojson.feature(world, world.objects.subunits);
    var projection = d3.geoMercator()
    	  .scale(215)
    	  .rotate([-240,-1]);
    var projection1 = d3.geoMercator()
    .scale(215)
    .translate([439,-127])
    .rotate([-240,-180]);
    var path = d3.geoPath()
    	  .projection(projection);
    var path1 = d3.geoPath()
    	  .projection(projection1);
    map.append("path")
        .datum(subunits)
        .attrs({
          "d": path,
          "id":"worlldMap"+counter
        })
    //create colors for the links
    //Calculate Max values for scales
    var maxDataLinks=[];
    var maxDataNodes=[];
    for(var each in eval("queryObjects["+counter+"].links")){
      maxDataLinks.push(eval("d3.max([queryObjects["+counter+"].links[each].data.input.max,queryObjects["+counter+"].links[each].data.output.max])"));
      maxDataNodes.push(eval("d3.max([queryObjects["+counter+"].nodes[each].data.input.max,queryObjects["+counter+"].nodes[each].data.output.max])"));
    }
    maxDataLinks = d3.max(maxDataLinks);
    maxDataNodes = d3.max(maxDataNodes);
    var colorLinks = d3.scaleLinear().domain([0,maxDataLinks])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#E1F5FE"), d3.rgb("#01579B")]);
    var colorNodes = d3.scaleLinear().domain([0,maxDataNodes])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#ffe0cc"), d3.rgb("#ff6600")]);

    //Create Links PlaceHolders
    d3.json("linksMetadata.json",function(error, linkValues){
      map.selectAll(".linksPlaceholder")
         .data(linkValues)
         .enter()
         .append("path")
         .datum( function(d){
            return {type: "LineString", coordinates: [[d["a_endpoint.longitude"], d["a_endpoint.latitude"]], [d["z_endpoint.longitude"],d["z_endpoint.latitude"]]],name:d.description,size:d.max_bandwidth};
         })
         .attrs({
            class:"linksPlaceholder",
            d:path,
            id: function (d,i) {
              return "linksPlaceholder-"+ d.node ; }
            })
         .styles({
            "stroke-width": function(d,i){
              return ((linkValues[i].max_bandwidth/10000000000) + 2 + 3 )}, //Transform to Terabyte and adjust size. We add a few extra pixels so that a border appears around the links.
         })
         .on("mouseover",handleMouseOver)
         .on("mouseout",handleMouseOut);

      //After we create the Real Links so they render on top
      map.selectAll(".links")
        .data(data.links)
        .enter()
        .append("path")
        .datum( function(d){
            // if(d.node !== "sw.net.wix.internet2.edu") 
            return {type: "LineString", coordinates: [[d["a_endpoint.longitude"], d["a_endpoint.latitude"]], [d["z_endpoint.longitude"],d["z_endpoint.latitude"]]]};
            // else return {type: "LineString", coordinates: [[d["a_endpoint.longitude"], d["a_endpoint.latitude"]], [-65,35] , [-55,33.2], [-50,32], [-40,31.5], [-30,32] , [-18,34.70], [-8.88,37.25], [-3.68,40.61], [0.695767,42.755750], [d["z_endpoint.longitude"],d["z_endpoint.latitude"]]]}
        })
        .attrs({
          class:"links",
          d:function(d,i){
            if(queryObjects[0].links[i].node !== "sw.net.wix.internet2.edu") return path(d);
            else return path1(d);
          },
          id: function (d,i) {
            return "links-"+ counter+ i ; }
        })
        .styles({
          "stroke-width": function(d,i){
            return ((data.links[i].max_bandwidth/10000000000) + 2 )}, //Transform to Terabyte and adjust size
          "stroke": function(d,i){
            return colorLinks(d3.mean([data.links[i].data.input.max,data.links[i].data.output.max]))} //We are coloring links based on max use
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout",handleMouseOut);

        //Create Nodes PlaceHolders
        d3.json("nodesMetadata.json",function(error, nodeValues){
          map.selectAll(".nodesPlaceholder")
             .data(nodeValues)
             .enter()
             .append("circle")
             .attrs({
                cx: function (d) {
                  return projection([d.longitude, d.latitude])[0]; },
                cy: function (d) { return projection([d.longitude, d.latitude])[1]; },
                r: 10,
                class: "nodesPlaceholder"
             })
             .styles({
                fill: function(d,i) {
                  return "white";
                }
             })
             .on("mouseover",handleMouseOver)
             .on("mouseout",handleMouseOut);
          //Create Real ExchangePoints
          map.selectAll(".nodes")
             .data(data.nodes)
             .enter()
             .append("circle")
             .attrs({
                cx: function (d) {
                  return projection([d.lon, d.lat])[0]; },
                cy: function (d) { return projection([d.lon, d.lat])[1]; },
                r: 10,
                class: "nodes",
                id: function (d,i) { return "nodes-"+ counter + i; }
             })
             .styles({
                fill: function(d,i) {
                  return colorNodes(avg([data.nodes[i].data.input.avg,data.nodes[i].data.output.avg]));
                }
             })
             .on("mouseover",handleMouseOver)
             .on("mouseout",handleMouseOut);
          //Create Legend
          createLegend(map, colorNodes, colorLinks,maxDataLinks,maxDataNodes);
        });
    });
  });
}