(function(){
var d=document,h=d.documentElement,EN=h.lang==='en';
h.classList.remove('nojs');h.classList.add('js');
/* mobile menu */
var bt=d.getElementById('burger'),sh=d.getElementById('sheet');
function menu(o){bt.setAttribute('aria-expanded',o);sh.classList.toggle('open',o);d.body.classList.toggle('lock',o);bt.setAttribute('aria-label',o?(EN?'Close menu':'Κλείσιμο μενού'):(EN?'Open menu':'Άνοιγμα μενού'))}
if(bt){bt.addEventListener('click',function(){menu(bt.getAttribute('aria-expanded')!=='true')});
 sh.addEventListener('click',function(e){if(e.target.closest('a'))menu(false)});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'&&sh.classList.contains('open')){menu(false);bt.focus()}});
 var mq=matchMedia('(min-width:1280px)'),wide=function(e){if(e.matches)menu(false)};mq.addEventListener?mq.addEventListener('change',wide):mq.addListener(wide)}
/* section headings rise word by word as they come into view (plain-text headings only; the label keeps them whole for screen readers) */
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)[].forEach.call(d.querySelectorAll('.rv .h2'),function(h){if(h.childElementCount)return;var s=h.textContent.trim();h.setAttribute('aria-label',s);
 h.innerHTML=s.split(/\s+/).map(function(w,i){return '<span class="w" aria-hidden="true" style="--i:'+i+'">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ')});
/* hero headline: each word sits in a mask and rises with its line when the cube locks (cube.js adds .hero-go);
   the text stays real text, nothing is hidden without JavaScript, and a timer reveals it if the cube never locks */
var hh=d.querySelector('.hero .h1');if(hh&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 (function wrap(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===1)return wrap(c);if(c.nodeType!==3)return;var f=d.createDocumentFragment();
  c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(d.createTextNode(w));return}var o=d.createElement('span'),i=d.createElement('span');o.className='ln';i.textContent=w;o.appendChild(i);f.appendChild(o)});
  n.replaceChild(f,c)})})(hh);
 var top=null,ln=-1;[].forEach.call(hh.querySelectorAll('.ln'),function(w){var y=w.getBoundingClientRect().top;if(top===null||Math.abs(y-top)>4){top=y;ln++}w.style.setProperty('--i',ln)});
 hh.classList.add('hl');setTimeout(function(){d.documentElement.classList.add('hero-go')},3200)}
/* reveal */
var rv=[].slice.call(d.querySelectorAll('.rv,.reveal-img'));
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});rv.forEach(function(n){io.observe(n)})}else rv.forEach(function(n){n.classList.add('in')});
/* process tabs + animated steps */
var tabs=[].slice.call(d.querySelectorAll('[role=tab]')),panels=[].slice.call(d.querySelectorAll('.panel'));
function pick(t){tabs.forEach(function(x){x.setAttribute('aria-selected',x===t)});panels.forEach(function(p){p.hidden=p.id!==t.getAttribute('aria-controls')});anim()}
tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(t)});t.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;if(n===null)return;n=(n+tabs.length)%tabs.length;tabs[n].focus();pick(tabs[n]);e.preventDefault()})});
/* steps follow the scroll: the line fills and each step lights as the reader moves through the section (all lit under reduced motion) */
var still=matchMedia('(prefers-reduced-motion:reduce)').matches,sq=false;
function anim(){sq=false;var p=panels.filter(function(x){return !x.hidden})[0],s=p&&p.querySelector('.steps');if(!s)return;var r=s.getBoundingClientRect(),v=innerHeight,k=still?1:Math.max(0,Math.min(1,(v*.85-r.top)/(v*.5)));
 s.style.setProperty('--p',k.toFixed(3));[].forEach.call(s.children,function(l,n,a){l.classList.toggle('on',k>=n/(a.length-1)-.001)})}
