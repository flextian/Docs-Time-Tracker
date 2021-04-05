/* eslint-disable no-undef */
chrome.tabs.onActivated.addListener(tab_switch);
chrome.windows.onFocusChanged.addListener(window_switch);
chrome.tabs.onUpdated.addListener(url_switch);
chrome.idle.onStateChanged.addListener(update_currentState);
// Runs the actual check for state function every 15 sec
chrome.idle.setDetectionInterval(15)

setInterval(function(){
	if (currentState == 'active'){
		console.log("CURRENT TIME " + (globalTimers[tabUrl] + ((new Date() - currentTimers[tabUrl]) / 1000)));
	}
	else {
		console.log("CURRENT TIME " + globalTimers[tabUrl]);
	}
	}, 1000);

var tabUrl;
var tabId;
var currentTimers = {};
var globalTimers = {};
var prevTabUrl = null;
var currentState = "active";

function url_switch(){
	tab_window_switched();
}
function tab_switch(){
	tab_window_switched();
}
function window_switch(){
	tab_window_switched();
}

function update_currentState(){
	// User needs to be idle for at least 15 sec
	chrome.idle.queryState(15, function(status){
		currentState = status;
		
		//Start idle state on google doc
		if (is_google_doc(tabUrl) && (status != "active")){
			save_time(tabUrl);
		}

		//Stops idle state on google docs, start counting 
		if (is_google_doc(tabUrl) && status == "active"){
			start_time(tabUrl, tabId);
		}
	});
}

function tab_window_switched(){
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabArray) {
		console.log("This is the data for the current active tab: " + JSON.stringify(tabArray[0]));
		console.log("This is the data for the last focused window: " + JSON.stringify(tabArray[1]));

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

		// if a google docs tab is switched out (stop), prevTabUrl is null initially
		if (prevTabUrl != null && is_google_doc(prevTabUrl) && currentState == "active"){
			save_time(prevTabUrl);
		}

		console.log(is_google_doc(tabUrl));
		// if docs tab switched on (start)
		if (is_google_doc(tabUrl) && currentState == "active"){
			start_time(tabUrl, tabId);
		}

		prevTabUrl = tabUrl;
	})
}

function is_google_doc(tab_url){
	if (tab_url.includes("/edit")){
		return true;
	}
	else {
		return false;
	}
}

function save_time(tab_url){
	console.log("saving time elapsed for " + tab_url);
	var timePassed = (new Date() - currentTimers[tab_url]) / 1000;
	globalTimers[tab_url] += timePassed;
	currentTimers[tab_url] = new Date(); // Not exactly necessary but may keep it more accurate
}

function start_time(tab_url, tab_id){
	if (!(tab_url in globalTimers)){
		globalTimers[tab_url] = 0;
	}
	console.log("starting timer for " + tab_url);
	currentTimers[tab_url] = new Date();
	chrome.tabs.sendMessage(tab_id, {time: globalTimers[tab_url]});
}



//fix case where if u switch fast after unafking it counts the time afk
//make other programs count as afk? (while docs is open in the back)