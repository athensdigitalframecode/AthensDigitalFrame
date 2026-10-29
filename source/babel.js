<script>
(function(){
var cv=document.getElementById('babel');if(!cv)return;
var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,1.5);
var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var main=ctx,LA=document.createElement('canvas'),LB=document.createElement('canvas'),built=false;
function size(){W=Math.min(window.innerWidth*.94,540);H=Math.min(window.innerHeight*.9,840);
 cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx=main;ctx.setTransform(dpr,0,0,dpr,0,0);built=false}
function geo(){var N=8,base=H*.92,top=H*.21,rs=[],i;for(i=0;i<N;i++)rs[i]=W*.4*Math.pow(.935,i);return{cx:W*.5,base:base,top:top,N:N,step:(base-top)/N,k:.2,rs:rs}}
function build(){
 var g=geo(),cx=g.cx,base=g.base,top=g.top,N=g.N,step=g.step,k=g.k,rs=g.rs,i,j;
 LA.width=LB.width=W*dpr;LA.height=LB.height=H*dpr;
 // layer A: haze, ground, hills, rubble, clouds (never changes)
 ctx=LA.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';
 var g0=ctx.createRadialGradient(cx,base,0,cx,base,W*.48);g0.addColorStop(0,'rgba(201,169,110,.16)');g0.addColorStop(1,'rgba(201,169,110,0)');
 ctx.fillStyle=g0;ctx.fillRect(0,base-W*.55,W,W*1.1);
 var g1=ctx.createRadialGradient(cx,top,0,cx,top,W*.36);g1.addColorStop(0,'rgba(241,221,176,.14)');g1.addColorStop(1,'rgba(241,221,176,0)');
 ctx.fillStyle=g1;ctx.fillRect(0,0,W,top+W*.4);
 var gs=ctx.createRadialGradient(cx,H*.5,0,cx,H*.5,Math.min(W*.49,H*.5));gs.addColorStop(0,'rgba(201,169,110,.09)');gs.addColorStop(1,'rgba(201,169,110,0)');
 ctx.fillStyle=gs;ctx.fillRect(0,0,W,H);
 stroke(.3,1.1);ctx.beginPath();ctx.ellipse(cx,base+4,W*.5,H*.04,0,Math.PI,0);ctx.stroke();
 stroke(.2,1);ctx.beginPath();ctx.moveTo(0,base-H*.04);ctx.quadraticCurveTo(W*.18,base-H*.1,W*.3,base);ctx.moveTo(W,base-H*.05);ctx.quadraticCurveTo(W*.84,base-H*.11,W*.72,base);ctx.stroke();
 for(j=0;j<16;j++){var bx=cx-W*.48+j*W*.06,bh=4+((j*7)%4)*4;stroke(.2,1);ctx.strokeRect(bx,base+7-bh,7,bh);if(j%3==0){ctx.beginPath();ctx.moveTo(bx,base+7-bh);ctx.lineTo(bx+3.5,base+2-bh);ctx.lineTo(bx+7,base+7-bh);ctx.stroke()}}
 stroke(.17,1.2);
 [[.1,.3,.36],[.86,.24,.32],[.08,.55,.28],[.9,.5,.26],[.5,.05,.4]].forEach(function(q){var x=W*q[0],y=H*q[1],w=W*q[2]*.3;var cg=ctx.createRadialGradient(x,y,0,x,y,w*1.3);cg.addColorStop(0,'rgba(201,169,110,.10)');cg.addColorStop(1,'rgba(201,169,110,0)');ctx.fillStyle=cg;ctx.fillRect(x-w*1.35,y-w*1.35,w*2.7,w*2.7);ctx.beginPath();ctx.ellipse(x,y,w,w*.16,0,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.ellipse(x+w*.5,y-w*.08,w*.5,w*.12,0,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.ellipse(x-w*.4,y+w*.07,w*.45,w*.1,0,Math.PI,0);ctx.stroke()});
 // layer B: tier bodies, shading, outlines, masonry (never changes)
 ctx=LB.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';
 for(i=0;i<N;i++){
  var r=rs[i],ry=r*k,yb=base-i*step,yt=yb-step*.96;
  ctx.globalAlpha=1-i*.045;
  var gb=ctx.createLinearGradient(cx-r,0,cx+r,0);
  gb.addColorStop(0,'rgba(8,8,8,.9)');gb.addColorStop(.28,'rgba(18,16,12,.88)');gb.addColorStop(.72,'rgba(52,43,28,.8)');gb.addColorStop(1,'rgba(120,98,58,.55)');
  ctx.fillStyle=gb;ctx.beginPath();ctx.moveTo(cx-r,yt);ctx.lineTo(cx-r,yb);ctx.ellipse(cx,yb,r,ry,0,Math.PI,0,true);ctx.lineTo(cx+r,yt);ctx.ellipse(cx,yt,r,ry,0,0,Math.PI,false);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(201,169,110,.10)';ctx.beginPath();ctx.ellipse(cx,yt,r,ry,0,0,Math.PI*2);ctx.fill();
  stroke(.12,4);ctx.beginPath();ctx.ellipse(cx,yt,r,ry,0,0,Math.PI*2);ctx.stroke();
  stroke(.6,1.3);
  ctx.beginPath();ctx.moveTo(cx-r,yb);ctx.lineTo(cx-r,yt);ctx.moveTo(cx+r,yb);ctx.lineTo(cx+r,yt);ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,yb,r,ry,0,0,Math.PI);ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,yt,r,ry,0,0,Math.PI*2);ctx.stroke();
  stroke(.95,1.7);ctx.beginPath();ctx.moveTo(cx+r,yb);ctx.lineTo(cx+r,yt);ctx.stroke();
  stroke(.3,1);ctx.beginPath();ctx.ellipse(cx,yt+3.5,r,ry,0,0,Math.PI);ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,yb-step*.5,r,ry,0,0,Math.PI);ctx.stroke();
  stroke(.07,1);ctx.beginPath();
  for(j=1;j<5;j++){var ym=yb-step*(.12+j*.17);if(Math.abs(j*.17+.12-.5)<.06)continue;ctx.moveTo(cx-r,ym);ctx.ellipse(cx,ym,r,ry,0,Math.PI,0,true)}
  ctx.stroke();
 }
 ctx=main;built=true}
