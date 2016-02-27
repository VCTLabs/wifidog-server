
/*
$(function(){
    //$("#ssid").append("<option value='3'>hello</option>");
    var iosocket = io();
    iosocket.on('wlan0_info', function(message) {
    if(message.length > 0)
    {
        var obj = JSON.parse(message); 
        //alert(message);

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
*/
 
window.onload = init;   
var iosocket = io(); 
function init(){ 
  /***/  
    var selector = document.getElementById('ssid');
    iosocket.on('wlan0_info', function(message) {
        if(message.length > 0)
        {
            var obj = JSON.parse(message); 
            //alert(message);
            selector.options.length = 0; 
            for (var i = 0; i < obj.length; i++) {
                var option = document.createElement('option');
                option.text = obj[i].ssid + '   ' + obj[i].signal;
                option.value = obj[i].ssid;
                selector.appendChild(option);
            }                
        }
    });
}
function  select_click(){
    iosocket.emit('rescan_wlan0_info','a');
}
function btn_check(form){
    if(form.ssid.value == '')
    {
        alert("Sorry,I didnt find any ssid.");
        return false;
    }else
        form.ssid.value = form.ssid.text;
    if(form.password.value == '')
    {
        alert("Please,Enter the ssid password.");
        return false;
    }
    if(form.boardname.value == '')
    {
        alert("Please,Name the board.");
        return false;
    }
    return true;
}