$(function(){
    $("#ssid").append("<option value='1'>hello</option>");
    var iosocket = io();
    iosocket.on('message', function(message) {
                        $('#incomingChatMessages').append($('<li></li>').text(message));
    });
})