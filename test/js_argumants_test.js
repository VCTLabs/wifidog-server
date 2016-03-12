function hello(opt,callback){
    var a = arguments;
    console.log("arguments length"+a.length);
    console.log('1:'+a[0]);
    console.log('2:'+a[1]);
    console.log('3:'+a[2]);
    console.log('4:'+a[3]);
    callback();
}
function check1(err){
    console.log('4 arguments');
}
function check2(err){
    console.log('3 arguments');
}
hello('a',check1,'c','d','b');
hello('x',check1,'z','y');