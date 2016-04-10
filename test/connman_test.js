var connman = require(__dirname + '/../lib/connman');
connman.on('init',function(){
    // connman.on('scan',function(err, services){
        // console.log(services);
    // });   
     connman.on('sta',"HUAWEI-1207","qqqqqqqq9",function(status){
         console.log("Get It::"+status);
     });    
        // connman.on('status',function(err,Lan){
            // console.log(Lan.Name);
            
        // });  
});
