window.onload = init;
var iosocket = io();  
function init(){ 
  /***/  
    var selector = document.getElementById('ssid');
    iosocket.on('ssid_list', function(message) {
        selector.options.length = 1; 
        for(var serviceName in message) {
            var option = document.createElement('option');
            option.text = message[serviceName].Name + '   ' + message[serviceName].Strength;
            option.value = message[serviceName].Name;
            selector.appendChild(option);
        }
    });
    var lanInfo = document.getElementById('lanInfo');
    iosocket.on('lan_info', function(message) {
        lanInfo.innerHTML = "SSID: "+message.Name + "&nbsp &nbsp &nbsp &nbsp"+"IP : "+message.IPv4.Address;
        lanInfo.style.display="";
        document.forms["done"].style.display="";
    });
}
function  select_click(){
    //iosocket.emit('rescan_wlan0_info','a');
}
function check(){
    var ssid = document.forms["wifi_info"]["ssid"].value;
    if(ssid == 'note')
    {
        alert("Please,choose the ssid");
        return false;
    }
    var password = document.forms["wifi_info"]["password"].value;
    if(password == null || password == "")
    {
        alert("Please,Enter the ssid password.");
        return false;
    }
    return true;
}