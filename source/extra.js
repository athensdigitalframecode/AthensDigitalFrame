<script>
(function(){
window.__ex=0;var root=document.documentElement;
function maxY(){return Math.max(1,Math.max(root.scrollHeight,document.body.scrollHeight)-window.innerHeight)}
function yy(){return window.pageYOffset||root.scrollTop||0}
function atEnd(d){return d>0?yy()>=maxY()-2:yy()<=0}
window.addEventListener('wheel',function(e){var d=e.deltaY;if(d&&atEnd(d))window.__ex+=d*.9},{passive:true});
var ty=null;
window.addEventListener('touchstart',function(e){ty=e.touches[0].clientY},{passive:true});
window.addEventListener('touchmove',function(e){if(ty==null)return;var ny=e.touches[0].clientY,d=ty-ny;ty=ny;if(d&&atEnd(d))window.__ex+=d*1.2},{passive:true});
/* centre logo + name reveal after some scrolling */
var logo=document.querySelector('.hero .logo'),brand=document.querySelector('.hero .brand');
if(!logo)return;
var st=document.createElement('div');st.id='stage';st.setAttribute('role','button');st.tabIndex=0;st.setAttribute('aria-expanded','false');st.setAttribute('aria-label',window.EN?'Our story: the Tower of Babel':'Η ιστορία μας: ο Πύργος της Βαβέλ');
var im=document.createElement('img');im.src=logo.src;im.alt='';
var nm=document.createElement('span');nm.id='stagename';nm.textContent=brand?brand.textContent:'Athens Digital Frame';
var tx=document.createElement('div');tx.className='stxt';
if(window.EN)tx.innerHTML='<h4>The Tower of Babel</h4><p>Once, a tower was left unfinished, because people could not understand each other\'s language.</p><p><strong>Today we build again.</strong> A site that speaks your customers\' language and an e-shop that sells while you sleep.</p>';
else tx.innerHTML='<h4>Ο Πύργος της Βαβέλ</h4><p>Κάποτε, ένας πύργος έμεινε ημιτελής, γιατί οι άνθρωποι δεν κατάλαβαν ο ένας τη γλώσσα του άλλου.</p><p><strong>Σήμερα χτίζουμε ξανά.</strong> Ένα site που μιλά τη γλώσσα των πελατών σου και ένα e-shop που πουλάει όσο κοιμάσαι.</p>';
st.appendChild(tx);st.appendChild(im);st.appendChild(nm);document.body.appendChild(st);
var armed=true,tm=null,opened=false;setTimeout(function(){opened=true;check()},1400);
function check(){var y=yy();
  if(armed&&(y>450||(opened&&!matchMedia("(max-width:699px)").matches))){armed=false;st.classList.add('on');
    st.classList.add('mini');nm.textContent=lb}
  }
var bn=nm.textContent,lb=window.EN?'Story +':'Ιστορία +';
function tog(o){var m=st.classList.contains('mini');if(o===undefined)o=m;st.classList.toggle('mini',!o);st.setAttribute('aria-expanded',o?'true':'false');nm.textContent=o?bn:lb}
st.addEventListener('click',function(e){e.stopPropagation();tog()});
st.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});
document.addEventListener('click',function(){if(!st.classList.contains('mini'))tog(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!st.classList.contains('mini'))tog(false)});
var lastY=0,snds=[].slice.call(document.querySelectorAll('.snd'));
function dirCheck(){var y=yy();
  var hide=(y>lastY+4&&y>90);var show=(y<lastY-4||y<=90);
  if(hide)snds.forEach(function(b){b.classList.add('away')});else if(show)snds.forEach(function(b){b.classList.remove('away')});
  lastY=y}