function stroke(a,w){ctx.strokeStyle='rgba(201,169,110,'+a+')';ctx.lineWidth=w}
function hash(i,j){var x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x)}
function draw(th,tm){
 if(!built)build();
 ctx.clearRect(0,0,W,H);
 var cx=W*.5,base=H*.92,top=H*.21,N=8,step=(base-top)/N,R0=W*.4,k=.2,i,j,rs=[];
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 for(i=0;i<N;i++)rs[i]=R0*Math.pow(.935,i);
 ctx.drawImage(LA,0,0,W,H);
 for(j=0;j<3;j++){var ra=(j-1)*.34+Math.sin(tm/5200+j)*.03,rg=ctx.createLinearGradient(cx,top,cx+Math.sin(ra)*H*.8,top+H*.7);rg.addColorStop(0,'rgba(241,221,176,.07)');rg.addColorStop(1,'rgba(241,221,176,0)');
  ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(cx-6,top-4);ctx.lineTo(cx+6,top-4);ctx.lineTo(cx+Math.sin(ra)*H*.8+W*.12,top+H*.7);ctx.lineTo(cx+Math.sin(ra)*H*.8-W*.12,top+H*.7);ctx.closePath();ctx.fill()}
 ctx.drawImage(LB,0,0,W,H);
 for(i=0;i<N;i++){
  var r=rs[i],ry=r*k,yb=base-i*step;
  ctx.globalAlpha=1-i*.045;
 // two arcades with filled openings; some windows glow
  var n=Math.max(14,Math.round(r*.22)),rowsY=[.06,.52];
  for(var rw=0;rw<2;rw++){
   for(j=0;j<n;j++){
    var a=th+j*2*Math.PI/n+rw*Math.PI/n,c=Math.cos(a),sn=Math.sin(a);if(c<.1)continue;
    var x=cx+r*sn,w=Math.max(1.1,r*.02*c+.7),y0=yb+ry*c-step*rowsY[rw],y1=y0-step*.34;
    ctx.beginPath();ctx.moveTo(x-w,y0);ctx.lineTo(x-w,y1+w);ctx.arc(x,y1+w,w,Math.PI,0);ctx.lineTo(x+w,y0);
    if(i==N-1&&hash(j,rw+9)<.35)continue;var lit=hash(i*3+rw,j)>.86&&c>.35;
    ctx.fillStyle=lit?'rgba(241,205,130,'+(.35+.3*Math.sin(tm/700+i+j))*c+')':'rgba(0,0,0,.55)';ctx.fill();
    stroke(.14+.5*c,1);ctx.stroke();
    if(c>.55){ctx.fillStyle='rgba(224,196,140,'+(.5*c)+')';ctx.fillRect(x-.8,y1+w-w-1.5,1.6,2.2)}
   }
  }
 }
 ctx.globalAlpha=1;
 // spiral ramp: lit edge + shadow edge
 var turns=N*.95,segs=460,prev=null,pts=[];
 ctx.beginPath();stroke(.98,2.2);
 for(i=0;i<=segs;i++){
  var u=i/segs,f=u*N,ti=Math.min(N-1,Math.floor(f)),rr=rs[ti]*1.015,ryy=rr*k,y=base-u*(base-top)+step*.04,a2=th+u*turns*2*Math.PI;
  var p={x:cx+rr*Math.sin(a2),y:y+ryy*Math.cos(a2),c:Math.cos(a2)};
  if(prev&&p.c>0&&prev.c>0){ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);pts.push(prev.x,prev.y,p.x,p.y)}
  prev=p;
 }
 ctx.stroke();stroke(.5,1);ctx.beginPath();
 for(i=0;i<pts.length;i+=4){ctx.moveTo(pts[i],pts[i+1]+5);ctx.lineTo(pts[i+2],pts[i+3]+5)}
 ctx.stroke();
 stroke(.16,3);ctx.beginPath();
 for(i=0;i<pts.length;i+=4){ctx.moveTo(pts[i],pts[i+1]+9);ctx.lineTo(pts[i+2],pts[i+3]+9)}
 ctx.stroke();
 // unfinished crown: broken piers, scaffolding, cranes
 var rt=rs[N-1]*.9,ty=top-step*.04;stroke(.65,1.2);
 for(j=0;j<11;j++){var aa=th+j*.58,cc=Math.cos(aa);if(cc<0)continue;var xx=cx+rt*Math.sin(aa),h=4+((j*5)%4)*4;ctx.beginPath();ctx.moveTo(xx,ty+rt*k*cc);ctx.lineTo(xx,ty+rt*k*cc-h);ctx.stroke()}
 stroke(.4,1);ctx.beginPath();ctx.moveTo(cx-rt*.8,ty+4);ctx.lineTo(cx-rt*.5,ty-34);ctx.lineTo(cx-rt*.2,ty+2);ctx.moveTo(cx-rt*.65,ty-12);ctx.lineTo(cx-rt*.35,ty-12);ctx.stroke();
 stroke(.75,1.3);
 ctx.beginPath();ctx.moveTo(cx-6,ty);ctx.lineTo(cx-6,ty-30);ctx.lineTo(cx+22,ty-38);ctx.moveTo(cx-6,ty-30);ctx.lineTo(cx-20,ty-24);ctx.moveTo(cx+18,ty-37);ctx.lineTo(cx+18,ty-22);ctx.stroke();
 ctx.beginPath();ctx.moveTo(cx+rt*.5,ty+3);ctx.lineTo(cx+rt*.5,ty-20);ctx.lineTo(cx+rt*.5+14,ty-26);ctx.stroke();
 // birds circling the tower
 stroke(.55,1.2);ctx.beginPath();
 for(j=0;j<6;j++){var ba=tm/4200+j*1.05,bx2=cx+Math.cos(ba)*(W*.34+j*7),by2=H*.3+Math.sin(ba*1.3)*(H*.1)+j*H*.06,fl=Math.sin(tm/160+j)*2.4;
  ctx.moveTo(bx2-5,by2-fl);ctx.lineTo(bx2,by2);ctx.lineTo(bx2+5,by2-fl)}
 ctx.stroke();
 // tiny builders climbing the ramp
 ctx.fillStyle='rgba(255,236,190,.9)';
 for(j=0;j<18;j++){var u=((tm/60000+j/18)%1),ti2=Math.min(N-1,Math.floor(u*N)),rr2=rs[ti2]*1.015,a3=th+u*turns*2*Math.PI;
  if(Math.cos(a3)<.15)continue;var wx=cx+rr2*Math.sin(a3),wy=base-u*(base-top)+step*.04+rr2*k*Math.cos(a3)-3;ctx.beginPath();ctx.arc(wx,wy,1.3,0,6.283);ctx.fill()}
 ctx.restore();
}
var cur=0,idle=0,last=performance.now(),lastDraw=0,lastTh=-9,vis=true,ema=0,slow=0,gap=16;
document.addEventListener('visibilitychange',function(){vis=!document.hidden});
function sy(){return window.pageYOffset||document.documentElement.scrollTop||0}
function loop(now){
  requestAnimationFrame(loop);
  if(!vis||window.__noTower)return;
  var dt=Math.min(.05,(now-last)/1000);last=now;
  var tgt=(sy()+(window.__ex||0))*.0015;cur+=(tgt-cur)*.14;idle+=dt*.07;
  var th=cur+idle+.5,moving=Math.abs(tgt-cur)>.0008;
  if(Math.abs(th-lastTh)<.0035&&now-lastDraw<90)return;
  if(!moving&&now-lastDraw<50)return;
  if(now-lastDraw<gap)return;
  lastDraw=now;lastTh=th;var t0=performance.now();draw(th,now);var cost=performance.now()-t0;
  ema=ema?ema*.92+cost*.08:cost;gap=ema>8?34:16;
  if(ema>14&&dpr>1){if(++slow>20){dpr=1;size();ema=0;slow=0}}else slow=0;
}
size();window.addEventListener('resize',function(){size();draw(cur+idle+.5)});
if(reduce){draw(.9,0)}else{requestAnimationFrame(loop)}
})();
</script>
