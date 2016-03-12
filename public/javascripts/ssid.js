
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
        selector.options.length = 1; 
        for(var serviceName in message) {
            var option = document.createElement('option');
            option.text = message[serviceName].Name + '   ' + message[serviceName].Strength;
            option.value = message[serviceName].Name;
            selector.appendChild(option);
            //alert(message[serviceName].Name);
        }
    });
}
function  select_click(){
    //iosocket.emit('rescan_wlan0_info','a');
}
function btn_check(form){
    if(form.ssid.value == 'note')
    {
        alert("Sorry,I didnt find any ssid.");
        return false;
    }
    if(form.password.value == '')
    {
        alert("Please,Enter the ssid password.");
        return false;
    }
    return true;
}