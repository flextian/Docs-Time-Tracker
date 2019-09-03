/* eslint-disable no-undef */
console.log("esketit");
chrome.runtime.onMessage.addListener(got_message);
var documentTime = "Time: ";
var html = '<div class="docs-title-widget goog-inline-block" id="docs-title-widget timer-thing"><div class="docs-title-input-label" style="pointer-events: none; max-width: 621px;"><span id ="sbs">' + documentTime + '</span></div></div>';
$('.docs-activity-indicator-container').append(html);
function got_message(message){
    var hours = Math.floor(message.time/3600);
    var minutes = Math.floor((message.time - hours * 3600)/60);
    var seconds = Math.floor(message.time % 60);
    document.getElementById("sbs").innerHTML = hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";
}
// fix the on all tabs close case - afk case (5 min time out)