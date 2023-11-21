import Shape from"./Shape";import constant from"../constant";import containRect from"../contain/rect";import getDistance from"../function/getDistance";export default class Oval extends Shape{isPointInFill(t,i,h){return t.begin(),this.drawPath(t),t.isPointInPath(i,h)}isPointInStroke(t,i,h){let{x:e,y:s,width:n,height:a,strokeStyle:r,strokePosition:o,lineWidth:d}=this;d<constant.SIZE_MIN&&(d=constant.SIZE_MIN);let l=2*d;switch(t.begin(),o){case constant.STROKE_POSITION_OUTSIDE:if(t.drawOval(e,s,n+l,a+l),t.isPointInPath(i,h))return t.begin(),t.drawOval(e,s,n,a),!t.isPointInPath(i,h);case constant.STROKE_POSITION_CENTER:if(t.drawOval(e,s,n+d,a+d),t.isPointInPath(i,h))return n-=d,a-=d,t.begin(),t.drawOval(e,s,n,a),!t.isPointInPath(i,h);break;case constant.STROKE_POSITION_INSIDE:if(t.drawOval(e,s,n,a),t.isPointInPath(i,h))return n-=l,a-=l,t.begin(),t.drawOval(e,s,n,a),!t.isPointInPath(i,h)}return!1}drawPath(t){t.drawOval(this.x,this.y,this.width,this.height)}stroke(t){let{x:i,y:h,width:e,height:s,strokeStyle:n,strokePosition:a,lineWidth:r}=this;if(a===constant.STROKE_POSITION_INSIDE){if(s-=r,(e-=r)<0||s<0)return}else a===constant.STROKE_POSITION_OUTSIDE&&(e+=r,s+=r);t.setLineWidth(r/constant.DEVICE_PIXEL_RATIO),t.setStrokeStyle(n),t.begin(),t.drawOval(i,h,e,s),t.stroke()}fill(t){t.setFillStyle(this.fillStyle),t.begin(),this.drawPath(t),t.fill()}drawing(t,i,h,e,s,n){n(),this.x=i,this.y=h,this.width=this.height=2*getDistance(i,h,e,s),this.draw(t)}save(t){return{x:(this.x-t.x)/t.width,y:(this.y-t.y)/t.height,width:this.width/t.width,height:this.height/t.height}}restore(t,i){this.x=t.x+t.width*i.x,this.y=t.y+t.height*i.y,this.width=t.width*i.width,this.height=t.height*i.height}validate(){return this.width>5&&this.height>5}getRect(){const{x:t,y:i,width:h,height:e}=this;return{x:t-h/2,y:i-e/2,width:h,height:e}}toJSON(){return super.toJSON({name:"Oval",x:this.x,y:this.y,width:this.width,height:this.height})}};