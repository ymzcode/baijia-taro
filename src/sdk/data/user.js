var store=require("../store"),config=require("../config"),eventEmitter=require("../eventEmitter"),$=require("../jquery"),classData=require("./class"),idToUserMap={},numberToUserMap={};function isValidUserId(e){return e||0===e}function getValidUser(e){var t=idToUserMap[e];if(t&&t===numberToUserMap[t.number])return t}function updateUser(e){var t=e.type===config.ROLE_TYPE_TEACHER,r=e.id===store.get("user.id"),i={};t&&$.extend(i,store.get("teacher")),r&&$.extend(i,store.get("user")),$.extend(i,e),t&&store.set("teacher",i),r&&store.set("user",i);var n=store.get("presenterId");return n?e.id===n&&store.set("presenter",i):t&&(store.set("presenterId",i.id),store.set("presenter",i)),i}function diff(e,t){var r=[];return $.each(e,function(e,i){$.isArray(i)||$.isPlainObject(i)?(null==t[e]||diff(i,t[e]).length>0)&&r.push(e):i!==t[e]&&r.push(e)}),r}exports.add=function(e,t){$.isArray(e)||(e=[e]);var r=[];$.each(e,function(e,t){if(t){var i=t.id,n=t.number;if(isValidUserId(i)){if(getValidUser(i))return void exports.update(t);if(0!=n){var s=numberToUserMap[t.number];s&&isValidUserId(s.id)&&exports.remove(s.id)}t=updateUser(t),idToUserMap[i]=numberToUserMap[n]=t,r.push(t)}}});var i=exports.group(r),n=i.teacherList;1===n.length&&(store.set("teacher",n[0]),eventEmitter.trigger(eventEmitter.TEACHER_ADD,{userList:n}));var s=i.assistantList;s.length>0&&eventEmitter.trigger(eventEmitter.ASSISTANT_ADD,{userList:s});var a=i.studentList;a.length>0&&eventEmitter.trigger(eventEmitter.STUDENT_ADD,{userList:a}),r.length>0&&eventEmitter.trigger(eventEmitter.USER_ADD,{userList:r})},exports.remove=function(e){var t=getValidUser(e);if(t){var r;switch(t.videoOn=t.audioOn=null,t.type){case config.ROLE_TYPE_TEACHER:r=eventEmitter.TEACHER_REMOVE;break;case config.ROLE_TYPE_ASSISTANT:r=eventEmitter.ASSISTANT_REMOVE;break;case config.ROLE_TYPE_STUDENT:r=eventEmitter.STUDENT_REMOVE;break;case config.ROLE_TYPE_GUEST:r=eventEmitter.GUEST_REMOVE}return delete idToUserMap[e],delete numberToUserMap[t.number],eventEmitter.trigger(r,{user:t}),eventEmitter.trigger(eventEmitter.USER_REMOVE,{user:t}),!0}return!1},exports.update=function(e){var t=getValidUser(e.id);if(null!=t){var r=diff(e,t);if(0===r.length)return;var i={};$.each(r,function(t,r){i[r]=e[r]});var n,s=updateUser(e);switch(idToUserMap[e.id]=numberToUserMap[e.number]=s,e.type){case config.ROLE_TYPE_TEACHER:n=eventEmitter.TEACHER_UPDATE;break;case config.ROLE_TYPE_ASSISTANT:n=eventEmitter.ASSISTANT_UPDATE;break;case config.ROLE_TYPE_STUDENT:n=eventEmitter.STUDENT_UPDATE;break;case config.ROLE_TYPE_GUEST:n=eventEmitter.GUEST_UPDATE}var a={user:s,update:i};return eventEmitter.trigger(n,a),eventEmitter.trigger(eventEmitter.USER_UPDATE,a),s}numberToUserMap[e.number]||exports.add(e)},exports.find=function(e){return getValidUser(e)},exports.findByNumber=function(e){var t=numberToUserMap[e];return t&&getValidUser(t.id)},exports.active=function(){return exports.all().filter(function(e){return!(!e.videoOn&&!e.audioOn)})},exports.activeAssist=function(e){var t=[];return idListOfActiveUser.forEach(function(e){let r=getValidUser(e);r&&t.push(r)}),t},exports.all=function(){var e=[];return $.each(idToUserMap,function(t){var r=getValidUser(t);r&&e.push(r)}),e},exports.isAudioSpeex=function(e){return e.endType==config.END_TYPE_PC_BROWSER||classData.isAudioSpeex()},exports.group=function(e){var t=[],r=[],i=[];return $.each(e||idToUserMap,function(e,n){switch(n.type){case config.ROLE_TYPE_TEACHER:t.push(n);break;case config.ROLE_TYPE_ASSISTANT:r.push(n);break;case config.ROLE_TYPE_STUDENT:i.push(n)}}),{teacherList:t,assistantList:r,studentList:i}},exports.hasAssistant=function(){var e=!1;return $.each(idToUserMap,function(t){if(getValidUser(t).type===config.ROLE_TYPE_ASSISTANT)return e=!0,!1}),e};