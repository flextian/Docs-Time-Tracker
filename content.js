chrome.runtime.onMessage.addListener(processMessage);
var html = '<div class="docs-title-widget goog-inline-block" id="docs-title-widget timer-thing"><div class="docs-title-input-label" style="pointer-events: none; max-width: 621px;"><span id ="time-span"></span></div></div>';

$('.docs-activity-indicator-container').append(html);

// After json is sent to doc tab
function processMessage(message, sender, sendResponse){

    console.log(message);

    // If message sent to tab is to get visibility
    if (message.visibilityRequest == 'true'){
        var visibility = document.visibilityState;
        sendResponse(visibility);
    }

    // If the message sent is used to update the time
    else {
        var hours = Math.floor(message.time / 3600);
        var minutes = Math.floor((message.time - hours * 3600) / 60);
        var seconds = Math.floor(message.time % 60);
        var displayText = hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";
        if (message.state == "idle"){
            displayText += ' - Idle';
        }
        document.getElementById("time-span").innerHTML = displayText;
    }

}
// fix the on all tabs close case - afk case (5 min time out)