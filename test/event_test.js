var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
// 监听事件some_event
emitter.on("some_event_a", function(){
  console.log("事件触发，调用此回调函数a");
	 emitter.emit("some_event_b");
});
emitter.on("some_event_b", function(){
  console.log("事件触发，调用此回调函数b");
	 emitter.emit("some_event_a");
});

setTimeout(function(){
  emitter.emit("some_event_a");   //触发事件some_event
},3000);
