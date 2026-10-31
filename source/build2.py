import re,sys,os
head=open('head_tpl.txt',encoding='utf-8').read()
fav=open('fav_uri.txt').read()
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
