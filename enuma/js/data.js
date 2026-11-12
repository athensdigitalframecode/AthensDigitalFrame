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
      "jp": "新着"
    },
    {
      "id": "tees",
      "title": "T-shirts",
      "el": "T-shirts",
      "jp": "Tシャツ"
    },
    {
      "id": "hoodies",
      "title": "Hoodies",
      "el": "Hoodies",
      "jp": "フーディー"
    },
    {
      "id": "bottoms",
      "title": "Bottoms",
      "el": "Παντελόνια",
      "jp": "ボトムス"
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
        "Bone/XS",
        "Bone/XL"
      ],
      "handle": "athens-x-tokyo-hoodie",
      "name": "Athens × Tokyo Hoodie",
      "jp": "アテネ × 東京",
      "code": "EE-01",
      "price": 140,
      "colors": [
        "Bone"
      ],
      "desc": "The two cities on one hoodie. An all-over print with the Parthenon, a meander border and an olive branch on one side, and a pagoda, a great wave and a samurai helmet on the other. Limited run.",
      "fit": "Relaxed fit with a dropped shoulder. Take your usual size.",
      "model": "Model is 180 cm and wears size M.",
      "fabric": [
        "420 GSM brushed-back cotton fleece, 100% cotton",
        "All-over sublimation print, front, back and sleeves",
        "Double-layer hood, rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry. Do not iron the print.",
      "images": [
        {
          "src": "img/athx-a.webp",
          "bg": "#d8d6d1",
          "cover": true,
          "label": "Front"
        },
        {
          "src": "img/athx-b.webp",
          "bg": "#e5e4e2",
          "cover": true,
          "label": "Side"
        }
      ],
      "el": {
        "desc": "Οι δύο πόλεις σε ένα hoodie. Τύπωμα σε όλη την επιφάνεια: ο Παρθενώνας, ένας μαίανδρος και ένα κλαδί ελιάς από τη μία πλευρά, μια παγόδα, ένα μεγάλο κύμα και ένα κράνος σαμουράι από την άλλη. Περιορισμένη παραγωγή.",
        "fit": "Χαλαρή εφαρμογή με πεσμένο ώμο. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 180 cm και φοράει M.",
        "fabric": [
          "Βουρτσισμένο φούτερ 420 GSM, 100% βαμβάκι",
          "Τύπωμα sublimation σε μπροστά, πλάτη και μανίκια",
          "Διπλή κουκούλα, ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο. Μη σιδερώνεις το τύπωμα."
      }
    },
    {
      "handle": "tokyo-after-dark-hoodie",
      "el": {
        "desc": "Το κομμάτι γύρω από το οποίο χτίστηκε το drop. Βαρύ φούτερ με έναν σταυρό από πινελιά μελανιού στο στήθος και τη γραφή 東京テック (Tokyo Tech), πλαϊνά πάνελ από mesh και υφαντό ταμπελάκι στο μανίκι.",
        "fit": "Oversized, φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε το μέγεθος που φοράς συνήθως για την προβλεπόμενη πτώση ή ένα μικρότερο για πιο στενή εφαρμογή.",
        "model": "Το μοντέλο έχει ύψος 183 cm και φοράει M.",
        "fabric": [
          "Βουρτσισμένο φούτερ 480 GSM, 100% βαμβάκι",
          "Μεταξοτυπία στο στήθος, πλαϊνά πάνελ mesh",
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
        "Washed Black",
        "Dirty White"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Washed Black/XS",
        "Dirty White/XL"
      ],
      "desc": "The piece the drop is built around. Heavy fleece with a brushed-ink cross across the chest and 東京テック (Tokyo Tech) lettering, mesh side panels and a woven tab on the cuff.",
      "fit": "Oversized, boxy fit with a dropped shoulder. Take your usual size for the intended drape, or size down for a closer fit.",
      "model": "Model is 183 cm and wears size M.",
      "fabric": [
        "480 GSM brushed-back fleece, 100% cotton",
        "Screen-printed chest graphic, mesh side panels",
        "Double-layer hood, heavy rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry. Iron on the reverse of the print.",
      "images": [
        {
          "src": "img/crossb-a.webp",
          "bg": "#ffffff",
          "label": "Front",
          "color": "Washed Black"
        },
        {
          "src": "img/crossb-b.webp",
          "bg": "#ffffff",
          "label": "Side",
          "color": "Washed Black"
        },
        {
          "src": "img/crossw-a.webp",
          "bg": "#ffffff",
          "label": "Front",
          "color": "Dirty White"
        },
        {
          "src": "img/crossw-b.webp",
          "bg": "#ffffff",
          "label": "Side",
          "color": "Dirty White"
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
      "handle": "exarchia-tag-hoodie",
      "name": "Exarchia Tag Hoodie",
      "jp": "エクサルヒア",
      "code": "EE-03",
      "price": 110,
      "colors": [
        "Washed Black"
      ],
      "desc": "Tags lifted from the walls of Exarchia and sprayed across the front, sleeve and pocket in white. No two walls are the same, and neither are the drips.",
      "fit": "Oversized, boxy fit with a dropped shoulder. Size down for a regular fit.",
      "model": "Model is 178 cm and wears size L.",
      "fabric": [
        "450 GSM brushed-back fleece, 100% cotton",
        "Puff and spray-effect screen prints",
        "Kangaroo pocket, rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry. Iron on the reverse of the print.",
      "images": [
        {
          "src": "img/graffiti-a.webp",
          "bg": "#ffffff",
          "label": "Front"
        },
        {
          "src": "img/graffiti-b.webp",
          "bg": "#ffffff",
          "label": "Side"
        }
      ],
      "el": {
        "desc": "Tags από τους τοίχους των Εξαρχείων, ψεκασμένα σε λευκό στο μπροστά μέρος, στο μανίκι και στην τσέπη. Δεν υπάρχουν δύο ίδιοι τοίχοι, ούτε δύο ίδιες σταγόνες.",
        "fit": "Oversized, φαρδιά εφαρμογή με πεσμένο ώμο. Πάρε ένα μέγεθος μικρότερο για κανονική εφαρμογή.",
        "model": "Το μοντέλο έχει ύψος 178 cm και φοράει L.",
        "fabric": [
          "Βουρτσισμένο φούτερ 450 GSM, 100% βαμβάκι",
          "Τυπώματα puff και εφέ σπρέι",
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
        "Dirty White/M"
      ],
      "handle": "shibuya-dist-hoodie",
      "name": "Shibuya Dist. Hoodie",
      "jp": "渋谷",
      "code": "EE-04",
      "price": 100,
      "colors": [
        "Dirty White"
      ],
      "desc": "A photo print of the Shibuya scramble at night under a TOKYO / SHIBUYA DIST. lockup, with a district tape running down the sleeve.",
      "fit": "Relaxed fit with a dropped shoulder. True to size.",
      "model": "Model is 183 cm and wears size L.",
      "fabric": [
        "420 GSM loopback cotton",
        "Photographic screen print",
        "Woven sleeve tape, rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Line dry.",
      "images": [
        {
          "src": "img/shibuya-a.webp",
          "bg": "#f3f3f3",
          "label": "Front"
        },
        {
          "src": "img/shibuya-b.webp",
          "bg": "#f8f8f8",
          "label": "Side"
        }
      ],
      "el": {
        "desc": "Φωτογραφικό τύπωμα της διάβασης της Shibuya τη νύχτα, κάτω από το λογότυπο TOKYO / SHIBUYA DIST., και ταινία με την περιοχή κατά μήκος του μανικιού.",
        "fit": "Χαλαρή εφαρμογή με πεσμένο ώμο. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 183 cm και φοράει L.",
        "fabric": [
          "Loopback βαμβάκι 420 GSM",
          "Φωτογραφική μεταξοτυπία",
          "Υφαντή ταινία στο μανίκι, ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."
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
      "soldOut": [],
      "handle": "circuit-panel-hoodie",
      "name": "Circuit Panel Hoodie",
      "jp": "回路",
      "code": "EE-05",
      "price": 125,
      "colors": [
        "Concrete"
      ],
      "desc": "Cut-and-sew panels in three greys, a circuit-board yoke under the cross graphic, mesh inserts and a zipped sleeve pocket for a transit card.",
      "fit": "Regular fit with articulated sleeves. True to size.",
      "model": "Model is 180 cm and wears size M.",
      "fabric": [
        "Cotton fleece body with nylon-blend panels",
        "Mesh inserts, zipped sleeve and pocket openings",
        "Rib cuffs and hem"
      ],
      "care": "Cold wash inside out. Do not tumble dry.",
      "images": [
        {
          "src": "img/panel-a.webp",
          "bg": "#ffffff",
          "label": "Front"
        },
        {
          "src": "img/panel-b.webp",
          "bg": "#ffffff",
          "label": "Side"
        }
      ],
      "el": {
        "desc": "Πάνελ σε τρεις αποχρώσεις του γκρι, ένα κομμάτι με σχέδιο πλακέτας κάτω από τον σταυρό, ένθετα mesh και τσέπη με φερμουάρ στο μανίκι για την κάρτα του μετρό.",
        "fit": "Κανονική εφαρμογή με ανατομικά μανίκια. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 180 cm και φοράει M.",
        "fabric": [
          "Βαμβακερό φούτερ με πάνελ από μείγμα νάιλον",
          "Ένθετα mesh, φερμουάρ σε μανίκι και τσέπη",
          "Ριμπ σε μανίκια και τελείωμα"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Όχι στεγνωτήριο."
      }
    },
    {
      "handle": "no-signal-tee",
      "el": {
        "desc": "Βαρύ t-shirt με το όνομα του drop τυπωμένο στην πλάτη στα ιαπωνικά: 圏外, εκτός εμβέλειας.",
        "fit": "Χαλαρή, ελαφρώς κοντή φαρδιά εφαρμογή. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 178 cm και φοράει L.",
        "fabric": [
          "Πενιέ βαμβακερό ζέρσεϊ 240 GSM",
          "Μεταξοτυπία με μελάνι νερού",
          "Ενισχυμένη λαιμόκοψη, διπλές ραφές"
        ],
        "care": "Πλύσιμο σε κρύο νερό, από την ανάποδη. Στέγνωμα στον αέρα."
      },
      "name": "No Signal Tee",
      "jp": "圏外",
      "code": "EE-06",
      "collections": [
        "tees"
      ],
      "guide": "tee",
      "price": 45,
      "colors": [
        "Washed Black",
        "Dirty White"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Dirty White/S"
      ],
      "desc": "A heavyweight tee with the drop name printed across the back in Japanese: 圏外, out of range.",
      "fit": "Relaxed, slightly cropped boxy fit. True to size.",
      "model": "Model is 178 cm and wears size L.",
      "fabric": [
        "240 GSM combed cotton jersey",
        "Water-based screen print",
        "Taped neck, double-needle hems"
      ],
      "care": "Cold wash inside out. Line dry.",
      "images": [
        {
          "src": "img/p2-a.webp",
          "bg": "#c4c1b9",
          "label": "Tee · front"
        },
        {
          "src": "img/p2-b.webp",
          "bg": "#333333",
          "label": "Tee · back print"
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
        "Washed Black",
        "Concrete"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "soldOut": [
        "Concrete/XL",
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
          "src": "img/p4-a.webp",
          "bg": "#c6c3bb",
          "label": "Cargo · front"
        },
        {
          "src": "img/p4-b.webp",
          "bg": "#313131",
          "label": "Cargo · on model"
        }
      ]
    },
    {
      "handle": "monastiraki-track-pant",
      "el": {
        "desc": "Φόρμα για skate στο Μοναστηράκι τη νύχτα: μακρύ, χαλαρό πόδι, πλαϊνές ρίγες σε βαθύ κόκκινο και φερμουάρ στους αστραγάλους.",
        "fit": "Χαλαρό, μακρύ πόδι με λάστιχο και κορδόνι στη μέση. Πάρε το κανονικό σου μέγεθος.",
        "model": "Το μοντέλο έχει ύψος 178 cm και φοράει M.",
        "fabric": [
          "Βουρτσισμένο πολυβαμβακερό τρικό",
          "Πλαϊνή ρίγα",
          "Φερμουάρ στους αστραγάλους και τις τσέπες"
        ],
        "care": "Πλύσιμο σε κρύο νερό. Στέγνωμα στον αέρα."
      },
      "name": "Monastiraki Track Pant",
      "jp": "モナスティラキ",
      "code": "EE-08",
      "collections": [
        "bottoms"
      ],
      "guide": "bottom",
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
      "desc": "Track pants for skating Monastiraki at night: a long, loose leg, side stripes in deep red and zipped ankles.",
      "fit": "Loose, long leg with an elastic waist and drawcord. True to size.",
      "model": "Model is 178 cm and wears size M.",
      "fabric": [
        "Brushed poly-cotton tricot",
        "Side stripe tape",
        "Zipped ankles and pockets"
      ],
      "care": "Cold wash. Line dry.",
      "images": [
        {
          "src": "img/p6-a.webp",
          "bg": "#c4c0b8",
          "label": "Track pant · front"
        },
        {
          "src": "img/p6-b.webp",
          "bg": "#313131",
          "label": "Track pant · on model"
        }
      ]
    }
  ],
  "media": {
    "hero": {
      "src": "img/hero.webp",
      "label": "Hero · lifestyle",
      "alt": "A figure in the Tokyo After Dark Hoodie on a backstreet stairway at night",
      "altEl": "Μια φιγούρα με το Tokyo After Dark Hoodie σε σκάλες στενού τη νύχτα"
    },
    "tokyo": {
      "src": "img/tokyo.webp",
      "label": "Tokyo street",
      "alt": "A Tokyo backstreet at night",
      "altEl": "Ένα στενό στο Τόκιο τη νύχτα"
    },
    "athens": {
      "src": "img/athens.webp",
      "label": "Athens street",
      "alt": "Painted walls in Exarchia, Athens",
      "altEl": "Ζωγραφισμένοι τοίχοι στα Εξάρχεια, Αθήνα"
    },
    "campaign1": {
      "src": "img/campaign-1.webp",
      "label": "Campaign 01",
      "alt": "Campaign photo on backstreet stairs",
      "altEl": "Φωτογραφία campaign σε σκάλες στενού"
    },
    "campaign2": {
      "src": "img/campaign-2.webp",
      "label": "Campaign 02",
      "alt": "Campaign photo in Exarchia, Athens",
      "altEl": "Φωτογραφία campaign στα Εξάρχεια, Αθήνα"
    },
    "campaign3": {
      "src": "img/campaign-3.webp",
      "label": "Campaign 03",
      "alt": "Campaign photo in Shibuya after the last train",
      "altEl": "Φωτογραφία campaign στη Shibuya μετά το τελευταίο τρένο"
    }
  }
};
