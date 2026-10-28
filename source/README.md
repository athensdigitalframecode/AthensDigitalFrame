# Source of the site (not served)

index.html and prices.html in the repo root are generated from the files in this folder.

To rebuild (from this folder):

    python3 mkpages.py && python3 build2.py

build2.py writes index.html and prices.html one level up (the repo root).
The favicon, apple-touch-icon.png, favicon-192.png and og.png are plain files in the root.
This folder is excluded from the Vercel deploy via /.vercelignore.
