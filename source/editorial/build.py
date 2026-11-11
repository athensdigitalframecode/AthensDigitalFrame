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
CUBE = asset('cube-gl.js'), asset('cube.js')   # home page only; cube.js falls back to the CSS cube without WebGL

# ---------- original FAQ / process copy ----------
def pairs(f):
    s = open(os.path.join(LEG, f), encoding='utf8').read()
    return [(html.unescape(a).strip(), html.unescape(b).strip()) for a, b in re.findall(r'data-el="([^"]*)"[^>]*?data-en="([^"]*)"', s)]
QA = pairs('faq.html')[2:-1]                      # 16 (question, answer) pairs as (el,en)
QA = [(QA[i], QA[i + 1]) for i in range(0, len(QA), 2)]
HW = pairs('how.html')
# the copy is cut out of the old HTML by position: stop the build if that HTML changed shape
assert len(QA) == 16, len(QA)
assert [x[1] for x in HW[7:22:3]] == [x[1] for x in HW[24:39:3]] == ['Day 1', 'Day 1–2', 'Day 2–4', 'Day 4', 'Day 5'], (HW[7:22:3], HW[24:39:3])
SITE_STEPS = [HW[7 + i * 3:10 + i * 3] for i in range(5)]
SHOP_STEPS = [HW[24 + i * 3:27 + i * 3] for i in range(5)]

LOGO = '<img class="mark" src="/assets/df-mark.png" width="145" height="121" alt="" decoding="async">'
ARROW = '<span class="ar" aria-hidden="true">→</span>'

# ---------- six services = the six cube faces (wording from the master brief, section 4.5) ----------
# (title el, title en, text el, text en, face drawing: frame parts only, no arcs except the Discover lens)
SERVICES = [
    ('Ανακάλυψη', 'Discover', 'Γνωρίζουμε την επιχείρησή σου, το κοινό και τους στόχους σου, για να εντοπίσουμε ευκαιρίες και να ορίσουμε τη σωστή ψηφιακή κατεύθυνση.', 'We get to know your business, audience, and goals to uncover opportunities and define the right digital direction.',
     '<path d="M10 26V10h16M74 10h16v16M90 74v16H74M26 90H10V74"/><path d="M35 50a15 15 0 1 0 30 0a15 15 0 1 0-30 0"/><path d="M50 28v12M50 60v12M28 50h12M60 50h12"/>'),
    ('Σχεδιασμός', 'Design', 'Δημιουργούμε ξεχωριστές οπτικές ταυτότητες και προσεγμένα περιβάλλοντα χρήσης, συνδυάζοντας δημιουργικότητα, ευχρηστία και προσοχή στη λεπτομέρεια.', 'We create distinctive visual identities and thoughtful user interfaces, combining creativity, usability, and attention to detail.',
     '<path d="M10 14h80v72H10zM10 14h49v72M59 44h31M59 44v42M71 44v18h19"/>'),
    ('Ανάπτυξη', 'Develop', 'Μετατρέπουμε τις ιδέες σε responsive ιστοσελίδες υψηλής απόδοσης, με σύγχρονες τεχνολογίες και προσεκτικά σχεδιασμένη λειτουργικότητα.', 'We turn ideas into responsive, high-performance websites built with modern technologies and carefully considered functionality.',
     '<path d="M10 18h46M22 34h58M22 50h34M34 66h46M22 82h28"/><path class="au" d="M10 34v48"/>'),
    ('E-commerce', 'E-commerce', 'Χτίζουμε e-shops στα μέτρα σου, που κάνουν την αγορά απλή, βελτιώνουν τη διαδρομή του πελάτη και στηρίζουν την ανάπτυξη της επιχείρησης.', 'We build tailored online shopping experiences that make purchasing simple, improve customer journeys, and support business growth.',
     '<path d="M12 12h34v34H12zM54 12h34v34H54zM12 54h34v34H12z"/><path class="fill" d="M54 54h34v34H54z"/>'),
    ('Προβολή', 'Visibility', 'Ενισχύουμε την online παρουσία σου με βάσεις SEO, βελτιστοποίηση για τις μηχανές αναζήτησης και στρατηγικές που βοηθούν την επιχείρησή σου να βρίσκεται.', 'We strengthen your online presence through SEO foundations, search optimisation, and strategies that help your business get discovered.',
     '<path d="M10 90h80M18 90V70M34 90V58M50 90V44M66 90V28M82 90V12"/><path class="au" d="M10 12h10M10 28h6M10 44h10M10 58h6M10 70h10"/>'),
    ('Υποστήριξη', 'Support', 'Παρέχουμε συνεχή συντήρηση, τεχνική βοήθεια, βελτιώσεις και καθοδήγηση, ώστε η ψηφιακή σου παρουσία να λειτουργεί ομαλά.', 'We provide ongoing maintenance, technical assistance, improvements, and guidance to keep your digital presence working smoothly.',
     '<path d="M62 14H14v72h72V38"/><path class="au" d="M36 50l12 12 38-44"/>'),
]

