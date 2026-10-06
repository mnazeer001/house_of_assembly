# Gombe State House of Assembly — website
### Pure HTML, CSS and JavaScript. No framework, no build step, no server code.

A complete, responsive, multi-page website for the legislative arm of the Government of
Gombe State. Everything runs in the browser: open `index.html` and the site works. There
is nothing to install, compile or configure, and the site makes no network requests except
the optional OpenStreetMap frame on the contact page.

---

## 1. Files

```
gombe-assembly/
├── index.html          Home — hero, quick access, Speaker's welcome, composition,
│                       constitutional functions, bills table, latest news, call to action
├── about.html          Mandate, vision/mission/values, how a bill becomes law (7 stages),
│                       milestones timeline, the Mace
├── leadership.html     Speaker, Deputy Speaker, Majority Leader, Chief Whip + institutional offices
├── members.html        All 24 members — live search, LGA filter, party filter, seats-by-LGA table
├── committees.html     The 18 standing committees, their mandates, powers and oversight practice
├── legislative.html    Bills register with search + stage filters, recent laws, records of the House
├── news.html           News, notices and press releases — category filter and load-more
├── gallery.html        Photo gallery with category filters and an accessible lightbox
├── contact.html        Contact cards, petition/memorandum form, visiting rules, FAQs, map
├── 404.html            Friendly not-found page
│
└── assets/
    ├── css/style.css   One stylesheet (~34 KB): design tokens, components, responsive rules,
    │                   print styles, reduced-motion support
    ├── js/main.js      One script (~14 KB): navigation, filters, counters, lightbox,
    │                   accordion, form validation, scroll effects
    └── img/*.jpg       Eight photographs used across the site
```

---

## 2. How to view or publish it

**On your computer** — double-click `index.html`. That is all.

**On a web server / cPanel** — upload the whole `gombe-assembly` folder (or just its
contents) to `public_html`. No PHP, database or server configuration is required.

**On GitHub Pages, Netlify or Cloudflare Pages** — drop the folder in; it is already a
static site. Set `index.html` as the entry page and `404.html` as the error page.

**Local preview with a web server** (optional, for testing links exactly as they will
behave online):

```bash
cd gombe-assembly
python3 -m http.server 8000
```
Then open <http://localhost:8000>.

---

## 3. What the JavaScript does

| Feature | Where | Behaviour |
|---|---|---|
| Mobile navigation | every page | Off-canvas drawer below 1020px with backdrop, Escape key, `aria-expanded`, focus-safe (`visibility:hidden` when closed) |
| Sticky header | every page | Shadow appears on scroll |
| Members directory | `members.html` | Live text search across name, constituency and LGA; dropdown filter by local government area; party filter buttons; live result count; empty state |
| Bills tracker | `legislative.html` | Search by title, sponsor or subject; filter by legislative stage; live count; empty state |
| News | `news.html` | Category filter plus “load more” in pages of six |
| Gallery | `gallery.html` | Category filter and a lightbox that opens on click or keyboard, traps nothing, and closes on Escape, backdrop click or the close button |
| Counters | `index.html` | Statistics count up once when scrolled into view |
| Accordion | `contact.html` | FAQ accordion, one panel open at a time, animated by measured height |
| Forms | contact + footer | Client-side validation (required fields, e-mail pattern, phone pattern, consent box), honeypot field, success message with a generated reference number |
| Reveal on scroll | several | Sections fade in via `IntersectionObserver`, disabled under `prefers-reduced-motion` |
| Back to top | every page | Appears after 520px of scroll |
| Sitting indicator | every page | Shows “Plenary sitting today” on Tuesdays, Wednesdays and Thursdays, otherwise the next sitting day |

**Important:** the forms are client-side only, because the site is static HTML. Nothing is
transmitted or stored — the success message says so explicitly. To receive real
submissions, either point the `<form>` at a form service (Formspree, Netlify Forms, Google
Forms) or use a server-side version of the site.

---

## 4. Content accuracy

The content reflects the public record of the Assembly:

* **Composition** — unicameral, 24 members, 24 state constituencies, 11 local government
  areas; Akko and Yamaltu/Deba return three members each. APC 20 seats, PDP 4.
* **Seventh Assembly, 2023 – 2027.** Sittings on Tuesdays, Wednesdays and Thursdays.
* **Principal officers** — Speaker Rt. Hon. Muhammad Abubakar Luggerewo (Akko Central),
  Deputy Speaker Rt. Hon. Sadam Bello Sale (Funakaye North), Majority Leader Hon. Ladan
  Yerima Gaule (Kaltungo East), Chief Whip Hon. Musa Buba (Balanga North).
