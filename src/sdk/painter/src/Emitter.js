import array from"./util/array";import object from"./util/object";import constant from"./constant";export default class Emitter{constructor(){let t,e,E,i,r,n,a,_=this,s={},o={};_.listeners={};let c=function(){s.x=s.y=o.x=o.y=0},m=function(a){r=a.pageX,n=a.pageY,t=r-s.x,e=n-s.y,container&&(t+=container.scrollLeft,e+=container.scrollTop),E=t*constant.DEVICE_PIXEL_RATIO,i=e*constant.DEVICE_PIXEL_RATIO},l=function(t){let{touches:e}=t;m(e?e[0]:t)},u=function(t,e){a&&_.fire(t,e)};c();let A=function(s){if(!_.disabled&&!s.button){if(a)return void d();void 0,l(s),u(Emitter.MOUSE_DOWN,{x:E,y:i,realX:t,realY:e,pageX:r,pageY:n,target:s.target,inCanvas:void 0})}},d=function(){_.disabled||(u(Emitter.MOUSE_UP,{x:E,y:i,realX:t,realY:e,pageX:r,pageY:n,inCanvas:void 0}),a&&(a=!1))},T="undefined"!=typeof document?document:null;if(!T)return;let h={},p=function(t,e){T&&(T.addEventListener(t,e),h[t]=e)};p("mousedown",A),p("mousemove",function(s){_.disabled||(m(s),u(Emitter.MOUSE_MOVE,{x:E,y:i,realX:t,realY:e,pageX:r,pageY:n,inCanvas:!!a||void 0}))}),p("mouseup",d),"ontouchstart"in T&&(p("touchstart",A),p("touchmove",function(s){_.disabled||(l(s),u(Emitter.MOUSE_MOVE,{x:E,y:i,realX:t,realY:e,pageX:r,pageY:n,inCanvas:!!a||void 0}))}),p("touchend",d)),SHORTCUT&&p("keyup",function(t){if(!_.disabled){let e=SHORTCUT[t.keyCode];e&&_.fire(e)}}),this.documentEvents=h,this.canvasEvents={}}fire(t,e){let E=this.listeners[t];E&&array.each(E,function(t){if(t)return t(e)})}on(t,e,E){let i=this.listeners[t]||(this.listeners[t]=[]);return E?i.unshift(e):i.push(e),this}off(t,e){let E=this.listeners[t];return E&&array.remove(E,e),this}dispose(){}};Emitter.RESET="reset",Emitter.CLEAR="clear",Emitter.MOUSE_DOWN="mouse_down",Emitter.MOUSE_MOVE="mouse_move",Emitter.MOUSE_UP="mouse_up",Emitter.SHAPE_ENTER="shape_enter",Emitter.SHAPE_LEAVE="shape_leave",Emitter.HOVER_SHAPE_CHANGE="hover_shape_change",Emitter.ACTIVE_SHAPE_CHANGE="active_shape_change",Emitter.ACTIVE_SHAPE_DELETE="active_shape_delete",Emitter.ACTIVE_SHAPE_ENTER="active_shape_enter",Emitter.ACTIVE_RECT_CHANGE_START="active_rect_change_start",Emitter.ACTIVE_RECT_CHANGE_END="active_rect_change_end",Emitter.ACTIVE_DRAG_BOX_HOVER="active_drag_box_hover",Emitter.SELECTION_RECT_CHANGE="selection_rect_change",Emitter.SELECTION_START="selection_start",Emitter.SELECTION_END="selection_end",Emitter.SHAPE_DRAWING_START="shape_drawing_start",Emitter.SHAPE_DRAWING="shape_drawing",Emitter.SHAPE_DRAWING_END="shape_drawing_end",Emitter.SHAPE_ADD="shape_add",Emitter.SHAPE_REMOVE="shape_remove",Emitter.SHAPE_UPDATE="shape_update";const SHORTCUT={8:Emitter.ACTIVE_SHAPE_DELETE,13:Emitter.ACTIVE_SHAPE_ENTER,36:Emitter.CLEAR,46:Emitter.ACTIVE_SHAPE_DELETE};