# ---------- case studies: both are self-initiated concepts for fictional companies; every fact below is checked against the demo's code ----------
# texts are (el, en). To add a real client project later: add an entry, set concept=False and the chip and disclosure change.
CASES = {
    'olivane': dict(
        name='Olivane Estate', live='/olivane/', og='olivane/og.jpg', other='arclines',
        sector=('Real estate · Κύπρος', 'Real estate · Cyprus'),
        alt=('Η concept ιστοσελίδα Olivane Estate: μια βίλα πάνω από τη θάλασσα στο ηλιοβασίλεμα', 'Olivane Estate concept website: a villa above the sea at sunset'),
        lead=('Ιστοσελίδα για μια φανταστική κατασκευαστική εταιρεία: το σπίτι χτίζεται μπροστά στα μάτια σου καθώς κυλάς τη σελίδα.', 'A website for a fictional property developer: the home builds itself in front of you as you scroll.'),
        brief=[('Η Olivane Estate είναι μια εταιρεία που επινοήσαμε: κατασκευάζει κατοικίες στη Λεμεσό της Κύπρου. Δεν υπάρχει πελάτης· το brief το θέσαμε μόνοι μας.', 'Olivane Estate is a company we made up: a developer building homes in Limassol, Cyprus. There is no client; we set the brief ourselves.'),
               ('Το ερώτημα ήταν πώς δείχνεις ένα σπίτι που ακόμα χτίζεται. Η απάντηση έγινε η ίδια η σελίδα: καθώς κυλάς, το σπίτι περνά από το σχέδιο στον σκελετό και στο έτοιμο σπίτι το σούρουπο.', 'The question was how to show a home that is still being built. The answer became the page itself: as you scroll, the house goes from blueprint to structure to the finished home at dusk.')],
        direction=[('Σκοτεινό, κινηματογραφικό και ήσυχο. Ένα νυχτερινό μπλε φόντο αφήνει τη ζεστή βραδινή φωτογραφία να κρατά τη σελίδα.', 'Dark, cinematic and quiet. A night-blue background lets the warm evening photography carry the page.'),
                   ('Οι τίτλοι είναι σε serif με έντονη αντίθεση και τα κείμενα σε στενό sans. Τα χρώματα έμφασης είναι ροδακινί, κοραλί και τιρκουάζ.', 'Headlines are set in a high-contrast serif and text in a tight sans. The accent colours are peach, coral and teal.')],
        palette=['#070a12', '#ffbd80', '#ff6f61', '#5ee6d0'],
        fonts=[('Instrument Serif', ('τίτλοι', 'headlines')), ('Inter Tight', ('κείμενα και interface', 'text and interface'))],
        stages=[('blueprint', ('Το σχέδιο του σπιτιού', 'The blueprint of the house')), ('bare', ('Ο σκελετός του σπιτιού', 'The structure of the house')), ('dusk', ('Το έτοιμο σπίτι το σούρουπο', 'The finished home at dusk'))],
        parts=[(('Ιστορία κατασκευής με κύλιση', 'Scroll-to-build story'), ('Τρία στάδια σε μία κύλιση: σχέδιο, σκελετός, έτοιμο σπίτι.', 'Three stages in one scroll: blueprint, structure, finished home.')),
               (('Κάρτες ακινήτων', 'Property listings'), ('Έξι ακίνητα-δείγματα σε κάρτες, με φίλτρα τύπου, περιοχής, υπνοδωματίων και τιμής.', 'Six sample properties as cards, with filters for type, area, bedrooms and price.')),
               (('Φόρμες επίσκεψης και φυλλαδίου', 'Site-visit and brochure forms'), ('Δοκιμαστικές φόρμες: δείχνουν τη ροή, δεν στέλνουν τίποτα.', 'Demo forms: they show the flow and send nothing.'))],
        responsive=('Οι εικόνες σερβίρονται σε AVIF με εναλλακτικό WebP και σε ξεχωριστά μεγέθη για κινητό.', 'Images are served as AVIF with a WebP fallback, in separate sizes for phones.'),
        motion=('Η ιστορία κατασκευής οδηγείται από τη θέση της κύλισης. Αν έχεις ζητήσει μειωμένη κίνηση στη συσκευή σου, η σελίδα το σέβεται.', 'The build story is driven by scroll position. If you have asked your device for reduced motion, the page respects it.'),
        sample=('Η εταιρεία, η ιστορία της, τα νούμερα και τα ακίνητα είναι επινοημένα. Οι φόρμες δεν στέλνουν τίποτα.', 'The company, its history, its figures and its listings are invented. The forms send nothing.')),
    'arclines': dict(
        name='Arclines Freight', live='/arclines/', og='arclines/og.jpg', other='olivane',
        sector=('Logistics · Asia-Pacific', 'Logistics · Asia-Pacific'),
        alt=('Η concept ιστοσελίδα Arclines Freight: μια σκοτεινή υδρόγειος με διαδρομές φορτίων', 'Arclines Freight concept website: a dark globe with freight routes'),
        lead=('Εταιρική ιστοσελίδα για μια φανταστική εταιρεία logistics. Τα στατιστικά, οι μαρτυρίες και τα νέα είναι δείγματα και δεν αντιστοιχούν σε πραγματικούς πελάτες.', 'A corporate website for a fictional logistics company. The statistics, testimonials and news are samples and do not correspond to real customers.'),
        brief=[('Η Arclines Freight είναι ένα επινοημένο brand logistics στην περιοχή Ασίας-Ειρηνικού: αεροπορικές και θαλάσσιες μεταφορές, εκτελωνισμός, αποθήκευση και project cargo. Δεν υπάρχει πελάτης.', 'Arclines Freight is a made-up Asia-Pacific logistics brand: air and ocean freight, customs brokerage, warehousing and project cargo. There is no client.'),
               ('Θέσαμε στον εαυτό μας ένα εταιρικό brief: πολλή πληροφορία, διαφορετικά κοινά και ένα brand που πρέπει να δείχνει αξιόπιστο πριν δείξει έξυπνο.', 'We set ourselves a corporate brief: a lot of information, several audiences, and a brand that has to look dependable before it looks clever.')],
        direction=[('Σχεδόν μαύρο και ένα μόνο ηλεκτρικό μπλε, με παγωμένους και χάρτινους τόνους στις φωτεινές ενότητες.', 'Near-black and a single electric blue, with ice and paper tones for the light sections.'),
                   ('Τεχνική γραμματοσειρά για τους τίτλους, γεωμετρικό sans για την ανάγνωση. Η υδρόγειος με τις διαδρομές σχεδιάζεται με κώδικα πάνω σε canvas· δεν είναι βίντεο.', 'A technical display face for headlines, a geometric sans for reading. The globe with its routes is drawn in code on a canvas; it is not a video.')],
        palette=['#06070b', '#1a1de6', '#bfe3ff', '#e9edf6'],
        fonts=[('Tomorrow', ('τίτλοι', 'headlines')), ('Space Grotesk', ('κείμενα', 'text'))],
        stages=[],
        parts=[(('Πέντε υπηρεσίες', 'Five services'), ('Air Freight, Ocean Freight, Customs Brokerage, Warehousing and 3PL, Project Cargo.', 'Air Freight, Ocean Freight, Customs Brokerage, Warehousing and 3PL, Project Cargo.')),
               (('Σκηνές με κύλιση', 'Scroll-driven scenes'), ('Ένα πλοίο, ένα φορτηγό και ένα μηχάνημα στοιβασίας κινούνται καθώς κυλάς.', 'A ship, a truck and a container stacker move as you scroll.')),
               (('Στοιχεία εμπιστοσύνης, ως δείγματα', 'Proof points, as samples'), ('Στατιστικά, μαρτυρίες, νέα και συχνές ερωτήσεις: όλα δείγματα, για να φανεί η δομή.', 'Statistics, testimonials, news and FAQ: all samples, there to show the structure.')),
               (('Φόρμα προσφοράς', 'Quote form'), ('Δοκιμαστική: δείχνει τη ροή, δεν στέλνει τίποτα.', 'Demo only: it shows the flow and sends nothing.'))],
        responsive=('Στο κινητό η πλοήγηση γίνεται συρόμενο μενού και η διάταξη ελέγχθηκε σε κάθετο και οριζόντιο προσανατολισμό.', 'On phones the navigation becomes a drawer, and the layout was checked in portrait and landscape.'),
        motion=('Οι σκηνές οδηγούνται από τη θέση της κύλισης. Αν έχεις ζητήσει μειωμένη κίνηση στη συσκευή σου, η σελίδα το σέβεται.', 'The scenes are driven by scroll position. If you have asked your device for reduced motion, the page respects it.'),
        sample=('Η εταιρεία, τα στατιστικά, οι μαρτυρίες, τα ονόματα πελατών και τα νέα είναι δείγματα χωρίς αντίκρισμα.', 'The company, statistics, testimonials, client names and news are placeholders.')),
}

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
<meta name="theme-color" content="#09090A"><meta name="color-scheme" content="dark">
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
    def header(s, cur='', path=''):   # path: this page's Greek path, when it is not home or prices
        t = s.t; H = s.home
        items = [('services', t('Υπηρεσίες', 'Services')), ('projects', t('Projects', 'Projects')), ('process', t('Διαδικασία', 'Process')),
                 ('pricing', t('Τιμές', 'Pricing')), ('about', t('Το στούντιο', 'About')), ('contact', t('Επικοινωνία', 'Contact'))]
        def href(k): return s.prices() if k == 'pricing' else H('#' + k)
        nav = ''.join(f'<a href="{href(k)}"{" aria-current=page" if k=="pricing" and cur=="prices" else ""}>{esc(n)}</a>' for k, n in items)
        sheet = ''.join(f'<a class="l" href="{href(k)}">{esc(n)}<span aria-hidden="true">→</span></a>' for k, n in items)
        path = path or ('/prices.html' if cur == 'prices' else '/'); other = path if s.l == 'en' else '/en' + path
        ol, on = ('EL', 'Ελληνικά') if s.l == 'en' else ('EN', 'English')
        return f'''<header class="hd"><i class="pg" aria-hidden="true"></i><div class="wrap in">
<a class="brand" href="{H()}" aria-label="Athens Digital Frame">{LOGO}<span translate="no">Athens Digital Frame</span></a>
<nav class="nav" aria-label="{t('Κύριο μενού','Main')}">{nav}</nav>
<div class="right"><a class="lang" href="{other}" hreflang="{ol.lower()}" lang="{ol.lower()}" aria-label="{on}">{ol}</a>
<a class="btn gold" href="{H('#contact')}"><span class="cta-long">{t('Ζήτησε δωρεάν demo','Request a free demo')}</span><span class="cta-short">Demo</span><span class="ar" aria-hidden="true">→</span></a>
<button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="sheet" aria-label="{t('Άνοιγμα μενού','Open menu')}"><i></i><i></i><i></i></button></div>
</div></header>
<div class="sheet" id="sheet">{sheet}<a class="btn gold" href="{H('#contact')}">{t('Ζήτησε δωρεάν demo','Request a free demo')} {ARROW}</a></div>
<main id="main">
'''
    def footer(s, scripts=''):
        t = s.t; H = s.home
        return f'''</main>
<footer class="ft2"><div class="wrap"><div class="g">
<div><a class="brand" href="{H()}" aria-label="Athens Digital Frame">{LOGO}<span translate="no">Athens Digital Frame</span></a>
<p>{t('Ψηφιακό στούντιο στην Αθήνα. Ιστοσελίδες και e-shops για επιχειρήσεις που θέλουν να ξεχωρίζουν.','A digital studio in Athens. Websites and e-shops for businesses that want to stand out.')}</p></div>
<div><h4>{t('Πλοήγηση','Navigate')}</h4><ul><li><a href="{H('#projects')}">Projects</a></li><li><a href="{H('#process')}">{t('Διαδικασία','Process')}</a></li><li><a href="{s.prices()}">{t('Τιμές','Pricing')}</a></li><li><a href="{H('#about')}">{t('Το στούντιο','About')}</a></li><li><a href="{H('#faq')}">FAQ</a></li></ul></div>
<div><h4>{t('Υπηρεσίες','Services')}</h4><ul><li><a href="{H('#pricing')}">{t('Ιστοσελίδες επιχειρήσεων','Business websites')}</a></li><li><a href="{H('#pricing')}">E-shops</a></li><li><a href="{H('#pricing')}">{t('Custom λύσεις','Custom solutions')}</a></li></ul>
<h4 style="margin-top:28px">{t('Νομικά','Legal')}</h4><ul><li><a href="{s.pre}/privacy.html">{t('Πολιτική απορρήτου','Privacy policy')}</a></li><li><span class="soon" title="{t('Δεν έχει δημοσιευτεί ακόμα','Not published yet')}">{t('Όροι χρήσης (σύντομα)','Terms (coming soon)')}</span></li></ul></div>
<div><h4>{t('Επικοινωνία','Contact')}</h4><ul><li><a href="{IG}" rel="noopener" target="_blank">Instagram @athens.digitalframe</a></li><li><a href="https://wa.me/{WA}" rel="noopener" target="_blank">WhatsApp +30 698 186 2732</a></li><li><a href="tel:{TEL}">{t('Τηλέφωνο','Phone')} +30 698 186 2732</a></li><li><a href="mailto:{MAIL}">{MAIL}</a></li></ul></div>
</div><div class="base"><span>© <span id="yr">2026</span> Athens Digital Frame · {t('Οι τιμές δεν υπόκεινται σε ΦΠΑ.','Prices are not subject to VAT.')}</span><span>{t('Αθήνα, Ελλάδα','Athens, Greece')}</span></div></div></footer>
<script src="{JS}" defer></script>{scripts}
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
<div class="two"><div class="f"><label for="lf-n">{t('Ονοματεπώνυμο','Full name')}</label><input id="lf-n" autocomplete="name" required maxlength="60" aria-describedby="lf-n-e"><p class="err" id="lf-n-e" role="alert"></p></div>
<div class="f"><label for="lf-b">{t('Όνομα επιχείρησης','Business name')}</label><input id="lf-b" autocomplete="organization" required maxlength="80" aria-describedby="lf-b-e"><p class="err" id="lf-b-e" role="alert"></p></div></div>
<div class="f"><label for="lf-k">{t('Κατηγορία επιχείρησης','Business category')}</label><select id="lf-k"><option value="">{t('Επίλεξε…','Choose…')}</option>{opts}</select></div>
<fieldset class="f"><legend>{t('Προτιμώμενος τρόπος επικοινωνίας','Preferred contact method')}</legend><div class="radios">
<label><input type="radio" name="m" value="whatsapp" checked><span>WhatsApp</span></label><label><input type="radio" name="m" value="email"><span>Email</span></label><label><input type="radio" name="m" value="phone"><span>{t('Τηλεφωνική κλήση','Phone call')}</span></label></div></fieldset>
<div class="f"><label for="lf-c" id="lf-c-l">{t('Τηλέφωνο','Phone number')}</label><input id="lf-c" spellcheck="false" type="tel" inputmode="tel" autocomplete="tel" required maxlength="80" aria-describedby="lf-c-e"><p class="err" id="lf-c-e" role="alert"></p></div>
<div class="f"><label for="lf-d">{t('Περιγραφή project','Project description')} <span class="opt">({t('προαιρετικό','optional')})</span></label><textarea id="lf-d" maxlength="600"></textarea></div>
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
    def cube(s):
        """Hero cube. The list and the texts are the accessible content; the 3D object repeats them and is hidden from assistive tech."""
        t = s.t; faces = lst = descs = ''
        for i, (tel, ten, xel, xen, g) in enumerate(SERVICES):
            n = f'{i + 1:02d}'; name = esc(t(tel, ten))
            faces += f'<div class="cb-face" data-f="{i}"><span class="cb-n">{n}</span><svg class="cb-g" viewBox="0 0 100 100">{g}</svg><span class="cb-t">{name}</span><span class="cb-b">ADF</span>{"<div class=cb-plate></div>" if i == 0 else ""}</div>'
            lst += f'<li><button type="button" aria-pressed="false"><i>{n}</i>{name}</button></li>'
            descs += f'<p><b>{name}.</b> {esc(t(xel, xen))}</p>'
        return f'''<div class="cb-wrap">
