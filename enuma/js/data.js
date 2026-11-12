/* ENUMA ELISH demo catalogue. Fictional brand: names, prices and stock are samples.
   To add photos: set `src` on an image (path relative to /enuma/, e.g. 'img/p/hoodie-1.webp'). */
window.EE_DATA = {
  freeShipping: 120,
  colors: {
    'Washed Black': '#1c1c1c',
    'Concrete': '#858585',
    'Dirty White': '#EAE7E0',
    'Deep Red': '#A51F25'
  },
  collections: [
    { id: 'new', title: 'New arrivals', el: 'Νέες αφίξεις', jp: '新着' },
    { id: 'tees', title: 'T-shirts', el: 'T-shirts', jp: 'Tシャツ' },
    { id: 'hoodies', title: 'Hoodies', el: 'Hoodies', jp: 'フーディー' },
    { id: 'bottoms', title: 'Bottoms', el: 'Παντελόνια', jp: 'ボトムス' },
    { id: 'accessories', title: 'Accessories', el: 'Αξεσουάρ', jp: 'アクセサリー', soon: 'DROP 02' }
  ],
  guides: {
    top: {
      caption: 'Garment measurements, cm',
      head: ['Size', 'Chest', 'Length', 'Sleeve'],
      rows: [['XS', 124, 68, 58], ['S', 130, 70, 59], ['M', 136, 72, 60], ['L', 142, 74, 61], ['XL', 148, 76, 62]]
    },
    tee: {
      caption: 'Garment measurements, cm',
      head: ['Size', 'Chest', 'Length', 'Shoulder'],
      rows: [['XS', 108, 68, 54], ['S', 114, 70, 56], ['M', 120, 72, 58], ['L', 126, 74, 60], ['XL', 132, 76, 62]]
    },
    bottom: {
      caption: 'Garment measurements, cm',
      head: ['Size', 'Waist', 'Inseam', 'Leg opening'],
      rows: [['XS', 72, 78, 20], ['S', 76, 79, 21], ['M', 80, 80, 22], ['L', 86, 81, 23], ['XL', 92, 82, 24]]
    }
  },
  products: [
    {
      handle: 'tokyo-after-dark-hoodie',
      el: {"desc": "Το κομμάτι γύρω από το οποίο χτίστηκε το drop. Βαρύ βουρτσισμένο φούτερ, κομμένο φαρδύ και μακρύ, με διπλή κουκούλα που κρατά το σχήμα της και μετά το τελευταίο τρένο.", "fit": "Oversized, φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε το μέγεθος που φοράς συνήθως για την προβλεπόμενη πτώση ή ένα μικρότερο για πιο στενή εφαρμογή.", "model": "Το μοντέλο έχει ύψος 183 cm και φοράει M.", "fabric": ["Βουρτσισμένο φούτερ 480 GSM, 100% βαμβάκι", "Βαμμένο ως ρούχο και πλυμένο με ένζυμα", "Διπλή κουκούλα, χοντρά ριμπ σε μανίκια και τελείωμα"], "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο. Σιδέρωμα από την ανάποδη του τυπώματος."},
      name: 'Tokyo After Dark Hoodie',
      jp: '東京の夜',
      code: 'EE-01',
      collections: ['new', 'hoodies'],
      guide: 'top',
      price: 95,
      colors: ['Washed Black', 'Concrete'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      soldOut: ['Washed Black/XS', 'Concrete/XL'],
      desc: 'The piece the drop is built around. Heavy brushed fleece, cut boxy and long, with a double-layer hood that holds its shape after the last train.',
      fit: 'Oversized, boxy fit with a dropped shoulder. Take your usual size for the intended drape, or size down for a closer fit.',
      model: 'Model is 183 cm and wears size M.',
      fabric: ['480 GSM brushed-back fleece, 100% cotton', 'Garment-dyed and enzyme washed', 'Double-layer hood, heavy rib cuffs and hem'],
      care: 'Cold wash inside out. Do not tumble dry. Iron on the reverse of the print.',
      images: [{ src: null, label: 'Hoodie · front' }, { src: null, label: 'Hoodie · on model' }, { src: null, label: 'Hoodie · back print' }]
    },
    {
      handle: 'no-signal-tee',
      el: {"desc": "Βαρύ t-shirt με το όνομα του drop τυπωμένο στην πλάτη στα ιαπωνικά: 圏外, εκτός εμβέλειας.", "fit": "Χαλαρή, ελαφρώς κοντή φαρδιά εφαρμογή. Πάρε το κανονικό σου μέγεθος.", "model": "Το μοντέλο έχει ύψος 178 cm και φοράει L.", "fabric": ["Πενιέ βαμβακερό ζέρσεϊ 240 GSM", "Μεταξοτυπία με μελάνι νερού", "Ενισχυμένη λαιμόκοψη, διπλές ραφές"], "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."},
      name: 'No Signal Tee',
      jp: '圏外',
      code: 'EE-02',
      collections: ['new', 'tees'],
      guide: 'tee',
      price: 45,
      colors: ['Washed Black', 'Dirty White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      soldOut: ['Dirty White/S'],
      desc: 'A heavyweight tee with the drop name printed across the back in Japanese: 圏外, out of range.',
      fit: 'Relaxed, slightly cropped boxy fit. True to size.',
      model: 'Model is 178 cm and wears size L.',
      fabric: ['240 GSM combed cotton jersey', 'Water-based screen print', 'Taped neck, double-needle hems'],
      care: 'Cold wash inside out. Line dry.',
      images: [{ src: null, label: 'Tee · front' }, { src: null, label: 'Tee · back print' }]
    },
    {
      handle: 'exarchia-wall-tee',
      el: {"desc": "Ένα γκράφιτι από έναν τοίχο στα Εξάρχεια που ξαναβάφτηκε το επόμενο πρωί. Τυπωμένο μεγάλο, πλυμένο μαλακό.", "fit": "Χαλαρή, ελαφρώς κοντή φαρδιά εφαρμογή. Πάρε το κανονικό σου μέγεθος.", "model": "Το μοντέλο έχει ύψος 175 cm και φοράει M.", "fabric": ["Πενιέ βαμβακερό ζέρσεϊ 240 GSM", "Τύπωμα discharge, μαλακό στην αφή", "Ενισχυμένη λαιμόκοψη, διπλές ραφές"], "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."},
      name: 'Exarchia Wall Tee',
      jp: 'エクサルヒア',
      code: 'EE-03',
      collections: ['new', 'tees'],
      guide: 'tee',
      price: 45,
      colors: ['Dirty White', 'Deep Red'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      soldOut: [],
      desc: 'A graphic taken from a wall in Exarchia that was painted over the next morning. Printed big, washed soft.',
      fit: 'Relaxed, slightly cropped boxy fit. True to size.',
      model: 'Model is 175 cm and wears size M.',
      fabric: ['240 GSM combed cotton jersey', 'Discharge print, soft to the touch', 'Taped neck, double-needle hems'],
      care: 'Cold wash inside out. Line dry.',
      images: [{ src: null, label: 'Tee · front' }, { src: null, label: 'Tee · detail' }]
    },
    {
      handle: 'last-train-cargo-pant',
      el: {"desc": "Φαρδύ cargo με έξι τσέπες και ρυθμιζόμενο τελείωμα. Φτιαγμένο για κίνηση και για να κάθεσαι σε σκαλιά από μπετόν μέχρι το πρωί.", "fit": "Φαρδύ, ίσιο πόδι με μεσαίο καβάλο. Πάρε το κανονικό σου μέγεθος· το κορδόνι στο τελείωμα ρυθμίζει το μήκος.", "model": "Το μοντέλο έχει ύψος 183 cm και φοράει M.", "fabric": ["Βουρτσισμένο βαμβακερό twill 320 GSM", "Έξι τσέπες, φερμουάρ YKK", "Κορδόνι στο τελείωμα"], "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο."},
      name: 'Last Train Cargo Pant',
      jp: '終電',
      code: 'EE-04',
      collections: ['new', 'bottoms'],
      guide: 'bottom',
      price: 110,
      colors: ['Washed Black', 'Concrete'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      soldOut: ['Concrete/XL', 'Washed Black/XL'],
      desc: 'Wide cargo pants with six pockets and an adjustable hem. Built to move, and to sit on concrete steps until morning.',
      fit: 'Wide, straight leg with a mid rise. True to size; the hem drawcord adjusts the length.',
      model: 'Model is 183 cm and wears size M.',
      fabric: ['Brushed cotton twill, 320 GSM', 'Six pockets, YKK zip fly', 'Drawcord hem'],
      care: 'Cold wash inside out. Do not tumble dry.',
      images: [{ src: null, label: 'Cargo · front' }, { src: null, label: 'Cargo · on model' }]
    },
    {
      handle: 'shibuya-static-crewneck',
      el: {"desc": "Φούτερ λαιμόκοψη από loopback βαμβάκι με τύπωμα «παράσιτα» στο στήθος, σαν οθόνη στη Shibuya όταν χάνεται το σήμα.", "fit": "Oversized με πεσμένο ώμο. Πάρε ένα μέγεθος μικρότερο για κανονική εφαρμογή.", "model": "Το μοντέλο έχει ύψος 180 cm και φοράει L.", "fabric": ["Loopback βαμβάκι 420 GSM", "Βαμμένο ως ρούχο", "Ριμπ σε λαιμό, μανίκια και τελείωμα"], "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο."},
      name: 'Shibuya Static Crewneck',
      jp: '渋谷',
      code: 'EE-05',
      collections: ['hoodies'],
      guide: 'top',
      price: 85,
      colors: ['Concrete'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      soldOut: ['Concrete/M'],
      desc: 'A loopback crewneck with a static-noise print across the chest, like a screen in Shibuya after the signal drops.',
      fit: 'Oversized with a dropped shoulder. Size down for a regular fit.',
      model: 'Model is 180 cm and wears size L.',
      fabric: ['420 GSM loopback cotton', 'Garment-dyed', 'Rib collar, cuffs and hem'],
      care: 'Cold wash inside out. Do not tumble dry.',
      images: [{ src: null, label: 'Crewneck · front' }, { src: null, label: 'Crewneck · on model' }]
    },
    {
      handle: 'monastiraki-track-pant',
      el: {"desc": "Φόρμα για skate στο Μοναστηράκι τη νύχτα: μακρύ, χαλαρό πόδι, πλαϊνές ρίγες σε βαθύ κόκκινο και φερμουάρ στους αστραγάλους.", "fit": "Χαλαρό, μακρύ πόδι με λάστιχο και κορδόνι στη μέση. Πάρε το κανονικό σου μέγεθος.", "model": "Το μοντέλο έχει ύψος 178 cm και φοράει M.", "fabric": ["Βουρτσισμένο πολυβαμβακερό τρικό", "Πλαϊνή ρίγα", "Φερμουάρ στους αστραγάλους και τις τσέπες"], "care": "Πλύσιμο σε κρύο νερό. Στέγνωμα στον αέρα."},
      name: 'Monastiraki Track Pant',
      jp: 'モナスティラキ',
      code: 'EE-06',
      collections: ['bottoms'],
      guide: 'bottom',
      price: 90,
      colors: ['Washed Black'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      soldOut: [],
      desc: 'Track pants for skating Monastiraki at night: a long, loose leg, side stripes in deep red and zipped ankles.',
      fit: 'Loose, long leg with an elastic waist and drawcord. True to size.',
      model: 'Model is 178 cm and wears size M.',
      fabric: ['Brushed poly-cotton tricot', 'Side stripe tape', 'Zipped ankles and pockets'],
      care: 'Cold wash. Line dry.',
      images: [{ src: null, label: 'Track pant · front' }, { src: null, label: 'Track pant · on model' }]
    }
  ],
  media: {
    hero: { src: null, label: 'Hero · lifestyle', alt: 'A figure in the Tokyo After Dark Hoodie on a backstreet stairway at night', altEl: 'Μια φιγούρα με το Tokyo After Dark Hoodie σε σκάλες στενού τη νύχτα' },
    tokyo: { src: null, label: 'Tokyo street', alt: 'A Tokyo backstreet at night', altEl: 'Ένα στενό στο Τόκιο τη νύχτα' },
    athens: { src: null, label: 'Athens street', alt: 'Painted walls in Exarchia, Athens', altEl: 'Ζωγραφισμένοι τοίχοι στα Εξάρχεια, Αθήνα' },
    campaign1: { src: null, label: 'Campaign 01', alt: 'Campaign photo on backstreet stairs', altEl: 'Φωτογραφία campaign σε σκάλες στενού' },
    campaign2: { src: null, label: 'Campaign 02', alt: 'Campaign photo in Exarchia, Athens', altEl: 'Φωτογραφία campaign στα Εξάρχεια, Αθήνα' },
    campaign3: { src: null, label: 'Campaign 03', alt: 'Campaign photo in Shibuya after the last train', altEl: 'Φωτογραφία campaign στη Shibuya μετά το τελευταίο τρένο' }
  }
};
