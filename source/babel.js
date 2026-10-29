<script>
(function(){
var img=document.getElementById('babel');if(!img)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var W=560,H=578,cv,ctx,src,out,th,cs,cx,hw,kk,rot=0,y0=0,dirty=true,last=0,wide=matchMedia('(min-width:900px)');
function sm(a,r){var b=[],n,s,k,j,q,L=a.length;for(j=0;j<L;j++){s=0;n=0;for(k=-r;k<=r;k++){q=j+k;if(q>=0&&q<L){s+=a[q];n++}}b[j]=s/n}return b}
function setup(){
 var oc=document.createElement('canvas');oc.width=W;oc.height=H;
 var o=oc.getContext('2d',{willReadFrequently:true});o.drawImage(img,0,0,W,H);
 var id=o.getImageData(0,0,W,H);src=id.data;out=new ImageData(W,H);
 var L=[],R=[],y,x,k,m;
 for(y=0;y<H;y++){L[y]=-1;R[y]=-1}
 for(y=0;y<H*.93;y++){for(x=0;x<W;x++){var hit=false;for(k=-5;k<=5&&!hit;k+=5){var yy=y+k;if(yy>=0&&yy<H&&src[(yy*W+x)*4+3]>14)hit=true}if(hit){if(L[y]<0)L[y]=x;R[y]=x}}}
 var n=0,sa=0,sb=0,sxy=0,sxx=0;
 for(y=Math.floor(H*.35);y<H*.8;y++){if(L[y]>=0){m=(L[y]+R[y])/2;n++;sa+=y;sb+=m;sxy+=y*m;sxx+=y*y}}
 var bs=(n*sxy-sa*sb)/(n*sxx-sa*sa),ic=(sb-bs*sa)/n,w=[],pw=W/4;cx=[];
 for(y=0;y<H;y++){cx[y]=ic+bs*y;if(L[y]>=0)pw=Math.min(cx[y]-L[y],R[y]-cx[y]);w[y]=Math.max(pw,6)}
 hw=sm(w,14);kk=[];
 for(y=0;y<H;y++)kk[y]=.08+.14*Math.min(1,y/(H*.9));
 th=new Float32Array(W*H);cs=new Float32Array(W*H);
 for(y=0;y<H;y++)for(x=0;x<W;x++){var s=(x-cx[y])/hw[y];s=s>.999?.999:s<-.999?-.999:s;th[y*W+x]=Math.asin(s);cs[y*W+x]=Math.sqrt(1-s*s)}
 cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.id='babelc';cv.className=img.className;cv.setAttribute('aria-hidden','true');
 ctx=cv.getContext('2d');
 img.parentNode.insertBefore(cv,img.nextSibling);img.style.visibility='hidden';
 new MutationObserver(function(){cv.className=img.className}).observe(img,{attributes:true,attributeFilter:['class']});
 draw();requestAnimationFrame(loop);
}
function draw(){
 var d=out.data,y,x,k,e,s,v,sx,sy,xi,yi,fx,fy,p0,p1,p2,p3,a0,a1,a2,a3,wa,al,c0,sc,cp=Math.cos,hwy,ky,cxy;
 for(y=0;y<H;y++){hwy=hw[y];ky=kk[y];cxy=cx[y];
  for(x=0;x<W;x++){k=y*W+x;e=hwy-Math.abs(x-cxy);if(e<=0){d[k*4+3]=0;continue}
   v=((th[k]+rot+1.5707963)*.3183099)%1;if(v<0)v+=1;
   s=(v*2-1)*.9;sx=cxy+s*hwy;sc=Math.sqrt(Math.max(0,1-s*s));
   sy=y-ky*hwy*cs[k]+ky*hwy*sc;if(sy<0)sy=0;else if(sy>H-1.01)sy=H-1.01;
   xi=sx|0;yi=sy|0;fx=sx-xi;fy=sy-yi;
   p0=(yi*W+xi)*4;p1=p0+4;p2=p0+W*4;p3=p2+4;
   a0=src[p0+3]*(1-fx)*(1-fy);a1=src[p1+3]*fx*(1-fy);a2=src[p2+3]*(1-fx)*fy;a3=src[p3+3]*fx*fy;
   wa=a0+a1+a2+a3;if(wa<1){d[k*4+3]=0;continue}
   d[k*4]=(src[p0]*a0+src[p1]*a1+src[p2]*a2+src[p3]*a3)/wa;d[k*4+1]=(src[p0+1]*a0+src[p1+1]*a1+src[p2+1]*a2+src[p3+1]*a3)/wa;d[k*4+2]=(src[p0+2]*a0+src[p1+2]*a1+src[p2+2]*a2+src[p3+2]*a3)/wa;
   sc=v<.5?v:1-v;sc=sc<.09?sc/.09:1;al=wa*sc*(.3+.7*cs[k])*(y>H*.84?Math.max(0,(H*.93-y)/(H*.09)):1);if(e<3)al*=e/3;d[k*4+3]=al>255?255:al}}
 ctx.putImageData(out,0,0);
}
function loop(t){
 requestAnimationFrame(loop);
 if(window.__noTower||document.hidden)return;
 if(wide.matches&&t-last>40){rot+=.003;dirty=true}
 if(!dirty||t-last<40)return;
 last=t;dirty=false;draw();
}
var tk=false;
window.addEventListener('scroll',function(){var s=window.pageYOffset||0;rot+=(s-y0)*.004;y0=s;dirty=true;if(cv&&!tk){tk=true;requestAnimationFrame(function(){tk=false;cv.style.translate='0 '+(-s*.05).toFixed(1)+'px'})}},{passive:true});
if(img.complete&&img.naturalWidth)setup();else img.addEventListener('load',setup);
})();
</script>
