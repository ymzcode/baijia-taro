var config=require("../../config"),store=require("../../store"),url=require("../../url"),eventEmitter=require("../../eventEmitter"),storage=require("../../storage.js"),guid=require("../../function/uuid"),bjy=require("../../bjy");Component({properties:{backUrl:{type:String,value:""}},data:{url:""},methods:{msgHandler:function(){this.setData({url:""})},setUrl:function(e){var t=store.get("env","");storage.set("uuid",e);var r=getCurrentPages(),i=r[r.length-1],n=this.data.canUsePptSelection||"/"+i.route+"?"+url.stringifyQuery(i.options),u={room_id:store.get("class.id"),uuid:e,user_number:store.get("user.number"),oriUrl:n};let s=config["QUESTIONNAIRE_PAGE"+t]+"&"+url.stringifyQuery(u);eventEmitter.trigger(eventEmitter.CLASSROOM_EXIT_TRIGGER,{keepIn:!0}),this.setData({url:s})}},ready:function(){var e=this;this.namespace=".survey"+Math.random();var t=storage.get("uuid")||guid();eventEmitter.on(eventEmitter.INTERFACE_FETCH_SUCCESS+this.namespace,function(){bjy.checkQuestionnaireAndTurn({roomId:store.get("class.id"),uuid:t,token:store.get("token")}).then(function(r){r&&e.setUrl(t)})})}});