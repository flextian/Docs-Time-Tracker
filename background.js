var tabUrl;
var tabId;
var currentState = "active";
var visibilityState = "visible";

// Check to see if local storage already exists
chrome.storage.sync.get(["timeStorage"], function(items){

	console.log(items['timeStorage']);

	if (items['timeStorage'] === undefined) {
		chrome.storage.sync.set({ "timeStorage": {} }, function(){});
	}

});



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
				
				// If docs tab is not in storage
				chrome.storage.sync.get(["timeStorage"], function(items){				

					if (!(tabUrl in items['timeStorage'])){
						items['timeStorage'][tabUrl] = 0;
					}

					chrome.idle.queryState(30, function(status){
						currentState = status;
					});

					chrome.tabs.sendMessage(tabId, {visibilityRequest: "true"}, function(visibility){
						visibilityState = visibility;
					});

					console.log(visibilityState);

					if(currentState == 'active' && visibilityState == 'visible'){
						items['timeStorage'][tabUrl] += 1;
					}

					chrome.tabs.sendMessage(tabId, {time: items['timeStorage'][tabUrl], state: currentState});

					chrome.storage.sync.set({ "timeStorage": items['timeStorage'] }, function(){});

				});
				
			}

			// For debugging, print timeStorage every second
			chrome.storage.sync.get(["timeStorage"], function(items){
				console.log(items['timeStorage']);			
			});

		}
	)}, 1000);

function isGoogleDoc(url){
	if (url.includes("/edit")){
		return true;
	}
	else {
		return false;
	}
}