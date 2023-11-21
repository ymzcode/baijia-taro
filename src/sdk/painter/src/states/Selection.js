import State from"./State";import Emitter from"../Emitter";import updateRect from"../function/updateRect";export default class Selection extends State{constructor(t,e){super(t,e);let E,r=this;r.mouseDownHandler=function(t){if(!E&&t.inCanvas){let E=updateRect(r,t.x,t.y);e.fire(Emitter.SELECTION_START);const i=function(t){E(t.x,t.y),e.fire(Emitter.SELECTION_RECT_CHANGE,{rect:r})},n=function(){e.off(Emitter.MOUSE_MOVE,i),e.off(Emitter.MOUSE_UP,n),e.off(Emitter.RESET,n),r.x=r.y=r.width=r.height=E=null,e.fire(Emitter.SELECTION_END)};e.on(Emitter.MOUSE_MOVE,i).on(Emitter.MOUSE_UP,n).on(Emitter.RESET,n)}},r.shapeEnterHandler=function(t){E=t.shape},r.shapeLeaveHandler=function(){E&&(E=null)},r.on(Emitter.MOUSE_DOWN,r.mouseDownHandler).on(Emitter.SHAPE_ENTER,r.shapeEnterHandler).on(Emitter.SHAPE_LEAVE,r.shapeLeaveHandler)}destroy(){this.off(Emitter.MOUSE_DOWN,this.mouseDownHandler).off(Emitter.SHAPE_ENTER,this.shapeEnterHandler).off(Emitter.SHAPE_LEAVE,this.shapeLeaveHandler)}isPointInPath(t,e,E){return!1}draw(t){const{x:e,y:E,width:r,height:i}=this;r&&i&&(t.disableShadow(),t.setLineWidth(1),t.setStrokeStyle("#ccc"),t.setFillStyle("rgba(180,180,180,0.1)"),t.begin(),t.drawRect(e+.5,E+.5,r,i),t.stroke(),t.fill())}};