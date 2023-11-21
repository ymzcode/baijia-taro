var $=require("../../jquery"),store=require("../../store"),config=require("../../config"),roomServer=require("../../server/room"),eventEmitter=require("../../eventEmitter"),info=require("../../info"),language=require("./language/main")(),FiniteArray=require("../../function/FiniteArray");$.extend(roomServer.messageTypes,require("./signaling")),$.extend(eventEmitter,require("./eventEmitter"));var timestampArray,scrollTop,scrollBottom,touchStartY,QuestionType={ALL:15,PUBLISHED:1,NOT_PUBLISHED:2,ANSWERED:4,NOT_ANSWERED:8},isFetching=!1,scrollListHeight=-1;Component({properties:{countPerPage:{type:Number,value:15},inputMaxLength:{type:Number,value:140},limitPerMinute:{type:Number,value:10}},data:{questionList:[],language:language,isForbidden:!1,selfNumber:"",inputValue:"",inputLength:0,scrollTop:0,countSelfPage:0,pageTotal:1,pageCurrent:1},ready:function(){var e=this,t=e.data,n={};timestampArray=new FiniteArray(t.limitPerMinute),eventEmitter.on(eventEmitter.QUESTION_PULL_REQ,function(e,r){isFetching||(roomServer.send({message_type:"question_pull_req",page:r.page,count_per_page:t.countPerPage,status:QuestionType.PUBLISHED,number:n.number}),isFetching=!0)}).on(eventEmitter.QUESTION_PULL_RES,function(n,r){var i=Math.ceil(r.categoryCounts.pub/t.countPerPage)||1;e.setData({pageTotal:i>r.selfPageCount?i:r.selfPageCount,countSelfPage:r.selfPageCount,pageCurrent:r.page+1,questionList:r.list,isForbidden:r.forbidStatus}),e.resortList(),isFetching=!1}).on(eventEmitter.QUESTION_SEND_REQ,function(e,t){var r={message_type:"question_send_req",from:{id:n.id,number:n.number,type:n.type,name:n.name,avatar:n.avatar,end_type:n.endType},content:t.content};roomServer.send(r)}).on(eventEmitter.QUESTION_SEND_RES,function(n,r){var i=t.questionList;if(1===t.pageCurrent){var a={status:r.status,id:r.id,forbid:!1,itemList:[{time:r.time,content:r.content,from:r.from}]};i.unshift(a),i.length>t.countPerPage&&i.pop(),e.setData({questionList:i}),setTimeout(function(){e.setData({scrollTop:0})},200),info.tip(language.INFO_QUESTION_SEND_SUCCESS)}var o=Math.ceil(r.categoryCounts.pub/t.countPerPage)||1;e.setData({countSelfPage:r.selfPageCount,pageTotal:o>r.selfPageCount?o:r.selfPageCount})}).on(eventEmitter.QUESTION_PUB,function(r,i){var a=-1,o=i.status,s=t.questionList;if($.each(s,function(e,t){if(t.id===i.id)return a=e,!1}),a>-1){var u=s[a];o&QuestionType.NOT_PUBLISHED?i.owner!==n.number&&s.splice(a,1):u.itemList=i.content,u.status=i.status,e.setData({questionList:s})}else 1===t.pageCurrent&&s.length<t.countPerPage&&(s.push({status:i.status,id:i.id,forbid:!1,itemList:i.content}),e.setData({questionList:s}),e.resortList());var l=Math.ceil(i.categoryCounts.pub/t.countPerPage)||1;e.setData({pageTotal:l>t.countSelfPage?l:t.countSelfPage})}).on(eventEmitter.QUESTION_SWITCH_FORBID_RES,function(t,r){r.to.number===n.number&&e.setData({isForbidden:r.switch})}).on(eventEmitter.CLASSROOM_CONNECT_SUCCESS,function(){n=store.get("user"),e.setData({selfNumber:n.number}),eventEmitter.trigger(eventEmitter.QUESTION_PULL_REQ,{page:0})})},methods:{onInput:function(e){this.setData({inputLength:e.detail.value.length})},onTouchStart:function(e){touchStartY=e.changedTouches[0].clientY},onTouchCancel:function(e){touchStartY=null},onTouchEnd:function(e){var t,n=this.data,r=e.changedTouches[0].clientY-touchStartY;touchStartY&&Math.abs(r)>120&&(scrollBottom<50&&r<0&&n.pageCurrent<n.pageTotal&&(t=n.pageCurrent+1),scrollTop<50&&r>0&&n.pageCurrent>1&&(t=n.pageCurrent-1),t&&eventEmitter.trigger(eventEmitter.QUESTION_PULL_REQ,{page:t-1}))},onScroll:function(e){var t=e.detail;scrollListHeight<0&&wx.createSelectorQuery().in(this).select(".scroll-list").boundingClientRect(function(e){scrollListHeight=e.height}).exec(),scrollTop=t.scrollTop,scrollBottom=t.scrollHeight-t.scrollTop-scrollListHeight},sendQuestion:function(e){var t=this.data,n=$.trim(e.detail.value);n&&(n.length<=t.inputMaxLength?timestampArray.isFull()&&+new Date-timestampArray.getFirst()<config.MINUTE?info.alert(language.ERROR_TOO_FREQUENT):(eventEmitter.trigger(eventEmitter.QUESTION_SEND_REQ,{content:n}),timestampArray.push(+new Date),this.setData({inputValue:"",inputLength:0})):info.alert(language.ERROR_TOO_LONG))},resortList:function(){var e=this.data.questionList;e.sort(function(e,t){return t.id-e.id}),this.setData({questionList:e})}}});