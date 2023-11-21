import State from"./State";import Emitter from"../Emitter";export default class Drawing extends State{constructor(e,t,r){super(e,t);let o,n,i,a,s,E=this;E.mouseDownHandler=function(e){e.inCanvas&&(n=0,a=Math.floor(e.x),s=Math.floor(e.y),(o=new E.createShape).startDrawing&&!1===o.startDrawing(r,t,e)?o=null:(r.save(),i=!0,t.fire(Emitter.SHAPE_DRAWING_START,{cursor:"crosshair"})))},E.mouseMoveHandler=function(e){o&&o.drawing&&(n++,o.drawing(r,a,s,Math.floor(e.x),Math.floor(e.y)),t.fire(Emitter.SHAPE_DRAWING,{shape:o}))},E.mouseUpHandler=function(){if(i&&(i=!1),o){if(o.endDrawing)return void o.endDrawing();r.restore(),t.fire(Emitter.SHAPE_DRAWING_END,{shape:n>0?o:null}),o=null}},E.on(Emitter.MOUSE_DOWN,E.mouseDownHandler).on(Emitter.MOUSE_MOVE,E.mouseMoveHandler).on(Emitter.MOUSE_UP,E.mouseUpHandler).on(Emitter.RESET,E.mouseUpHandler)}destroy(){this.off(Emitter.MOUSE_DOWN,this.mouseDownHandler).off(Emitter.MOUSE_MOVE,this.mouseMoveHandler).off(Emitter.MOUSE_UP,this.mouseUpHandler).off(Emitter.RESET,this.mouseUpHandler)}isPointInPath(e,t,r){return!1}};