addEventListener('scroll',function(){if(!sq){sq=true;requestAnimationFrame(anim)}},{passive:true});
anim();
/* contact form: honest hand-off to WhatsApp / email (no backend) */
var f=d.getElementById('leadform');
if(f){var WA='306981862732',MAIL='athens.digitalframe@gmail.com';
 var T=EN?{n:'Please add your full name.',b:'Please add your business name.',c:'Please enter a valid email address.',p:'Please enter a valid phone number (at least 8 digits).',busy:'Preparing…',sendLbl:f.querySelector('[type=submit]').textContent,
  okwa:'WhatsApp opened with your message. Press send there: we receive nothing until you do.',okml:'Your email app opened with your message. Press send there: we receive nothing until you do.',
  block:'Your browser blocked the window. Open WhatsApp manually:',fix:'Please fix the highlighted fields.',hi:'Hello! I would like a free demo.',nm:'Name',bz:'Business',ct:'Category',pm:'Preferred contact',nt:'Note',call:'Phone call',subj:'Free demo request'}
 :{n:'Γράψε το ονοματεπώνυμό σου.',b:'Γράψε το όνομα της επιχείρησής σου.',c:'Γράψε ένα έγκυρο email.',p:'Γράψε ένα έγκυρο τηλέφωνο (τουλάχιστον 8 ψηφία).',busy:'Ετοιμάζεται…',sendLbl:f.querySelector('[type=submit]').textContent,
  okwa:'Άνοιξε το WhatsApp με το μήνυμά σου. Πάτα αποστολή εκεί: δεν λαμβάνουμε τίποτα μέχρι να το κάνεις.',okml:'Άνοιξε η εφαρμογή email με το μήνυμά σου. Πάτα αποστολή εκεί: δεν λαμβάνουμε τίποτα μέχρι να το κάνεις.',
  block:'Ο browser μπλόκαρε το παράθυρο. Άνοιξε το WhatsApp χειροκίνητα:',fix:'Διόρθωσε τα επισημασμένα πεδία.',hi:'Γεια σας! Θέλω ένα δωρεάν demo.',nm:'Όνομα',bz:'Επιχείρηση',ct:'Κατηγορία',pm:'Προτιμώμενη επικοινωνία',nt:'Σημείωση',call:'Τηλεφωνική κλήση',subj:'Αίτημα για δωρεάν demo'};
 var st=f.querySelector('.status'),btn=f.querySelector('[type=submit]'),mail=d.getElementById('lf-mail');
 var $=function(id){return d.getElementById(id)};
 function method(){return f.querySelector('input[name=m]:checked').value}
 f.addEventListener('change',function(e){if(e.target.name==='m'){var v=method(),c=$('lf-c');c.type=v==='email'?'email':'tel';c.setAttribute('inputmode',v==='email'?'email':'tel');c.autocomplete=v==='email'?'email':'tel';
  $('lf-c-l').textContent=v==='email'?(EN?'Email':'Email'):(EN?'Phone number':'Τηλέφωνο')}});
 function setE(id,msg){var i=$(id),e=$(id+'-e');if(msg){i.setAttribute('aria-invalid','true');e.textContent=msg}else{i.removeAttribute('aria-invalid');e.textContent=''}return !msg}
 function val(){var ok=true,v=method(),c=$('lf-c').value.trim();
  ok=setE('lf-n',$('lf-n').value.trim().length<2?T.n:'')&ok;
  ok=setE('lf-b',$('lf-b').value.trim().length<2?T.b:'')&ok;
  ok=setE('lf-c',v==='email'?(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)?'':T.c):(c.replace(/\D/g,'').length<8?T.p:''))&ok;
  if(!ok){st.hidden=false;st.className='status bad';st.textContent=T.fix;var bad=f.querySelector('[aria-invalid=true]');if(bad)bad.focus()}return ok}
 function msg(){var v=method(),cat=$('lf-k').value,note=$('lf-d').value.trim();
  return T.hi+'\n'+T.nm+': '+$('lf-n').value.trim()+'\n'+T.bz+': '+$('lf-b').value.trim()+(cat?'\n'+T.ct+': '+cat:'')+'\n'+T.pm+': '+(v==='phone'?T.call:v==='email'?'Email':'WhatsApp')+' ('+$('lf-c').value.trim()+')'+(note?'\n'+T.nt+': '+note:'')}
 function ev(n){if(window.va){try{window.va('event',{name:n})}catch(x){}}}
 function go(kind){if(!val())return;btn.disabled=true;btn.setAttribute('aria-busy','true');btn.textContent=T.busy;st.hidden=true;
  var m=msg();setTimeout(function(){
   if(kind==='mail'){ev('form_email');location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(T.subj)+'&body='+encodeURIComponent(m);st.className='status';st.textContent=T.okml;st.hidden=false}
   else{ev('form_whatsapp');var u='https://wa.me/'+WA+'?text='+encodeURIComponent(m),w=window.open(u,'_blank');if(w){try{w.opener=null}catch(x){}}
    if(!w){st.className='status bad';st.textContent=T.block+' ';var a=d.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';a.textContent='wa.me/'+WA;st.appendChild(a)}else{st.className='status';st.textContent=T.okwa}st.hidden=false}
   btn.disabled=false;btn.removeAttribute('aria-busy');btn.textContent=T.sendLbl},250)}
 f.addEventListener('submit',function(e){e.preventDefault();go(method()==='email'?'mail':'wa')});
 if(mail)mail.addEventListener('click',function(){go('mail')});
}

/* header glass + reading progress; hero light follows the pointer (desktop, motion allowed) */
(function(){var hd=d.querySelector('.hd'),pg=hd&&hd.querySelector('.pg'),t=false;if(!hd)return;
function u(){t=false;var y=pageYOffset||0,m=h.scrollHeight-innerHeight;hd.classList.toggle('sc',y>8);if(pg)pg.style.transform='scaleX('+(m>0?Math.min(1,y/m):0).toFixed(4)+')'}
addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});u();
var hero=d.querySelector('.hero');
if(hero&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){var q=false,px=0,py=0;
 hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;if(!q){q=true;requestAnimationFrame(function(){q=false;hero.style.setProperty('--lx',(px*-42).toFixed(1)+'px');hero.style.setProperty('--ly',(py*-30).toFixed(1)+'px')})}},{passive:true})}
})();

