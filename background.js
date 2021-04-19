var tabUrl;
var tabId;
var timeStorage = {};
var currentState = "active";
var visibilityState = "visible";

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
				if (!(tabUrl in timeStorage)){
					timeStorage[tabUrl] = 0;
				}
				
				chrome.idle.queryState(30, function(status){
					currentState = status;
				});
				
				chrome.tabs.sendMessage(tabId, {visibilityRequest: "true"}, function(visibility){
					visibilityState = visibility;
				});

				console.log(visibilityState);
				if(currentState == 'active' && visibilityState == 'visible'){
					timeStorage[tabUrl] += 1;
				}

				chrome.tabs.sendMessage(tabId, {time: timeStorage[tabUrl], state: currentState});

			}

			console.log(timeStorage);


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