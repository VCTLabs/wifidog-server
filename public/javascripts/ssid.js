$(function(){
    //$("#ssid").append("<option value='3'>hello</option>");
    var iosocket = io();
    iosocket.on('wlan0_info', function(message) {
    if(message.length > 0)
    {
        var obj = JSON.parse(message); 
        //alert(message);
        $('#ssid').empty();
        for (var i = 0; i < obj.length; i++) {
            $('#ssid').append($("<option value='1'>"+
                        obj[i].ssid+'    '+obj[i].signal+
                        "</option>"));
        }                
    }
    });
    $("#ssid").click(function(){
        iosocket.emit('rescan_wlan0_info','a');
    });
});