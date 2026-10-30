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
  if(armed&&(y>450||opened)){armed=false;st.classList.add('on');
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
if(!b||!h)return;function pl(){if(m.matches){h.parentNode.insertBefore(b,h.nextSibling);b.setAttribute('viewBox','0 70 520 360')}else{bg.insertBefore(b,bg.firstChild);b.setAttribute('viewBox','0 0 520 640')}}
pl();m.addEventListener&&m.addEventListener('change',pl)})();
</script>
