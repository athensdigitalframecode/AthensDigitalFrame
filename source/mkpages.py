import re,json
P=open('prices_v46_backup.html',encoding='utf-8').read()
# ---------- ambient sound removed (button + audio script)
_m=re.search(r'<button class="snd" id="snd".*?</button>\n?',P,re.S);assert _m;P=P.replace(_m.group(0),'')
_i=P.index("var btn=document.getElementById('snd')");_s=P.rindex('<script>',0,_i);_e=P.index('</script>',_i)+len('</script>');P=P[:_s]+P[_e:].lstrip('\n')
assert "id=\"snd\"" not in P and 'AudioContext' not in P

# ---------- extra translations (home + shared)
EXTRA={
'Αρχική':'Home','Υπηρεσίες':'Services','Τιμές':'Prices',
'Ένα μικρό στούντιο στην Αθήνα. Ξεκάθαρες τιμές, χωρίς κρυφά κόστη και δωρεάν demo πριν πληρώσεις.':'A small studio in Athens. Clear prices, no hidden costs, and a free demo before you pay.',
'Δες όλες τις τιμές →':'See all prices →',
'Τι κάνουμε':'What we do','Δύο τρόποι να βρεθείς online':'Two ways to get online',
'Ιστοσελίδα για την επιχείρησή σου':'A website for your business',
'Γρήγορη, όμορφη και φτιαγμένη πρώτα για κινητά. Με φόρμα επικοινωνίας, Google Maps και βασικό τοπικό SEO.':'Fast, good-looking and built mobile-first. With a contact form, Google Maps and basic local SEO.',
'Κατασκευή':'Build','από 300€':'from 300€','από 200–300€':'from 200–300€',
'Δες περισσότερα →':'Learn more →',
'E-shop χωρίς μεγάλο κόστος στην αρχή':'An e-shop without a big upfront cost',
'Πουλάς online με κάρτα, αντικαταβολή και ελληνικές αποστολές, χωρίς να πληρώσεις 2.000€ μπροστά.':'Sell online with cards, cash on delivery and Greek shipping, without paying 2,000€ upfront.',
'Γιατί εμείς':'Why us','Γιατί να μας διαλέξεις':'Why choose us',
'Live σε 3–5 ημέρες':'Live in 3–5 days',
'Ξεκάθαρες τιμές, χωρίς κρυφά κόστη':'Clear prices, no hidden costs',
'Σχεδιασμός πρώτα για κινητά':'Designed for phones first',
'Μικρό στούντιο στην Αθήνα, μιλάς απευθείας με εμάς':'A small studio in Athens, you talk directly to us',
'Δωρεάν demo πριν πληρώσεις':'Free demo before you pay',
'Μενού':'Menu','Ιστοσελίδες από 300€':'Websites from 300€','E-shop από 200€':'E-shops from 200€','Τιμές & Υπηρεσίες':'Prices & Services','Ιστοσελίδες από 300€ · E-shop από 200€':'Websites from 300€ · E-shops from 200€',
'DM, WhatsApp, τηλέφωνο, email':'DM, WhatsApp, phone, email','Έργα':'Our work','Τα πρώτα μας έργα':'Our first projects',
'Για εμάς':'About us','Κάποτε, ένας πύργος έμεινε ημιτελής, γιατί οι άνθρωποι δεν κατάλαβαν ο ένας τη γλώσσα του άλλου.':'Once, a tower was left unfinished, because people could not understand each other\'s language.','Σήμερα χτίζουμε ξανά.':'Today we build again.','Ένα site που μιλά τη γλώσσα των πελατών σου και ένα e-shop που πουλάει όσο κοιμάσαι.':'A site that speaks your customers\' language and an e-shop that sells while you sleep.','Η ομάδα πίσω από το στούντιο':'The people behind the studio','Σύντομα':'Coming soon',
}
def inject_extra(html):
    return html.replace(';\nvar q=/[?&]lang',';Object.assign(T,'+json.dumps(EXTRA,ensure_ascii=False)+');\nvar q=/[?&]lang',1)
assert ';\nvar q=/[?&]lang' in P

