<script>
(function(){
var s=document.getElementById('babel');if(!s||!s.querySelectorAll)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var L=[].slice.call(s.querySelectorAll('[data-d]')),mx=0,my=0,sy=0,tk=false,wide=matchMedia('(min-width:900px)');
function ap(){tk=false;if(window.__noTower)return;var sc=Math.min(sy,900)*.014;
 for(var i=0;i<L.length;i++){var d=+L[i].getAttribute('data-d');L[i].style.transform='translate('+(mx*d*-7).toFixed(1)+'px,'+(-sc*d+my*d*-4).toFixed(1)+'px)'}}
function q(){if(!tk){tk=true;requestAnimationFrame(ap)}}
window.addEventListener('scroll',function(){sy=window.pageYOffset||0;q()},{passive:true});
if(wide.matches)window.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;q()},{passive:true});
})();
</script>
