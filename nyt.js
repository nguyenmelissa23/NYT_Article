//Creates queryURL
var makeQuery = function(){

	var authKey = "b9f91d369ff59547cd47b931d8cbc56b:0:74623931"
	var search = $("#searchBar").val();
	var yearBeg = $("#yearBeg").val(); 
	var yearEnd = $("#yearEnd").val();

	var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey + "&sort=newest";

	//Checks each input field for value, if invalid assigns default values: history, limit 5, all years
	if(search === ""){
		queryURL += "&q=history";
	}
	else{
		queryURL += "&q=" + encodeURI(search);
	}
	if(yearBeg !== undefined){
		"&begin_date=" + yearBeg;
	}
	if(yearEnd !== undefined){
		"&end_date=" + yearEnd;
	}

	//Outputs the entire API CALL as url
	return queryURL;
}

//Outputs search results into the DOM
var createSearchResults = function(data){
	//Get to what we need from data
	var results = data.response.docs;
	//Clears reults in DOM in prep for new
	$("#results").empty();

	//Limits number of results to display. If 0, or undefined default to 5
	var numRec = $("#numRecord").val(); 

	if(numRec === 0 || numRec === undefined){
		numRec = 5;
	}

	//Clear loading GIF
	$('.loader').addClass('hide');

	for (i = 0; i < numRec; i++){
		var newdiv = $("<div>").addClass("results");
		//create new elements to house search reesults
		var title = $("<h2>");
		var auth = $("<h3>");
		var sect = $("<p>");
		var time = $("<p>");
		var link = $("<a>");
		//create the text for each element
		
		console.log(results)
		var titleText = results[i].headline.main;
		
		var authText;
		//Try catch to see if author is listed
		if(authText === null){
			
		}
		try {
    		authText = results[i].byline.original;
		}
		catch(err) {
		    authText = "New York Times Article";
		}

		var sectText = results[i].snippet;
		var timeText = results[i].pub_date;
		var linkURL = results[i].web_url;

		//Appends title plus link to abstract
		title.append(i + 1 + ".) ")
			.append(link.append(titleText).attr("href", linkURL));

		auth.append(authText);
		sect.append(sectText);
		time.append(timeText).addClass("italic");
		//apppend to div
		newdiv.append(title);
		newdiv.append(auth);
		newdiv.append(sect);
		newdiv.append(time);


		//Append the container element for the current index search result
		$("#results").append(newdiv);
	}
};


//Function call to run AJAX request and work with data it returns.
var initSearchButton = function(){
	//Showing loading gif
	$('.loader').removeClass('hide');

	//Create API Call
	var queryURL = makeQuery();

 	console.log(queryURL);

 	//AJAX request to NYTimes
	$.ajax({
		url: queryURL, 
		method: 'GET'
	}).done(createSearchResults);
};


$(document).ready(function(){
	
	//Binds initSearchButton to #search-button
	$("#search-btn").on('click', initSearchButton);

	//If inside input fields and the user hits enter, binds initSearchButton
	$("input").keypress(function (e) {
			if (e.which == 13) {
				initSearchButton();
			return false;
			}
	});

	$("#clear-btn").click(function(){
		$("#results").empty();
		$("#searchBar").focus();
	})

	$("#searchBar").focus();
});

