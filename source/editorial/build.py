#!/usr/bin/env python3
"""Builds index.html, prices.html, en/index.html, en/prices.html from this folder.
Run from anywhere:  python3 source/editorial/build.py
Content is bilingual in-place: t(el, en). FAQ and process copy are read from ../legacy so the
original wording is preserved."""
import re, html, json, hashlib, glob, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
LEG = os.path.join(HERE, '..', 'legacy')
SITE = 'https://athensdigitalframe.vercel.app'
WA, MAIL, TEL = '306981862732', 'athens.digitalframe@gmail.com', '+306981862732'
IG = 'https://www.instagram.com/athens.digitalframe/'; DM = 'https://ig.me/m/athens.digitalframe'

def esc(s): return html.escape(s, quote=True)

# ---------- assets (content-hashed so they can be cached forever) ----------
def asset(name):
    src = os.path.join(HERE, name); data = open(src, 'rb').read()
    h = hashlib.sha1(data).hexdigest()[:8]; base, ext = os.path.splitext(name)
    out = f'{base}.{h}{ext}'
    for old in glob.glob(os.path.join(ROOT, 'assets', f'{base}.*{ext}')):
        if os.path.basename(old) != out: os.remove(old)
    open(os.path.join(ROOT, 'assets', out), 'wb').write(data)
    return '/assets/' + out
CSS = asset('site.css'); JS = asset('site.js')

# ---------- original FAQ / process copy ----------
def pairs(f):
    s = open(os.path.join(LEG, f), encoding='utf8').read()
    return [(html.unescape(a).strip(), html.unescape(b).strip()) for a, b in re.findall(r'data-el="([^"]*)"[^>]*?data-en="([^"]*)"', s)]
QA = pairs('faq.html')[2:-1]                      # 16 (question, answer) pairs as (el,en)
QA = [(QA[i], QA[i + 1]) for i in range(0, len(QA), 2)]
HW = pairs('how.html')
SITE_STEPS = [HW[7 + i * 3:10 + i * 3] for i in range(5)]
SHOP_STEPS = [HW[24 + i * 3:27 + i * 3] for i in range(5)]

LOGO = '<img class="mark" src="/assets/df-mark.png" width="145" height="121" alt="" decoding="async">'
ARCH = re.sub(r' (id|class|width|height)="[^"]*"', '', open(os.path.join(LEG, 'frame.svg.txt'), encoding='utf8').read(), count=0).replace('<svg ', '<svg width="520" height="640" ', 1)
ARROW = '<span class="ar" aria-hidden="true">→</span>'

