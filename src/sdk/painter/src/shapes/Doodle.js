import Shape from"./Shape";import smoothPoints from"../algorithm/smoothPoints";export default class Doodle extends Shape{setLineStyle(t){t.setLineJoin("round"),t.setLineCap("round")}drawing(t,e,o,s,i){const n=this.points||(this.points=[{x:e,y:o}]);t.disableShadow(),t.begin(),1===n.length&&(this.setLineStyle(t),t.setLineWidth(this.lineWidth),t.setStrokeStyle(this.strokeStyle)),n.push({x:s,y:i});var r=Math.pow(2,3),h=n.length,a=smoothPoints(n,{order:3,tailSize:3});t.drawPoints(a.slice(r*(h-2),r*(h-1)+1)),t.stroke(),t.draw(!0)}drawPath(t){t.drawPoints(this.points,!0)}toJSON(){return super.toJSON({name:"Doodle"})}};