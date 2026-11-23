/* ENUMA ELISH demo catalogue. Fictional brand: names, prices and stock are samples.
   Images may carry a `color` so the gallery follows the selected colour. */
window.EE_DATA = {
  "freeShipping": 120,
  "colors": {
    "Washed Black": "#1c1c1c",
    "Concrete": "#858585",
    "Dirty White": "#EAE7E0",
    "Deep Red": "#A51F25",
    "Bone": "#E3DCCB"
  },
  "collections": [
    {
      "id": "new",
      "title": "New arrivals",
      "el": "Νέες αφίξεις",
      "jp": "新着",
      "img": "img/collections/collections_03_underground_product_only.webp"
    },
    {
      "id": "tees",
      "title": "T-shirts",
      "el": "T-shirts",
      "jp": "Tシャツ",
      "img": "img/collections/collections_02_athens_product_only.webp"
    },
    {
      "id": "hoodies",
      "title": "Hoodies",
      "el": "Hoodies",
      "jp": "フーディー",
      "img": "img/collections/collections_01_tokyo_product_only.webp"
    },
    {
      "id": "bottoms",
      "title": "Bottoms",
      "el": "Παντελόνια",
      "jp": "ボトムス",
      "img": "img/drop/newdrop_04_cargo_trousers.webp"
    },
    {
      "id": "accessories",
      "title": "Accessories",
      "el": "Αξεσουάρ",
      "jp": "アクセサリー",
      "soon": "DROP 02"
    }
  ],
  "guides": {
    "top": {
      "caption": "Garment measurements, cm",
      "head": [
        "Size",
        "Chest",
        "Length",
        "Sleeve"
      ],
      "rows": [
        [
          "XS",
          124,
          68,
          58
        ],
        [
          "S",
          130,
          70,
          59
        ],
        [
          "M",
          136,
          72,
          60
        ],
        [
          "L",
          142,
          74,
          61
        ],
        [
          "XL",
          148,
          76,
          62
        ]
      ]
    },
    "tee": {
      "caption": "Garment measurements, cm",
      "head": [
        "Size",
        "Chest",
        "Length",
        "Shoulder"
      ],
      "rows": [
        [
          "XS",
          108,
          68,
          54
        ],
        [
          "S",
          114,
          70,
          56
        ],
        [
          "M",
          120,
          72,
          58
        ],
        [
          "L",
          126,
          74,
          60
        ],
        [
          "XL",
          132,
          76,
          62
        ]
      ]
    },
    "bottom": {
      "caption": "Garment measurements, cm",
      "head": [
        "Size",
        "Waist",
        "Inseam",
        "Leg opening"
      ],
      "rows": [
        [
          "XS",
          72,
          78,
          20
        ],
        [
          "S",
          76,
          79,
          21
        ],
        [
          "M",
          80,
          80,
          22
        ],
        [
          "L",
          86,
          81,
          23
        ],
        [
          "XL",
          92,
          82,
          24
        ]
      ]
    }
  },
  "products": [
    {
      "collections": [
        "new",
        "hoodies"
      ],
      "guide": "top",
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Washed Black/XS",
        "Washed Black/XL"
      ],
      "handle": "athens-x-tokyo-hoodie",
      "name": "Athens × Tokyo Hoodie",
      "jp": "アテネ × 東京",
      "code": "EE-01",
      "price": 140,
      "colors": [
        "Washed Black"
      ],
      "desc": "The two cities on one hoodie: a skyline of temple columns and Tokyo towers, printed in faded stone grey across the chest and down both sleeves, on heavy washed-black fleece. Limited run.",
      "fit": "Relaxed fit with a dropped shoulder. Take your usual size.",
      "model": "Model is 180 cm and wears size M.",
      "fabric": [
        "420 GSM brushed-back cotton fleece, 100% cotton",
        "Distressed screen print, front and sleeves",
        "Double-layer hood, rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry. Do not iron the print.",
      "images": [
        {
          "src": "img/drop/newdrop_08_architecture_hoodie.webp",
          "bg": "#1a1a1a",
          "label": "Front"
        }
      ],
      "el": {
        "desc": "Οι δύο πόλεις σε ένα hoodie: ένας ορίζοντας με κίονες ναών και πύργους του Τόκιο, τυπωμένος σε ξεθωριασμένο γκρι της πέτρας στο στήθος και στα δύο μανίκια, πάνω σε βαρύ ξεβαμμένο μαύρο φούτερ. Περιορισμένη παραγωγή.",
        "fit": "Χαλαρή εφαρμογή με πεσμένο ώμο. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 180 cm και φοράει M.",
        "fabric": [
          "Βουρτσισμένο φούτερ 420 GSM, 100% βαμβάκι",
          "Ξεθωριασμένη μεταξοτυπία μπροστά και στα μανίκια",
          "Διπλή κουκούλα, ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο. Μη σιδερώνεις το τύπωμα."
      }
    },
    {
      "handle": "tokyo-after-dark-hoodie",
      "el": {
        "desc": "Το κομμάτι γύρω από το οποίο χτίστηκε το drop. Βαρύ ξεβαμμένο μαύρο φούτερ με ένα ξεθωριασμένο σχέδιο κωδωνοστασίου κάτω από το λογότυπο ENUMA ELISH στο στήθος.",
        "fit": "Oversized, φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε το μέγεθος που φοράς συνήθως για την προβλεπόμενη πτώση ή ένα μικρότερο για πιο στενή εφαρμογή.",
        "model": "Το μοντέλο έχει ύψος 183 cm και φοράει M.",
        "fabric": [
          "Βουρτσισμένο φούτερ 480 GSM, 100% βαμβάκι",
          "Ξεθωριασμένη μεταξοτυπία στο στήθος",
          "Διπλή κουκούλα, χοντρά ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο. Σιδέρωμα από την ανάποδη του τυπώματος."
      },
      "name": "Tokyo After Dark Hoodie",
      "jp": "東京の夜",
      "code": "EE-02",
      "collections": [
        "new",
        "hoodies"
      ],
      "guide": "top",
      "price": 95,
      "colors": [
        "Washed Black"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Washed Black/XS"
      ],
      "desc": "The piece the drop is built around. Heavy washed-black fleece with a faded spire graphic under an ENUMA ELISH wordmark across the chest.",
      "fit": "Oversized, boxy fit with a dropped shoulder. Take your usual size for the intended drape, or size down for a closer fit.",
      "model": "Model is 183 cm and wears size M.",
      "fabric": [
        "480 GSM brushed-back fleece, 100% cotton",
        "Distressed screen-printed chest graphic",
        "Double-layer hood, heavy rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry. Iron on the reverse of the print.",
      "images": [
        {
          "src": "img/drop/newdrop_07_spire_hoodie.webp",
          "bg": "#1f1f1f",
          "label": "Front"
        }
      ]
    },
    {
      "collections": [
        "new",
        "hoodies"
      ],
      "guide": "top",
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Washed Black/S"
      ],
      "handle": "no-signal-hoodie",
      "name": "No Signal Hoodie",
      "jp": "圏外",
      "code": "EE-03",
      "price": 110,
      "colors": [
        "Washed Black"
      ],
      "desc": "Named after the drop. An ENUMA ELISH wordmark over a small star emblem on the chest, printed in faded grey on washed-black fleece. Quiet from across the street, detailed up close.",
      "fit": "Oversized, boxy fit with a dropped shoulder. Size down for a regular fit.",
      "model": "Model is 178 cm and wears size L.",
      "fabric": [
        "450 GSM brushed-back fleece, 100% cotton",
        "Distressed screen print",
        "Kangaroo pocket, rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry. Iron on the reverse of the print.",
      "images": [
        {
          "src": "img/drop/newdrop_01_no_signal_hoodie.webp",
          "bg": "#1c1c1c",
          "label": "Front"
        }
      ],
      "el": {
        "desc": "Πήρε το όνομά του από το drop. Το λογότυπο ENUMA ELISH πάνω από ένα μικρό έμβλημα-αστέρι στο στήθος, τυπωμένο σε ξεθωριασμένο γκρι πάνω σε ξεβαμμένο μαύρο φούτερ. Διακριτικό από μακριά, γεμάτο λεπτομέρειες από κοντά.",
        "fit": "Oversized, φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε ένα μέγεθος μικρότερο για κανονική εφαρμογή.",
        "model": "Το μοντέλο έχει ύψος 178 cm και φοράει L.",
        "fabric": [
          "Βουρτσισμένο φούτερ 450 GSM, 100% βαμβάκι",
          "Ξεθωριασμένη μεταξοτυπία",
          "Τσέπη καγκουρό, ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο. Σιδέρωμα από την ανάποδη του τυπώματος."
      }
    },
    {
      "collections": [
        "new",
        "hoodies"
      ],
      "guide": "top",
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Washed Black/M"
      ],
      "handle": "shibuya-plain-hoodie",
      "name": "Shibuya Plain Hoodie",
      "jp": "渋谷",
      "code": "EE-04",
      "price": 100,
      "colors": [
        "Washed Black"
      ],
      "desc": "No print, no logo: just the wash. Garment-dyed charcoal fleece with a faded, uneven finish, a deep hood and a kangaroo pocket.",
      "fit": "Relaxed fit with a dropped shoulder. True to size.",
      "model": "Model is 183 cm and wears size L.",
      "fabric": [
        "420 GSM loopback cotton",
        "Garment-dyed and stone-washed",
        "Kangaroo pocket, rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Line dry.",
      "images": [
        {
          "src": "img/drop/newdrop_05_plain_hoodie.webp",
          "bg": "#131313",
          "label": "Front"
        }
      ],
      "el": {
        "desc": "Χωρίς τύπωμα, χωρίς λογότυπο: μόνο το ξέβαμμα. Φούτερ βαμμένο σε ανθρακί μετά τη ραφή, με ξεθωριασμένο, ακανόνιστο φινίρισμα, βαθιά κουκούλα και τσέπη καγκουρό.",
        "fit": "Χαλαρή εφαρμογή με πεσμένο ώμο. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 183 cm και φοράει L.",
        "fabric": [
          "Loopback βαμβάκι 420 GSM",
          "Βαφή μετά τη ραφή και stone wash",
          "Τσέπη καγκουρό, ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."
      }
    },
    {
      "collections": [
        "new"
      ],
      "guide": "top",
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [],
      "handle": "circuit-utility-jacket",
      "name": "Circuit Utility Jacket",
      "jp": "回路",
      "code": "EE-05",
      "price": 125,
      "colors": [
        "Washed Black"
      ],
      "desc": "A shell for the walk home after the last train: washed charcoal cotton canvas, a stand collar, two bellows chest pockets with buckle tabs and a drawcord hem.",
      "fit": "Boxy fit with a dropped shoulder. True to size.",
      "model": "Model is 180 cm and wears size M.",
      "fabric": [
        "Washed cotton canvas",
        "Bellows chest pockets with buckle tabs",
        "Two-way zip, drawcord hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry.",
      "images": [
        {
          "src": "img/drop/newdrop_03_utility_jacket.webp",
          "bg": "#151516",
          "label": "Front"
        }
      ],
      "el": {
        "desc": "Ένα μπουφάν για τον δρόμο προς το σπίτι μετά το τελευταίο τρένο: ξεβαμμένος ανθρακί βαμβακερός καμβάς, όρθιος γιακάς, δύο τσέπες φυσαρμόνικα στο στήθος με πόρπες και κορδόνι στο τελείωμα.",
        "fit": "Φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 180 cm και φοράει M.",
        "fabric": [
          "Ξεβαμμένος βαμβακερός καμβάς",
          "Τσέπες φυσαρμόνικα στο στήθος με πόρπες",
          "Φερμουάρ διπλής κατεύθυνσης, κορδόνι στο τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο."
      }
    },
    {
      "handle": "monastiraki-tee",
      "el": {
        "desc": "Το καθημερινό. Βαρύ, φαρδύ t-shirt σε ξεβαμμένο ανθρακί χωρίς τύπωμα, κομμένο φαρδύ στο σώμα και στα μανίκια.",
        "fit": "Χαλαρή, ελαφρώς κοντή φαρδιά εφαρμογή. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 178 cm και φοράει L.",
        "fabric": [
          "Πενιέ βαμβακερό ζέρσεϊ 240 GSM",
          "Βαφή μετά τη ραφή και ξέβαμμα",
          "Ενισχυμένη λαιμόκοψη, διπλές ραφές"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."
      },
      "name": "Monastiraki Tee",
      "jp": "モナスティラキ",
      "code": "EE-06",
      "collections": [
        "tees"
      ],
      "guide": "tee",
      "price": 45,
      "colors": [
        "Washed Black"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [],
      "desc": "The everyday one. A heavyweight, boxy tee in washed charcoal with no print, cut wide in the body and the sleeve.",
      "fit": "Relaxed, slightly cropped boxy fit. True to size.",
      "model": "Model is 178 cm and wears size L.",
      "fabric": [
        "240 GSM combed cotton jersey",
        "Garment-dyed and washed",
        "Taped neck, double-needle hems"
      ],
      "care": "Cold wash inside out. Line dry.",
      "images": [
        {
          "src": "img/drop/newdrop_06_plain_tee.webp",
          "bg": "#0f0f0f",
          "label": "Front"
        }
      ]
    },
    {
      "handle": "last-train-cargo-pant",
      "el": {
        "desc": "Φαρδύ cargo με έξι τσέπες και ρυθμιζόμενο τελείωμα. Φτιαγμένο για κίνηση και για να κάθεσαι σε σκαλιά από μπετόν μέχρι το πρωί.",
        "fit": "Φαρδύ, ίσιο πόδι με μεσαίο καβάλο. Πάρε το κανονικό σου μέγεθος· το κορδόνι στο τελείωμα ρυθμίζει το μήκος.",
        "model": "Το μοντέλο έχει ύψος 183 cm και φοράει M.",
        "fabric": [
          "Βουρτσισμένο βαμβακερό twill 320 GSM",
          "Έξι τσέπες, φερμουάρ YKK",
          "Κορδόνι στο τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο."
      },
      "name": "Last Train Cargo Pant",
      "jp": "終電",
      "code": "EE-07",
      "collections": [
        "bottoms"
      ],
      "guide": "bottom",
      "price": 110,
      "colors": [
        "Washed Black"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Washed Black/XL"
      ],
      "desc": "Wide cargo pants with six pockets and an adjustable hem. Built to move, and to sit on concrete steps until morning.",
      "fit": "Wide, straight leg with a mid rise. True to size; the hem drawcord adjusts the length.",
      "model": "Model is 183 cm and wears size M.",
      "fabric": [
        "Brushed cotton twill, 320 GSM",
        "Six pockets, YKK zip fly",
        "Drawcord hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry.",
      "images": [
        {
          "src": "img/drop/newdrop_04_cargo_trousers.webp",
          "bg": "#222224",
          "label": "Front"
        }
      ]
    },
    {
      "handle": "exarchia-statue-tee",
      "el": {
        "desc": "Ένα κλασικό κεφάλι αγάλματος, σκισμένο σαν αφίσα σε τοίχο των Εξαρχείων: ξεθωριασμένο τύπωμα κάτω από το λογότυπο ENUMA ELISH, σε βαρύ ξεβαμμένο μαύρο t-shirt.",
        "fit": "Χαλαρή, φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 178 cm και φοράει M.",
        "fabric": [
          "Πενιέ βαμβακερό ζέρσεϊ 240 GSM",
          "Ξεθωριασμένη μεταξοτυπία με μελάνι νερού",
          "Ενισχυμένη λαιμόκοψη, διπλές ραφές"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."
      },
      "name": "Exarchia Statue Tee",
      "jp": "エクサルヒア",
      "code": "EE-08",
      "collections": [
        "tees"
      ],
      "guide": "tee",
      "price": 90,
      "colors": [
        "Washed Black"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [],
      "desc": "A classical head cut up like a poster on an Exarchia wall: a distressed statue print under an ENUMA ELISH wordmark, across a heavyweight washed-black tee.",
      "fit": "Relaxed, boxy fit with a dropped shoulder. True to size.",
      "model": "Model is 178 cm and wears size M.",
      "fabric": [
        "240 GSM combed cotton jersey",
        "Distressed water-based screen print",
        "Taped neck, double-needle hems"
      ],
      "care": "Cold wash inside out. Line dry.",
      "images": [
        {
          "src": "img/drop/newdrop_02_statue_graphic_tee.webp",
          "bg": "#181818",
          "label": "Front"
        }
      ]
    }
  ],
  "media": {
    "hero": {
      "src": "img/editorial/01_homepage_hero_desktop.webp",
      "srcM": "img/editorial/02_homepage_hero_mobile.webp",
      "label": "Hero · lifestyle",
      "alt": "A figure in a black hoodie on a backstreet stairway at night",
      "altEl": "Μια φιγούρα με μαύρο φούτερ σε σκάλες στενού τη νύχτα"
    },
    "tokyo": {
      "src": "img/editorial/05_our_world_tokyo.webp",
      "label": "Tokyo street",
      "alt": "A Tokyo backstreet at night",
      "altEl": "Ένα στενό στο Τόκιο τη νύχτα"
    },
    "athens": {
      "src": "img/editorial/06_our_world_athens.webp",
      "label": "Athens street",
      "alt": "Painted walls in Exarchia, Athens",
      "altEl": "Ζωγραφισμένοι τοίχοι στα Εξάρχεια, Αθήνα"
    },
    "campaign1": {
      "src": "img/editorial/10_campaign_backstreet_stairs.webp",
      "label": "Campaign 01",
      "alt": "Campaign photo on backstreet stairs",
      "altEl": "Φωτογραφία campaign σε σκάλες στενού"
    },
    "campaign2": {
      "src": "img/editorial/11_campaign_exarchia.webp",
      "label": "Campaign 02",
      "alt": "Campaign photo in Exarchia, Athens",
      "altEl": "Φωτογραφία campaign στα Εξάρχεια, Αθήνα"
    },
    "campaign3": {
      "src": "img/editorial/12_campaign_shibuya.webp",
      "label": "Campaign 03",
      "alt": "Campaign photo in Shibuya after the last train",
      "altEl": "Φωτογραφία campaign στη Shibuya μετά το τελευταίο τρένο"
    }
  }
};
