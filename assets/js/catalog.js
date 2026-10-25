/* Catalog cards. #catalog-preview (compact, home) and #catalog-list (detailed catalog page).
   Data: assets/data/items.js. Copy lives in i18n under  item.<id>.name | tagline | desc | o1..oN  */
(function () {
  "use strict";
  var B = window.Cedarlish;
  var TINT = B.levelTint;
  var items = function () { return (B.data.items || []); };
  function fact(f) { return B.t(f.key, f.vars || {}); }

  function compact(it) {
    var f = it.facts || [];
    return '<a href="' + B.esc(B.page("catalog") || "#") + "#" + it.id + '" class="card group flex h-full flex-col !p-5 transition hover:-translate-y-1 hover:shadow-pop">' +
      '<span class="flex h-36 items-center justify-center rounded-2xl ' + (TINT[it.color] || "bg-brand-soft") + '"><img src="' + B.esc(it.icon) + '" alt="" width="112" height="112" class="h-28 w-28 transition group-hover:scale-105" loading="lazy" /></span>' +
      (f[0] ? '<span class="mt-4 inline-flex w-fit rounded-btn bg-brand-soft px-3 py-1 text-xs font-bold text-brand-dark">' + B.esc(fact(f[0])) + "</span>" : "") +
      '<h3 class="mt-2 text-xl">' + B.esc(B.t("item." + it.id + ".name")) + "</h3>" +
      '<p class="mt-1 flex-1 text-[15px] text-muted">' + B.esc(B.t("item." + it.id + ".tagline")) + "</p>" +
      (f[1] ? '<span class="mt-3 text-sm font-bold text-ink">' + B.esc(fact(f[1])) + "</span>" : "") + "</a>";
  }

  function bubble(it, i) {
    var f = it.facts || [];
    return '<a href="' + B.esc(B.page("catalog") || "#") + "?item=" + encodeURIComponent(it.id) + '" class="bubble group flex flex-col items-center text-center' + (i % 2 ? " lg:mt-10" : "") + '">' +
      '<span class="relative flex h-40 w-40 items-center justify-center rounded-full ring-8 ring-white shadow-soft transition group-hover:-translate-y-1 ' + (TINT[it.color] || "bg-brand-soft") + '"><img src="' + B.esc(it.icon) + '" alt="" width="112" height="112" class="h-28 w-28 transition group-hover:scale-105" loading="lazy" />' +
      ((it.ages || f[0]) ? '<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-extrabold text-brand-dark shadow-soft ring-1 ring-brand/15">' + B.esc(it.ages ? B.t("catalog.agesRange", { a: it.ages[0], b: it.ages[1] }) : fact(f[0])) + "</span>" : "") + "</span>" +
      '<h3 class="mt-6 text-xl">' + B.esc(B.t("item." + it.id + ".name")) + "</h3>" +
      '<p class="mt-1 max-w-[16rem] text-[15px] text-muted">' + B.esc(B.t("item." + it.id + ".tagline")) + "</p></a>";
  }

  function detailed(it, i) {
    var outs = "", n, f = it.facts || [];
    for (n = 1; n <= (it.outcomes || 0); n++) outs += "<li>" + B.esc(B.t("item." + it.id + ".o" + n)) + "</li>";
    var badge = "inline-flex items-center gap-1.5 rounded-btn bg-white px-3 py-1.5 text-sm font-bold text-ink ring-1 ring-ink/10";
    var book = B.page("booking"), sched = B.page("schedule");
    var q = encodeURIComponent(it.id);
    return '<article id="' + it.id + '" class="card grid scroll-mt-28 gap-6 md:grid-cols-[240px_1fr] md:gap-10">' +
      '<div class="flex items-center justify-center rounded-3xl p-6 ' + (TINT[it.color] || "bg-brand-soft") + '"><img src="' + B.esc(it.icon) + '" alt="" width="176" height="176" class="h-40 w-40 md:h-44 md:w-44" loading="lazy" /></div>' +
      "<div>" +
        (B.has("catalog.itemLabel") ? '<p class="text-sm font-bold uppercase tracking-wide text-brand-dark">' + B.esc(B.t("catalog.itemLabel", { n: i + 1 })) + "</p>" : "") +
        '<h2 class="mt-1 text-3xl">' + B.esc(B.t("item." + it.id + ".name")) + "</h2>" +
        '<p class="mt-1 text-lg font-bold text-brand-dark">' + B.esc(B.t("item." + it.id + ".tagline")) + "</p>" +
        '<p class="mt-3 text-muted">' + B.esc(B.t("item." + it.id + ".desc")) + "</p>" +
        (f.length ? '<ul class="mt-4 flex flex-wrap gap-2">' + f.map(function (x) { return '<li class="' + badge + '">' + B.icon(x.icon || "check", "h-4 w-4") + B.esc(fact(x)) + "</li>"; }).join("") + "</ul>" : "") +
        (outs ? '<h3 class="mt-6 text-lg">' + B.esc(B.t("catalog.outcomes")) + '</h3><ul class="prose-list mt-2 space-y-2 text-ink">' + outs + "</ul>" : "") +
        '<div class="mt-6 flex flex-wrap gap-3">' +
          (book ? '<a class="btn btn-primary" href="' + B.esc(book) + "?item=" + q + '">' + B.esc(B.t("catalog.cta")) + "</a>" : "") +
          (sched ? '<a class="btn btn-outline" href="' + B.esc(sched) + "?item=" + q + '">' + B.esc(B.t("common.viewSchedule")) + "</a>" : "") + "</div>" +
      "</div></article>";
  }

  /* "menu" variants: a club-menu board grouped by item.group (main | side), dotted leader between name and ages */
  function groups() {
    var order = [], by = {};
    items().forEach(function (it) { var g = it.group || "main"; if (!by[g]) { by[g] = []; order.push(g); } by[g].push(it); });
    return order.map(function (g) { return { id: g, list: by[g] }; });
  }
  function agesOf(it) { return it.ages ? B.t("catalog.agesRange", { a: it.ages[0], b: it.ages[1] }) : ""; }
  function menuBoard() {
    return groups().map(function (g, gi) {
      return '<div class="' + (gi ? "mt-8" : "") + '"><h3 class="menu-group">' + B.esc(B.t("menu.group." + g.id)) + '</h3><ul class="mt-2">' + g.list.map(function (it) {
        return '<li><a class="menu-row" href="' + B.esc(B.page("catalog") || "#") + "#" + it.id + '"><span class="flex items-baseline gap-2"><span class="menu-name">' + B.esc(B.t("item." + it.id + ".name")) + '</span><span class="menu-dots" aria-hidden="true"></span><span class="menu-ages">' + B.esc(agesOf(it)) + "</span></span>" +
          '<span class="block text-[15px] text-muted">' + B.esc(B.t("item." + it.id + ".tagline")) + "</span></a></li>";
      }).join("") + "</ul></div>";
    }).join("");
  }
  function menuList() {
    var n = 0;
    return groups().map(function (g) {
      return '<section aria-labelledby="mg-' + g.id + '"><h2 id="mg-' + g.id + '" class="menu-group menu-group-lg">' + B.esc(B.t("menu.group." + g.id)) + '</h2><div class="mt-6 grid gap-8">' + g.list.map(function (it) {
        var i = n++, outs = "", k, f = it.facts || [], book = B.page("booking"), sched = B.page("schedule"), q = encodeURIComponent(it.id);
        for (k = 1; k <= (it.outcomes || 0); k++) outs += "<li>" + B.esc(B.t("item." + it.id + ".o" + k)) + "</li>";
        return '<article id="' + it.id + '" class="menu-entry scroll-mt-28 ' + (i % 2 ? "me-r" : "me-l") + '">' +
          '<div class="menu-sticker ' + (TINT[it.color] || "bg-brand-soft") + '"><span class="tape tape-c" aria-hidden="true"></span><img src="' + B.esc(it.icon) + '" alt="" width="176" height="176" class="h-32 w-32 sm:h-40 sm:w-40" loading="lazy" /></div>' +
          '<div class="min-w-0"><div class="flex items-baseline gap-2"><h3 class="menu-name text-2xl sm:text-3xl">' + B.esc(B.t("item." + it.id + ".name")) + '</h3><span class="menu-dots" aria-hidden="true"></span><span class="menu-ages">' + B.esc(agesOf(it)) + "</span></div>" +
          '<p class="mt-1 text-lg font-bold text-brand-dark">' + B.esc(B.t("item." + it.id + ".tagline")) + "</p>" +
          '<p class="mt-3 text-muted">' + B.esc(B.t("item." + it.id + ".desc")) + "</p>" +
          (f.length ? '<ul class="mt-4 flex flex-wrap gap-2">' + f.map(function (x) { return '<li class="menu-fact">' + B.icon(x.icon || "check", "h-4 w-4") + B.esc(fact(x)) + "</li>"; }).join("") + "</ul>" : "") +
          (outs ? '<h4 class="mt-5 font-display text-lg font-bold">' + B.esc(B.t("catalog.outcomes")) + '</h4><ul class="prose-list mt-2 space-y-2 text-ink">' + outs + "</ul>" : "") +
          '<div class="mt-5 flex flex-wrap gap-3">' +
          (book ? '<a class="btn btn-primary" href="' + B.esc(book) + "?item=" + q + '">' + B.esc(B.t("catalog.cta")) + "</a>" : "") +
          (sched ? '<a class="btn btn-outline" href="' + B.esc(sched) + "?item=" + q + '">' + B.esc(B.t("common.viewSchedule")) + "</a>" : "") + "</div></div></article>";
      }).join("") + "</div></section>";
    }).join("");
  }

  /* "index" variant (home): a numbered table of contents, one ruled row per item; the item's data.code (e.g. a CEFR-style level) sits at the right */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function indexList() {
    return '<ol class="idx-list">' + items().map(function (it, i) {
      var f = it.facts || [];
      return '<li><a class="idx-row" href="' + B.esc(B.page("catalog") || "#") + "#" + it.id + '">' +
        '<span class="idx-no" aria-hidden="true">' + pad(i + 1) + "</span>" +
        '<span class="idx-main"><span class="idx-name">' + B.esc(B.t("item." + it.id + ".name")) + '</span><span class="idx-tag">' + B.esc(B.t("item." + it.id + ".tagline")) + "</span></span>" +
        '<span class="idx-meta">' + (it.code ? '<span class="idx-code">' + B.esc(it.code) + "</span>" : "") + (it.ages ? "<span>" + B.esc(agesOf(it)) + "</span>" : (f[0] ? "<span>" + B.esc(fact(f[0])) + "</span>" : "")) + "</span>" +
        '<span class="idx-arrow" aria-hidden="true">' + B.icon("arrow-right", "h-5 w-5") + "</span></a></li>";
    }).join("") + "</ol>";
  }

  /* "chapters" variant (catalog page): numbered <details> chapters, first open; ?item=<id> or #<id> opens that chapter */
  function chapters() {
    return '<div class="chap-list">' + items().map(function (it, i) {
      var outs = "", k, f = it.facts || [], book = B.page("booking"), sched = B.page("schedule"), q = encodeURIComponent(it.id);
      for (k = 1; k <= (it.outcomes || 0); k++) outs += "<li>" + B.esc(B.t("item." + it.id + ".o" + k)) + "</li>";
      return '<details id="' + it.id + '" class="chap scroll-mt-28"' + (i === 0 ? " open" : "") + '><summary class="chap-sum">' +
        '<span class="chap-no" aria-hidden="true">' + pad(i + 1) + "</span>" +
        '<span class="chap-head">' + (B.has("catalog.itemLabel") ? '<span class="chap-label">' + B.esc(B.t("catalog.itemLabel", { n: i + 1 })) + (it.code ? " · " + B.esc(it.code) : "") + "</span>" : "") +
          '<span class="chap-name">' + B.esc(B.t("item." + it.id + ".name")) + '</span><span class="chap-tag">' + B.esc(B.t("item." + it.id + ".tagline")) + "</span></span>" +
        '<span class="chap-chev" aria-hidden="true">' + B.icon("chevron-down", "h-6 w-6") + "</span></summary>" +
        '<div class="chap-body"><div><p class="text-[17px] leading-relaxed text-ink">' + B.esc(B.t("item." + it.id + ".desc")) + "</p>" +
          (f.length ? '<ul class="chap-facts">' + f.map(function (x) { return "<li>" + B.icon(x.icon || "check", "h-4 w-4") + "<span>" + B.esc(fact(x)) + "</span></li>"; }).join("") + "</ul>" : "") + "</div>" +
        "<div>" + (outs ? '<p class="chap-h">' + B.esc(B.t("catalog.outcomes")) + '</p><ul class="prose-list mt-3 space-y-2 text-ink">' + outs + "</ul>" : "") +
          '<div class="mt-6 flex flex-wrap gap-3">' +
          (book ? '<a class="btn btn-primary" href="' + B.esc(book) + "?item=" + q + '">' + B.esc(B.t("catalog.cta")) + "</a>" : "") +
          (sched ? '<a class="btn btn-outline" href="' + B.esc(sched) + "?item=" + q + '">' + B.esc(B.t("common.viewSchedule")) + "</a>" : "") + "</div></div></div></details>";
    }).join("") + "</div>";
  }
  function openChapter() {
    var id = (location.hash || "").replace("#", "");
    if (!id) { var m = /[?&]item=([^&]+)/.exec(location.search || ""); id = m ? decodeURIComponent(m[1]) : ""; }
    var d = id && document.getElementById(id);
    if (d && d.tagName === "DETAILS") { d.open = true; if (location.hash) d.scrollIntoView(); }
  }

  B.mount(function () {
    var a = document.getElementById("catalog-preview");
    var av = a && a.getAttribute("data-variant");
    if (a) a.innerHTML = av === "menu" ? menuBoard() : av === "index" ? indexList() : items().map(av === "bubbles" ? bubble : compact).join("");
    var b = document.getElementById("catalog-list");
    var bv = b && b.getAttribute("data-variant");
    if (b) b.innerHTML = bv === "menu" ? menuList() : bv === "chapters" ? chapters() : items().map(detailed).join("");
    if (bv === "chapters") { openChapter(); window.addEventListener("hashchange", openChapter); }
  });
})();