# ---------- prices page: nav + footer back link
pr=P.replace('<a href="#how-sec">Διαδικασία</a>','<a href="index.html" class="homechip">Αρχική</a>',1)
assert 'homechip' in pr
pr=pr.replace('<footer>','<footer><a class="homelink" href="index.html">← Αρχική</a><br>',1)
pr=pr.replace('<button class="snd lang" id="lang"','<a class="snd back" href="index.html" aria-label="Αρχική" title="Αρχική"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></a>\n<button class="snd lang" id="lang"',1)
assert 'snd back' in pr
pr=inject_extra(pr)

css_hide = "<style>.snd{transition:opacity .35s ease,transform .35s ease,background .2s,border-color .2s}.snd.away{opacity:0;transform:translateY(-10px);pointer-events:none}</style>\n"
js_hide = """<script>(function(){var s=[].slice.call(document.querySelectorAll('.snd')),l=0;function f(){var y=window.pageYOffset||document.documentElement.scrollTop||0;if(y>l+4&&y>90)s.forEach(function(b){b.classList.add('away')});else if(y<l-4||y<=90)s.forEach(function(b){b.classList.remove('away')});l=y}window.addEventListener('scroll',f,{passive:true})})();</script>
"""
css_hide=css_hide+'<style>'+open('premium_css.txt',encoding='utf-8').read()+open('polish_css.txt',encoding='utf-8').read()+'</style>\n'
_k=pr.rindex('</style>')+len('</style>');pr=pr[:_k]+'\n'+css_hide+pr[_k:]
pr=pr.rstrip()+'\n'+js_hide+'\n'+open('reveal.js',encoding='utf-8').read()

# ---------- home page
m=re.search(r'<main>.*?</main>',P,flags=re.S); main=m.group(0)
hero=re.search(r'<header class="hero">.*?</header>',main,flags=re.S).group(0)
how=re.search(r'<section class="how".*?</section>',main,flags=re.S).group(0)
guar=re.search(r'<section class="guar".*?</section>',main,flags=re.S).group(0)
contact=re.search(r'<section class="contact".*?</section>',main,flags=re.S).group(0)
foot=re.search(r'<footer>.*?</footer>',main,flags=re.S).group(0)
hero=re.sub(r'\s*<p class="lead">Live σε 3–5 ημέρες\. Ξεκάθαρες τιμές, χωρίς κρυφά κόστη\.</p>','',hero)
# hero tweaks
hero=hero.replace('href="#site-sec"','href="prices.html#site-sec"').replace('href="#eshop-sec"','href="prices.html#eshop-sec"')
lead='<p class="lead">Ένα μικρό στούντιο στην Αθήνα. Ξεκάθαρες τιμές, χωρίς κρυφά κόστη και δωρεάν demo πριν πληρώσεις.</p>\n    <p class="seeall"><a href="prices.html">Δες όλες τις τιμές →</a></p>'
# hero currently has no lead (removed earlier) -> place after typed
i=hero.index('</p>',hero.index('class="typed"'))+4
hero=hero[:i]+'\n    '+lead+hero[i:]
if 'class="lead"' in P[P.index('<header class="hero">'):P.index('</header>')]:
    pass
web='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>'
bag='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>'
nav='<nav class="jump" aria-label="Μενού"><a href="#svc-sec">Υπηρεσίες</a><a href="#how-sec">Διαδικασία</a><a href="prices.html">Τιμές</a><a href="#contact-sec">Επικοινωνία</a></nav>'
svc=f'''<section class="s-site svc" id="svc-sec" aria-labelledby="svc1">
    <p class="eyebrow">{web}Ιστοσελίδες</p>
    <h2 id="svc1">Ιστοσελίδα για την επιχείρησή σου</h2>
    <p class="for">Γρήγορη, όμορφη και φτιαγμένη πρώτα για κινητά. Με φόρμα επικοινωνίας, Google Maps και βασικό τοπικό SEO.</p>
    <div class="price-row"><span>Κατασκευή</span><span class="price">από 300€</span></div>
    <a class="more" href="prices.html#site-sec">Δες περισσότερα →</a>
  </section>

  <section class="s-shop svc" aria-labelledby="svc2">
    <p class="eyebrow">{bag}E-shop</p>
    <h2 id="svc2">E-shop χωρίς μεγάλο κόστος στην αρχή</h2>
    <p class="for">Πουλάς online με κάρτα, αντικαταβολή και ελληνικές αποστολές, χωρίς να πληρώσεις 2.000€ μπροστά.</p>
    <div class="price-row"><span>Εγκατάσταση</span><span class="price">από 200–300€</span></div>
    <a class="more" href="prices.html#eshop-sec">Δες περισσότερα →</a>
  </section>

  <section class="why" aria-labelledby="whyh">
    <p class="eyebrow">Γιατί εμείς</p>
    <h2 id="whyh">Γιατί να μας διαλέξεις</h2>
    <ul class="list">
      <li>Live σε 3–5 ημέρες</li>
      <li>Ξεκάθαρες τιμές, χωρίς κρυφά κόστη</li>
      <li>Σχεδιασμός πρώτα για κινητά</li>
      <li>Μικρό στούντιο στην Αθήνα, μιλάς απευθείας με εμάς</li>
      <li>Δωρεάν demo πριν πληρώσεις</li>
    </ul>
  </section>'''
