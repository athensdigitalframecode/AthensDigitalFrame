<script>
(function(){
var s=document.getElementById('babel');if(!s||!s.querySelectorAll)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var L=[].slice.call(s.querySelectorAll('[data-d]')),
 P=[].slice.call(s.querySelectorAll('#wf>*')),N=P.length,
 mx=0,my=0,sy=window.pageYOffset||0,cur=sy,run=false,lastP=-1,wide=matchMedia('(min-width:900px)');
for(var j=0;j<N;j++){P[j].setAttribute('pathLength','1');P[j].style.opacity=0}
function build(p){
 var r=Math.round(p*200);if(r===lastP)return;lastP=r;
 for(var j=0;j<N;j++){
  var t=Math.max(0,Math.min(1,(p-j/N*.75)/.25)),st=P[j].style;
  if(t<.01){st.opacity=0;st.strokeDasharray=''}
  else if(t>.99){st.opacity='';st.strokeDasharray='';st.strokeDashoffset=''}
  else{st.opacity='';st.strokeDasharray='1 2';st.strokeDashoffset=(1-t).toFixed(3)}
 }
}
function frame(){
 run=false;
 if(window.__noTower)return;
 var diff=sy-cur;cur+=diff*.1;
 var sc=Math.min(cur,900)*.014,ph=cur*.011;
 for(var i=0;i<L.length;i++){
  var d=+L[i].getAttribute('data-d');
  var x=Math.sin(ph+i*1.3)*d*5+mx*d*-7,y=-sc*d+Math.cos(ph*.8+i*1.3)*d*2.2+my*d*-4;
  L[i].style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
 }
 build(Math.min(1,cur/900));
 if(Math.abs(sy-cur)>.4)q();
}
function q(){if(!run){run=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',function(){sy=window.pageYOffset||0;q()},{passive:true});
if(wide.matches)window.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;q()},{passive:true});
q();
})();
</script>
