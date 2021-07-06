var tabUrl;
var tabId;
var currentState = "active";
var visibilityState = "visible";

resetStorage();

// Check to see if local storage already exists
chrome.storage.sync.get(["timeStorage"], function(items){

	console.log(items['timeStorage']);

	if (items['timeStorage'] === undefined) {
		chrome.storage.sync.set({ "timeStorage": {} }, function(){});
	}

});


// Called every second
setInterval(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabArray) {

			var tabData = tabArray[0];
			// If the tab isn't valid (usually the chrome console)
			if (tabData == null){
				tabUrl = "none";
			}
			// If the tab is valid, retrieve its url and id
			else{
				tabUrl = tabData.url;
				tabId = tabData.id;
			}

			if (isGoogleDoc(tabUrl)){

				var tabUrlShortened = parseDocsUrl(tabUrl);
				
				// If docs tab is not in storage
				chrome.storage.sync.get(["timeStorage"], function(items){				

					if (!(tabUrlShortened in items['timeStorage'])){
						items['timeStorage'][tabUrlShortened] = {};
					}

					chrome.idle.queryState(30, function(status){
						currentState = status;
					});

					chrome.tabs.sendMessage(tabId, {visibilityRequest: "true"}, function(visibility){
						visibilityState = visibility;
					});

					console.log(visibilityState);

					if(currentState == 'active' && visibilityState == 'visible'){
						items['timeStorage'][tabUrlShortened] += 1;
					}

					chrome.tabs.sendMessage(tabId, {time: items['timeStorage'][tabUrlShortened], state: currentState});

					chrome.storage.sync.set({ "timeStorage": items['timeStorage'] }, function(){});

				});

				printStorage();
				
			}
		}
	);}, 1000);


// Components
function isGoogleDoc(url){
	if (url.includes("/edit")){
		return true;
	}
	else {
		return false;
	}
}

function parseDocsUrl(url){
	var start = url.indexOf('/d/');
	var parsed = url.substring(start + 3, start + 47);
	return parsed;
}

function resetStorage(){
	chrome.storage.sync.set({ "timeStorage": {} }, function(){});
}

function printStorage(){
	// For debugging, print timeStorage every second
	chrome.storage.sync.get(["timeStorage"], function(items){
		console.log(items['timeStorage']);			
	});
}