<div class="cb" id="cube-stage" data-logo="/assets/df-logo-1024.jpg" aria-hidden="true"><div class="cb-cube" id="cube">{faces}</div><div class="cb-floor"></div></div>
<button type="button" class="cb-reset" id="cube-reset" hidden>{t('Πίσω στο λογότυπο','Back to the logo')}</button>
<ol class="cb-list" id="cube-svc" aria-label="{t('Υπηρεσίες','Services')}">{lst}</ol>
<div class="cb-descs" id="cube-descs" aria-live="polite"><p class="cb-hint is-on">{t('Γύρισε τον κύβο ή διάλεξε υπηρεσία.','Turn the cube or pick a service.')}</p>{descs}</div>
</div>'''

    def build_home(s):
        t = s.t
        faqcats = [(t('Ιστοσελίδες', 'Websites'), [1, 3, 4]), ('E-commerce', [10, 11, 12, 13]), (t('Τιμές', 'Pricing'), [0, 5, 14]),
                   (t('Hosting & συντήρηση', 'Hosting & maintenance'), [8, 9]), (t('Διαδικασία', 'Process'), [2, 6]), (t('Ιδιοκτησία & υποστήριξη', 'Ownership & support'), [7, 15])]
        pick = lambda p: p[1] if s.l == 'en' else p[0]
        faq = ''
        faq = f'<div class="fq-tabs" role="group" aria-label="{t("Φίλτρο ερωτήσεων", "Filter questions")}"><button type="button" aria-pressed="true" data-cat="all">{t("Όλες", "All")}</button>' + ''.join(f'<button type="button" aria-pressed="false" data-cat="{n}">{esc(title)}</button>' for n, (title, _) in enumerate(faqcats)) + '</div>'
        for n, (title, idx) in enumerate(faqcats):
            faq += f'<div class="fcat rv" data-cat="{n}"><h3>{esc(title)}</h3>' + ''.join(f'<details><summary>{esc(pick(QA[i][0]))}</summary><div class="ans"><p>{esc(pick(QA[i][1]))}</p></div></details>' for i in idx) + '</div>'
        def panel(pid, steps, hidden, note):
            li = ''.join(f'<li><span class="dot" aria-hidden="true">{i+1}</span><span class="day">{esc(pick(st[0]))}</span><h3>{names[i]}</h3><p>{esc(pick(st[2]))}</p></li>' for i, st in enumerate(steps))
            return f'<div class="panel" id="{pid}" role="tabpanel" aria-labelledby="{pid}-t"{" hidden" if hidden else ""}><ol class="steps">{li}</ol><p class="note">{note}</p></div>'
        names = ['Discover', 'Concept', 'Design &amp; Build', 'Refine &amp; Test', 'Launch']
        ld = {"@context": "https://schema.org", "@graph": [
            {"@type": "ProfessionalService", "@id": SITE + "/#org", "name": "Athens Digital Frame", "url": SITE + "/", "image": SITE + "/og-v4.jpg", "logo": SITE + "/assets/df-mark.png",
             "description": t('Ψηφιακό στούντιο στην Αθήνα: ιστοσελίδες και e-shops για επιχειρήσεις.', 'Digital studio in Athens: websites and e-shops for businesses.'),
             "email": MAIL, "telephone": TEL, "sameAs": [IG], "areaServed": "Athens, Greece", "address": {"@type": "PostalAddress", "addressLocality": "Athens", "addressCountry": "GR"},
             "knowsLanguage": ["el", "en"],
             "hasOfferCatalog": {"@type": "OfferCatalog", "name": t('Υπηρεσίες', 'Services'), "itemListElement": [
                 {"@type": "Offer", "itemOffered": {"@type": "Service", "name": t(a, b), "description": t(c, d)}} for a, b, c, d, _ in SERVICES]}},
            {"@type": "WebSite", "name": "Athens Digital Frame", "url": SITE + "/", "inLanguage": s.l},
            {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": pick(QA[i][0]), "acceptedAnswer": {"@type": "Answer", "text": pick(QA[i][1])}} for _, idx in faqcats for i in idx]}]}
        out = s.head(t('Athens Digital Frame | Ιστοσελίδες & e-shops στην Αθήνα', 'Athens Digital Frame | Websites & e-shops in Athens'),
                     t('Ψηφιακό στούντιο στην Αθήνα. Σύγχρονες ιστοσελίδες από 300€ και e-shops, με δωρεάν demo πριν από οποιαδήποτε πληρωμή.', 'A digital studio in Athens. Modern websites from €300 and e-shops, with a free demo before any payment.'),
                     '/', '/en/', 'og-v4.jpg' if s.l == 'el' else 'og-en-v2.jpg', ld)
        out += s.header()
        out += f'''<section class="hero dark"><div class="wrap grid">
