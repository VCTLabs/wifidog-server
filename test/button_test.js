var button = require(__dirname + '/../lib/button');
button.on('on',function(){
    console.log("button pressed");
    button.on('off');
});