var chatServer=require("../../server/chat"),isSameChannel=require("../../function/isSameChannel"),util=require("../../util"),config=require("../../config"),userData=require("../../data/user"),parser=require("../../parser"),$=require("../../jquery"),string=require("../../string"),eventEmitter=require("../../eventEmitter"),auth=require("../../auth"),store=require("../../store"),language=require("../../language/main")(),getDocumentImageDimension=require("../../function/getDocumentImageDimension");function isSelf(e){return e.number===store.get("user.number")}$.extend(language,require("./language/main")()),Component({properties:{canSticky:{type:"boolean",value:!0}},data:{fetching:!1,language:language,stickyData:[],stickyFold:!0,stickySimpleMessage:""},ready:function(){var e=this;e.namespace=".message_sticker"+Math.random();var t=function(t){let a="";return t?((t=JSON.parse(t)).from?a=e.format(t):t.user&&(a=Object.assign({},t,{user:t.user})),a):a};eventEmitter.on(eventEmitter.STICKY_NOTICE_RES+e.namespace,function(a,i){$.isArray(i.stickyList)?e.setData({stickyData:i.stickyList.map(t=>t.originMessage?t:e.format(t))}):i.content?e.setData({stickyData:[t(i.content)]}):e.setData({stickyData:[]}),i.content?e.setData({contentStickyData:t(i.content)}):e.setData({contentStickyData:""}),e.setData({stickyContent:i.content||""}),e.setData({stickyUnfoldHeight:0}),e.setData({stickySimpleMessage:e.filterStickySimpleMessage()})}).on(eventEmitter.STICKY_NOTICE_CHANGE+e.namespace,function(a,i){$.isArray(i.stickyList)?e.setData({stickyData:i.stickyList.map(t=>t.originMessage?t:e.format(t))}):i.content?e.setData({stickyData:[t(i.content)]}):e.setData({stickyData:[]}),i.content?e.setData({contentStickyData:t(i.content)}):e.setData({contentStickyData:""}),e.setData({stickyContent:i.content||""}),e.setData({stickyUnfoldHeight:0}),e.setData({stickySimpleMessage:e.filterStickySimpleMessage()})}).on(eventEmitter.CHAT_SERVER_LOGIN_SUCCESS,function(){e.fetchMore()});var a=chatServer.socket;a&&a.isOpen()&&e.fetchMore()},methods:{format:function(e){var t,a,i=e.from,r=e.data,n=e.content,s=e.custom,o=e.to;this.data.renderContent;var c=function(){var e=$.extend(!0,{},i),t=e.type;return(auth.isTeacher(t)||auth.isAssistant(t))&&(e.roleName="teacher",e.localRole=auth.isTeacher(t)?language.USER_ROLE_TEACHER:language.USER_ROLE_ASSISTANT),auth.isStudent(t)&&(e.roleName="student"),isSelf(i)&&(e.name=language.ME,e.roleName="self"),e}();if(o){var u=userData.find(o);u&&(t=u.name)}if(!s)if(r&&r.type)e.type=r.type,"emoji"===r.type?(e.key=r.key,e.url=r.url||parser.getEmojiUrlByKey(r.key)):"image"===r.type&&(e.url=r.url,e.height=r.height,e.width=r.width),a=n="";else if(e.type="text",n=$.trim(n),parser.isPureText(n)){var g=auth.isSelf(i.id)?language.ME:c.name,m=string.size(g);a=string.cut(n,this.data.shortContentSize-(m>12?12:m))}else{var l=parser.parseEmoji(n);l.url&&(e.url=l.url,e.type="emoji");var y=parser.parseImage(n);y&&(e.url=y,e.type="image"),a=""}var h=e.channel;return"string"!==$.type(h)&&(h=$.type(h)),r={id:e.id,type:e.type,url:e.url,number:h+(e.id||""+Math.random()),user:c,receiver:t,time:e.time?1e3*e.time:$.now(),custom:s,content:n,key:e.key,width:e.width,height:e.height,shortContent:a}},fetchMore:function(e){this.data.fetching||(this.setData({fetching:!0}),eventEmitter.trigger(eventEmitter.STICKY_NOTICE_REQ))},filterStickySimpleMessage:function(){const e=this.data.stickyData[0];return console.log(e),e},toggleFold:function(){this.setData({stickyFold:!this.data.stickyFold})}}});