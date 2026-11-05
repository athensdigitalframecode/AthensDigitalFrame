import re,sys,os
head=open('head_tpl.txt',encoding='utf-8').read()
fav=open('fav_uri.txt').read()

SEO_HEAD='''<link rel="canonical" href="__URL__">
<link rel="alternate" hreflang="el" href="__URL__">
<link rel="alternate" hreflang="en" href="__ENURL__">
<link rel="alternate" hreflang="x-default" href="__URL__">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfessionalService","name":"Athens DigitalFrame","url":"https://athensdigitalframe.vercel.app/","image":"https://athensdigitalframe.vercel.app/og-v3.png","description":"Ιστοσελίδες και e-shops για επιχειρήσεις στην Αθήνα.","telephone":"+306981862732","email":"athens.digitalframe@gmail.com","areaServed":{"@type":"City","name":"Athens"},"sameAs":["https://www.instagram.com/athens.digitalframe/"],"knowsAbout":["Web design","E-shops","Local SEO"]}</script>
<style>.skip{position:fixed;left:12px;top:-80px;z-index:100;padding:12px 18px;border-radius:12px;background:#0b0b0b;color:#F5F1E8;border:1px solid rgba(201,169,110,.7);font:600 15px/1 Manrope,system-ui,sans-serif;text-decoration:none;transition:top .15s}
.skip:focus{top:12px;outline:2px solid #F5F1E8;outline-offset:2px}
main:focus{outline:none}
body .jump a,body .snd{min-height:44px;min-width:44px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center}
:focus-visible{outline:2px solid #F5F1E8;outline-offset:3px}
.dock a:focus-visible,.snd:focus-visible,.jump a:focus-visible{outline-offset:-3px}
.btn,.dock a,.tile{-webkit-tap-highlight-color:transparent}
.btn:active,.dock a:active,a.tile:active{transform:scale(.98)}
@media (prefers-reduced-motion:reduce){.btn:active,.dock a:active,a.tile:active{transform:none}}</style>
'''
SKIP='''<a class="skip" href="#main" id="skip">Μετάβαση στο περιεχόμενο</a><script>if(/[?&]lang=en/.test(location.search)){document.getElementById('skip').textContent='Skip to content';document.documentElement.lang='en';var T=/prices/.test(location.pathname)?['Athens DigitalFrame | Websites from 300€','Prices for websites and e-shop leasing from Athens DigitalFrame. Live in 3–5 days.']:['Athens DigitalFrame | Websites & e-shops in Athens','Websites and e-shops for businesses in Athens. Live in 3–5 days, clear prices, free demo.'];document.title=T[0];var d=document.querySelector('meta[name=description]');if(d)d.content=T[1]}</script>'''
EN_META={
 'index':('Athens DigitalFrame | Websites &amp; e-shops in Athens','Websites and e-shops for businesses in Athens. Live in 3–5 days, clear prices, free demo.'),
 'prices':('Athens DigitalFrame | Websites from 300€','Prices for websites and e-shop leasing from Athens DigitalFrame. Live in 3–5 days.')}
def make_en(gr,out,url):
    """Static English copy under /en/: English head (title, description, OG, canonical, hreflang, OG image), language forced to EN."""
    import os,re
    kind='prices' if 'prices' in os.path.basename(out) else 'index'
    t,d=EN_META[kind]
    enurl=url.replace('vercel.app/','vercel.app/en/')
    s=gr
    s=s.replace('<html lang="el">','<html lang="en">',1)
    s=re.sub(r'<title>.*?</title>','<title>'+t+'</title>',s,count=1)
    s=re.sub(r'(<meta name="description" content=")[^"]*','\\g<1>'+d,s,count=1)
    s=re.sub(r'(<meta property="og:title" content=")[^"]*','\\g<1>'+t.replace('|','–'),s,count=1)
    s=re.sub(r'(<meta property="og:description" content=")[^"]*','\\g<1>'+d,s,count=1)
    s=s.replace('<meta property="og:url" content="'+url+'"','<meta property="og:url" content="'+enurl+'"',1)
    s=s.replace('og-v3.png','og-en-v1.png')
    s=s.replace('<link rel="canonical" href="'+url+'">','<link rel="canonical" href="'+enurl+'">',1)
    s=s.replace('<meta property="og:type" content="website">','<meta property="og:type" content="website">\n<meta property="og:locale" content="en_GB">',1)
    s=s.replace('"description":"Ιστοσελίδες και e-shops για επιχειρήσεις στην Αθήνα."','"description":"Websites and e-shops for businesses in Athens.","inLanguage":"en"',1)
    # force English, never read/write the saved language
    _old="var q=/[?&]lang=(en|el)/.exec(location.search),L=null;\ntry{if(q){L=q[1];localStorage.setItem('lang',L)}else{L=localStorage.getItem('lang')}}catch(e){if(q)L=q[1]}"
    assert _old in s
    s=s.replace(_old,"var L='en';",1)
    s=s.replace("if(/[?&]lang=en/.test(location.search))","if(true)",1)
    # language button goes to the Greek page; links stay inside /en/
    s=s.replace("var u=location.pathname+'?lang='+(window.EN?'el':'en')+location.hash;","var u=(/prices/.test(location.pathname)?'/prices.html':'/')+'?lang=el'+location.hash;",1)
    s=s.replace('url(fonts/','url(/fonts/').replace('href="fonts/','href="/fonts/')
    s=s.replace('href="prices.html','href="/en/prices.html').replace('href="index.html','href="/en/')
    s=s.replace('href="/en/#','href="/en/#')
    d_=os.path.join(os.path.dirname(os.path.abspath(out)),'en');os.makedirs(d_,exist_ok=True)
    open(os.path.join(d_,os.path.basename(out)),'w',encoding='utf-8').write(s)

