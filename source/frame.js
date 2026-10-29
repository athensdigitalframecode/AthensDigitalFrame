<script>
(function(){
var s=document.getElementById('babel');if(!s||!s.querySelectorAll)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var L=[].slice.call(s.querySelectorAll('[data-d]')),grp=document.getElementById('flgrp'),map=document.getElementById('flmap'),
 mx=0,my=0,sy=window.pageYOffset||0,cur=sy,run=false,filt=false,wide=matchMedia('(min-width:900px)');
function frame(){
 run=false;
 if(window.__noTower)return;
 var diff=sy-cur;cur+=diff*.1;
 var sc=Math.min(cur,900)*.014,ph=cur*.011,amp=Math.min(1,Math.abs(diff)/60);
 for(var i=0;i<L.length;i++){
  var d=+L[i].getAttribute('data-d');
  var x=Math.sin(ph+i*1.3)*d*5+mx*d*-7,y=-sc*d+Math.cos(ph*.8+i*1.3)*d*2.2+my*d*-4;
  L[i].style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
 }
 var k=Math.min(6,Math.abs(diff)*.1);
 if(map&&grp){
  if(k>.5){map.setAttribute('scale',k.toFixed(1));if(!filt){grp.setAttribute('filter','url(#flwave)');filt=true}}
  else if(filt){grp.removeAttribute('filter');filt=false}
 }
 if(Math.abs(sy-cur)>.4)q();
}
function q(){if(!run){run=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',function(){sy=window.pageYOffset||0;q()},{passive:true});
if(wide.matches)window.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;q()},{passive:true});
})();
</script>
