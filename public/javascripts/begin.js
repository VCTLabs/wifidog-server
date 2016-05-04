window.onload = init;
var iosocket;  
function init(){ 
  /***/  
    iosocket= io();  
    var errorAdmin = document.getElementById('errorAdmin');
    iosocket.on('adminResult', function(message) {
        if(message == "ok"){
            document.forms["admin_info"].submit();
        }
        if(message == "error"){
            errorAdmin.innerHTML = "OOPS, Maybe there is something wrong with admin password.You should try again!";
            errorAdmin.style.display="";
            errorAdmin.style.color = "red";            
        }        
    });
}


function submit_password(){
    var password = document.forms["admin_info"]["admin"].value;
    if(password == null || password == "")
    {
        alert("Please,Enter the ssid password.");
        return false;
    }
    
    iosocket.emit("admin",password);
    return true;
}
