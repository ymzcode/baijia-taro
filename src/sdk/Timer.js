var $=require("./jquery");function Timer(t){$.extend(this,t)}var proto=Timer.prototype;proto.start=function(){var t=this;t.stop();var i=t.timeout,o=t.interval,e=function(){"number"===$.type(t.count)?t.count++:t.count=1,!1!==t.task()?t.timer=setTimeout(e,o):t.stop()};null==i&&(i=o),t.timer=setTimeout(e,i)},proto.stop=function(){this.timer&&(clearTimeout(this.timer),this.timer=null,this.count=0)},proto.dispose=function(){this.stop(),this.task=this.timeout=this.interval=null},module.exports=Timer;