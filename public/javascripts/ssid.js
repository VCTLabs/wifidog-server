window.onload = init;
var iosocket = io();  
function init(){ 
  /***/  

    var selector = document.getElementById('ssid');
    iosocket.on('ssidList', function(message) {
        if(selector.options[ selector.selectedIndex ].value != "note"){
            var reserveOption = selector.options[ selector.selectedIndex ];
            selector.options.length = 0;
            selector.appendChild(reserveOption);
        }
        //selector.options.length = 1; 
        for(var serviceName in message) {
            var option = document.createElement('option');
            option.text = message[serviceName].Name +" " + message[serviceName].Strength;
            option.value = message[serviceName].Name;
            
            selector.appendChild(option);
        }
    });
    var lanInfo = document.getElementById('lanInfo');
    iosocket.on('lan_info', function(message) {
        if(message !=null ){
            lanInfo.innerHTML = "SSID: "+message.Name + "&nbsp; &nbsp; &nbsp; &nbsp;"+"IP : "+message.IPv4.Address;
            lanInfo.style.display="";
            document.forms["done"].style.display="";
        }
    });
    iosocket.emit("scanWifi","a");
}
function select_click(){
    
}
function check(){
    var xhttp = new XMLHttpRequest();
    var waitimg = document.getElementById('wait');
    
      xhttp.onreadystatechange=function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          //alert(xhttp.responseText);
          alert(xhttp.responseText);
          waitimg.style.display="none";
          if(xhttp.responseText == 'ready')
          {
              iosocket.emit("getLanInfo","a");
          }
          if(xhttp.responseText == 'failure')
          {
                var lanInfo = document.getElementById('lanInfo');
                lanInfo.innerHTML = "Please check your password!";
                lanInfo.style.display="";
                lanInfo.style.color = "red"; 
                document.forms["done"].style.display="none";
                document.forms["wifi_info"].style.display="";
          }
        }
      };
    xhttp.open('POST', 'config');
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    var ssid_str = document.forms["wifi_info"]["ssid"].value;
    if(ssid_str == 'note')
    {
        alert("Please,choose the ssid");
        return false;
    }

    var password_str = document.forms["wifi_info"]["password"].value;
    if(password_str == null || password_str == "")
    {
        alert("Please,Enter the ssid password.");
        return false;
    }
    
    waitimg.style.display="";
    document.forms["wifi_info"].style.display="none";
    xhttp.send("ssid="+ssid_str+"&password="+password_str);
    return true;
}