var canvasWidth,canvasHeight,painter,context,serial=require("../../../function/serial"),Canvas=require("../../../painter/painter"),Doodle=Canvas.shapes.Doodle,$=require("../../../jquery"),eventEmitter=require("../../../eventEmitter"),auth=require("../../../auth"),docData=require("../../../data/doc"),pageData=require("../../../data/page"),painterConfig=require("./config"),util=require("../../../util"),store=require("../../../store"),drawing=!1;$.extend(eventEmitter,require("../eventEmitter"));var resizeTask,drawTimer,realX,realY,cursorX,cursorY,pageX,pageY,inCanvas,numberToIdMap={},shapeMap={};function formatDecimal(e){return(e=""+e).slice(0,6)}function object2Shape(e){return new(0,Canvas.shapes[e.name])(e)}function getPainterConfig(){return{fillStyle:"transparent",strokeStyle:"red",lineWidth:1,strokePosition:2,shadowOffsetX:0,shadowOffsetY:0,shadowBlur:0,shadowColor:"#8f8f8f",radius:0,hasShadow:!0,thickness:6,fontFamily:"sans-serif",caretColor:"#fff",hoverColor:"#fff000"}}function serializeShape(e){var a=e.toJSON();if(a.id=e.id,a.fillAlpha=0,a.strokeAlpha=0,"Oval"!==a.name&&"Text"!==a.name&&(a.autoClosePath="Doodle"!==a.name,a.smooth="Doodle"===a.name,a.name="Doodle"),e.x)if("Oval"===a.name){var t=e.x-e.width/2;a.x=formatDecimal(t/canvasWidth)}else a.x=formatDecimal(e.x/canvasWidth);if(e.y)if("Oval"===a.name){var i=e.y-e.height/2;a.y=formatDecimal(i/canvasHeight)}else a.y=formatDecimal(e.y/canvasHeight);var n=null;return a.points&&(n=[],util.array.each(e.points,function(e){n.push({x:formatDecimal(e.x/canvasWidth),y:formatDecimal(e.y/canvasHeight)})}),a.points=n,n.length&&(a.x=n[0].x,a.y=n[0].y)),e.width&&(a.width=formatDecimal(e.width/canvasWidth)),e.height&&(a.height=formatDecimal(e.height/canvasHeight)),"transparent"===e.strokeStyle&&(a.strokeStyle="#000000"),"transparent"===e.fillStyle&&(a.fillStyle="#000000"),e.fontSize&&(a.fontSize=formatDecimal(e.fontSize/canvas.clientWidth)),"transparent"!=e.fillStyle&&(a.fillAlpha=1),"transparent"!=e.strokeStyle&&(a.strokeAlpha=1),"Oval"===a.name||"Text"===a.name||a.autoClosePath||(a.fillAlpha=0,a.fillStyle="#000000"),a}function unserializeShape(e){var a="Doodle"==e.name?e.autoClosePath?"Polygon":"Doodle":e.name,t={points:[],lineWidth:e.lineWidth,strokeStyle:e.strokeStyle,fillStyle:e.fillStyle,name:a,id:e.id,number:e.number,text:e.text,x:e.x,y:e.y,width:e.width,height:e.height,fontSize:e.fontSize,fontWeight:e.fontWeight,fontItalic:e.fontItalic,fontFamily:e.fontFamily};0==e.strokeAlpha&&(t.strokeStyle="transparent"),0==e.fillAlpha&&(t.fillStyle="transparent");var i=[];if(e.points&&util.array.each(e.points,function(e){i.push({x:Math.floor(e.x*canvasWidth),y:Math.floor(e.y*canvasHeight)})}),t.points=i,e.width&&(t.width=Math.floor(e.width*canvasWidth)),e.height&&(t.height=Math.floor(e.height*canvasHeight)),e.x){var n=e.x*canvasWidth;"Oval"==t.name&&(n+=t.width/2),t.x=Math.floor(n)}if(e.y){var r=e.y*canvasHeight;"Oval"==t.name&&(r+=t.height/2),t.y=Math.floor(r)}return e.fontSize&&(t.computeFontSize=Math.floor(e.fontSize*canvasWidth),t.fontSize=t.computeFontSize<1.5?1.5:t.computeFontSize),t}function addShape(e){painter.addShape(unserializeShape(e))}function stopDrawTimer(){drawTimer&&(drawTimer(),drawTimer=null)}function addShapes(e,a){var t=[];util.array.each(e,function(e){numberToIdMap[e.number]=e.id;var a=unserializeShape(e),i=a.name?a.name.toLowerCase():painterConfig.toolDoodle;t.push(new shapeMap[i](a))}),painter.addShapes(t,a)}function updatePosition(e){wx.getSystemInfoSync().pixelRatio;var a=e.changedTouches[0];realX=a.x,realY=a.y,cursorX=realX,cursorY=realY}shapeMap[painterConfig.toolLine]=Canvas.shapes.Line,shapeMap[painterConfig.toolRect]=Canvas.shapes.Rect,shapeMap[painterConfig.toolOval]=Canvas.shapes.Oval,shapeMap[painterConfig.toolDoodle]=Canvas.shapes.Doodle,shapeMap[painterConfig.toolPolygon]=Canvas.shapes.Polygon,shapeMap[painterConfig.toolArrow]=Canvas.shapes.Arrow,shapeMap[painterConfig.toolText]=Canvas.shapes.Text,shapeMap[painterConfig.toolStar]=Canvas.shapes.Star,shapeMap[painterConfig.toolHeart]=Canvas.shapes.Heart,shapeMap[painterConfig.toolArrows]=function(e){return e.double=!0,new Canvas.shapes.Arrow(e)},shapeMap[painterConfig.toolTriangle]=Canvas.shapes.Polygon,exports.init=function(e,a,t){drawing=!1,(painter=new Canvas(context=e,canvasWidth=a,canvasHeight=t)).apply(getPainterConfig()),painter.emitter.on(Canvas.Emitter.SHAPE_ADD,function(e){if(drawing){var a=e.shapes[0];if(!a.id){a=serializeShape(a);var t=docData.getComplexPage(pageData.getClientPage());eventEmitter.trigger(eventEmitter.SHAPE_ADD_TRIGGER,{shape:a,page:t.page,docId:t.docId})}}}),eventEmitter.on(eventEmitter.SERVER_PAGE_CHANGE,function(){console.log("on SERVER_PAGE_CHANGE"),painter.clear()}).on(eventEmitter.CLIENT_PAGE_CHANGE,function(){painter.clear()}).on(eventEmitter.SHAPE_ADD,function(e,a){if(auth.isSelf(a.fromId))util.array.each(painter.getShapes(),function(e){if(!e.id&&e.number===a.shape.number)return e.id=a.shape.id,!1},!0);else{var t=pageData.getClientPage(),i=docData.getComplexPage(t);a.docId===i.docId&&a.page===i.page&&addShapes([a.shape],!0)}}).on(eventEmitter.SHAPE_REMOVE,function(e,a){if(store.get("user.id")!=a.fromId)if(""!=a.shapeId){var t=a.shapeId.split(","),i=[];util.array.each(painter.getShapes(),function(e){e&&e.id&&util.array.has(t,e.id)&&(i.push(e),delete numberToIdMap[e.number])},!0),painter.removeShapes(i)}else painter.clear()}).on(eventEmitter.SHAPE_UPDATE,function(e,a){var t=a.shapeList;if(store.get("user.id")!=a.fromId){var i={};util.array.each(t,function(e){i[e.id]=e}),util.array.each(painter.getShapes(),function(e){var a=i[e.id];e.id&&i[e.id]&&(painter.removeShape(e,!0),a=unserializeShape(a),$.extend(e,a),painter.addShape(e,!0))})}})},exports.draw=function(e){1==e?painter.drawing(Doodle):painter.drawing(!1),drawing=!!e},exports.create=function(e){if(console.log("in painter create"),console.log(e),stopDrawTimer(),e.length)if(e.length>100){var a=[];util.array.each(e,function(e){a.push(function(){addShapes([e],!0)})}),this.stopDrawTimer=serial(a,20)}else addShapes(e)},exports.onCanvasTouchStart=function(e){if(drawing){var a=painter.emitter;updatePosition(e),a.fire(Canvas.Emitter.MOUSE_DOWN,{x:cursorX,y:cursorY,realX:realX,realY:realY,target:e.target,inCanvas:!0})}},exports.onCanvasTouchMove=function(e){if(drawing){var a=painter.emitter;updatePosition(e),a.fire(Canvas.Emitter.MOUSE_MOVE,{x:cursorX,y:cursorY,realX:realX,realY:realY,target:e.target,inCanvas:!0})}},exports.onCanvasTouchEnd=function(e){var a=painter.emitter;updatePosition(e),a.fire(Canvas.Emitter.MOUSE_UP,{x:cursorX,y:cursorY,realX:realX,realY:realY,target:e.target,inCanvas:!0})},exports.onClearTap=function(){painter.clear()},exports.resize=function(e,a){if(canvasHeight=a,canvasWidth=e,e>0&&a>0){var t=function(){painter&&painter.resize(e,a)};painter?t():resizeTask=t}};