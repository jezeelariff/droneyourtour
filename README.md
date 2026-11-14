# DroneYourTour – Pre-Wedding Packages page

Static website (HTML + CSS + JS). No build step, no dependencies.

## Preview locally
Option 1: double-click `index.html` to open it in your browser.

Option 2 (recommended, behaves like a real server):
```
cd droneyourtour
python3 -m http.server 8000
```
Then open http://localhost:8000
(Node alternative: `npx serve .`)

## Folder structure
```
index.html              the page
assets/css/style.css    all styling (colours at the top in :root)
assets/js/main.js       menu, hero counter, contact form
assets/images/          placeholder images (replace with your photos)
robots.txt, sitemap.xml SEO basics
netlify.toml            optional config if you deploy on Netlify
```

## Replace the images
The images in `assets/images/` are placeholder illustrations.
Put your own photos there (e.g. `hero.jpg`) and update the matching
`src="assets/images/....svg"` in `index.html`. Keep the `alt` text descriptive.
Recommended size: about 1600px wide, compressed JPG or WebP.

## Edit details
- Prices, package names, text: `index.html`
- Contact email: `CONTACT_EMAIL` in `assets/js/main.js` and the `mailto:` links in `index.html`
- Colours/fonts: top of `assets/css/style.css`

## Contact form
By default the form opens the visitor's email app with the enquiry filled in.
To receive submissions without that, use a form service, e.g. Formspree:
set `<form action="https://formspree.io/f/YOUR_ID" method="POST">` and remove
the submit handler in `main.js`.

## Deploy (when you're ready)
Upload the whole folder's contents to any static host:
Netlify (drag & drop), Vercel, GitHub Pages, Cloudflare Pages, or your
web host's `public_html` via FTP. Then point droneyourtour.com at it.
