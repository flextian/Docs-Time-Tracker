/* eslint-disable no-undef */
chrome.tabs.onActivated.addListener(tab_switch);
chrome.windows.onFocusChanged.addListener(window_switch);
chrome.tabs.onUpdated.addListener(url_switch);
chrome.idle.onStateChanged.addListener(activity);
chrome.idle.setDetectionInterval(15)

setInterval(function(){console.log("CURRENT TIME " + globalTimers[tabUrl]); }, 1000);

var tabUrl;
var tabId;
var currentTimers = {};
var globalTimers = {};
var prevTabUrl = null;

function url_switch(){
	tab_window_switched();
}
function tab_switch(){
	tab_window_switched();
}
function window_switch(){
	tab_window_switched();
}

var currentState;
function activity(){
	chrome.idle.queryState(15, function(status){
		currentState = status;
		//idle start
		if (tabUrl.includes("/edit") && (status == "idle" || status == "locked")){
			console.log("idle start");
			var timePassed = (new Date() - currentTimers[tabUrl]) / 1000;
			currentTimers[tabUrl] = new Date();
			globalTimers[tabUrl] += timePassed;
		}
		//idle stop
		if (tabUrl.includes("/edit") && status == "active"){
			console.log("idle stop");
			currentTimers[tabUrl] = new Date();
			chrome.tabs.sendMessage(tabId, {time: globalTimers[tabUrl]});
		}
	});
}

function tab_window_switched(){
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabArray) {
		var tabData = tabArray[0];
		if (tabData == null){
			tabUrl = "none";
		}
		else{
			tabUrl = tabData.url;
			tabId = tabData.id;
		}


		//if tab switched out (stop)
		if (prevTabUrl != null && prevTabUrl.includes("/edit") && currentState != "idle" && currentState != "locked"){
			console.log("stop");
			//time passed calculations
			var timePassed = (new Date() - currentTimers[prevTabUrl]) / 1000;
			currentTimers[tabUrl] = new Date();
			if (!(prevTabUrl in globalTimers)){
				globalTimers[prevTabUrl] = 0;
			}
			globalTimers[prevTabUrl] += timePassed;
		}
		//if tab switched on (start)
		if (tabUrl.includes("/edit") && currentState != "idle"){
			console.log("start");
			currentTimers[tabUrl] = new Date();
			chrome.tabs.sendMessage(tabId, {time: globalTimers[tabUrl]});
		}
		prevTabUrl = tabUrl;
	})
}

//fix case where if u switch fast after unafking it counts the time afk
//make other programs count as afk? (while docs is open in the back)