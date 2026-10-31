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
(function(){/* right-side mini arch: appears as the hero arch fades, runs down to the bottom (desktop only) */
var b=document.getElementById('babel'),w=document.querySelector('section.why'),T=b&&b.querySelector('g[data-d="1.4"]');
if(!b||!w||!T||!window.matchMedia)return;
var NS='http://www.w3.org/2000/svg',el=document.createElement('div');el.id='archside';el.setAttribute('aria-hidden','true');document.body.appendChild(el);
var on=false;
function build(){
 var vw=innerWidth,gut=vw-w.getBoundingClientRect().right,W=Math.min(gut-30,190),top=Math.round(innerHeight*.16),H=innerHeight-top;
 on=vw>=1240&&W>=70;el.style.display=on?'block':'none';if(!on)return;
 var r=W/2,x=(vw+w.getBoundingClientRect().right)/2-W/2,k=(W-18)/460;
 el.style.cssText='display:block;left:'+x.toFixed(1)+'px;top:'+top+'px;width:'+W.toFixed(1)+'px;height:'+H+'px';
 function arc(i){var a=i,rr=r-i;return 'M'+a+' '+H+'V'+(r)+'A'+rr+' '+rr+' 0 0 1 '+(W-a)+' '+r+'V'+H}
 el.innerHTML='<svg xmlns="'+NS+'" width="'+W+'" height="'+H+'" fill="none" stroke="#C9A96E" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="flgold2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d6"/><stop offset=".18" stop-color="#C9A96E"/><stop offset="1" stop-color="#C9A96E" stop-opacity=".1"/></linearGradient></defs>'
 +'<path d="'+arc(1.5)+'" stroke="url(#flgold2)" stroke-width="2"/><path d="'+arc(7)+'" stroke="url(#flgold2)" stroke-width=".7"/>'
 +'<svg x="9" y="'+(r+6)+'" width="'+(W-18)+'" height="'+(270*k).toFixed(1)+'" viewBox="30 280 460 270" stroke-width="'+(1/k*.8).toFixed(2)+'" opacity=".8">'+T.innerHTML+'</svg></svg>';
 upd();
}
function upd(){if(!on)return;var y=pageYOffset||0,o=Math.max(0,Math.min(1,(y-380)/520));el.style.opacity=(o*.5).toFixed(3)}
build();addEventListener('resize',build);addEventListener('scroll',upd,{passive:true});
})();
</script>