def build(src,out,title,ogtitle,desc,url,preview=None):
    s=open(src,encoding='utf-8').read()
    i=s.index('<link rel="preconnect"')
    rest=s[i:]
    # self-hosted fonts instead of Google Fonts
    rest=re.sub(r'<link[^>]*(fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\s*','',rest)
    _f=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'fonts_head.txt'),encoding='utf-8').read()
    j=rest.index('</style>')+len('</style>')+len(_f)
    rest=_f+rest
    h=head
    h=re.sub(r'<title>.*?</title>','<title>'+title+'</title>',h,count=1)
    h=re.sub(r'(<meta name="description" content=")[^"]*','\\g<1>'+desc,h,count=1)
    h=re.sub(r'(<meta property="og:title" content=")[^"]*','\\g<1>'+ogtitle,h,count=1)
    h=re.sub(r'(<meta property="og:url" content=")[^"]*','\\g<1>'+url,h,count=1)
    icon='<link rel="icon" type="image/png" href="'+fav+'">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
    body=rest[:j]+'\n</head>\n<body>\n'+rest[j:].lstrip()
    if '</body>' not in body: body+='\n</body>\n</html>\n'
    outs=h+'\n'+icon+body
    # SEO + accessibility additions (see DESIGN.md, "Доступность и SEO")
    outs=outs.replace('</head>',SEO_HEAD.replace('__ENURL__',url.replace('vercel.app/','vercel.app/en/')).replace('__URL__',url)+'</head>',1)
    outs=outs.replace('<body>','<body>\n'+SKIP,1)
    outs=outs.replace('<main>','<main id="main" tabindex="-1">',1)
    if preview:
        for a,b in preview.items(): outs=outs.replace(a,b)
    open(out,'w',encoding='utf-8').write(outs)
    make_en(outs,out,url)
    print(out,len(outs))
if __name__=='__main__':
    import os
    O=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
    build('home_src.html',O+'index.html','Athens DigitalFrame | Ιστοσελίδες &amp; e-shops στην Αθήνα','Athens DigitalFrame – Ιστοσελίδες &amp; e-shops στην Αθήνα','Ιστοσελίδες και e-shops για επιχειρήσεις στην Αθήνα. Live σε 3–5 ημέρες, ξεκάθαρες τιμές, δωρεάν demo.','https://athensdigitalframe.vercel.app/')
    build('prices_src.html',O+'prices.html','Athens DigitalFrame | Ιστοσελίδες από 300€','Athens DigitalFrame – Ιστοσελίδες από 300€','Τιμές για ιστοσελίδες και e-shop leasing από την Athens DigitalFrame. Live σε 3–5 ημέρες.','https://athensdigitalframe.vercel.app/prices.html')
    _p=O+'prices.html';_t=open(_p,encoding='utf-8').read().replace('<body>','<body class="pricespage">',1);open(_p,'w',encoding='utf-8').write(_t)
    _e=O+'en/prices.html';_t=open(_e,encoding='utf-8').read().replace('<body>','<body class="pricespage">',1);open(_e,'w',encoding='utf-8').write(_t)
