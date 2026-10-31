<script>
(function(){
var sec=document.getElementById('how');if(!sec)return;
var EN=!!window.EN;
sec.querySelectorAll('[data-el]').forEach(function(e){e.textContent=EN?e.getAttribute('data-en'):e.getAttribute('data-el')});
var fq=document.getElementById('faq');
if(fq)fq.querySelectorAll('[data-el]').forEach(function(e){e.textContent=EN?e.getAttribute('data-en'):e.getAttribute('data-el')});
var pf=document.getElementById('portfolio');
if(pf)pf.querySelectorAll('[data-el]').forEach(function(e){e.textContent=EN?e.getAttribute('data-en'):e.getAttribute('data-el')});
var pt=document.getElementById('pftile');if(pt&&EN){pt.querySelector('em').textContent='Coming soon'}
var tt=document.getElementById('hwtile');
if(tt&&EN){tt.querySelector('strong').textContent='How it works';tt.querySelector('em').textContent='From brief to live, step by step'}
var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var cols=[].slice.call(sec.querySelectorAll('.hw-col')),wide=window.matchMedia('(min-width:900px)'),babel=document.getElementById('babel');
function clamp(x){return Math.max(0,Math.min(1,x))}
function scrollY(){return window.pageYOffset||document.documentElement.scrollTop||0}
function prog(el,vh){var r=el.getBoundingClientRect();return clamp((vh*.78-r.top)/(r.height*.82))}
function paint(col,p){
  var st=col.querySelectorAll('.hw-step'),n=st.length;
  st.forEach(function(s,i){s.classList.toggle('on',p>=(i+.35)/n)});
  var f=col.querySelector('.hw-rail i');if(f)f.style.height=(p*100).toFixed(1)+'%';
}
var hidden=false,offT=0;
function tower(vh){
  if(!babel||window.__dock)return;
  var r=sec.getBoundingClientRect(),gone=r.top<vh*.04,st=document.getElementById('stage');
  if(st)st.classList.toggle('hwgone',r.top<vh*.9);
  if(gone&&!hidden){hidden=true;babel.classList.add('gone');window.__noTower=true;clearTimeout(offT);offT=setTimeout(function(){if(hidden)babel.classList.add('off')},650)}
  else if(!gone&&hidden){hidden=false;clearTimeout(offT);babel.classList.remove('off');void babel.offsetWidth;babel.classList.remove('gone');window.__noTower=false}
}
var busy=false;
function update(){
  busy=false;var vh=window.innerHeight||700;
  if(reduce){cols.forEach(function(c){paint(c,1)})}
  else if(wide.matches){var p=prog(sec.querySelector('.hw-cols'),vh);cols.forEach(function(c){paint(c,p)})}
  else cols.forEach(function(c){paint(c,prog(c,vh))});
  tower(vh);
}
function req(){if(!busy){busy=true;requestAnimationFrame(update)}}
sec.classList.add('live');
window.addEventListener('scroll',req,{passive:true});document.addEventListener('scroll',req,{passive:true,capture:true});
window.addEventListener('resize',req);window.addEventListener('touchmove',req,{passive:true});
setInterval(req,300);req();
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href="#how"],a[href="#portfolio"]');if(!a)return;
  e.preventDefault();(document.getElementById(a.getAttribute('href').slice(1))||sec).scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
});
})();
</script>
