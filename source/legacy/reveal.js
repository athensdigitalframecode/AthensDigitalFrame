<script>
(function(){
if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;
var els=[].slice.call(document.querySelectorAll('section:not(.how):not(.hero),footer'));if(!els.length)return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.04});
document.documentElement.classList.add('rvjs');
els.forEach(function(e){e.classList.add('rv');io.observe(e)});
setTimeout(function(){els.forEach(function(e){e.classList.add('in')})},7000);
})();
</script>
