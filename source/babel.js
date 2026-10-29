<script>
(function(){
var img=document.getElementById('babel');if(!img)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var W=560,H=596,cv,ctx,src,out,th,cx,hw,rot=0,y0=0,dirty=true,last=0,wide=matchMedia('(min-width:900px)');
function setup(){
 var oc=document.createElement('canvas');oc.width=W;oc.height=H;
 var o=oc.getContext('2d',{willReadFrequently:true});o.drawImage(img,0,0,W,H);
 var id=o.getImageData(0,0,W,H);src=id.data;out=ctx0(id);
 var L=[],R=[],y,x,i;
 for(y=0;y<H;y++){L[y]=-1;R[y]=-1;for(x=0;x<W;x++){if(src[(y*W+x)*4+3]>40){if(L[y]<0)L[y]=x;R[y]=x}}}
 var n=0,sa=0,sb=0,sxy=0,sxx=0,m;
 for(y=Math.floor(H*.4);y<H*.8;y++){if(L[y]>=0){m=(L[y]+R[y])/2;n++;sa+=y;sb+=m;sxy+=y*m;sxx+=y*y}}
 var bs=(n*sxy-sa*sb)/(n*sxx-sa*sa),ic=(sb-bs*sa)/n,w=[],pw=W/4;
 cx=[];for(y=0;y<H;y++){cx[y]=ic+bs*y;if(L[y]>=0)pw=Math.min(cx[y]-L[y],R[y]-cx[y]);w[y]=Math.max(pw,4)}
 function sm(a,r){var b=[],n,s,k;for(var j=0;j<H;j++){s=0;n=0;for(k=-r;k<=r;k++){var q=j+k;if(q>=0&&q<H){s+=a[q];n++}}b[j]=s/n}return b}
 hw=sm(w,12);
 th=new Float32Array(W*H);
 for(y=0;y<H;y++)for(x=0;x<W;x++){var s=(x-cx[y])/hw[y];s=s>.999?.999:s<-.999?-.999:s;th[y*W+x]=Math.asin(s)}
 cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.id='babelc';cv.className=img.className;cv.setAttribute('aria-hidden','true');
 ctx=cv.getContext('2d');ctx.putImageData(id,0,0);
 img.parentNode.insertBefore(cv,img.nextSibling);img.style.visibility='hidden';
 new MutationObserver(function(){cv.className=img.className}).observe(img,{attributes:true,attributeFilter:['class']});
 requestAnimationFrame(loop);
}
function ctx0(id){return ctx0.o=new ImageData(new Uint8ClampedArray(id.data),W,H)}
function draw(){
 var d=out.data,y,x,k,sx,f,j,p,q,l,r,e,al,sh,v;
 for(y=0;y<H;y++){l=cx[y]-hw[y]+2;r=cx[y]+hw[y]-2;
  for(x=0;x<W;x++){k=y*W+x;e=hw[y]-Math.abs(x-cx[y]);if(e<=0){d[k*4+3]=0;continue}
   v=((th[k]+rot+1.5707963)*.3183099)%1;if(v<0)v+=1;sx=cx[y]-hw[y]+2*hw[y]*v;sx=sx<l?l:sx>r?r:sx;
   j=sx|0;if(src[(y*W+j)*4+3]<200||src[(y*W+j)*4+2]>src[(y*W+j)*4]-6&&src[(y*W+j)*4]>120){sx=2*cx[y]-sx;sx=sx<l?l:sx>r?r:sx}
   sh=.74-.3*Math.sin(th[k]);
   j=sx|0;f=sx-j;p=(y*W+j)*4;q=p+4;
   al=src[p+3]*(1-f)+src[q+3]*f;if(e<2)al*=e/2;
   d[k*4]=(src[p]*(1-f)+src[q]*f)*sh;d[k*4+1]=(src[p+1]*(1-f)+src[q+1]*f)*sh;d[k*4+2]=(src[p+2]*(1-f)+src[q+2]*f)*sh;d[k*4+3]=al}}
 ctx.putImageData(out,0,0);
}
function loop(t){
 requestAnimationFrame(loop);
 if(window.__noTower||document.hidden)return;
 if(wide.matches){if(t-last>42){rot+=.0035;dirty=true}}
 if(!dirty)return;
 if(t-last<42)return;
 last=t;dirty=false;draw();
}
var y=0,tk=false;
window.addEventListener('scroll',function(){var s=window.pageYOffset||0;rot+=(s-y0)*.004;y0=s;dirty=true;if(cv&&!tk){tk=true;requestAnimationFrame(function(){tk=false;cv.style.translate='0 '+(-s*.05).toFixed(1)+'px'})}},{passive:true});
if(img.complete&&img.naturalWidth)setup();else img.addEventListener('load',setup);
})();
</script>