tiles='''<p class="eyebrow menuhead">Μενού</p>
  <nav class="tiles" aria-label="Μενού">
    <a class="tile" href="prices.html"><span class="ti">__PRICE__</span><span class="tt"><strong>Τιμές &amp; Υπηρεσίες</strong><em>Ιστοσελίδες από 300€<br>E-shop από 200€ <span style="white-space:nowrap">+ 30€/μήνα</span></em></span><span class="go" aria-hidden="true">→</span></a>
    <a class="tile" href="#contact-sec"><span class="ti">__CHAT__</span><span class="tt"><strong>Επικοινωνία</strong><em>DM, WhatsApp, τηλέφωνο, email</em></span><span class="go" aria-hidden="true">→</span></a>
  </nav>'''
ic=lambda d:'<svg viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'
tiles=tiles.replace('__PRICE__',ic('<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.4"/>')).replace('__CHAT__',ic('<path d="M4 5h16v11H9l-5 4z"/>')).replace('__WORK__',ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6"/>')).replace('__ABOUT__',ic('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14c3 0 5 1.6 5 5"/>'))
why='''<section class="why" aria-labelledby="whyh">
    <p class="eyebrow">Γιατί εμείς</p>
    <h2 id="whyh">Γιατί να μας διαλέξεις</h2>
    <ul class="list">
      <li>Live σε 3–5 ημέρες</li>
      <li>Ξεκάθαρες τιμές, χωρίς κρυφά κόστη</li>
      <li>Σχεδιασμός πρώτα για κινητά</li>
      <li>Μικρό στούντιο στην Αθήνα, μιλάς απευθείας με εμάς</li>
      <li>Δωρεάν demo πριν πληρώσεις</li>
    </ul>
  </section>'''
# hub hero: no price cards, no seeall
import re as _re
hero=_re.sub(r'\s*<div class="qp">.*?</div>','',hero,count=1,flags=_re.S)
hero=_re.sub(r'\s*<p class="seeall">.*?</p>','',hero,count=1,flags=_re.S)
newmain='<main>\n  '+hero+'\n  '+tiles+'\n\n  '+why+'\n\n  '+contact+'\n\n  '+foot+'\n</main>'
home=P.replace(m.group(0),newmain,1)
# tower removed: no #babel element
home=home.replace('<h1>','</header>\n  <header class="hero herotxt">\n    <h1>',1)
import re as _re
_lead=_re.search(r'\s*<p class="lead">.*?</p>',home,flags=_re.S).group(0)
home=home.replace(_lead,'',1)

import re as _r2
from newbg import HTML as _NB,CSS as _NC
_i=home.index('<div class="bg"')
_d=0
for _m in _r2.finditer(r'<div\b|</div>',home[_i:]):
    _d+=1 if _m.group(0)=='<div' else -1
    if _d==0:_e=_i+_m.end();break
_blk=home[_i:_e]
_blk=_r2.sub(r'\s*<svg class="px (?:ob|wf).*?</svg>','',_blk,flags=_r2.S)
_blk=_blk.replace('<span class="px neb n2" data-s=".16"></span>','<span class="px neb n2" data-s=".16"></span>\n  <i class="mist m1"></i><i class="mist m2"></i><i class="mist m3"></i>\n  '+_NB,1)
home=home[:_i]+_blk+home[_e:]
assert 'k-fr1' in home
home=inject_extra(home)
css_home='''/* home hub */
.hero .lead{display:block;max-width:34ch;margin:0 auto 6px;font-size:15px}
.menuhead{margin:6px 2px -8px}
.tiles{display:grid;gap:12px}
.tile{display:flex;align-items:center;gap:14px;padding:18px 18px;border:1px solid rgba(201,169,110,.35);border-radius:18px;text-decoration:none;color:var(--cream);
  background:linear-gradient(180deg,rgba(26,24,19,.88),rgba(20,20,17,.88));-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);-webkit-tap-highlight-color:transparent;transition:border-color .25s,box-shadow .25s,transform .15s}
.tile .ti{flex:none;width:46px;height:46px;border-radius:14px;border:1px solid rgba(201,169,110,.45);display:grid;place-items:center;background:rgba(201,169,110,.08)}
.tile .ti svg{width:24px;height:24px;fill:none;stroke:var(--gold);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.tile .tt{flex:1;min-width:0;display:grid;gap:2px}
.tile strong{font-family:var(--display);font-size:20px;font-weight:600}
.tile em{font-style:normal;color:var(--muted);font-size:14px}
.tile .go{color:var(--gold);font-size:20px;transition:transform .25s}
a.tile:hover,a.tile:focus-visible,a.tile:active{border-color:var(--gold);box-shadow:0 0 22px rgba(201,169,110,.4),inset 0 0 14px rgba(201,169,110,.08)}
a.tile:active{transform:scale(.985)}
a.tile:hover .go{transform:translateX(4px)}
.tile.soon{opacity:.6;border-style:dashed;border-color:rgba(201,169,110,.28)}
.tile .ti{display:none}.tile strong{font-size:18px}.tile em{font-size:13px}
.babel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:.7;pointer-events:none}
.menuhead,.tiles{max-width:236px;margin-left:0;margin-right:auto;text-align:left}
.hero,main>section:first-of-type{text-align:left}
.hero{max-width:none;padding-top:44px;text-align:center}.hero .logo{margin:0 auto}.hero .brand{text-align:center}
.herotxt{max-width:300px;margin-right:auto;padding-top:0;text-align:left;margin-top:-18px}.herotxt::before{display:none}.herotxt .typed{font-size:18px;min-height:56px}.herotxt h1{font-size:28px;line-height:1.2}.herotxt .lead{font-size:15.5px;margin-left:0;max-width:none}
_NEWBG_CSS_

/* perf: compositor-only animations, contained background */
.bg{contain:layout paint}
.bg .neb{filter:none!important}
.bg .stars,.bg .px,.mist,#babel{will-change:transform}
@keyframes shimmer{0%,60%{transform:translateX(0) skewX(-20deg)}100%{transform:translateX(450%) skewX(-20deg)}}
.btn:not(.ghost)::after{left:-60%!important}
.hero::before{display:none!important}
.mist{position:absolute;left:-35%;width:170%;height:200px;pointer-events:none;background:radial-gradient(closest-side,rgba(201,169,110,.075),rgba(201,169,110,0));animation:mistmv 46s ease-in-out infinite alternate}
.mist.m1{top:30%}.mist.m2{top:62%;animation-duration:58s;animation-direction:alternate-reverse;height:240px}.mist.m3{top:84%;animation-duration:70s}
@keyframes mistmv{from{transform:translateX(-9%)}to{transform:translateX(9%)}}
.bg::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 48%,rgba(0,0,0,0) 42%,rgba(0,0,0,.6) 100%)}
.bg::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(0deg,rgba(201,169,110,.09),rgba(201,169,110,0) 26%)}
@media (prefers-reduced-motion:reduce){.mist{animation:none}}
.hero:not(.herotxt){overflow:visible!important}
#stage{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(88px + env(safe-area-inset-bottom,0px));width:min(300px,calc(100vw - 24px));z-index:5;text-align:center;opacity:0;pointer-events:none;padding:16px 16px 12px;border-radius:18px;background:rgba(10,10,10,.95);border:1px solid rgba(201,169,110,.35);transform:translateY(18px) scale(.94);transform-origin:100% 100%;transition:opacity .9s ease,transform 1s cubic-bezier(.2,.8,.2,1)}
#stage.on{opacity:1;transform:none}
#stage .stxt{font-family:'Noto Serif Display','Noto Serif',serif;font-style:italic;font-size:14.5px;line-height:1.5;color:#E9DFC8;margin:0 0 12px}
#stage .stxt h4{margin:0 0 9px;font-family:'Marcellus','Noto Serif',serif;font-style:normal;font-weight:400;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#D9BE86;display:flex;align-items:center;gap:8px}
#stage .stxt h4::before,#stage .stxt h4::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,169,110,.6))}
#stage .stxt h4::after{transform:scaleX(-1)}
#stage .stxt p{margin:0 0 7px}
#stage .stxt strong{font-style:normal;font-weight:500;letter-spacing:.03em;color:#D9BE86}
#stage img{width:64px;height:auto;display:block;margin:0 auto 6px;filter:drop-shadow(0 0 12px rgba(201,169,110,.4))}
#stagename{display:block;font-family:'Marcellus','Noto Serif',serif;font-weight:400;font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;white-space:nowrap;color:#D9BE86}
#stage.mini .stxt{display:none}#stage.mini{width:auto;padding:10px 16px 8px}#stage.mini img{width:46px;margin-bottom:4px}#stage.mini #stagename{font-size:9.5px}
#stage{transition:opacity .9s ease,transform 1s cubic-bezier(.2,.8,.2,1),width .4s ease}
.snd{transition:opacity .35s ease,transform .35s ease,background .2s,border-color .2s}.snd.away{opacity:0;transform:translateY(-10px);pointer-events:none}
@media (max-width:699px){#stage.on{pointer-events:auto;cursor:pointer}.herotxt h1,.herotxt .typed{text-shadow:0 0 14px #000,0 0 5px #000}.babel{opacity:.5}#stage .stxt{font-size:13.5px;line-height:1.45}}
@media (min-width:700px){#stage{bottom:100px;right:34px;width:360px}#stage .stxt{font-size:17px}#stage img{width:90px}#stagename{font-size:13px}}}
.toplead{text-align:center;max-width:350px;margin:50px auto 0!important;font-size:12.5px!important;line-height:1.45;color:var(--muted)}
@media (min-width:700px){.toplead{position:absolute;top:46px;left:calc(100vw - max(21px,5vw) - 29px - 34px - 320px);width:320px;max-width:320px;margin:0!important;text-align:right;font-size:15px!important}}
.hero:not(.herotxt) .brand{margin-top:9px!important;display:flex;align-items:center;justify-content:center;gap:0;font-family:'Marcellus','Noto Serif',serif;font-size:clamp(11px,3.6vw,14px)!important;font-weight:400;letter-spacing:.2em!important;text-transform:uppercase;white-space:nowrap;color:#D9BE86;-webkit-text-fill-color:initial;background:none;text-shadow:0 0 14px rgba(201,169,110,.35)}
.brand .bl{display:inline-block;opacity:0;transform:translateY(16px) scale(.8);filter:blur(7px);animation:brin .8s cubic-bezier(.2,.9,.25,1) forwards;animation-delay:calc(.35s + var(--i)*.055s)}
.brand .bsp{display:inline-block;width:.55em}
.hero:not(.herotxt) .brand{gap:0}
@keyframes brin{to{opacity:1;transform:none;filter:blur(0)}}
@keyframes bwave{0%,100%{opacity:0}50%{opacity:1}}.brand .bl{position:relative;color:#D9BE86;text-shadow:0 0 14px rgba(201,169,110,.35)}.brand .bl::after{content:attr(data-t);position:absolute;left:0;top:0;color:#FFF1CF;text-shadow:0 0 16px rgba(241,221,176,.8);opacity:0;animation:bwave 3.2s ease-in-out infinite;animation-delay:calc(2.4s + var(--i)*.09s);pointer-events:none}
@media (prefers-reduced-motion:reduce){.brand .bl{animation:none;opacity:1;transform:none;filter:none}}
.hero:not(.herotxt) .brand::before,.hero:not(.herotxt) .brand::after{content:"";flex:none;width:14px;margin:0 8px;height:1px;background:linear-gradient(90deg,transparent,#C9A96E);-webkit-text-fill-color:initial}
.hero:not(.herotxt) .brand::after{transform:scaleX(-1)}
@media (min-width:700px){.hero:not(.herotxt) .brand{font-size:21px!important}.hero:not(.herotxt) .brand::before,.hero:not(.herotxt) .brand::after{width:34px}}
@media (min-width:700px){.hero:not(.herotxt){position:absolute;top:12px;left:calc(50vw - max(21px,5vw) - 29px);animation:none;transform:none;margin:0 0 0 -160px;width:320px;padding-top:0}.herotxt{margin-top:10px}}
.snd.lang{left:auto;right:calc(max(34px,calc(env(safe-area-inset-right,0px) + 20px)))}
.tile{padding:14px 12px;gap:10px;background:linear-gradient(180deg,rgba(26,24,19,.58),rgba(20,20,17,.58));-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}
@media (min-width:900px){main{margin-left:max(21px,5vw);margin-right:auto;max-width:430px}}
.tile .badge{flex:none;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-soft);border:1px solid rgba(201,169,110,.45);border-radius:999px;padding:4px 10px}
.tile{opacity:0;animation:tin .6s cubic-bezier(.2,.7,.2,1) forwards}
.tile.soon{animation-name:tin2}
.tiles .tile:nth-child(1){animation-delay:.1s}.tiles .tile:nth-child(2){animation-delay:.2s}.tiles .tile:nth-child(3){animation-delay:.3s}.tiles .tile:nth-child(4){animation-delay:.4s}
@keyframes tin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes tin2{from{opacity:0;transform:translateY(12px)}to{opacity:.6;transform:none}}
@media (prefers-reduced-motion:reduce){.tile{animation:none;opacity:1}.tile.soon{opacity:.6}}
'''
css_prices='''.homelink{color:var(--gold-soft);text-decoration:none;font-weight:600;display:inline-block;margin-bottom:10px}
.snd.back{right:auto;left:max(88px,calc(env(safe-area-inset-left,0px) + 74px));padding:8px 11px;display:flex;align-items:center;text-decoration:none}
'''
css_fade='''*,*::before,*::after{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
.tile{background:linear-gradient(180deg,rgba(26,24,19,.82),rgba(20,20,17,.82))!important}
html{animation:pgin .45s ease both}
@keyframes pgin{from{opacity:0}to{opacity:1}}
html.leaving{opacity:0;transition:opacity .28s ease}
@media (prefers-reduced-motion:reduce){html{animation:none}html.leaving{transition:none}}
'''
fade_js='''<script>
(function(){
try{history.scrollRestoration='manual'}catch(e){}
if(!location.hash){window.scrollTo({top:0,left:0,behavior:'instant'})}
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target)return;
  var h=a.getAttribute('href');
  if(!h||/^(https?:|mailto:|tel:|#|javascript:)/i.test(h)||h.charAt(0)==='#')return;
  e.preventDefault();document.documentElement.classList.add('leaving');
  setTimeout(function(){location.href=a.href},260);
});
window.addEventListener('pageshow',function(ev){if(ev.persisted){document.documentElement.classList.remove('leaving');if(!location.hash)window.scrollTo({top:0,left:0,behavior:'instant'})}});
})();
</script>'''
for name,h,css in (('home',home,css_home),('prices',pr,css_prices)):
    k=h.rindex('</style>'); h=h[:k]+css.replace('_NEWBG_CSS_',_NC if name=='home' else '')+css_fade+h[k:]
    h=h.replace('<p class="brand">Athens DigitalFrame</p>','<p class="brand">Athens Digital Frame</p>')
    h=h.rstrip()+'\n'+fade_js+'\n'
    if name=='home':
        _how=open('how.html',encoding='utf-8').read()
        assert '<section class="contact"' in h
        h=h.replace('<section class="contact"',_how+'\n\n  '+open('portfolio.html',encoding='utf-8').read()+'\n\n  '+open('faq.html',encoding='utf-8').read()+'\n\n  <section class="contact"',1)
        _tile='<a class="tile" id="hwtile" href="#how"><span class="ti"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="6" cy="19" r="2"/><path d="M11 5h9M11 12h9M11 19h9"/></svg></span><span class="tt"><strong>Πώς δουλεύουμε</strong><em>Από το brief ως το live, βήμα βήμα</em></span><span class="go" aria-hidden="true">→</span></a>'
        _k=h.index('<a class="tile" href="#contact-sec"')
        _tile2='<a class="tile" id="pftile" href="#portfolio"><span class="ti"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 3-2 6 4"/></svg></span><span class="tt"><strong>Portfolio</strong><em>Έρχεται σύντομα</em></span><span class="go" aria-hidden="true">→</span></a>'
        h=h[:_k]+_tile+'\n    '+_tile2+'\n    '+h[_k:]
        k=h.rindex('</style>');h=h[:k]+open('how_css.txt',encoding='utf-8').read()+open('pf_css.txt',encoding='utf-8').read()+open('faq_css.txt',encoding='utf-8').read()+h[k:]
        h=h.rstrip()+'\n'+open('how.js',encoding='utf-8').read()+'\n'
        _f=open('form.html',encoding='utf-8').read()
        assert '<div class="actions">' in h
        h=h.replace('<div class="actions">',_f+'\n    <div class="actions">',1)
        _pre='<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        assert _pre in h
        h=h.replace(_pre,_pre+'<script>document.documentElement.classList.add("fgate");(function(){function d(){document.documentElement.classList.remove("fgate")}setTimeout(d,1400);try{document.fonts.ready.then(d)}catch(e){d()}})()</script>',1)
        h=h.replace('<link rel="stylesheet" href="https://fonts.googleapis.com/css2','<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Noto+Serif:wght@500;600&family=Marcellus&family=Noto+Serif+Display:ital,wght@1,400&family=Noto+Serif+Display:wght@500&display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2',1)
        k=h.rindex('</style>');h=h[:k]+open('extra_css.txt',encoding='utf-8').read()+open('premium_css.txt',encoding='utf-8').read()+open('polish_css.txt',encoding='utf-8').read()+h[k:]
        h=h.rstrip()+'\n'+open('form.js',encoding='utf-8').read()+'\n'+open('reveal.js',encoding='utf-8').read()+'\n'
        h=h.replace('px.forEach(function(e){','if(!reduce)px.forEach(function(e){',1).replace('draw(y+ex,now-t0);','draw(y+ex,reduce?0:now-t0);',1)
        h=h.replace('function frame(now){\n  var diff=target-cur;','function frame(now){\n  var ex=window.__ex||0;var diff=target-cur;',1)
        h=h.replace('m.style.backgroundPositionY=(-y*.4).toFixed(1)','m.style.backgroundPositionY=(-(y+ex)*.4).toFixed(1)',1).replace('draw(y,now-t0);','draw(y+ex,now-t0);',1)
        o1="var y=cur,max=Math.max(1,docH()-H),p=Math.min(1,y/max);"
        n1="if(!window.__dhT||now-window.__dhT>500){window.__dhT=now;window.__dh=docH()}var y=cur,max=Math.max(1,window.__dh-H),p=Math.min(1,y/max);var fk=y+'|'+ex;if(fk===window.__fk&&now-(window.__fl||0)<66){requestAnimationFrame(frame);return}window.__fk=fk;window.__fl=now;"
        assert o1 in h
        h=h.replace(o1,n1,1)
        assert 'var ex=window.__ex' in h and 'draw(y+ex' in h
        h=h.replace('family=Noto+Serif:wght@500;600&display=swap','family=Noto+Serif:wght@500;600&family=Marcellus&family=Noto+Serif+Display:ital,wght@1,400&family=Noto+Serif+Display:wght@500&display=swap',1)
        _d="function draw(y,t){\n  cx.clearRect(0,0,W,H);"
        assert h.count(_d)==1
        h=h.replace(_d,"function draw(y,t){\n  return; /* calm: starfield hidden */\n  cx.clearRect(0,0,W,H);",1)
        h+=open('extra.js',encoding='utf-8').read()+open('brand.js',encoding='utf-8').read()
    open(name+'_src.html','w',encoding='utf-8').write(h)
print('ok')