/* scroll-spy: mark the nav link of the section in view */
(function(){var links=[].slice.call(d.querySelectorAll('.nav a[href*="#"]'));if(!links.length||!('IntersectionObserver' in window))return;
var map={};links.forEach(function(a){var id=a.getAttribute('href').split('#')[1];var s=id&&d.getElementById(id);if(s&&a.pathname===location.pathname)map[id]=a});
var ids=Object.keys(map);if(!ids.length)return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.removeAttribute('aria-current')});if(map[e.target.id])map[e.target.id].setAttribute('aria-current','true')}})},{rootMargin:'-45% 0px -50% 0px'});
[].forEach.call(d.querySelectorAll('section[id]'),function(x){io.observe(x)});   /* sections without a nav link (FAQ) clear the mark */
addEventListener('scroll',function(){if((pageYOffset||0)<200)links.forEach(function(a){a.removeAttribute('aria-current')})},{passive:true})})();
/* magnetic primary buttons: lean a few px toward a fine pointer (transform only, off under reduced motion) */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches)[].forEach.call(d.querySelectorAll('.btn.gold'),function(b){
 b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.setProperty('--mx',(((e.clientX-r.left)/r.width-.5)*8).toFixed(1)+'px');b.style.setProperty('--my',(((e.clientY-r.top)/r.height-.5)*6).toFixed(1)+'px')});
 b.addEventListener('pointerleave',function(){b.style.removeProperty('--mx');b.style.removeProperty('--my')})});
/* FAQ group filter (without JS every group shows) */
var fb=[].slice.call(d.querySelectorAll('.fq-tabs button')),fc=[].slice.call(d.querySelectorAll('.fcat'));
fb.forEach(function(b){b.addEventListener('click',function(){var c=b.getAttribute('data-cat');fb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});fc.forEach(function(g){g.hidden=c!=='all'&&g.getAttribute('data-cat')!==c})})});
var y=d.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
})();
