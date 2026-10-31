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
(function(){/* right-side copy of the SAME arch (all CSS effects kept): fades in as the hero arch fades, stands in the right gutter, desktop only */
var b=document.getElementById('babel'),w=document.querySelector('section.why');
if(!b||!w||!window.matchMedia)return;
var el=document.createElement('div');el.id='archside';el.setAttribute('aria-hidden','true');
var h=b.outerHTML.replace(/ id="(fl\w+)"/g,' id="$1s"').replace(/url\(#(fl\w+)\)/g,'url(#$1s)').replace(' id="babel"','').replace('class="babel"','class="bside"').replace(/ data-d="[^"]*"/g,'');
el.innerHTML=h;document.body.appendChild(el);
var on=false,svg=el.firstChild;
function build(){
 var vw=innerWidth,r=w.getBoundingClientRect().right,gut=vw-r,W=Math.min(gut-30,230);
 on=vw>=1240&&W>=70;el.style.display=on?'block':'none';if(!on)return;
 el.style.left=((vw+r)/2-W/2).toFixed(1)+'px';el.style.width=W.toFixed(1)+'px';
 svg.setAttribute('width',W.toFixed(1));svg.setAttribute('height',(W*640/520).toFixed(1));svg.style.cssText='display:block;width:'+W.toFixed(1)+'px;height:'+(W*640/520).toFixed(1)+'px;opacity:1';
 upd();
}
function upd(){if(!on)return;var y=pageYOffset||0,o=Math.max(0,Math.min(1,(y-380)/520));el.style.opacity=(o*.5).toFixed(3)}
build();addEventListener('resize',build);addEventListener('scroll',upd,{passive:true});
})();
</script>