<div><p class="eyebrow">Athens Digital Frame — Digital Studio</p>
<h1 class="h1">Websites designed to <em>move your business</em> forward.</h1>
<p class="lead">{t('Σχεδιάζουμε και κατασκευάζουμε σύγχρονες ιστοσελίδες και e-shops για επιχειρήσεις που θέλουν να ξεχωρίζουν.','We design and build modern websites and e-shops for businesses that want to stand out.')}</p>
<div class="btns"><a class="btn gold" href="#contact">{t('Ζήτησε δωρεάν demo','Request a free demo')} {ARROW}</a><a class="btn ghost" href="#projects">{t('Ανακάλυψε τα projects','Explore the projects')}</a></div>
<div class="meta"><div><b>3–5</b>{t('ημέρες έως το live','days to go live')}</div><div><b>300€</b>{t('ιστοσελίδα, εφάπαξ','website, one-time')}</div><div><b>0€</b>{t('πριν δεις το demo','before you see the demo')}</div></div></div>
{s.cube()}
</div></section>
<section class="sec paper" id="studio" aria-labelledby="advh"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">01 — {t('Το στούντιο','Studio')}</p><h2 class="h2" id="advh">{t('Σχεδιασμένο με προσοχή. Φτιαγμένο για την επιχείρησή σου.','Thoughtfully made. Built for your business.')}</h2></div></div>
<ul class="adv">
<li class="rv"><span class="n">01</span><h3>{t('Προσεγμένος σχεδιασμός','Thoughtful design')}</h3><p>{t('Πρώτα για κινητό, με καθαρή δομή και γρήγορη φόρτωση. Ελέγχουμε την ταχύτητα σε κινητό πριν βγει live.','Mobile-first, with a clear structure and fast loading. We check mobile speed before launch.')}</p></li>
<li class="rv d1"><span class="n">02</span><h3>{t('Φτιαγμένο για επιχειρήσεις','Built for business')}</h3><p>{t('Φόρμα επικοινωνίας, Google Maps και βασικό local SEO, ώστε οι πελάτες να σε βρίσκουν και να σε προσεγγίζουν εύκολα.','A contact form, Google Maps and local SEO basics, so customers can find and reach you easily.')}</p></li>
<li class="rv d2"><span class="n">03</span><h3>{t('Προσωπική συνεργασία','Personal collaboration')}</h3><p>{t('Μικρό στούντιο στην Αθήνα: μιλάς απευθείας με όσους φτιάχνουν το site σου, χωρίς ενδιάμεσους.','A small Athens studio: you talk directly to the people building your site, with no middlemen.')}</p></li>
<li class="rv d3"><span class="n">04</span><h3>{t('Διαφανείς τιμές','Transparent pricing')}</h3><p>{t('Ξεκάθαρες τιμές, χωρίς κρυφά κόστη, και δωρεάν demo πριν από οποιαδήποτε πληρωμή.','Clear prices, no hidden costs, and a free demo before any payment.')}</p></li></ul>
</div></section>
<section class="sec" id="services" aria-labelledby="svch"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">02 — {t('Υπηρεσίες','Services')}</p><h2 class="h2" id="svch">{t('Έξι πλευρές ενός στούντιο.','Six sides of one studio.')}</h2></div></div>
<ol class="caps">{''.join(f'<li class="rv"><span class="n">{i + 1:02d}</span><h3>{esc(t(a, b))}</h3><p>{esc(t(c, d))}</p><button type="button" class="caps-go" data-face="{i}">{t("Δες τη στον κύβο", "Show it on the cube")} {ARROW}</button></li>' for i, (a, b, c, d, _) in enumerate(SERVICES))}</ol>
</div></section>
<section class="sec paper" id="projects" aria-labelledby="projh"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">03 — Projects</p><h2 class="h2" id="projh">{t('Δύο concept projects, σχεδιασμένα από εμάς.','Two concept projects, designed by us.')}</h2></div>
<p class="lead">{t('Φανταστικές εταιρείες χωρίς πραγματικό πελάτη. Τα φτιάξαμε για να δείξουμε πώς δουλεύουμε.','Fictional companies with no real client. We made them to show how we work.')}</p></div>
{''.join(s.work(i, k) for i, k in enumerate(CASES))}
<p class="more rv">{t('Περισσότερα demo concepts έρχονται σύντομα.','More demo concepts are coming soon.')}</p>
</div></section>
<section class="sec dark" id="process" aria-labelledby="proch"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">04 — {t('Διαδικασία','Process')}</p><h2 class="h2" id="proch">{t('Από το brief ως το live, σε πέντε βήματα.','From brief to live, in five steps.')}</h2></div><p class="lead">{t('Δύο δρόμοι, ίδια απλά βήματα. Το demo έρχεται πριν από οποιαδήποτε πληρωμή.','Two paths, the same simple steps. The demo comes before any payment.')}</p></div>
<div class="tabs" role="tablist" aria-label="{t('Ιστοσελίδα ή e-shop','Website or e-shop')}"><button role="tab" id="p-site-t" aria-selected="true" aria-controls="p-site" type="button">{t('Ιστοσελίδα','Website')}</button><button role="tab" id="p-shop-t" aria-selected="false" aria-controls="p-shop" type="button">E-shop</button></div>
{panel('p-site', SITE_STEPS, False, t('Ιστοσελίδα: live σε 3–5 ημέρες. Συνδέουμε domain και hosting και σου δείχνουμε με σύντομα βίντεο πώς το διαχειρίζεσαι. Η συντήρηση είναι προαιρετική.','Website: live in 3–5 days. We connect domain and hosting and show you how to manage it in short videos. Maintenance is optional.'))}
{panel('p-shop', SHOP_STEPS, True, t('E-shop: live σε 3–5 ημέρες, με δοκιμαστική παραγγελία πριν ανοίξει. Μετά την παράδοση προσθέτεις μόνος σου προϊόντα με τα βίντεο οδηγιών.','E-shop: live in 3–5 days, with a test order before it opens. After handover you add products yourself using the video tutorials.'))}
</div></section>
<section class="sec" id="pricing" aria-labelledby="prh"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">05 — {t('Τιμές','Pricing')}</p><h2 class="h2" id="prh">{t('Ξεκάθαρες τιμές. Τίποτα κρυφό.','Clear prices. Nothing hidden.')}</h2></div><p class="lead">{t('Εφάπαξ, επαναλαμβανόμενα, υποχρεωτικά και προαιρετικά κόστη, ξεχωριστά.','One-time, recurring, mandatory and optional costs, kept apart.')}</p></div>
{s.plans()}
<p class="vat">{t('Οι τιμές δεν υπόκεινται σε ΦΠΑ. Πιο σύνθετα sites τιμολογούνται ανάλογα με την πολυπλοκότητα.','Prices are not subject to VAT. More complex sites are quoted by complexity.')}</p>
<div class="btns" style="margin-top:32px"><a class="btn" href="{s.prices()}">{t('Δες όλες τις τιμές','See all pricing')} {ARROW}</a><a class="btn ghost" href="#contact">{t('Ζήτησε δωρεάν demo','Request a free demo')}</a></div>
</div></section>
<section class="sec paper" id="about" aria-labelledby="abh"><div class="wrap why">
<div class="rv"><p class="eyebrow">06 — {t('Το στούντιο','About')}</p><h2 class="h2" id="abh">{t('Ένα μικρό στούντιο στην Αθήνα.','A small studio in Athens.')}</h2>
<div class="txt"><p>{t('Η Athens Digital Frame φτιάχνει ιστοσελίδες και e-shops για τοπικές επιχειρήσεις. Δουλεύουμε σε μικρή κλίμακα, ώστε κάθε project να έχει την προσοχή που του αναλογεί και να μιλάς πάντα απευθείας με εμάς.','Athens Digital Frame builds websites and e-shops for local businesses. We work at a small scale so every project gets the attention it deserves and you always talk to us directly.')}</p>
</div>
<p class="pull">{t('Ένα site που ξέρεις ότι φτιάχτηκε για σένα.','A site you know was made for you.')}</p>
<ul class="facts"><li><b>{t('Έδρα','Base')}</b><span>{t('Αθήνα, Ελλάδα','Athens, Greece')}</span></li><li><b>{t('Γλώσσες','Languages')}</b><span>{t('Ελληνικά και English','Greek and English')}</span></li><li><b>Instagram</b><span><a href="{IG}" target="_blank" rel="noopener">@athens.digitalframe</a></span></li></ul></div>
<dl class="rv d1 pts"><dt>{t('Φιλοσοφία','Philosophy')}</dt><dd>{t('Κάθε επιχείρηση χρειάζεται ένα site που εξηγεί καθαρά τι κάνει και κάνει εύκολο το επόμενο βήμα. Αυτό σχεδιάζουμε πρώτα, πριν από τα στολίδια.','Every business needs a site that explains clearly what it does and makes the next step easy. We design that first, before the decoration.')}</dd>
<dt>{t('Προσοχή στη λεπτομέρεια','Attention to detail')}</dt><dd>{t('Μελετάμε την επιχείρησή σου και την περιοχή σου, και ελέγχουμε την ταχύτητα σε κινητό πριν από το live.','We study your business and your area, and check mobile speed before launch.')}</dd>
<dt>{t('Άμεση επικοινωνία','Direct communication')}</dt><dd>{t('Μιλάς απευθείας με εμάς, με DM, WhatsApp, τηλέφωνο ή email.','You talk directly to us, by DM, WhatsApp, phone or email.')}</dd>
<dt>{t('Διαφανείς τιμές','Transparent pricing')}</dt><dd>{t('Οι τιμές είναι γραμμένες πάνω στο site, ξεχωριστά οι εφάπαξ και οι μηνιαίες, και το demo είναι δωρεάν.','Prices are written on the site, with one-time and recurring costs kept apart, and the demo is free.')}</dd>
<dt>{t('Οργανωμένη διαδικασία','Organised process')}</dt><dd>{t('Πέντε σαφή βήματα, live σε 3–5 ημέρες.','Five clear steps, live in 3–5 days.')}</dd></dl>
</div></section>
<section class="sec" id="faq" aria-labelledby="fqh"><div class="wrap faq">
<div class="side rv"><p class="eyebrow">07 — FAQ</p><h2 class="h2" id="fqh">{t('Πριν μας στείλεις μήνυμα.','Before you message us.')}</h2></div><div>{faq}</div>
</div></section>
<section class="sec dark" id="contact" aria-labelledby="cth"><div class="wrap"><div class="fr closing">{LOGO}<div class="contact">
<div class="rv"><p class="eyebrow">08 — {t('Επικοινωνία','Contact')}</p><h2 class="h2" id="cth">{t('Δες πώς θα φαινόταν το δικό σου site.','See how your own site would look.')}</h2><p class="lead" style="margin-top:20px">{t('Το δωρεάν demo έρχεται πριν από οποιαδήποτε πληρωμή. Δεν σου αρέσει; Δεν πληρώνεις τίποτα.','The free demo comes before any payment. Do not like it? You pay nothing.')}</p>
<div class="ways"><a href="{DM}" target="_blank" rel="noopener"><span>Instagram DM</span><span>@athens.digitalframe</span></a><a href="https://wa.me/{WA}" target="_blank" rel="noopener"><span>WhatsApp</span><span>+30 698 186 2732</span></a><a href="tel:{TEL}"><span>{t('Τηλέφωνο','Phone')}</span><span>+30 698 186 2732</span></a><a href="mailto:{MAIL}"><span>Email</span><span>{MAIL}</span></a></div></div>
<div class="rv d1">{s.form()}</div>
</div><i class="mk a"></i><i class="mk b"></i><i class="mk c"></i><i class="mk d"></i></div></div></section>
'''
        out += s.footer(''.join(f'\n<script src="{u}" defer></script>' for u in CUBE))
        return out

    # ----- PRICES -----
    def plans(s):
        """Home pricing: the three packages side by side with the same rows, so they compare line by line.
        Every figure and note is copied from the previous services and pricing blocks; change prices only with the owner."""
        t = s.t
        req = lambda x: f'<span class="tag2 req">{x}</span>'
        ft = lambda *xs: '<ul class="ft">' + ''.join(f'<li>{x}</li>' for x in xs) + '</ul>'
        rows = [t('Εφάπαξ', 'One-time'), t('Επαναλαμβανόμενο', 'Recurring'), t('Περιλαμβάνει', 'Included'), t('Προαιρετικά', 'Optional'), t('Πρώτο έτος', 'First year')]
        P = [
            (t('Ιστοσελίδα επιχείρησης', 'Business website'), t('Για επαγγελματίες, ιατρεία, δικηγορικά γραφεία, αρχιτέκτονες και τοπικές υπηρεσίες.', 'For professionals, clinics, law firms, architects and local services.'),
             [f'<b>300€</b> {t("κατασκευή", "development")}',
              f'<b>50€ / {t("έτος", "year")}</b> hosting &amp; domain {req(t("Υποχρεωτικό", "Required"))}',
              ft(t('Έως 3 σελίδες', 'Up to 3 pages'), t('Σχεδιασμός πρώτα για κινητό', 'Mobile-first design'), t('Φόρμα επικοινωνίας και Google Maps', 'Contact form and Google Maps'), t('Βασικό local SEO', 'Local SEO basics')),
              f'<b>20€ / {t("μήνα", "month")}</b> {t("συντήρηση", "maintenance")}<span class="s">{t("Ενημερώσεις, backups, ασφάλεια και μικρές αλλαγές σε κείμενα και φωτογραφίες.", "Updates, backups, security and small changes to text and photos.")}</span>',
              f'<b class="big">350€</b><span class="s">{t("300€ + 50€, πριν από την προαιρετική συντήρηση.", "€300 + €50, before optional maintenance.")}</span>']),
            ('E-commerce', t('Για καταστήματα και δημιουργούς που θέλουν να πουλήσουν online χωρίς μεγάλο αρχικό κόστος.', 'For shops and creators who want to sell online without a large upfront cost.'),
             [f'<b>200–300€</b> {t("εγκατάσταση", "setup")}',
              f'<b>30–50€ / {t("μήνα", "month")}</b> {t("συνδρομή", "subscription")} {req(t("Υποχρεωτικό · 12 μήνες", "Required · 12 months"))}<span class="s">{t("Cloud hosting, εβδομαδιαίες ενημερώσεις, καθημερινά backups, βιβλιοθήκη βίντεο.", "Cloud hosting, weekly updates, daily backups, video library.")}</span>',
              ft(t('Πληρωμές με Viva Wallet ή Stripe', 'Payments with Viva Wallet or Stripe'), t('Αντικαταβολή και σταθερό κόστος αποστολής', 'Cash on delivery and flat-rate shipping'), t('Έως 5 προϊόντα-δείγμα στην εγκατάσταση', 'Up to 5 sample products at setup')),
              '<b>150€</b> Skroutz / BestPrice<br><b>120€</b> BOX NOW',
              f'<b class="big">560–900€</b><span class="s">{t("200–300€ + 12 × 30–50€, πριν από τα προαιρετικά.", "€200–300 + 12 × €30–50, before optional extras.")}</span>']),
            (t('Custom λύσεις', 'Custom website solutions'), t('Πιο σύνθετες ιστοσελίδες, πέρα από τις 3 σελίδες του βασικού πακέτου.', 'More complex websites, beyond the 3 pages of the basic package.'),
             [f'<b>{t("Με προσφορά", "Quoted")}</b>', '—',
              ft(t('Τιμή ανάλογα με την πολυπλοκότητα', 'Priced by complexity'), t('Ξεκάθαρη προσφορά πριν ξεκινήσουμε', 'A clear quote before we start')),
              '—',
              f'<b class="big">{t("Με προσφορά", "Quoted")}</b><span class="s">{t("Στείλε μας τι χρειάζεσαι και απαντάμε με τιμή.", "Tell us what you need and we reply with a price.")}</span>']),
        ]
        cols = ''.join(f'<article class="plan rv{" d" + str(i) if i else ""}"><h3>{n}</h3><p class="who">{w}</p><dl>' + ''.join(f'<div><dt>{r}</dt><dd>{v}</dd></div>' for r, v in zip(rows, vals)) + '</dl></article>' for i, (n, w, vals) in enumerate(P))
        out = f'<div class="plans">{cols}</div>'
        return re.sub(r'(\d[\d–]*)€', r'€\1', out) if s.l == 'en' else out   # English writes €300, Greek 300€
    def work(s, i, key):
        """One project in Selected Work: a large framed preview that opens the case study, then one meta row."""
        t = s.t; c = CASES[key]; case = s.case(key)
        pv = s.frame(f'<a class="lnk" href="{case}" aria-label="{c["name"]}: {t("case study", "case study")}">' + s.browser(key + '-d.webp', 'athensdigitalframe.vercel.app' + c['live'].rstrip('/'), t(*c['alt'])) + '</a>')
        return f'''<article class="work">
