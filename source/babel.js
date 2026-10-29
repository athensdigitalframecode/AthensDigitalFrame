<script>
(function(){
var el=document.getElementById('babel');if(!el)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var y=0,ticking=false;
function apply(){ticking=false;if(window.__noTower)return;el.style.translate='0 '+(-y*.05).toFixed(1)+'px'}
window.addEventListener('scroll',function(){y=window.pageYOffset||document.documentElement.scrollTop||0;if(!ticking){ticking=true;requestAnimationFrame(apply)}},{passive:true});
})();
</script>
