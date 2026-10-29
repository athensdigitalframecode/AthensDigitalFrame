<script>
(function(){
var s=document.getElementById('babel');if(!s||!s.querySelectorAll)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var L=[].slice.call(s.querySelectorAll('[data-d]')),sh=document.getElementById('sheen'),
 P=[].slice.call(s.querySelectorAll('path,circle,rect')),W=[],
 mx=0,my=0,sy=window.pageYOffset||0,cur=sy,run=false,ia=1,lastR=-1,wide=matchMedia('(min-width:900px)');
for(var j=0;j<P.length;j++){P[j].setAttribute('pathLength','1');W.push(.35+((j*37)%100)/100*.65)}
function draw(a){
 var r=Math.round(a*100);if(r===lastR)return;lastR=r;
 for(var j=0;j<P.length;j++){
  var o=Math.min(.92,a*W[j]*1.15),st=P[j].style;
  if(o<.004){st.strokeDasharray='';st.strokeDashoffset=''}
  else{st.strokeDasharray='1 2';st.strokeDashoffset=o.toFixed(3)}
 }
}
function frame(){
 run=false;
 if(window.__noTower)return;
 var diff=sy-cur;cur+=diff*.1;ia*=.965;if(ia<.01)ia=0;
 var sc=Math.min(cur,900)*.014,ph=cur*.011,amp=Math.min(1,Math.abs(diff)/70);
 for(var i=0;i<L.length;i++){
  var d=+L[i].getAttribute('data-d');
  var x=Math.sin(ph+i*1.3)*d*5+mx*d*-7,y=-sc*d+Math.cos(ph*.8+i*1.3)*d*2.2+my*d*-4;
  L[i].style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
 }
 draw(Math.max(amp*.7,ia));
 if(sh)sh.setAttribute('gradientTransform','translate('+(((cur*.9+performance.now()*0)%1500)-420).toFixed(0)+',0) skewX(-20)');
 if(Math.abs(sy-cur)>.4||ia>0)q();
}
function q(){if(!run){run=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',function(){sy=window.pageYOffset||0;q()},{passive:true});
if(wide.matches)window.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;q()},{passive:true});
q();
})();
</script>
