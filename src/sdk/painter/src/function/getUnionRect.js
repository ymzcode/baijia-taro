export default function(t){let{length:e}=t;if(!e)throw new Error("getUnionRect rects array length have to be large than 1.");let h=t[0],r=h.x,i=h.y,n=r+h.width,g=i+h.height;for(let l=1;l<e;l++)(h=t[l]).x<r&&(r=h.x),h.y<i&&(i=h.y),h.x+h.width>n&&(n=h.x+h.width),h.y+h.height>g&&(g=h.y+h.height);return{x:r,y:i,width:n-r,height:g-i}};