<div class="pv rv">{pv}{s.phone(key + '-m.webp', c['name'] + ' ' + t('σε κινητό', 'on a phone'))}</div>
<div class="work-meta rv d1"><span class="n">{i + 1:02d}</span><div class="work-t"><h3>{c['name']}</h3><p class="k">{esc(t(*c['sector']))}</p></div>
<p class="work-d"><span class="chip">{t('Self-initiated concept · φανταστική εταιρεία', 'Self-initiated concept · fictional company')}</span>{esc(t(*c['lead']))}</p>
<div class="btns"><a class="btn" href="{case}">{t('Διάβασε το case study', 'Read the case study')} {ARROW}</a><a class="btn ghost" href="{c['live']}" target="_blank" rel="noopener">{t('Δες το live', 'View live')} ↗</a></div></div>
</article>'''
    def case(s, key): return f'{s.pre}/work/{key}.html'
    def build_case(s, key):
        t = s.t; c = CASES[key]; p = lambda x: esc(t(*x)); o = CASES[c['other']]
        img = key  # assets/<key>-d.webp and -m.webp
        url = f'/work/{key}.html'
        ld = {"@context": "https://schema.org", "@type": "CreativeWork", "name": c['name'], "url": SITE + s.case(key), "inLanguage": s.l,
              "description": t(*c['lead']), "creator": {"@id": SITE + "/#org"}}
        out = s.head(f"{c['name']} | {t('Concept project', 'Concept project')} | Athens Digital Frame", t(*c['lead']), url, '/en' + url, c['og'], ld)
        out += s.header(path=url)
        chip = f'<span class="chip">{t("Self-initiated concept · φανταστική εταιρεία", "Self-initiated concept · fictional company")}</span>'
        stages = ''.join(f'<figure><picture><source srcset="/olivane/img/{n}-m.avif" type="image/avif"><img src="/olivane/img/{n}-m.webp" width="1170" height="653" alt="{p(a)}" loading="lazy" decoding="async"></picture><figcaption>{i + 1:02d}</figcaption></figure>' for i, (n, a) in enumerate(c['stages']))
        out += f'''<section class="phero dark"><div class="wrap">{chip}<p class="eyebrow">{p(c['sector'])}</p>
