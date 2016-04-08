
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

//opts 可从网站在线制作
var opts = {            
    lines: 13, // 花瓣数目
    length: 20, // 花瓣长度
    width: 10, // 花瓣宽度
    radius: 30, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#5882FA', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
    top: 'auto', // spinner 相对父容器Top定位 单位 px
    left: 'auto'// spinner 相对父容器Left定位 单位 px
};

var spinner = new Spinner(opts);   
var iosocket = io(); 
function init(){ 
  /***/  
    var selector = document.getElementById('ssid');
    var target = document.getElementById('spin');
    spinner.spin(target); 
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