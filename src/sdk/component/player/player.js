var streamNameForResume,$=require("../../jquery"),info=require("../../info"),eventEmitter=require("../../eventEmitter"),language=require("../../language/main")(),getStreamName=require("../../function/getStreamName");function getChangeType(e,t){var a={};return e.videoOn&&!t.videoOn&&(a.videoTo=!1),!e.videoOn&&t.videoOn&&(a.videoTo=!0),e.audioOn&&!t.audioOn&&(a.audioTo=!1),!e.audioOn&&t.audioOn&&(a.audioTo=!0),a}Component({properties:{showName:{type:Boolean,value:!0},styleInfo:{type:Object,value:{fontSize:12}},coverImage:{type:String,value:"./image/closeCamera.png"},orientation:{type:String,value:"vertical"},objectFit:{type:String,value:"contain"},fullScreen:{type:Boolean,value:!1,observer:function(e,t){console.log("fullScreen",e);var a=wx.createLivePlayerContext("player",this);console.log("player"),console.log(a),!0===e?a.requestFullScreen():a.exitFullScreen()}},stopPlay:{type:Boolean,value:!1,observer:function(e,t){console.log("stopPlay change");!0===e?(streamNameForResume=this.data.streamName,this.setData({streamName:"rtmp://a"})):!0===t&&!1===e&&this.setData({streamName:streamNameForResume})}},userInfo:{type:Object,value:{videoOn:!1},observer:function(e,t){var a=this;if(!$.isEmptyObject(e)){var o=!e.canPlay;a.setData({streamName:""}),console.log("stream name:",getStreamName(e)),setTimeout(function(){a.setData({notSupported:o,streamName:getStreamName(e)})},1e3),a.triggerEvent("isSupportedChanged",{user:e,support:!o})}var n={};$.isEmptyObject(e)||(n=getChangeType(t,e)),$.isEmptyObject(n)||a.triggerEvent("AVStatusChange",{user:e,support:!a.data.notSupported,changeInfo:n})}}},data:{language:language,notSupported:!1,streamName:"",showCameraCover:!1},ready:function(){var e=this;eventEmitter.on(eventEmitter.DOWNLINK_SERVER_CHANGE_TRIGGER,function(){var t=e.data.userInfo;$.isEmptyObject(t)||(e.setData({streamName:""}),e.setData({streamName:getStreamName(t)}))}).on(eventEmitter.NETWORK_RECONNECT,function(){var t=e.data.streamName;e.setData({streamName:""}),e.setData({streamName:t})})},methods:{onStateChange:function(e){console.log("live-player code:",e.detail.code);var t=this,a=e.detail.code;2001==a||2002==a||2004==a||2007==a||2008==a||2009==a?t.setData({showLoading:!0}):t.setData({showLoading:!1}),-2301==a?t.setData({showCameraCover:!0}):t.setData({showCameraCover:!1}),t.triggerEvent("stateChange",e.detail)},onError:function(e){console.log("live-player code:",e.detail.code)},onNetStatus:function(e){this.triggerEvent("netStatus",e.detail),e.detail.info&&e.detail.info.netSpeed>0&&this.setData({showLoading:!1})},onItemTap:function(e){this.triggerEvent("optTap",e.detail)},onPlayerLongTap:function(){"longTap"==this.data.optTriggerType&&this.showOptBar()},onFullscreenChange:function(e){this.data.fullScreen!=e.detail.fullScreen&&this.toggleFullscreen()},onPlayerTap:function(){console.log("onPlayerTap"),this.triggerEvent("playerTap",{user:this.data.userInfo,support:!this.data.notSupported})},toggleFullscreen:function(){this.setData({fullScreen:!this.data.fullScreen,orientation:this.data.fullScreen?"vertical":"horizontal"})}}});