<h1 class="h1" style="max-width:14ch;font-size:clamp(38px,5vw + 14px,76px)">{c['name']}</h1>
<p class="lead" style="max-width:46ch">{p(c['lead'])}</p>
<div class="btns" style="margin-top:32px"><a class="btn gold" href="{c['live']}" target="_blank" rel="noopener">{t('Δες το live', 'View live')} {ARROW}</a><a class="btn ghost" href="{s.home('#contact')}">{t('Ζήτησε δωρεάν demo', 'Request a free demo')}</a></div></div></section>
<section class="sec paper"><div class="wrap"><div class="pv cs-pv rv">{s.frame(s.browser(img + '-d.webp', 'athensdigitalframe.vercel.app' + c['live'].rstrip('/'), t(*c['alt']), eager=True))}<div class="phone"><img src="/assets/{img}-m.webp" width="390" height="844" alt="{c['name']} {t('σε κινητό', 'on a phone')}" loading="lazy" decoding="async"></div></div></div></section>
<section class="sec" aria-labelledby="cs1"><div class="wrap about">
<div class="rv"><p class="eyebrow">01 — Brief</p><h2 class="h2" id="cs1">{t('Το brief που θέσαμε.', 'The brief we set.')}</h2></div>
<div class="txt rv d1">{''.join(f'<p>{p(x)}</p>' for x in c['brief'])}
<ul class="facts" style="margin-top:32px"><li><b>{t('Είδος', 'Type')}</b><span>{t('Concept project με δική μας πρωτοβουλία', 'Self-initiated concept project')}</span></li><li><b>{t('Πελάτης', 'Client')}</b><span>{t('Κανένας· φανταστική εταιρεία', 'None; fictional company')}</span></li><li><b>{t('Αντικείμενο', 'Scope')}</b><span>{t('Σχεδιασμός και κατασκευή', 'Design and build')}</span></li><li><b>Live</b><span><a href="{c['live']}" target="_blank" rel="noopener">athensdigitalframe.vercel.app{c['live'].rstrip('/')}</a></span></li></ul></div>
</div></section>
<section class="sec paper" aria-labelledby="cs2"><div class="wrap"><div class="about">
<div class="rv"><p class="eyebrow">02 — {t('Κατεύθυνση', 'Direction')}</p><h2 class="h2" id="cs2">{t('Σχεδιαστική κατεύθυνση.', 'Design direction.')}</h2></div>
<div class="txt rv d1">{''.join(f'<p>{p(x)}</p>' for x in c['direction'])}
<ul class="sw" aria-label="{t('Χρώματα', 'Colours')}">{''.join(f'<li><i style="background:{h}"></i>{h.upper()}</li>' for h in c['palette'])}</ul>
<ul class="facts">{''.join(f'<li><b>{esc(n)}</b><span>{p(r)}</span></li>' for n, r in c['fonts'])}</ul></div></div>
{f'<div class="stages rv">{stages}</div>' if stages else ''}</div></section>
<section class="sec" aria-labelledby="cs3"><div class="wrap">
<div class="sechead rv"><div><p class="eyebrow">03 — {t('Στοιχεία', 'Components')}</p><h2 class="h2" id="cs3">{t('Τι περιέχει.', 'What it contains.')}</h2></div></div>
<ol class="caps">{''.join(f'<li class="rv"><span class="n">{i + 1:02d}</span><h3>{p(h)}</h3><p>{p(x)}</p></li>' for i, (h, x) in enumerate(c['parts']))}</ol>
</div></section>
<section class="sec paper" aria-labelledby="cs4"><div class="wrap about">
<div class="rv"><p class="eyebrow">04 — {t('Συμπεριφορά', 'Behaviour')}</p><h2 class="h2" id="cs4">{t('Κινητό και κίνηση.', 'Phone and motion.')}</h2></div>
<div class="txt rv d1"><ul class="facts"><li><b>Responsive</b><span>{p(c['responsive'])}</span></li><li><b>{t('Κίνηση', 'Motion')}</b><span>{p(c['motion'])}</span></li><li><b>{t('Δείγματα', 'Samples')}</b><span>{p(c['sample'])}</span></li></ul></div>
</div></section>
<section class="sec dark" aria-labelledby="cs5"><div class="wrap about">
<div class="rv"><p class="eyebrow">05 — {t('Επόμενο βήμα', 'Next step')}</p><h2 class="h2" id="cs5">{t('Δες πώς θα φαινόταν το δικό σου site.', 'See how your own site would look.')}</h2></div>
<div class="txt rv d1"><p>{t('Το δωρεάν demo έρχεται πριν από οποιαδήποτε πληρωμή. Δεν σου αρέσει; Δεν πληρώνεις τίποτα.', 'The free demo comes before any payment. Do not like it? You pay nothing.')}</p>
<div class="btns" style="margin-top:24px"><a class="btn gold" href="{s.home('#contact')}">{t('Ζήτησε δωρεάν demo', 'Request a free demo')} {ARROW}</a><a class="btn ghost" href="{s.case(c['other'])}">{t('Επόμενο concept', 'Next concept')}: {o['name']}</a></div></div>
</div></section>
'''
        out += s.footer()
        return out

    def build_privacy(s):
        """Every statement here describes what the site actually does; change the code first, then this text."""
        t = s.t; url = '/privacy.html'
        VA = 'https://vercel.com/docs/analytics/privacy-policy'
        parts = [
            (t('Ποιοι είμαστε', 'Who we are'), t(f'Η Athens Digital Frame είναι ένα μικρό ψηφιακό στούντιο στην Αθήνα. Για οτιδήποτε αφορά τα δεδομένα σου, γράψε μας στο <a href="mailto:{MAIL}">{MAIL}</a>.', f'Athens Digital Frame is a small digital studio in Athens, Greece. For anything about your data, write to <a href="mailto:{MAIL}">{MAIL}</a>.')),
            (t('Η φόρμα επικοινωνίας', 'The contact form'), t('Η φόρμα δεν στέλνει τίποτα σε εμάς ή σε κάποιον server. Όταν πατάς το κουμπί, ανοίγει το WhatsApp ή η εφαρμογή email σου με έτοιμο μήνυμα. Το λαμβάνουμε μόνο αν πατήσεις αποστολή εκεί. Από εκείνο το σημείο, το μήνυμα το διαχειρίζεται το WhatsApp ή ο πάροχος email σου με τους δικούς του όρους.', 'The form does not send anything to us or to a server. When you press the button, it opens WhatsApp or your email app with a prepared message. We receive it only if you press send there. From that point the message is handled by WhatsApp or your email provider under their own terms.')),
            (t('Τα μηνύματα που μας στέλνεις', 'Messages you send us'), t('Αν επικοινωνήσεις μαζί μας με Instagram, WhatsApp, τηλέφωνο ή email, χρησιμοποιούμε όσα μας γράφεις μόνο για να σου απαντήσουμε και να ετοιμάσουμε το demo ή το project σου. Δεν τα πουλάμε και δεν τα δίνουμε σε τρίτους για διαφήμιση.', 'If you contact us by Instagram, WhatsApp, phone or email, we use what you tell us only to reply and to prepare your demo or project. We do not sell it or pass it to anyone for advertising.')),
            (t('Στατιστικά επισκεψιμότητας', 'Visitor statistics'), t(f'Χρησιμοποιούμε το Vercel Web Analytics για να βλέπουμε πόσοι επισκέπτονται το site και ποιες σελίδες ανοίγουν. Σύμφωνα με τη Vercel, δεν χρησιμοποιεί cookies, τα δεδομένα είναι ανώνυμα και δεν συνδέονται με συγκεκριμένο άτομο ή διεύθυνση IP, και η συνεδρία ενός επισκέπτη διαγράφεται μετά από 24 ώρες. <a href="{VA}" target="_blank" rel="noopener">Η πολιτική της Vercel</a>.', f'We use Vercel Web Analytics to see how many people visit and which pages they open. According to Vercel, it uses no cookies, the data is anonymous and not tied to an individual or an IP address, and a visitor session is discarded after 24 hours. <a href="{VA}" target="_blank" rel="noopener">Vercel\'s policy</a>.')),
            (t('Φιλοξενία', 'Hosting'), t('Το site φιλοξενείται στη Vercel. Όπως κάθε πάροχος φιλοξενίας, επεξεργάζεται τεχνικά δεδομένα του αιτήματος, όπως τη διεύθυνση IP σου, για να σου παραδώσει τις σελίδες.', 'The site is hosted by Vercel. Like any web host, it processes technical request data such as your IP address in order to deliver the pages.')),
            ('Cookies', t('Το site δεν τοποθετεί cookies, γι’ αυτό δεν υπάρχει banner για cookies.', 'This site does not set cookies, which is why there is no cookie banner.')),
            (t('Τα concept demos', 'The concept demos'), t('Τα δύο concept sites (Olivane Estate, Arclines Freight) φορτώνουν τις γραμματοσειρές τους από το Google Fonts, οπότε ο browser σου συνδέεται με την Google όταν τα ανοίγεις. Οι φόρμες τους είναι επιδείξεις και δεν στέλνουν τίποτα.', 'The two concept sites (Olivane Estate, Arclines Freight) load their fonts from Google Fonts, so your browser connects to Google when you open them. Their forms are demonstrations and send nothing.')),
            (t('Τα δικαιώματά σου', 'Your rights'), t('Με βάση τον GDPR μπορείς να ρωτήσεις ποια δεδομένα σου έχουμε και να ζητήσεις να τα διορθώσουμε ή να τα διαγράψουμε. Γράψε μας στο παραπάνω email. Μπορείς επίσης να απευθυνθείς στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (<a href="https://www.dpa.gr" target="_blank" rel="noopener">dpa.gr</a>).', 'Under the GDPR you can ask what data we hold about you and ask us to correct or delete it. Write to the email above. You can also complain to the Hellenic Data Protection Authority (<a href="https://www.dpa.gr" target="_blank" rel="noopener">dpa.gr</a>).')),
        ]
        title = t('Πολιτική απορρήτου', 'Privacy policy')
        ld = {"@context": "https://schema.org", "@type": "WebPage", "name": f'{title} | Athens Digital Frame', "url": SITE + s.pre + url, "inLanguage": s.l, "isPartOf": {"@id": SITE + "/#org"}}
        out = s.head(f'{title} | Athens Digital Frame', t('Τι δεδομένα επεξεργάζεται το site της Athens Digital Frame: χωρίς cookies, χωρίς λογαριασμούς, η φόρμα δεν αποθηκεύει τίποτα.', 'What data the Athens Digital Frame site processes: no cookies, no accounts, and the form stores nothing.'), url, '/en' + url, 'og-v4.jpg' if s.l == 'el' else 'og-en-v2.jpg', ld)
        out += s.header(path=url)
        out += f'''<section class="phero dark"><div class="wrap"><p class="eyebrow">{t('Νομικά', 'Legal')}</p>
