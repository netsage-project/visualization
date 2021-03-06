
function main (){
	mainQueryForm();
}

function mainQueryForm(){
	//First we check if we have URL parameters. Question is comming from another tab.
	var hasParameters;
	if(getUrlParameter("date")!=undefined) hasParameters = true;
	else hasParameters = false;
	//QueryFormVariables Array of Options
	var queryTypesOptions = ["What was the min, max, average ","What is the duration and are there any periodic patterns or peak periods ", "Top Talkers (Coming Soon)", "More to come... "];
	var queryMeasuresOptions = ["in Bandwidth use"," in Losses","in Latency"];
	var queryValuesOptions = ["across the IRNC Links","across the Institutions (Coming Soon)","across the protocols (Coming Soon)","across the Autonomous Systems (AS) (Coming Soon)","accross Countries (Coming Soon)"];
	var timeFramesOptions = ["now","today","last 7 days","this month","this year","time frame"];
	//Variables we populate to create menus from the available options.
	var queryTypes = [];
	var queryMeasures = [];
	var queryValues = [];
	var timeFrames = [];
	var day;
	var queryFromTab;
	//If the URL doesnt hace parameters we initialize
	if(hasParameters===false){
		queryTypes = queryTypesOptions;
		queryMeasures = queryMeasuresOptions;
		queryValues = queryValuesOptions;
		timeFrames = timeFramesOptions;
		drawQueryForm();
		//Prefill with the pickers with the now data
		day = new Date();
		var threeHoursBefore = new Date(day.getTime() - (3 * 60 * 60 * 1000));
		createDatePickers(threeHoursBefore,day,true);
	//If URL has parameters we load the parameters to fill up the menu.
	}else{
		//Add Giff image while loading it replaces the text in the button. The giff is replaced back to the text at the end of the query.
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
		//Fill the first element to be what we got from the queryParameters then omit the element that we put first o that we dont repeat elements. We do this for all options
		queryTypes.push(queryTypesOptions[queryFromTab.queryType]);
		queryTypesOptions.forEach(function(option,index){
			if(index.toString() !== queryFromTab.queryType){
				queryTypes.push(queryTypesOptions[index]);
			}
		})
		queryMeasures.push(queryMeasuresOptions[queryFromTab.queryMeasure]);
		queryMeasuresOptions.forEach(function(option,index){
			if(index.toString() !== queryFromTab.queryMeasure){
				queryMeasures.push(queryMeasuresOptions[index]);
			}
		})
		//queryMeasures = ["in Bandwidth use"," in Losses","in Latency"];
		queryValues = ["across the IRNC Network","across the main Institutions","across the IRNC Nodes"];
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
				"src":"logo.png",
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
		fieldset.append("img")
					.attrs({
						class:"mainInfo noShowInfo",
						"src":"question-mark.png"
					})
					.on("click",function(){
						if(this.classList[1]==="showInfo"){
							d3.select(this)
						  	  .attr("class","mainInfo noShowInfo")
						}else{
							d3.select(this)
						  	  .attr("class","mainInfo showInfo")
						}
						if(this.classList[1]==="showInfo")
						{
							d3.select("#fieldset").append("span")
							.attrs({
								"class": "mainInFoText",
								"id":"mainInFoText"
							})
							.html("<p>From this page you can customize your query using the dropdown menus on the left.</p><p> 1. Select the question you want to ask </p> <p> 2. Select the type of measurement you want (Bandwidth, Loss, ...) </p> <p> 3. Choose the Networks </p> <p> 4. Select the Time Range </p> <p> Note that subsequent queries open in a new browser tab, this way we allow users to make different queries and visualize them side by side by undocking the tabs and arranging them in the screen.</p>")
						}else{
							$("#mainInFoText").remove();
						}
					});
		drawQueryFormCommon(queryForm,fieldset,queryTypes,queryMeasures,queryValues,timeFrames,day,queryFromTab);
	}
}