class Page:
    def __init__(s, lang): s.l = lang
    def t(s, el, en): return en if s.l == 'en' else el
    @property
    def pre(s): return '/en' if s.l == 'en' else ''
    def home(s, frag=''): return (s.pre + '/' if s.l == 'en' else '/') + frag
    def prices(s): return s.pre + '/prices.html'

    # ----- shared parts -----
    def head(s, title, desc, path_el, path_en, og, ld):
        t = s.t; canon = SITE + (path_en if s.l == 'en' else path_el)
        return f'''<!doctype html>
<html lang="{s.l}" class="nojs">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#0B0B0B">
<link rel="canonical" href="{canon}">
<link rel="alternate" hreflang="el" href="{SITE}{path_el}"><link rel="alternate" hreflang="en" href="{SITE}{path_en}"><link rel="alternate" hreflang="x-default" href="{SITE}{path_el}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Athens Digital Frame"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canon}"><meta property="og:image" content="{SITE}/{og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="{'en_GB' if s.l=='en' else 'el_GR'}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/notoserifdisplay-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{CSS}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#main">{t('Μετάβαση στο περιεχόμενο','Skip to content')}</a>
'''
    def header(s, cur=''):
        t = s.t; H = s.home
        items = [('projects', t('Projects', 'Projects')), ('services', t('Υπηρεσίες', 'Services')), ('process', t('Διαδικασία', 'Process')),
                 ('pricing', t('Τιμές', 'Pricing')), ('about', t('Το στούντιο', 'About')), ('contact', t('Επικοινωνία', 'Contact'))]
        def href(k): return s.prices() if k == 'pricing' else H('#' + k)
        nav = ''.join(f'<a href="{href(k)}"{" aria-current=page" if k=="pricing" and cur=="prices" else ""}>{esc(n)}</a>' for k, n in items)
        sheet = ''.join(f'<a class="l" href="{href(k)}">{esc(n)}<span aria-hidden="true">→</span></a>' for k, n in items)
        other = ('/prices.html' if cur == 'prices' else '/') if s.l == 'en' else ('/en/prices.html' if cur == 'prices' else '/en/')
        ol, on = ('EL', 'Ελληνικά') if s.l == 'en' else ('EN', 'English')
        return f'''<header class="hd"><div class="wrap in">
<a class="brand" href="{H()}" aria-label="Athens Digital Frame">{LOGO}<span>Athens Digital Frame</span></a>
<nav class="nav" aria-label="{t('Κύριο μενού','Main')}">{nav}</nav>
<div class="right"><a class="lang" href="{other}" hreflang="{ol.lower()}" lang="{ol.lower()}" aria-label="{on}">{ol}</a>
<a class="btn gold" href="{H('#contact')}"><span class="cta-long">{t('Ζήτησε δωρεάν demo','Request a free demo')}</span><span class="cta-short">Demo</span></a>
<button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="sheet" aria-label="{t('Άνοιγμα μενού','Open menu')}"><i></i><i></i><i></i></button></div>
</div></header>
<div class="sheet" id="sheet">{sheet}<a class="btn gold" href="{H('#contact')}">{t('Ζήτησε δωρεάν demo','Request a free demo')} {ARROW}</a></div>
<main id="main">
'''
    def footer(s):
        t = s.t; H = s.home
        return f'''</main>
<footer class="ft2"><div class="wrap"><div class="g">
<div><a class="brand" href="{H()}" aria-label="Athens Digital Frame">{LOGO}<span>Athens Digital Frame</span></a>
<p>{t('Ψηφιακό στούντιο στην Αθήνα. Ιστοσελίδες και e-shops για επιχειρήσεις που θέλουν να ξεχωρίζουν.','A digital studio in Athens. Websites and e-shops for businesses that want to stand out.')}</p></div>
<div><h4>{t('Πλοήγηση','Navigate')}</h4><ul><li><a href="{H('#projects')}">Projects</a></li><li><a href="{H('#process')}">{t('Διαδικασία','Process')}</a></li><li><a href="{s.prices()}">{t('Τιμές','Pricing')}</a></li><li><a href="{H('#about')}">{t('Το στούντιο','About')}</a></li><li><a href="{H('#faq')}">FAQ</a></li></ul></div>
<div><h4>{t('Υπηρεσίες','Services')}</h4><ul><li><a href="{H('#services')}">{t('Ιστοσελίδες επιχειρήσεων','Business websites')}</a></li><li><a href="{H('#services')}">E-shops</a></li><li><a href="{H('#services')}">{t('Custom λύσεις','Custom solutions')}</a></li></ul>
<h4 style="margin-top:28px">{t('Νομικά','Legal')}</h4><ul><li><span class="soon" title="{t('Δεν έχει δημοσιευτεί ακόμα','Not published yet')}">{t('Πολιτική απορρήτου (σύντομα)','Privacy policy (coming soon)')}</span></li><li><span class="soon" title="{t('Δεν έχει δημοσιευτεί ακόμα','Not published yet')}">{t('Όροι χρήσης (σύντομα)','Terms (coming soon)')}</span></li></ul></div>
<div><h4>{t('Επικοινωνία','Contact')}</h4><ul><li><a href="{IG}" rel="noopener" target="_blank">Instagram @athens.digitalframe</a></li><li><a href="https://wa.me/{WA}" rel="noopener" target="_blank">WhatsApp +30 698 186 2732</a></li><li><a href="tel:{TEL}">{t('Τηλέφωνο','Phone')} +30 698 186 2732</a></li><li><a href="mailto:{MAIL}">{MAIL}</a></li></ul></div>
</div><div class="base"><span>© <span id="yr">2026</span> Athens Digital Frame · {t('Οι τιμές δεν υπόκεινται σε ΦΠΑ.','Prices are not subject to VAT.')}</span><span>{t('Αθήνα, Ελλάδα','Athens, Greece')}</span></div></div></footer>
<script src="{JS}" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
</body></html>
'''
    def form(s):
        t = s.t
        cats = [('Υπηρεσίες / επαγγελματίας', 'Services / professional'), ('Ιατρείο / υγεία', 'Clinic / health'), ('Δικηγορικό / λογιστικό', 'Legal / accounting'),
                ('Κατάστημα / e-shop', 'Shop / e-shop'), ('Εστίαση / καφέ', 'Food / café'), ('Δημιουργός / freelancer', 'Creator / freelancer'), ('Άλλο', 'Other')]
        opts = ''.join(f'<option value="{esc(en if s.l=="en" else el)}">{esc(en if s.l=="en" else el)}</option>' for el, en in cats)
        return f'''<form class="lf" id="leadform" novalidate aria-labelledby="formh">
<h3 id="formh" style="font-size:var(--fs-2)">{t('Πες μας για την επιχείρησή σου','Tell us about your business')}</h3>
<div class="two"><div class="f"><label for="lf-n">{t('Ονοματεπώνυμο','Full name')}</label><input id="lf-n" name="n" autocomplete="name" required maxlength="60" aria-describedby="lf-n-e"><p class="err" id="lf-n-e" role="alert"></p></div>
<div class="f"><label for="lf-b">{t('Όνομα επιχείρησης','Business name')}</label><input id="lf-b" name="b" autocomplete="organization" required maxlength="80" aria-describedby="lf-b-e"><p class="err" id="lf-b-e" role="alert"></p></div></div>
<div class="f"><label for="lf-k">{t('Κατηγορία επιχείρησης','Business category')}</label><select id="lf-k" name="k"><option value="">{t('Επίλεξε…','Choose…')}</option>{opts}</select></div>
<fieldset class="f"><legend>{t('Προτιμώμενος τρόπος επικοινωνίας','Preferred contact method')}</legend><div class="radios">
<label><input type="radio" name="m" value="whatsapp" checked><span>WhatsApp</span></label><label><input type="radio" name="m" value="email"><span>Email</span></label><label><input type="radio" name="m" value="phone"><span>{t('Τηλεφωνική κλήση','Phone call')}</span></label></div></fieldset>
<div class="f"><label for="lf-c" id="lf-c-l">{t('Τηλέφωνο','Phone number')}</label><input id="lf-c" name="c" type="tel" inputmode="tel" autocomplete="tel" required maxlength="80" aria-describedby="lf-c-e"><p class="err" id="lf-c-e" role="alert"></p></div>
<div class="f"><label for="lf-d">{t('Περιγραφή project','Project description')} <span class="opt">({t('προαιρετικό','optional')})</span></label><textarea id="lf-d" name="d" maxlength="600"></textarea></div>
<div class="status" role="status" aria-live="polite" hidden></div>
<div class="btns"><button class="btn gold" type="submit">{t('Ζήτησε δωρεάν demo','Request a free demo')}</button><button class="btn ghost" type="button" id="lf-mail">{t('Αποστολή με email','Send by email')}</button></div>
<p class="small">{t('Δεν υπάρχει server: η φόρμα ανοίγει το WhatsApp ή το email σου με έτοιμο μήνυμα. Τίποτα δεν στέλνεται μέχρι να πατήσεις αποστολή εκεί.','There is no server: the form opens your WhatsApp or email with a ready message. Nothing is sent until you press send there.')}</p>
</form>'''

    def frame(s, inner):
        return f'<div class="fr">{inner}<i class="mk a"></i><i class="mk b"></i><i class="mk c"></i><i class="mk d"></i></div>'
    def browser(s, img, url, alt, w=1200, h=630, eager=False):
        return f'<div class="browser"><div class="bar"><i></i><i></i><i></i><span>{url}</span></div><img src="/assets/{img}" width="{w}" height="{h}" alt="{esc(alt)}" {"fetchpriority=high" if eager else "loading=lazy"} decoding="async"></div>'
    def phone(s, img, alt, eager=False):
        return f'<div class="phone"><img src="/assets/{img}" width="390" height="844" alt="{esc(alt)}" {"" if eager else "loading=lazy"} decoding="async"></div>'

    # ----- HOME -----
    def build_home(s):
        t = s.t
        faqcats = [(t('Ιστοσελίδες', 'Websites'), [1, 3, 4]), ('E-commerce', [10, 11, 12, 13]), (t('Τιμές', 'Pricing'), [0, 5, 14]),
                   (t('Hosting & συντήρηση', 'Hosting & maintenance'), [8, 9]), (t('Διαδικασία', 'Process'), [2, 6]), (t('Ιδιοκτησία & υποστήριξη', 'Ownership & support'), [7, 15])]
        pick = lambda p: p[1] if s.l == 'en' else p[0]
        faq = ''
        for title, idx in faqcats:
            faq += f'<div class="fcat rv"><h3>{esc(title)}</h3>' + ''.join(f'<details><summary>{esc(pick(QA[i][0]))}</summary><div class="ans"><p>{esc(pick(QA[i][1]))}</p></div></details>' for i in idx) + '</div>'
        def panel(pid, steps, hidden, note):
            li = ''.join(f'<li><span class="dot" aria-hidden="true">{i+1}</span><span class="day">{esc(pick(st[0]))}</span><h3>{names[i]}</h3><p>{esc(pick(st[2]))}</p></li>' for i, st in enumerate(steps))
            return f'<div class="panel" id="{pid}" role="tabpanel" aria-labelledby="{pid}-t"{" hidden" if hidden else ""}><ol class="steps">{li}</ol><p class="note">{note}</p></div>'
        names = ['Discover', 'Concept', 'Design &amp; Build', 'Refine &amp; Test', 'Launch']
        ld = {"@context": "https://schema.org", "@graph": [
            {"@type": "ProfessionalService", "@id": SITE + "/#org", "name": "Athens Digital Frame", "url": SITE + "/", "image": SITE + "/og-v3.png", "logo": SITE + "/assets/df-mark.png",
             "description": t('Ψηφιακό στούντιο στην Αθήνα: ιστοσελίδες και e-shops για επιχειρήσεις.', 'Digital studio in Athens: websites and e-shops for businesses.'),
             "email": MAIL, "telephone": TEL, "sameAs": [IG], "areaServed": "Athens, Greece", "address": {"@type": "PostalAddress", "addressLocality": "Athens", "addressCountry": "GR"},
             "knowsLanguage": ["el", "en"]},
            {"@type": "WebSite", "name": "Athens Digital Frame", "url": SITE + "/", "inLanguage": s.l},
            {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": pick(QA[i][0]), "acceptedAnswer": {"@type": "Answer", "text": pick(QA[i][1])}} for _, idx in faqcats for i in idx]}]}
        out = s.head(t('Athens Digital Frame | Ιστοσελίδες & e-shops στην Αθήνα', 'Athens Digital Frame | Websites & e-shops in Athens'),
                     t('Ψηφιακό στούντιο στην Αθήνα. Σύγχρονες ιστοσελίδες από 300€ και e-shops, με δωρεάν demo πριν από οποιαδήποτε πληρωμή.', 'A digital studio in Athens. Modern websites from €300 and e-shops, with a free demo before any payment.'),
                     '/', '/en/', 'og-v3.png' if s.l == 'el' else 'og-en-v1.png', ld)
        out += s.header()
        out += f'''<section class="hero dark"><div class="arch" aria-hidden="true">{ARCH}</div><div class="wrap grid">
<div><p class="eyebrow">Athens Digital Frame — Digital Studio</p>
<h1 class="h1">Websites designed to <em>move your business</em> forward.</h1>
<p class="lead">{t('Σχεδιάζουμε και κατασκευάζουμε σύγχρονες ιστοσελίδες και e-shops για επιχειρήσεις που θέλουν να ξεχωρίζουν.','We design and build modern websites and e-shops for businesses that want to stand out.')}</p>
<div class="btns"><a class="btn gold" href="#contact">{t('Ζήτησε δωρεάν demo','Request a free demo')} {ARROW}</a><a class="btn ghost" href="#projects">{t('Ανακάλυψε τα projects','Explore the projects')}</a></div>
<div class="meta"><div><b>3–5</b>{t('ημέρες έως το live','days to go live')}</div><div><b>300€</b>{t('ιστοσελίδα, εφάπαξ','website, one-time')}</div><div><b>0€</b>{t('πριν δεις το demo','before you see the demo')}</div></div></div>
<div class="stage" aria-label="{t('Προεπισκόπηση δύο concept projects','Preview of two concept projects')}"><span class="tag">{t('Concept projects · Αθήνα','Concept projects · Athens')}</span>
{s.frame(s.browser('olivane-d.webp','olivane estate','Olivane Estate concept website on a desktop browser: a villa above the sea at sunset', eager=True))}
<div class="b3">{s.frame(s.browser('arclines-d.webp','arclines freight','Arclines Freight concept website on a desktop browser: a dark globe with freight routes'))}</div>
<div class="b2">{s.phone('olivane-m.webp','Olivane Estate concept website on a phone')}</div></div>
</div></section>
<section class="sec paper" id="studio" aria-labelledby="advh"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">01 — {t('Το στούντιο','Studio')}</p><h2 class="h2" id="advh">{t('Σχεδιασμένο με προσοχή. Φτιαγμένο για την επιχείρησή σου.','Thoughtfully made. Built for your business.')}</h2></div></div>
<ul class="adv">
<li class="rv"><span class="n">01</span><h3>{t('Προσεγμένος σχεδιασμός','Thoughtful design')}</h3><p>{t('Πρώτα για κινητό, με καθαρή δομή και γρήγορη φόρτωση. Ελέγχουμε την ταχύτητα σε κινητό πριν βγει live.','Mobile-first, with a clear structure and fast loading. We check mobile speed before launch.')}</p></li>
<li class="rv d1"><span class="n">02</span><h3>{t('Φτιαγμένο για επιχειρήσεις','Built for business')}</h3><p>{t('Φόρμα επικοινωνίας, Google Maps και βασικό local SEO, ώστε οι πελάτες να σε βρίσκουν και να σε προσεγγίζουν εύκολα.','A contact form, Google Maps and local SEO basics, so customers can find and reach you easily.')}</p></li>
<li class="rv d2"><span class="n">03</span><h3>{t('Προσωπική συνεργασία','Personal collaboration')}</h3><p>{t('Μικρό στούντιο στην Αθήνα: μιλάς απευθείας με όσους φτιάχνουν το site σου, χωρίς ενδιάμεσους.','A small Athens studio: you talk directly to the people building your site, with no middlemen.')}</p></li>
<li class="rv d3"><span class="n">04</span><h3>{t('Διαφανείς τιμές','Transparent pricing')}</h3><p>{t('Ξεκάθαρες τιμές, χωρίς κρυφά κόστη, και δωρεάν demo πριν από οποιαδήποτε πληρωμή.','Clear prices, no hidden costs, and a free demo before any payment.')}</p></li></ul>
</div></section>
<section class="sec" id="projects" aria-labelledby="projh"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">02 — Projects</p><h2 class="h2" id="projh">{t('Δύο concept projects, σχεδιασμένα από εμάς.','Two concept projects, designed by us.')}</h2></div>
<p class="lead">{t('Φανταστικές εταιρείες χωρίς πραγματικό πελάτη. Τα φτιάξαμε για να δείξουμε πώς δουλεύουμε.','Fictional companies with no real client. We made them to show how we work.')}</p></div>
<article class="proj"><div class="pv rv">{s.frame('<a class="lnk" href="/olivane/" target="_blank" rel="noopener" aria-label="Olivane Estate">'+s.browser('olivane-d.webp','athensdigitalframe.vercel.app/olivane','Olivane Estate concept website: a villa above the sea at sunset')+'</a>')}<div class="phone">{''}<img src="/assets/olivane-m.webp" width="390" height="844" alt="Olivane Estate on a phone" loading="lazy" decoding="async"></div></div>
<div class="pt rv d1"><span class="chip">{t('Self-initiated concept · φανταστική εταιρεία','Self-initiated concept · fictional company')}</span><p class="k">{t('Real estate · Κύπρος','Real estate · Cyprus')}</p><h3>Olivane Estate</h3>
<p>{t('Ιστοσελίδα για μια φανταστική κατασκευαστική εταιρεία: το σπίτι χτίζεται μπροστά στα μάτια σου καθώς κυλάς τη σελίδα.','A website for a fictional property developer: the home builds itself in front of you as you scroll.')}</p>
<ul class="ft"><li>{t('Ιστορία κατασκευής με κύλιση, από το σχέδιο στο έτοιμο σπίτι','Scroll-driven construction story, from blueprint to finished home')}</li><li>{t('Κάρτες ακινήτων με φίλτρα τύπου, περιοχής, υπνοδωματίων και τιμής','Property cards with type, area, bedroom and price filters')}</li><li>{t('Φόρμες για επίσκεψη και φυλλάδιο (δοκιμαστικές, δεν στέλνουν τίποτα)','Site-visit and brochure forms (demo only, nothing is sent)')}</li></ul>
<a class="btn" href="/olivane/" target="_blank" rel="noopener">{t('Δες το live','View live')} {ARROW}</a></div></article>
<article class="proj rev"><div class="pv rv">{s.frame('<a class="lnk" href="/arclines/" target="_blank" rel="noopener" aria-label="Arclines Freight">'+s.browser('arclines-d.webp','athensdigitalframe.vercel.app/arclines','Arclines Freight concept website: a dark globe with freight routes')+'</a>')}<div class="phone"><img src="/assets/arclines-m.webp" width="390" height="844" alt="Arclines Freight on a phone" loading="lazy" decoding="async"></div></div>
<div class="pt rv d1"><span class="chip">{t('Self-initiated concept · φανταστική εταιρεία','Self-initiated concept · fictional company')}</span><p class="k">{t('Logistics · Asia-Pacific','Logistics · Asia-Pacific')}</p><h3>Arclines Freight</h3>
<p>{t('Εταιρική ιστοσελίδα για μια φανταστική εταιρεία logistics. Τα στατιστικά, οι μαρτυρίες και τα νέα είναι δείγματα και δεν αντιστοιχούν σε πραγματικούς πελάτες.','A corporate website for a fictional logistics company. The statistics, testimonials and news are samples and do not correspond to real customers.')}</p>
<ul class="ft"><li>{t('Υπηρεσίες, κλάδοι και παρακολούθηση αποστολών σε εταιρικό ύφος','Services, industries and shipment tracking in a corporate style')}</li><li>{t('Δείγματα μαρτυριών, νέων και συχνών ερωτήσεων','Sample testimonials, news and FAQ')}</li><li>{t('Φόρμα προσφοράς (δοκιμαστική)','Quote form (demo)')}</li></ul>
<a class="btn" href="/arclines/" target="_blank" rel="noopener">{t('Δες το live','View live')} {ARROW}</a></div></article>
<p class="more rv">{t('Περισσότερα demo concepts έρχονται σύντομα.','More demo concepts are coming soon.')}</p>
</div></section>
<section class="sec paper" id="services" aria-labelledby="svch"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">03 — {t('Υπηρεσίες','Services')}</p><h2 class="h2" id="svch">{t('Τρεις τρόποι να βγεις online.','Three ways to get online.')}</h2></div></div>
<div class="svc">
<article class="rv"><span class="n">01</span><div><h3>{t('Ιστοσελίδες επιχειρήσεων','Business websites')}</h3><p style="margin-top:12px">{t('Για επαγγελματίες, ιατρεία, δικηγορικά γραφεία, αρχιτέκτονες και τοπικές υπηρεσίες.','For professionals, clinics, law firms, architects and local services.')}</p></div>
<ul class="ft"><li>{t('Έως 3 σελίδες','Up to 3 pages')}</li><li>{t('Σχεδιασμός πρώτα για κινητό','Mobile-first design')}</li><li>{t('Φόρμα επικοινωνίας και Google Maps','Contact form and Google Maps')}</li><li>{t('Βασικό local SEO','Local SEO basics')}</li></ul>
<div><p class="price">{t('300€ εφάπαξ','€300 one-time')}</p><p style="margin-top:8px;font-size:var(--fs-0)">{t('+ 50€/έτος hosting & domain. Συντήρηση προαιρετικά, 20€/μήνα.','+ €50/year hosting & domain. Maintenance optional, €20/month.')}</p></div></article>
<article class="rv"><span class="n">02</span><div><h3>E-commerce</h3><p style="margin-top:12px">{t('Για καταστήματα και δημιουργούς που θέλουν να πουλήσουν online χωρίς μεγάλο αρχικό κόστος.','For shops and creators who want to sell online without a large upfront cost.')}</p></div>
<ul class="ft"><li>{t('Πληρωμές με Viva Wallet ή Stripe','Payments with Viva Wallet or Stripe')}</li><li>{t('Αντικαταβολή και σταθερό κόστος αποστολής','Cash on delivery and flat-rate shipping')}</li><li>{t('Έως 5 προϊόντα-δείγμα στην εγκατάσταση','Up to 5 sample products at setup')}</li><li>{t('Προαιρετικά: Skroutz/BestPrice 150€, BOX NOW 120€','Optional: Skroutz/BestPrice €150, BOX NOW €120')}</li></ul>
<div><p class="price">{t('200–300€ εγκατάσταση','€200–300 setup')}</p><p style="margin-top:8px;font-size:var(--fs-0)">{t('+ 30–50€/μήνα, ελάχιστη διάρκεια 12 μήνες.','+ €30–50/month, 12-month minimum.')}</p></div></article>
<article class="rv"><span class="n">03</span><div><h3>{t('Custom λύσεις','Custom website solutions')}</h3><p style="margin-top:12px">{t('Πιο σύνθετες ιστοσελίδες, πέρα από τις 3 σελίδες του βασικού πακέτου.','More complex websites, beyond the 3 pages of the basic package.')}</p></div>
<ul class="ft"><li>{t('Τιμή ανάλογα με την πολυπλοκότητα','Priced by complexity')}</li><li>{t('Ξεκάθαρη προσφορά πριν ξεκινήσουμε','A clear quote before we start')}</li></ul>
<div><p class="price">{t('Με προσφορά','Quoted')}</p><p style="margin-top:8px;font-size:var(--fs-0)">{t('Στείλε μας τι χρειάζεσαι και απαντάμε με τιμή.','Tell us what you need and we reply with a price.')}</p></div></article>
</div></div></section>
<section class="sec" id="why" aria-labelledby="whyh"><div class="wrap why">
<div class="rv"><p class="eyebrow">04 — {t('Γιατί εμείς','Why us')}</p><h2 class="h2" id="whyh">{t('Λιγότερος θόρυβος. Περισσότερη προσοχή.','Less noise. More attention.')}</h2><p class="pull">{t('Ένα site που ξέρεις ότι φτιάχτηκε για σένα.','A site you know was made for you.')}</p></div>
<dl class="rv d1"><dt>{t('Φιλοσοφία','Philosophy')}</dt><dd>{t('Κάθε επιχείρηση χρειάζεται ένα site που εξηγεί καθαρά τι κάνει και κάνει εύκολο το επόμενο βήμα. Αυτό σχεδιάζουμε πρώτα, πριν από τα στολίδια.','Every business needs a site that explains clearly what it does and makes the next step easy. We design that first, before the decoration.')}</dd>
<dt>{t('Προσοχή στη λεπτομέρεια','Attention to detail')}</dt><dd>{t('Μελετάμε την επιχείρησή σου και την περιοχή σου, και ελέγχουμε την ταχύτητα σε κινητό πριν από το live.','We study your business and your area, and check mobile speed before launch.')}</dd>
<dt>{t('Άμεση επικοινωνία','Direct communication')}</dt><dd>{t('Μιλάς απευθείας με εμάς, με DM, WhatsApp, τηλέφωνο ή email.','You talk directly to us, by DM, WhatsApp, phone or email.')}</dd>
<dt>{t('Διαφανείς τιμές','Transparent pricing')}</dt><dd>{t('Οι τιμές είναι γραμμένες πάνω στο site, ξεχωριστά οι εφάπαξ και οι μηνιαίες, και το demo είναι δωρεάν.','Prices are written on the site, with one-time and recurring costs kept apart, and the demo is free.')}</dd>
<dt>{t('Οργανωμένη διαδικασία','Organised process')}</dt><dd>{t('Πέντε σαφή βήματα, live σε 3–5 ημέρες.','Five clear steps, live in 3–5 days.')}</dd></dl>
</div></section>
<section class="sec dark" id="process" aria-labelledby="proch"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">05 — {t('Διαδικασία','Process')}</p><h2 class="h2" id="proch">{t('Από το brief ως το live, σε πέντε βήματα.','From brief to live, in five steps.')}</h2></div><p class="lead">{t('Δύο δρόμοι, ίδια απλά βήματα. Το demo έρχεται πριν από οποιαδήποτε πληρωμή.','Two paths, the same simple steps. The demo comes before any payment.')}</p></div>
<div class="tabs" role="tablist" aria-label="{t('Ιστοσελίδα ή e-shop','Website or e-shop')}"><button role="tab" id="p-site-t" aria-selected="true" aria-controls="p-site" type="button">{t('Ιστοσελίδα','Website')}</button><button role="tab" id="p-shop-t" aria-selected="false" aria-controls="p-shop" type="button">E-shop</button></div>
{panel('p-site', SITE_STEPS, False, t('Ιστοσελίδα: live σε 3–5 ημέρες. Συνδέουμε domain και hosting και σου δείχνουμε με σύντομα βίντεο πώς το διαχειρίζεσαι. Η συντήρηση είναι προαιρετική.','Website: live in 3–5 days. We connect domain and hosting and show you how to manage it in short videos. Maintenance is optional.'))}
{panel('p-shop', SHOP_STEPS, True, t('E-shop: live σε 3–5 ημέρες, με δοκιμαστική παραγγελία πριν ανοίξει. Μετά την παράδοση προσθέτεις μόνος σου προϊόντα με τα βίντεο οδηγιών.','E-shop: live in 3–5 days, with a test order before it opens. After handover you add products yourself using the video tutorials.'))}
</div></section>
<section class="sec" id="pricing" aria-labelledby="prh"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">06 — {t('Τιμές','Pricing')}</p><h2 class="h2" id="prh">{t('Ξεκάθαρες τιμές. Τίποτα κρυφό.','Clear prices. Nothing hidden.')}</h2></div><p class="lead">{t('Εφάπαξ, επαναλαμβανόμενα, υποχρεωτικά και προαιρετικά κόστη, ξεχωριστά.','One-time, recurring, mandatory and optional costs, kept apart.')}</p></div>
<div class="pgrid">
<div class="pcard rv"><h3>{t('Ιστοσελίδα επιχείρησης','Business website')}</h3><p class="d">{t('Έως 3 σελίδες.','Up to 3 pages.')}</p>
<div class="rows"><div class="row"><span class="t">{t('Κατασκευή','Development')}<span class="tag2 req">{t('Εφάπαξ','One-time')}</span></span><span class="a">300€</span></div>
<div class="row"><span class="t">Hosting &amp; domain<span class="tag2 req">{t('Υποχρεωτικό','Required')}</span></span><span class="a">50€ / {t('έτος','year')}</span></div>
<div class="row"><span class="t">{t('Συντήρηση','Maintenance')}<span class="tag2 opt">{t('Προαιρετικό','Optional')}</span></span><span class="a">20€ / {t('μήνα','month')}</span><span class="s">{t('Ενημερώσεις, backups, ασφάλεια και μικρές αλλαγές σε κείμενα και φωτογραφίες.','Updates, backups, security and small changes to text and photos.')}</span></div></div>
<p class="sum">{t('Πρώτο έτος: <b>350€</b> (300€ + 50€), πριν από την προαιρετική συντήρηση.','First year: <b>€350</b> (€300 + €50), before optional maintenance.')}</p></div>
<div class="pcard rv d1"><h3>E-commerce</h3><p class="d">{t('Με συμβόλαιο 12 μηνών.','On a 12-month contract.')}</p>
<div class="rows"><div class="row"><span class="t">{t('Εγκατάσταση','Setup')}<span class="tag2 req">{t('Εφάπαξ','One-time')}</span></span><span class="a">200–300€</span></div>
<div class="row"><span class="t">{t('Μηνιαία συνδρομή','Monthly subscription')}<span class="tag2 req">{t('Υποχρεωτικό · 12 μήνες','Required · 12 months')}</span></span><span class="a">30–50€ / {t('μήνα','month')}</span><span class="s">{t('Cloud hosting, εβδομαδιαίες ενημερώσεις, καθημερινά backups, βιβλιοθήκη βίντεο.','Cloud hosting, weekly updates, daily backups, video library.')}</span></div>
<div class="row"><span class="t">Skroutz / BestPrice<span class="tag2 opt">{t('Προαιρετικό','Optional')}</span></span><span class="a">150€</span></div>
<div class="row"><span class="t">BOX NOW<span class="tag2 opt">{t('Προαιρετικό','Optional')}</span></span><span class="a">120€</span></div></div>
<p class="sum">{t('Πρώτο έτος: <b>560–900€</b> (200–300€ + 12 × 30–50€), πριν από τα προαιρετικά.','First year: <b>€560–900</b> (€200–300 + 12 × €30–50), before optional extras.')}</p></div></div>
<p class="vat">{t('Οι τιμές δεν υπόκεινται σε ΦΠΑ. Πιο σύνθετα sites τιμολογούνται ανάλογα με την πολυπλοκότητα.','Prices are not subject to VAT. More complex sites are quoted by complexity.')}</p>
<div class="btns" style="margin-top:32px"><a class="btn" href="{s.prices()}">{t('Δες όλες τις τιμές','See all pricing')} {ARROW}</a><a class="btn ghost" href="#contact">{t('Ζήτησε δωρεάν demo','Request a free demo')}</a></div>
</div></section>
<section class="sec paper" id="about" aria-labelledby="abh"><div class="wrap about">
<div class="rv"><p class="eyebrow">07 — {t('Το στούντιο','About')}</p><h2 class="h2" id="abh">{t('Ένα μικρό στούντιο στην Αθήνα.','A small studio in Athens.')}</h2></div>
<div class="txt rv d1"><p>{t('Η Athens Digital Frame φτιάχνει ιστοσελίδες και e-shops για τοπικές επιχειρήσεις. Δουλεύουμε σε μικρή κλίμακα, ώστε κάθε project να έχει την προσοχή που του αναλογεί και να μιλάς πάντα απευθείας με εμάς.','Athens Digital Frame builds websites and e-shops for local businesses. We work at a small scale so every project gets the attention it deserves and you always talk to us directly.')}</p>
<p>{t('Δεν έχουμε ακόμα δημοσιευμένες δουλειές για πραγματικούς πελάτες, γι’ αυτό δείχνουμε concept projects που σημειώνονται καθαρά ως φανταστικά. Αν θες να δεις πώς θα φαινόταν το δικό σου, φτιάχνουμε δωρεάν demo.','We do not yet have published work for real clients, so we show concept projects that are clearly labelled as fictional. If you want to see how yours would look, we build a free demo.')}</p>
<ul class="facts" style="margin-top:32px"><li><b>{t('Έδρα','Base')}</b><span>{t('Αθήνα, Ελλάδα','Athens, Greece')}</span></li><li><b>{t('Γλώσσες','Languages')}</b><span>{t('Ελληνικά και English','Greek and English')}</span></li><li><b>Instagram</b><span><a href="{IG}" target="_blank" rel="noopener">@athens.digitalframe</a></span></li></ul></div>
</div></section>
<section class="sec" id="faq" aria-labelledby="fqh"><div class="wrap faq">
<div class="side rv"><p class="eyebrow">08 — FAQ</p><h2 class="h2" id="fqh">{t('Πριν μας στείλεις μήνυμα.','Before you message us.')}</h2></div><div>{faq}</div>
</div></section>
<section class="sec dark" id="contact" aria-labelledby="cth"><div class="wrap contact">
<div class="rv"><p class="eyebrow">09 — {t('Επικοινωνία','Contact')}</p><h2 class="h2" id="cth">{t('Δες πώς θα φαινόταν το δικό σου site.','See how your own site would look.')}</h2><p class="lead" style="margin-top:20px">{t('Το δωρεάν demo έρχεται πριν από οποιαδήποτε πληρωμή. Δεν σου αρέσει; Δεν πληρώνεις τίποτα.','The free demo comes before any payment. Do not like it? You pay nothing.')}</p>
<div class="ways"><a href="{DM}" target="_blank" rel="noopener"><span>Instagram DM</span><span>@athens.digitalframe</span></a><a href="https://wa.me/{WA}" target="_blank" rel="noopener"><span>WhatsApp</span><span>+30 698 186 2732</span></a><a href="tel:{TEL}"><span>{t('Τηλέφωνο','Phone')}</span><span>+30 698 186 2732</span></a><a href="mailto:{MAIL}"><span>Email</span><span>{MAIL}</span></a></div></div>
<div class="rv d1">{s.form()}</div>
</div></section>
'''
        out += s.footer()
        return out

    # ----- PRICES -----
    def build_prices(s):
        t = s.t
        ld = {"@context": "https://schema.org", "@type": "WebPage", "name": t('Τιμές | Athens Digital Frame', 'Pricing | Athens Digital Frame'), "url": SITE + s.prices(), "inLanguage": s.l,
              "isPartOf": {"@id": SITE + "/#org"}}
        out = s.head(t('Τιμές ιστοσελίδων & e-shop | Athens Digital Frame', 'Website & e-shop pricing | Athens Digital Frame'),
                     t('Ιστοσελίδα 300€ για έως 3 σελίδες, hosting & domain 50€/έτος. E-shop με εγκατάσταση 200–300€ και συνδρομή 30–50€/μήνα. Χωρίς ΦΠΑ.', 'Website €300 for up to 3 pages, hosting & domain €50/year. E-shop with €200–300 setup and €30–50/month subscription. No VAT.'),
                     '/prices.html', '/en/prices.html', 'og-v3.png' if s.l == 'el' else 'og-en-v1.png', ld)
        out += s.header('prices')
        r = lambda a, b, c: f'<tr><th scope="row">{a}</th><td>{b}</td><td>{c}</td></tr>'
        out += f'''<section class="phero dark"><div class="wrap"><p class="eyebrow">{t('Τιμές','Pricing')}</p><h1 class="h1" style="max-width:14ch;font-size:clamp(38px,5vw+14px,76px)">{t('Ξεκάθαρες τιμές, <em>τίποτα κρυφό.</em>','Clear prices, <em>nothing hidden.</em>')}</h1>
<p class="lead">{t('Εφάπαξ, επαναλαμβανόμενα, υποχρεωτικά και προαιρετικά κόστη, γραμμένα ξεχωριστά. Οι τιμές δεν υπόκεινται σε ΦΠΑ.','One-time, recurring, mandatory and optional costs, written apart. Prices are not subject to VAT.')}</p></div></section>
<section class="sec"><div class="wrap">
<div class="pgrid">
<div class="pcard"><span class="eyebrow">{t('Δημοφιλές','Popular')}</span><h3 style="margin-top:12px">{t('Βασική ιστοσελίδα','Basic website')}</h3><p class="d">{t('Για επαγγελματίες, ιατρεία, δικηγορικά γραφεία, αρχιτέκτονες και τοπικές υπηρεσίες.','For professionals, clinics, law firms, architects and local services.')}</p>
<div class="rows"><div class="row"><span class="t">{t('Κατασκευή βασικής ιστοσελίδας','Basic website development')}<span class="tag2 req">{t('Εφάπαξ','One-time')}</span></span><span class="a">300€</span></div>
<div class="row"><span class="t">Hosting &amp; domain<span class="tag2 req">{t('Υποχρεωτικό','Required')}</span></span><span class="a">50€ / {t('έτος','year')}</span></div>
<div class="row"><span class="t">{t('Τεχνική συντήρηση','Technical maintenance')}<span class="tag2 opt">{t('Προαιρετικό','Optional')}</span></span><span class="a">20€ / {t('μήνα','month')}</span><span class="s">{t('Ενημερώσεις, backups, ασφάλεια και μικρές αλλαγές σε κείμενα και φωτογραφίες.','Updates, backups, security and small changes to text and photos.')}</span></div></div>
<ul class="ft" style="margin-top:0"><li>{t('Έως 3 σελίδες','Up to 3 pages')}</li><li>{t('Mobile-first σχεδιασμός','Mobile-first design')}</li><li>{t('Φόρμα επικοινωνίας και Google Maps','Contact form and Google Maps')}</li><li>{t('Βασικό τοπικό SEO','Local SEO basics')}</li></ul>
<p class="sum">{t('Πρώτο έτος: 300€ + 50€ hosting &amp; domain = <b>350€</b>. Η συντήρηση, αν τη θες, είναι 20€ τον μήνα.','First year: €300 + €50 hosting &amp; domain = <b>€350</b>. Maintenance, if you want it, is €20 per month.')}</p></div>
<div class="pcard"><span class="eyebrow">E-shop</span><h3 style="margin-top:12px">E-shop leasing</h3><p class="d">{t('Για καταστήματα και δημιουργούς που θέλουν να πουλήσουν online χωρίς 2.000€ μπροστά.','For shops and creators who want to sell online without €2,000 upfront.')}</p>
<div class="rows"><div class="row"><span class="t">{t('Εγκατάσταση','Setup')}<span class="tag2 req">{t('Εφάπαξ','One-time')}</span></span><span class="a">200–300€</span></div>
<div class="row"><span class="t">{t('Μηνιαία συνδρομή','Monthly subscription')}<span class="tag2 req">{t('Υποχρεωτικό · 12 μήνες','Required · 12 months')}</span></span><span class="a">30–50€ / {t('μήνα','month')}</span><span class="s">{t('Συμβόλαιο 12 μηνών. Cloud hosting, εβδομαδιαίες ενημερώσεις, καθημερινά backups, βιβλιοθήκη βίντεο.','12-month contract. Cloud hosting, weekly updates, daily backups, video library.')}</span></div></div>
<ul class="ft" style="margin-top:0"><li>{t('Πληρωμές με κάρτα (Viva Wallet / Stripe)','Card payments (Viva Wallet / Stripe)')}</li><li>{t('Ελληνικές αποστολές και αντικαταβολή','Greek shipping and cash on delivery')}</li><li>{t('Διαχείριση προϊόντων από το κινητό, έως 5 προϊόντα-δείγμα στην εγκατάσταση','Manage products from your phone, up to 5 sample products at setup')}</li></ul>
<p class="sum">{t('Πρώτο έτος: 200–300€ + 12 × 30–50€ = <b>560–900€</b>, πριν από τα προαιρετικά extras.','First year: €200–300 + 12 × €30–50 = <b>€560–900</b>, before optional extras.')}</p></div></div>
<div class="legend" aria-label="{t('Υπόμνημα','Legend')}"><span><span class="tag2 req" style="margin:0">{t('Εφάπαξ / Υποχρεωτικό','One-time / Required')}</span> {t('κόστη που πληρώνεις σίγουρα','costs you always pay')}</span><span><span class="tag2 opt" style="margin:0">{t('Προαιρετικό','Optional')}</span> {t('μόνο αν το θέλεις','only if you want it')}</span></div></div></section>
<section class="sec paper"><div class="wrap"><div class="pgrid">
<div class="pcard" style="background:transparent"><span class="eyebrow">Custom</span><h3 style="margin-top:12px">{t('Πιο σύνθετη ιστοσελίδα','A more complex website')}</h3><p class="d">{t('Τιμή ανάλογα με την πολυπλοκότητα. Ξεκάθαρη προσφορά πριν ξεκινήσουμε.','Priced by complexity. A clear quote before we start.')}</p></div>
<div class="pcard" style="background:transparent"><span class="eyebrow">Extras</span><h3 style="margin-top:12px">{t('Επιπλέον υπηρεσίες','Additional services')}</h3>
<div class="rows" style="margin-bottom:0"><div class="row"><span class="t">Skroutz / BestPrice XML feed<span class="tag2 opt">{t('Προαιρετικό','Optional')}</span></span><span class="a">150€</span></div><div class="row"><span class="t">BOX NOW voucher<span class="tag2 opt">{t('Προαιρετικό','Optional')}</span></span><span class="a">120€</span></div></div></div></div>
<div class="pcard" style="background:transparent;margin-top:clamp(20px,3vw,40px)"><span class="eyebrow">{t('Συστάσεις','Referrals')}</span><h3 style="margin-top:12px">{t('Πρόγραμμα συστάσεων','Referral programme')}</h3><p class="d">{t('Συστήνεις μια επιχείρηση και κερδίζεις 50€ μετρητά ή 2 μήνες δωρεάν συντήρηση. Ο φίλος σου παίρνει 10% έκπτωση.','Refer a business and earn €50 cash or 2 months of free maintenance. Your friend gets 10% off.')}</p></div></div></section>
<section class="sec" id="process"><div class="wrap"><div class="sechead"><div><p class="eyebrow">{t('Διαδικασία','Process')}</p><h2 class="h2">{t('Πώς δουλεύουμε','How we work')}</h2></div></div>
<ol class="three"><li><span class="n">1</span><h3>{t('Στέλνεις μήνυμα','You message us')}</h3><p>{t('Μας λες τι δουλειά κάνεις και τι χρειάζεσαι.','Tell us what you do and what you need.')}</p></li><li><span class="n">2</span><h3>{t('Δωρεάν demo','Free demo')}</h3><p>{t('Φτιάχνουμε ένα demo για την επιχείρησή σου.','We build a demo for your business.')}</p></li><li><span class="n">3</span><h3>{t('Live σε 3–5 ημέρες','Live in 3–5 days')}</h3><p>{t('Αν σου αρέσει, ανεβαίνει και είναι έτοιμο.','If you like it, it goes live and it is ready.')}</p></li></ol></div></section>
<section class="sec paper"><div class="wrap incl"><div><p class="eyebrow">{t('Περιλαμβάνεται','Included')}</p><h2 class="h2" style="max-width:none">{t('Τι περιλαμβάνεται','What is included')}</h2>
<div class="incl" style="margin-top:32px"><div><h3 style="font-size:var(--fs-2)">{t('Ιστοσελίδα','Website')}</h3><ul class="ft"><li>Hosting &amp; domain</li><li>{t('Έως 3 σελίδες','Up to 3 pages')}</li><li>{t('Φόρμα επικοινωνίας','Contact form')}</li><li>Google Maps</li><li>{t('Βασικό τοπικό SEO','Local SEO basics')}</li></ul></div>
<div><h3 style="font-size:var(--fs-2)">E-shop</h3><ul class="ft"><li>{t('Πληρωμές με κάρτα','Card payments')}</li><li>{t('Αποστολές & αντικαταβολή','Shipping & cash on delivery')}</li><li>{t('Διαχείριση από κινητό','Manage from your phone')}</li></ul></div></div></div>
<div><p class="eyebrow">{t('Από εσένα','From you')}</p><h2 class="h2" style="max-width:none">{t('Τι χρειάζομαι από σένα','What we need from you')}</h2><p class="lead" style="margin-top:20px">{t('Το λογότυπό σου και μερικές φωτογραφίες, αν έχεις. Για τα κείμενα μην ανησυχείς, τα γράφουμε εμείς.','Your logo and a few photos, if you have them. Do not worry about the copy, we write it.')}</p></div></div></section>
<section class="sec"><div class="wrap"><div class="sechead"><div><p class="eyebrow">{t('Σύγκριση','Compare')}</p><h2 class="h2">{t('Με μια ματιά','At a glance')}</h2></div></div>
<table class="cmp"><thead><tr><th></th><th scope="col">{t('Ιστοσελίδα','Website')}</th><th scope="col">E-shop</th></tr></thead><tbody>
{r(t('Πληρώνεις τώρα','Pay now'),'300€','200–300€')}{r(t('Κάθε μήνα','Every month'),t('20€ (προαιρετικό)','€20 (optional)'),t('30–50€ (12 μήνες)','€30–50 (12 months)'))}{r('Hosting &amp; domain',t('50€ / έτος','€50 / year'),'—')}{r(t('Πρώτο έτος','First year'),t('350€ (χωρίς συντήρηση)','€350 (without maintenance)'),'560–900€')}</tbody></table>
<p class="vat">{t('Οι τιμές δεν υπόκεινται σε ΦΠΑ.','Prices are not subject to VAT.')}</p></div></section>
<section class="sec dark" id="contact"><div class="wrap contact"><div><p class="eyebrow">{t('Εγγύηση','Guarantee')}</p><h2 class="h2" style="max-width:14ch">{t('Δεν σου αρέσει το demo; <em>Δεν πληρώνεις τίποτα.</em>','Do not like the demo? <em>You pay nothing.</em>')}</h2><p class="lead" style="margin-top:20px">{t('Θες να δεις πώς θα φαίνεται η δική σου; Στείλε μας μήνυμα και φτιάχνουμε δωρεάν demo.','Want to see how yours would look? Message us and we build a free demo.')}</p>
<div class="ways"><a href="{DM}" target="_blank" rel="noopener"><span>Instagram DM</span><span>@athens.digitalframe</span></a><a href="mailto:{MAIL}"><span>Email</span><span>{MAIL}</span></a><a href="https://wa.me/{WA}" target="_blank" rel="noopener"><span>WhatsApp</span><span>+30 698 186 2732</span></a></div></div>
<div>{s.form()}</div></div></section>
'''
        out += s.footer()
        return out

def w(path, txt):
    p = os.path.join(ROOT, path); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w', encoding='utf8').write(txt); print('wrote', path, len(txt))
if __name__ == '__main__':
    for lang in ('el', 'en'):
        p = Page(lang); pre = 'en/' if lang == 'en' else ''
        w(pre + 'index.html', p.build_home()); w(pre + 'prices.html', p.build_prices())
