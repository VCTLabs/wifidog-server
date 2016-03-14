var spawn = require('child_process').spawn; 
var logger = require(__dirname + '/logger');
var connmanctl = null;
var old_str;
var new_str;
var exec_run_timer;
var counter = 0;
exports.on = function(name,ssid_obj,password){
    connmanctl = spawn('connmanctl');
    connmanctl.stdin.setEncoding('utf-8');
    connmanctl.stdout.pipe(process.stdout); 
    if(name == 'sta'){
        counter = 0;
        function run_step(){
            var step = counter%4;
            if(0 == step) connmanctl.stdin.write('agent on\n');
            if(1 == step) connmanctl.stdin.write('tether wifi off\n');
            if(2 == step) {
                ssid_obj = ssid_obj.substring(21);
                connmanctl.stdin.write('connect  '+ssid_obj+'\n');  
            }
            if(3 == step) {
                connmanctl.stdin.write(password+'\n');
                clearInterval(exec_run_timer);
                exec_run_timer =null;
            }
            counter++;
        } 
        exec_run_timer = setInterval(run_step,3000,'run step');
        //connmanctl.stdout.on("data",function(data){});
    }    
    if(name == 'ap'){
        connmanctl.stdin.write('agent on\n');
        connmanctl.stdin.write("tether wifi on");  
    }
    if(name == 'off')
        connmanctl.stdin.write('quit\n'); 
};