window.addEventListener('scroll',dirCheck,{passive:true});
window.addEventListener('scroll',check,{passive:true});setInterval(check,300);
})();
(function(){var m=matchMedia('(max-width:699px)'),b=document.getElementById('babel'),h=document.querySelector('.herotxt'),bg=b&&b.parentNode;
if(!b||!h)return;function pl(){if(m.matches){h.parentNode.insertBefore(b,h.nextSibling);b.setAttribute('viewBox','0 8 520 400')}else{bg.insertBefore(b,bg.firstChild);b.setAttribute('viewBox','0 0 520 640')}}
pl();m.addEventListener&&m.addEventListener('change',pl)})();
(function(){/* dock: the hero arch itself shrinks and slides into the right gutter while scrolling (desktop >=1240px); it also shows page progress (ring) and the "how it works" step (dots) */
var b=document.getElementById('babel'),w=document.querySelector('section.why'),how=document.getElementById('how'),ring=b&&b.querySelector('#flring');
if(!b||!w||!ring||!window.matchMedia)return;
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,NS='http://www.w3.org/2000/svg',g={ok:false,dx:0,dy:0,s:1};
function mk(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);ring.appendChild(e);return e}
var prog=mk('circle',{cx:260,cy:250,r:150,pathLength:100,fill:'none',stroke:'#fff3d6','stroke-width':1.6,'stroke-dasharray':100,'stroke-dashoffset':100,transform:'rotate(-90 260 250)',opacity:0}),dots=[];
for(var i=0;i<5;i++){var a=(-160+i*35)*Math.PI/180;dots.push(mk('circle',{cx:(260+128*Math.cos(a)).toFixed(1),cy:(250+128*Math.sin(a)).toFixed(1),r:2.2,fill:'#C9A96E',opacity:0}))}
function measure(){
 var vw=innerWidth,vh=innerHeight,r=w.getBoundingClientRect().right,W=Math.min(vw-r-30,230);
 b.style.transform='';
 var o=b.getBoundingClientRect(),m=new DOMMatrix(getComputedStyle(b).transform),ok=vw>=1240&&W>=110&&o.width>0;
 if(ok){var s=W/o.width;g.s=s;g.dx=(vw+r)/2-(o.left+o.width/2)+(1-s)*m.e;g.dy=(vh-o.height*s/2)-(o.top+o.height/2)+(1-s)*m.f;g.tx=m.e;g.ty=m.f}
 g.ok=ok;window.__dock=ok;
 if(ok){b.classList.remove('gone','off');window.__noTower=false}
 upd();
}
function upd(){
 if(!g.ok){b.style.transform='';b.style.removeProperty('opacity');prog.setAttribute('opacity',0);dots.forEach(function(d){d.setAttribute('opacity',0)});return}
 var y=pageYOffset||0,vh=innerHeight,t=Math.max(0,Math.min(1,y/(vh*.8)));
 if(reduce)t=t>.5?1:0;
 var e=t*t*(3-2*t);
 b.style.transform='translate('+(g.dx*e).toFixed(1)+'px,'+(g.dy*e).toFixed(1)+'px) scale('+(1+(g.s-1)*e).toFixed(4)+') translate('+g.tx.toFixed(1)+'px,'+g.ty.toFixed(1)+'px)';
 b.style.setProperty('opacity',(.5+.3*e).toFixed(2),'important');
 var max=document.documentElement.scrollHeight-vh,p=max>0?Math.min(1,y/max):0;
 prog.setAttribute('stroke-dashoffset',(100-p*100).toFixed(1));prog.setAttribute('opacity',e.toFixed(2));
 var col=how&&how.querySelector('.hw-col'),st=col?col.querySelectorAll('.hw-step'):[],hr=how?how.getBoundingClientRect():null,vis=hr&&hr.top<vh&&hr.bottom>0?e:0;
 dots.forEach(function(d,i){var on=st[i]&&st[i].classList.contains('on');d.setAttribute('opacity',vis?(on?1:.3)*vis:0);d.setAttribute('fill',on?'#fff3d6':'#C9A96E');d.setAttribute('r',on?3.4:2.2)});
}
var q=false;function req(){if(!q){q=true;requestAnimationFrame(function(){q=false;upd()})}}
measure();addEventListener('resize',measure);addEventListener('scroll',req,{passive:true});addEventListener('load',measure);
})();
</script>
