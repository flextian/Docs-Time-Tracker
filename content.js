/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(update_time);
var html = '<div class="docs-title-widget goog-inline-block" id="docs-title-widget timer-thing"><div class="docs-title-input-label" style="pointer-events: none; max-width: 621px;"><span id ="time-span"></span></div></div>';
$('.docs-activity-indicator-container').append(html);

// After json is sent to doc tab
function update_time(message){
    console.log(message)
    var hours = Math.floor(message.time / 3600);
    var minutes = Math.floor((message.time - hours * 3600) / 60);
    var seconds = Math.floor(message.time % 60);
    document.getElementById("time-span").innerHTML = hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";
}
// fix the on all tabs close case - afk case (5 min time out)