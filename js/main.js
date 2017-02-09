
function main (){
	mainQueryForm();
}

function mainQueryForm(){
	//First we check if we have URL parameters. Question is comming from another tab.
	var hasParameters;
	if(getUrlParameter("date")!=undefined) hasParameters = true;
	else hasParameters = false;
	//QueryFormVariables Array of Options
	var queryTypes;
	var queryMeasures;
	var queryValues;
	var timeFrames;
	var day;
	var queryFromTab;
	if(hasParameters===false){
		queryTypes = ["What was the min, max, average ","What is the duration and are there any periodic patterns or peak periods ", "More to come... "];
		queryMeasures = ["in Bandwidth use"," in Losses","in Latency"];
		queryValues = ["across the IRNC Network","across the IRNC Links","across the IRNC Nodes"];
		timeFrames = ["now","today","last 7 days","this month","this year","time frame"];
		drawQueryForm();
		//Prefill with the pickers with the now data
		day = new Date();
		var threeHoursBefore = new Date(day.getTime() - (3 * 60 * 60 * 1000));
		createDatePickers(threeHoursBefore,day,true);
	}else{
		//Add Giff image while loading it replaces the text in the button. The giff is replaced back to the text at the end of the query. I do that in the main function (TOP)
		d3.select("#submit").append("span")
			.append("img")
			.attrs({
				"id":"whiteButtonImg",
				"src":"whiteSquareButton.jpeg",
				"width":"25em",
				"height":"25em"
			})
		d3.select("#submit").append("span")
			.append("img")
			.attrs({
				"id":"queryButtonImg",
				"src":"opc-ajax-loader.gif",
				"width":"35em",
				"height":"35em"
			})
		queryFromTab = {
			"queryType":getUrlParameter("queryType"),
			"queryName":getUrlParameter("queryName"),
			"queryMeasure":getUrlParameter("queryMeasure"),
			"queryValue":getUrlParameter("queryValue")
		}
		queryTypes = ["What was the min, max, average ","What is the duration and are there any periodic patterns or peak periods ", "More to come... "];
		queryMeasures = ["in Bandwidth use"," in Losses","in Latency"];
		queryValues = ["across the IRNC Network","across the IRNC Links","across the IRNC Nodes"];
		timeFrames = ["time frame","now","today","last 7 days","this month","this year"];
		drawQueryForm();
		//Load the parameters from the URL and execute search
		day = getUrlParameter("date").split(",");
		createDatePickers(new Date(day[0]),new Date(day[1]),true);
		handleOnClick(day,true,queryFromTab);
	}
	function drawQueryForm(){
		//We put the logo and links between Dashboard and Main
		var logoWidth = 90;
		var logoHeight = 90;
		var querySelector = d3.select("body").append("div")
			.attrs({
				class:"querySelector"
			});
		querySelector.append("img")
			.attrs({
				"src":"logoNoShadow.png",
				"width":logoWidth,
				"height":logoHeight
			});
		var goBack = querySelector.append("span")
			.attrs({
				"class":"goBack"
			})
			.html("Dashboard...")
			.on("click",function(){ window.location.href="dashboard.html"});
		goBack.append("span")
			  .attrs({
			  	"class":"ui-icon ui-icon-triangle-1-e arrowGoBack"
			  })
			  .on("click",function(){ window.location.href=".html"});

		// var querySelector = d3.select("body").append("div")
		// 	.attrs({
		// 		class:"querySelector"
		// 	});
		queryForm=querySelector.append("form")
			.attrs({
				"id":"queryForm"
			});
		var fieldset = queryForm.append("fieldset")
							.attrs({
								"id":"fieldset"
							});
		fieldset.append("span")
				.attrs({
					class:"fieldsetTitle"
				})
				.html("Ask NetSage...");
		//We add the info button only present in Main view
		fieldset.append("span")
					.attrs({
						class:"ui-icon ui-icon-info mainInfo noShowInfo"
					})
					.on("click",function(){
						if(this.classList[3]==="showInfo"){
							d3.select(this)
						  	  .attr("class","ui-icon ui-icon-info mainInfo noShowInfo")
						}else{
							d3.select(this)
						  	  .attr("class","ui-icon ui-icon-info mainInfo showInfo")
						}
						if(this.classList[3]==="showInfo")
						{
							d3.select("#fieldset").append("span")
							.attrs({
								"class": "mainInFoText",
								"id":"mainInFoText"
							})
							.html("<p>From this page you can customize your query by simply clicking on the different dropdown menus.</p><p> Firstly select the question you want to get an answer to, secondly select the type of measurement you want to get, thirdly select the elements you want the measurements from and lastly select from the fast time range selector or your own customized range.</p><p>After you create your first query the following queries open in a new browser tab, this way we allow users to make different queries and visualize them side by side by undocking the tabs and arranging them in the screen.</p>")
						}else{
							$("#mainInFoText").remove();
						}
					});
		drawQueryFormCommon(queryForm,fieldset,queryTypes,queryMeasures,queryValues,timeFrames,day);
	}
}