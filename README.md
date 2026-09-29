# Canopy Custom Print website (v2)

Static files only, with no build step, backend or form. The layout follows the reference the owner picked:

| Section | What's in it |
|---|---|
| Announcement bar | The Store opening kit offer |
| Nav | Floating dark bar with dropdowns (What we print, Programs, Resources, Company, Pricing) and Price sheet / Get a quote buttons |
| Hero | Centered headline with a rotating product word, then a curved 3D gallery with category tabs. The gallery drifts slowly, pauses on hover and can be dragged. |
| Instant quote bar | Visitors type a job like "250 pre-roll wraps by Friday" and get an estimate from the price list, including setup, minimum, rush and delivery. "Email this request" opens a pre-filled email. |
| Scrolling strip | License types served and the service area. There are no client logos until real clients agree to be named. |
| Audience tabs | Dispensaries, growers and micros, brands and processors, stores opening soon |
| Pricing | Toggles for pay per job or programs, and 100+ or 500+ pieces |
| Rest of the page | How it works, the free test strip, the NY rules we design around, an artwork guide, FAQ, a contact banner, and a footer with a status line and a price-sheet sign-up (opens an email) |

The previous version is kept in `_v1/`.

## Preview locally

Run this from this folder, then open http://localhost:8000:

```
python -m http.server 8000
```

Double-clicking `index.html` also works.

## Before going live

1. **Contact details.** Replace `[Your name]`, `[Phone]` and `[Email]` in `index.html`, in the contact card.
2. **Quote email address.** Set `CONTACT_EMAIL` at the top of `js/site.js`. The quote bar, the contact button and the sign-up all use it.
3. **Share image.** Once there's a domain, change `og:image` to an absolute URL, like `https://yourdomain.com/img/og.jpg`.
4. **Prices.** If prices change, update them in two places: the `P_` table in `js/site.js` and `downloads/canopy-price-sheet.pdf`. They mirror the dashboard price book.
5. **Cache tags.** After editing CSS or JS, bump the `?v=` number on the two links in `index.html` so browsers load the new files.

## Free hosting that allows commercial use

| Host | Notes |
|---|---|
| Cloudflare Pages | Free plan allows commercial sites, with a free custom domain and HTTPS |
| Netlify | Free Starter plan allows commercial use, with bandwidth limits |
| GitHub Pages | On a free account the repo must be public |

Avoid Vercel's free Hobby plan: it's non-commercial only.

## Files

| Path | What it is |
|---|---|
| `index.html` | Page markup and meta tags |
| `css/site.css` | Brand tokens (light and dark), layout, gallery, quote bar |
| `js/site.js` | Nav, rotating word, gallery, instant quote, tabs, pricing toggles |
| `img/tile-*.jpg` | Gallery images, 720 px wide, geometric sample art |
| `img/*.jpg` | Product photos |
| `downloads/canopy-price-sheet.pdf` | The one-page price sheet |
