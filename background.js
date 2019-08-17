/* eslint-disable no-undef */
console.log("working");
chrome.tabs.onActivated.addListener(tab_switch);
chrome.windows.onFocusChanged.addListener(window_switch);
chrome.tabs.onUpdated.addListener(url_switch);

prevUrl = null;

function url_switch(){
	tab_window_switched();
}
function tab_switch(){
	tab_window_switched();
}
function window_switch(){
	tab_window_switched();
}

function tab_window_switched(){
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabArray) {
		var tabData = tabArray[0];
		var tabUrl;
		if (tabData == null){
			tabUrl = "none";
		}
		else{
			tabUrl = tabData.url; 
		}
		if (prevUrl != tabUrl){
			console.log(tabUrl);
			prevUrl = tabUrl;
		}
	})
}