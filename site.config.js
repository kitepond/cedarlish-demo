/* ==========================================================================
   Cedarlish - SITE CONFIG  (the ONE file most buyers need to edit)
   --------------------------------------------------------------------------
   - Everything here is plain JavaScript: no build step needed.
   - Text that must be bilingual is written as { en: "...", vi: "..." }.
   - Leave a contact channel as "" (empty) to hide its button everywhere.
   - ALL values below are PLACEHOLDERS. Replace them before you go live.
   ========================================================================== */
window.SITE_CONFIG = {

  /* ---------- Brand ---------- */
  brand: {
  "name": "Cedarlish",
  "logoText": "Cedarlish",
  "logoMark": "assets/img/logo-mark.svg",
  "tagline": {
    "en": "Small-group English academy for ages 5 to 15",
    "vi": "Học viện tiếng Anh sĩ số nhỏ cho bé 5–15 tuổi"
  },
  "schemaType": "EducationalOrganization"
},

  /* ---------- Site URL (used for sitemap/OG/schema; no trailing slash) ---------- */
  siteUrl: "https://www.example.com",

  /* ---------- Pages and navigation (managed by the page generator; edit pages.json in the source, or edit here if you edit the HTML by hand) ---------- */
  pages: {
  "home": "index.html",
  "catalog": "programmes.html",
  "schedule": "timetable.html",
  "pricing": "tuition.html",
  "booking": "admissions.html",
  "contact": "contact.html",
  "notfound": "404.html"
},
  nav: [
  {
    "id": "catalog",
    "href": "programmes.html",
    "key": "nav.catalog"
  },
  {
    "id": "schedule",
    "href": "timetable.html",
    "key": "nav.schedule"
  },
  {
    "id": "pricing",
    "href": "tuition.html",
    "key": "nav.pricing"
  },
  {
    "id": "contact",
    "href": "contact.html",
    "key": "nav.contact"
  }
],
  headerCta: {
  "page": "booking",
  "key": "cta.book"
},

  /* ---------- Layout style (header: bar | pill | tabs | dock, footer: dark | light | grid | scrap) ---------- */
  style: {
  "pack": "editorial",
  "header": "split",
  "footer": "rules",
  "deferScripts": true
},

  /* ---------- Language ---------- */
  language: {
  "default": "en",
  "available": [
    "en",
    "vi"
  ],
  "labels": {
    "en": "EN",
    "vi": "VI"
  },
  "names": {
    "en": "English",
    "vi": "Tiếng Việt"
  },
  "storageKey": "cedarlish.lang"
},

  /* ---------- Currency (per language). Prices in assets/data/pricing.js hold several currencies. ---------- */
  currency: {
  "en": "USD",
  "vi": "VND"
},

  /* ---------- Theme (rebrand here or in src/input.css :root). Hex colours. ---------- */
  theme: {
  "colors": {
    "brand": "#1F4D45",
    "brandDark": "#163832",
    "brandSoft": "#E4EBE3",
    "accent": "#C9A24B",
    "coral": "#A6432F",
    "mint": "#4F7A5E",
    "sky": "#6E8FA3",
    "violet": "#7B6A8F",
    "ink": "#1B2623",
    "muted": "#505B57",
    "cream": "#FAF6EC",
    "surface": "#FFFEFA",
    "lvl1": "#4F7A5E",
    "lvl2": "#C9A24B",
    "lvl3": "#5F86A0",
    "lvl4": "#A6432F",
    "lvl5": "#1F4D45"
  },
  "radius": {
    "card": "2px",
    "button": "2px"
  },
  "fonts": {
    "display": "Fraunces, \"Iowan Old Style\", \"Palatino Linotype\", Georgia, serif",
    "body": "\"Plus Jakarta Sans\", system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif"
  }
},

  /* ---------- Contact (leave "" to hide) ---------- */
  contact: {
  "hotline": "+84900000000",
  "hotlineDisplay": "0900 000 000",
  "zalo": "0900000000",
  "messenger": "yourpage",
  "whatsapp": "",
  "email": "hello@example.com",
  "mapEmbedUrl": "",
  "mapLink": "https://maps.google.com/?q=Ho+Chi+Minh+City",
  "address": {
    "en": "123 Sample Street, District 1, Ho Chi Minh City, Vietnam",
    "vi": "123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh"
  },
  "social": {
    "facebook": "",
    "youtube": "",
    "instagram": "",
    "tiktok": ""
  }
},

  /* ---------- Opening hours (24h "HH:MM"; null = closed; [] hides the column) ---------- */
  hours: [
  {
    "day": "mon",
    "open": "15:30",
    "close": "19:30"
  },
  {
    "day": "tue",
    "open": "15:30",
    "close": "19:30"
  },
  {
    "day": "wed",
    "open": "15:30",
    "close": "19:30"
  },
  {
    "day": "thu",
    "open": "15:30",
    "close": "19:30"
  },
  {
    "day": "fri",
    "open": "15:30",
    "close": "19:30"
  },
  {
    "day": "sat",
    "open": "08:30",
    "close": "12:30"
  },
  {
    "day": "sun",
    "open": null,
    "close": null
  }
],

  /* ---------- Floating click-to-chat buttons ---------- */
  chatButtons: {
  "zalo": false,
  "messenger": false,
  "whatsapp": false,
  "call": false,
  "position": "right"
},

  /* ---------- Bank transfer / VietQR block ---------- */
  payment: {
  "show": true,
  "isPlaceholder": true,
  "bankName": "Sample Bank (SMB)",
  "accountName": "SAMPLE ACCOUNT NAME",
  "accountNumber": "0000 0000 0000",
  "transferNote": "CEDARLISH - Learner name - Term",
  "qrImage": "assets/img/vietqr-placeholder.svg"
},

  /* ---------- Booking / contact form ----------
     provider: "none"      -> validates but does NOT send anywhere (demo mode)
               "formspree" -> set endpoint to https://formspree.io/f/xxxxxxx
               "netlify"   -> deploy on Netlify (form name below); no endpoint needed
               "custom"    -> POST JSON to your own endpoint (Make, Zapier, Google Apps Script, API...) */
  form: {
  "provider": "none",
  "endpoint": "",
  "netlifyFormName": "booking",
  "redirectAfterSuccess": "",
  "calendlyUrl": "",
  "fallbackEmail": "hello@example.com"
},

  /* ---------- Misc ---------- */
  showDemoNote: true   // footer note "Template preview with sample content". Set false when live.
};