<h1 class="h1" style="max-width:14ch;font-size:clamp(38px,5vw + 14px,76px)">{title}</h1>
<p class="lead" style="max-width:46ch">{t('Με λίγα λόγια: το site δεν τοποθετεί cookies, δεν έχει λογαριασμούς και δεν αποθηκεύει όσα γράφεις.', 'In short: this site sets no cookies, has no accounts and does not store what you type.')}</p></div></section>
<section class="sec"><div class="wrap about"><div><p class="eyebrow">{t('Τελευταία ενημέρωση', 'Last updated')}</p><p class="h2" style="font-size:var(--fs-2)">{t('11 Νοεμβρίου 2026', '11 November 2026')}</p></div>
<div class="txt legal">{''.join(f'<h2>{h}</h2><p>{x}</p>' for h, x in parts)}</div></div></section>
'''
        out += s.footer()
        return out

    def build_prices(s):
        t = s.t
        ld = {"@context": "https://schema.org", "@type": "WebPage", "name": t('Τιμές | Athens Digital Frame', 'Pricing | Athens Digital Frame'), "url": SITE + s.prices(), "inLanguage": s.l,
              "isPartOf": {"@id": SITE + "/#org"}}
        out = s.head(t('Τιμές ιστοσελίδων & e-shop | Athens Digital Frame', 'Website & e-shop pricing | Athens Digital Frame'),
                     t('Ιστοσελίδα 300€ για έως 3 σελίδες, hosting & domain 50€/έτος. E-shop με εγκατάσταση 200–300€ και συνδρομή 30–50€/μήνα. Χωρίς ΦΠΑ.', 'Website €300 for up to 3 pages, hosting & domain €50/year. E-shop with €200–300 setup and €30–50/month subscription. No VAT.'),
                     '/prices.html', '/en/prices.html', 'og-v4.jpg' if s.l == 'el' else 'og-en-v2.jpg', ld)
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
<div class="pcard"><span class="eyebrow">Custom</span><h3 style="margin-top:12px">{t('Πιο σύνθετη ιστοσελίδα','A more complex website')}</h3><p class="d">{t('Τιμή ανάλογα με την πολυπλοκότητα. Ξεκάθαρη προσφορά πριν ξεκινήσουμε.','Priced by complexity. A clear quote before we start.')}</p></div>
<div class="pcard"><span class="eyebrow">Extras</span><h3 style="margin-top:12px">{t('Επιπλέον υπηρεσίες','Additional services')}</h3>
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
    p = os.path.join(ROOT, path); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w', encoding='utf8', newline='\n').write(txt); print('wrote', path, len(txt))
if __name__ == '__main__':
    for lang in ('el', 'en'):
        p = Page(lang); pre = 'en/' if lang == 'en' else ''
        w(pre + 'index.html', p.build_home()); w(pre + 'prices.html', p.build_prices())
        for k in CASES: w(pre + f'work/{k}.html', p.build_case(k))
        w(pre + 'privacy.html', p.build_privacy())
    # sitemap from the same list of pages, so a new page cannot be forgotten
    pages = ['/', '/prices.html', '/privacy.html'] + [f'/work/{k}.html' for k in CASES]
    alt = lambda u: f'\n    <xhtml:link rel="alternate" hreflang="el" href="{SITE}{u}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="{SITE}/en{u}"/>'
    w('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
      + ''.join(f'  <url><loc>{SITE}{l}{u}</loc>{alt(u)}</url>\n' for u in pages for l in ('', '/en')) + '</urlset>\n')
