var ConnMan = require('connman-api');
var connman = new ConnMan();
var wifi;
var StartwifidogInterval;
exports.on = function(opt,callback){
    if(opt == 'init'){
        connman.init(function(){
            wifi = connman.technologies['WiFi'];
            callback();
        });
    }
    
    if(opt == 'ap'){
       connman.getAllTechnologyInfo(function(err, technologies){
           if(technologies.WiFi.Tethering == false)
               wifi.enableTethering('HotspotSSID', 'password123', function(err) {
                   callback(err);
               });
           
       });            
    }
    if(opt == 'sta'){
        
    } 
    if(opt == 'scan'){
        wifi.disableTethering(function(err, res) {
            //connmanctl scan wifi
            wifi.scan(function(err){
                if (err) {
                     console.log(err);
                }
                //connmanctl services
                wifi.getServices(function(err, services) { 
                    wlan0_info = services;
                    //console.log(wlan0_info);
                    for(var a_ssid in wlan0_info){
                       if(wlan0_info[a_ssid].Name != null){

                            console.log("ListWifiAccessPoints finished!....");
                            callback(err,services);
                            break;
                       }else
                            callback(err);
                    }
                });        
            }); 
        });                          
    }
}