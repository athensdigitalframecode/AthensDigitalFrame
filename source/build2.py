import re,sys,os
head=open('head_tpl.txt',encoding='utf-8').read()
fav=open('fav_uri.txt').read()

SEO_HEAD='''<link rel="canonical" href="__URL__">
<link rel="alternate" hreflang="el" href="__URL__">
<link rel="alternate" hreflang="en" href="__URL__?lang=en">
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
    outs=outs.replace('</head>',SEO_HEAD.replace('__URL__',url)+'</head>',1)
    outs=outs.replace('<body>','<body>\n'+SKIP,1)
    outs=outs.replace('<main>','<main id="main" tabindex="-1">',1)
    if preview:
        for a,b in preview.items(): outs=outs.replace(a,b)
    open(out,'w',encoding='utf-8').write(outs)
    print(out,len(outs))
if __name__=='__main__':
    import os
    O=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
    build('home_src.html',O+'index.html','Athens DigitalFrame | Ιστοσελίδες &amp; e-shops στην Αθήνα','Athens DigitalFrame – Ιστοσελίδες &amp; e-shops στην Αθήνα','Ιστοσελίδες και e-shops για επιχειρήσεις στην Αθήνα. Live σε 3–5 ημέρες, ξεκάθαρες τιμές, δωρεάν demo.','https://athensdigitalframe.vercel.app/')
    build('prices_src.html',O+'prices.html','Athens DigitalFrame | Ιστοσελίδες από 300€','Athens DigitalFrame – Ιστοσελίδες από 300€','Τιμές για ιστοσελίδες και e-shop leasing από την Athens DigitalFrame. Live σε 3–5 ημέρες.','https://athensdigitalframe.vercel.app/prices.html')
    _p=O+'prices.html';_t=open(_p,encoding='utf-8').read().replace('<body>','<body class="pricespage">',1);open(_p,'w',encoding='utf-8').write(_t)