* **All 24 members** are listed with constituency, local government area and party.
* **Legislation** — the 2026 Appropriation Law (₦617.95bn “Budget of Consolidation”, raised
  by over ₦82bn from the ₦535.69bn executive proposal, ₦428.5bn capital, ₦12bn Northern
  Security Fund); the law creating 13 new council development areas; the Disability Rights
  and Commission Law (2024); the ₦369.9bn 2025 Appropriation Law; the Child Rights and
  VAPP bills at committee stage; the ICT Development Bill.
* **Institutional** — groundbreaking of the new Assembly complex in the Three-Arms Zone
  (part of a ₦28.9bn twin project with the State High Court), and the July 2026 screening
  and confirmation of 23 commissioner-nominees.

### Before publishing, please verify and replace
1. **Telephone number, e-mail addresses and the street address** — placeholders are used
   (`+234 803 000 0000`, `info@gombeassembly.gov.ng`, `clerk@gombeassembly.gov.ng`).
2. **Photographs** — the eight images are illustrative stock photography. Replace them with
   the Assembly media unit's own pictures (same filenames, no code changes needed), and add
   official portraits for the principal officers in place of the initials avatars.
3. **Minority caucus officers and the serving Clerk** — names were not published in the
   sources used, so the pages say they are announced by resolution of the House.
4. **Committee chairmen** — three are named from public reports; the rest are shown as
   “announced by resolution of the House”.
5. **Social media links** in the top bar and footer currently point to `#`.

---

## 5. Editing the site

* **Text** — open the relevant `.html` file in any editor and edit between the tags.
* **Colours, spacing, type** — change the custom properties at the top of
  `assets/css/style.css` (`--navy-900`, `--gold-500`, `--container`, `--radius`, …) and the
  whole site follows.
* **A new member** — copy one `<article class="member …>` block in `members.html`, change
  the name, constituency, LGA, party class and the `data-lga`, `data-party` and
  `data-search` attributes. The search and filters pick it up automatically.
* **A new bill** — copy a `<tr>` in `legislative.html` and set `data-status` to one of
  `first`, `second`, `committee`, `hearing`, `passed`, `assented`, matching the
  `<span class="status …">` label.
* **A news item** — copy an `<article class="post">` block in `news.html` and set
  `data-cat` to match one of the filter buttons.
* **Header and footer** appear in every page, so a change to the navigation must be
  repeated in all ten files (a find-and-replace across the folder does it in one pass).

---

## 6. Design and quality

### Colour palette

| Colour | Purpose | Hex |
|---|---|---|
| Navy Blue | Main brand colour — top bar, hero, footer, table headers, solid buttons | `#0B1F3A` |
| Gold | Accent — primary buttons, borders, highlights, active underlines | `#D4AF37` |
| White | Main background, cards, header | `#FFFFFF` |
| Light Blue | Secondary sections, panel headers, tints | `#EEF4FA` |
| Dark Charcoal | Body text and headings | `#252525` |

These five are declared once at the top of `assets/css/style.css` as custom properties, so
changing them there restyles the whole site. A small set of derived shades is used only for
states that need them, each a tint or shade of the five above:

| Token | Hex | Used for |
|---|---|---|
| `--navy-950` | `#061426` | depth in the hero gradient and the lightbox backdrop |
| `--navy-800` | `#123152` | solid button fills and navy hover states |
| `--navy-700` | `#1A4472` | links on white (9.9:1 contrast) |
| `--navy-600` | `#20568F` | focus rings and input borders |
| `--navy-100` | `#DCE8F5` | light-blue borders |
| `--gold-600` | `#8A6D12` | gold *text* on white — `#D4AF37` is only 3.4:1, this is 4.9:1 |
| `--gold-400` | `#E3C65F` | gold button hover |
| `--gold-100` | `#FBF4DD` | notice backgrounds |
| `--muted` | `#5E6A75` | secondary text (5.5:1 on white) |
| `--line` | `#E2E8F0` | hairline rules |
| `--red-600` | `#B3261E` | functional only — invalid form fields and required markers |

Contrast was measured, not assumed: charcoal on white 15.3:1, charcoal on light blue
13.8:1, white on navy 16.5:1, gold on navy 7.9:1, navy on gold buttons 7.9:1 — all pass
WCAG AA, most pass AAA.

Georgia for display headings and the system sans stack for body text. 1220px container,
CSS Grid throughout, inline SVG icons, no icon fonts and no web fonts.

Checked in a real browser at 360, 390, 414, 768, 1024, 1180, 1366 and 1600px:

* no horizontal overflow at any width;
* no JavaScript errors on any page;
* every internal link and asset resolves (audited);
* one `<h1>` per page, `lang` set, every image has `alt`, skip link, visible focus rings,
  `aria-expanded` on toggles, `aria-current` on the active nav item, keyboard-operable
  gallery and accordion;
* `prefers-reduced-motion` honoured; print stylesheet included.
