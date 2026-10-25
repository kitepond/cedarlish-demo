/* Weekly timetable with filter. Data: assets/data/schedule.js + items.js. ?item=<id> pre-selects a filter. */
(function () {
  "use strict";
  var B = window.Cedarlish;
  var grid = document.getElementById("schedule-grid");
  if (!grid) return;
  var filters = document.getElementById("schedule-filters");
  var count = document.getElementById("schedule-count");
  var BORDER = { lvl1: "border-lvl1", lvl2: "border-lvl2", lvl3: "border-lvl3", lvl4: "border-lvl4", lvl5: "border-lvl5" };
  var BORDER_T = { lvl1: "border-lvl1", lvl2: "border-lvl2", lvl3: "border-lvl3", lvl4: "border-lvl4", lvl5: "border-lvl5" };
  var params = new URLSearchParams(window.location.search);
  var selected = params.get("item") || "all";
  var items = function () { return B.data.items || []; };
  if (selected !== "all" && !items().some(function (l) { return l.id === selected; })) selected = "all";
  function itemOf(id) { return items().filter(function (l) { return l.id === id; })[0] || {}; }

  function renderFilters() {
    var list = [{ id: "all", label: B.t("schedule.all") }].concat(items().map(function (l) { return { id: l.id, label: B.t("item." + l.id + ".name") }; }));
    filters.innerHTML = list.map(function (it) {
      return '<button type="button" class="chip" data-item="' + B.esc(it.id) + '" aria-pressed="' + (it.id === selected ? "true" : "false") + '">' + B.esc(it.label) + "</button>";
    }).join("");
  }

  function renderColumns() {
    var sched = B.data.schedule || { days: [], slots: [] };
    var book = B.page("booking"), total = 0;
    var days = sched.days.filter(function (d) { return sched.slots.some(function (s) { return s.day === d; }); });
    var cols = days.map(function (d) {
      var slots = sched.slots.filter(function (s) { return s.day === d && (selected === "all" || s.item === selected); })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      total += slots.length;
      var dayName = B.t("day." + d);
      function card(s) {
        var it = itemOf(s.item);
        var seats = s.seats != null && s.seats <= 3 ? '<span class="badge bg-coral/20 text-ink">' + B.esc(B.t("schedule.seats", { n: s.seats })) + "</span>" : "";
        var link = book ? '<a class="mt-1 inline-flex min-h-[44px] items-center gap-1 rounded-btn text-sm font-bold text-brand-dark underline-offset-4 hover:underline" href="' + B.esc(book) + "?item=" + encodeURIComponent(s.item) + "&slot=" + encodeURIComponent(d + "|" + s.start) + '">' +
          B.esc(B.t("schedule.book")) + '<span class="sr-only"> – ' + B.esc(dayName + " " + s.start) + "</span>" + B.icon("arrow-right", "h-4 w-4") + "</a>" : "";
        return '<li class="rounded-2xl border-t-[8px] bg-white p-3.5 shadow-soft ring-1 ring-ink/5 ' + (BORDER_T[it.color] || "border-brand") + '">' +
          '<p class="text-base font-extrabold tabular-nums text-ink">' + B.esc(B.fmtTime(s.start)) + " – " + B.esc(B.fmtTime(s.end)) + "</p>" +
          '<p class="text-[15px] font-bold leading-snug text-brand-dark">' + B.esc(B.t("item." + s.item + ".name")) + "</p>" +
          (s.room ? '<p class="text-sm text-muted">' + B.esc(B.t("schedule.room", { room: s.room })) + "</p>" : "") + seats + "<div>" + link + "</div></li>";
      }
      function group(label, list) {
        return list.length ? '<p class="mt-3 text-xs font-extrabold uppercase tracking-wide text-muted first:mt-0">' + B.esc(label) + '</p><ul class="mt-2 space-y-2.5" aria-label="' + B.esc(B.t("schedule.dayLabel", { day: dayName }) + " – " + label) + '">' + list.map(card).join("") + "</ul>" : "";
      }
      var am = slots.filter(function (s) { return s.start < "12:00"; }), pm = slots.filter(function (s) { return s.start >= "12:00"; });
      var body = slots.length ? group(B.t("schedule.am"), am) + group(B.t("schedule.pm"), pm) : '<p class="rounded-2xl border-2 border-dashed border-ink/15 px-3 py-4 text-center text-sm text-muted">' + B.esc(B.t("schedule.none")) + "</p>";
      return '<div class="rounded-[1.75rem] bg-brand-soft/70 p-3 sm:p-4"><h3 class="mb-3 rounded-full bg-white px-4 py-2 text-center font-display text-lg font-extrabold text-ink shadow-soft">' + B.esc(dayName) + "</h3>" + body + "</div>";
    }).join("");
    grid.innerHTML = '<div class="grid gap-3 sm:grid-cols-2 ' + (days.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3") + '">' + cols + "</div>";
    count.textContent = total === 1 ? B.t("schedule.count1") : B.t("schedule.count", { n: total });
  }

  function renderMatrix() {
    var sched = B.data.schedule || { days: [], slots: [] };
    var book = B.page("booking"), total = 0;
    var days = sched.days.filter(function (d) { return sched.slots.some(function (s) { return s.day === d; }); });
    var live = sched.slots.filter(function (s) { return selected === "all" || s.item === selected; });
    total = live.length;
    var starts = [];
    sched.slots.forEach(function (s) { if (starts.indexOf(s.start) < 0) starts.push(s.start); });
    starts.sort();
    function link(s, d, cls) {
      if (!book) return "";
      return '<a class="' + cls + '" href="' + B.esc(book) + "?item=" + encodeURIComponent(s.item) + "&slot=" + encodeURIComponent(d + "|" + s.start) + '">' + B.esc(B.t("schedule.book")) +
        '<span class="sr-only"> – ' + B.esc(B.t("day." + d) + " " + s.start) + "</span>" + B.icon("arrow-right", "h-4 w-4") + "</a>";
    }
    function block(s, d) {
      var it = itemOf(s.item);
      return '<div class="mx-block ' + (BORDER[it.color] || "border-brand") + '"><p class="font-display text-[15px] font-bold leading-snug text-ink">' + B.esc(B.t("item." + s.item + ".name")) + "</p>" +
        '<p class="text-sm tabular-nums text-ink/80">' + B.esc(B.fmtTime(s.start)) + " – " + B.esc(B.fmtTime(s.end)) + "</p>" +
        (s.room ? '<p class="text-sm text-muted">' + B.esc(B.t("schedule.room", { room: s.room })) + "</p>" : "") +
        link(s, d, "mx-book") + "</div>";
    }
    function cell(d, st) {
      var list = live.filter(function (x) { return x.day === d && x.start === st; });
      if (!list.length) return '<td class="mx-cell mx-empty"></td>';
      return '<td class="mx-cell">' + list.map(function (s) { return block(s, d); }).join("") + "</td>";
    }
    var head = '<th scope="col" class="mx-corner"><span class="sr-only">' + B.esc(B.t("schedule.timeCol")) + "</span></th>" + days.map(function (d) { return '<th scope="col" class="mx-day">' + B.esc(B.t("day." + d)) + "</th>"; }).join("");
    var rows = starts.map(function (st) {
      return '<tr><th scope="row" class="mx-time tabular-nums">' + B.esc(B.fmtTime(st)) + "</th>" + days.map(function (d) { return cell(d, st); }).join("") + "</tr>";
    }).join("");
    var cards = days.map(function (d) {
      var list = live.filter(function (s) { return s.day === d; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      var dn = B.t("day." + d);
      var body = list.length ? list.map(function (s) {
        var it = itemOf(s.item);
        return '<li class="mx-ticket ' + (BORDER[it.color] || "border-brand") + '"><p class="mx-ticket-time tabular-nums">' + B.esc(B.fmtTime(s.start)) + '<span class="block text-sm font-medium text-ink/80">' + B.esc(B.fmtTime(s.end)) + "</span></p>" +
          "<div><p class=\"font-display text-base font-bold text-ink\">" + B.esc(B.t("item." + s.item + ".name")) + "</p>" +
          (s.room ? '<p class="text-sm text-muted">' + B.esc(B.t("schedule.room", { room: s.room })) + "</p>" : "") + link(s, d, "mx-book mt-1") + "</div></li>";
      }).join("") : '<li class="px-4 py-3 text-sm text-muted">' + B.esc(B.t("schedule.none")) + "</li>";
      return '<section class="mx-day-card" aria-label="' + B.esc(B.t("schedule.dayLabel", { day: dn })) + '"><h3 class="mx-day-title">' + B.esc(dn) + '</h3><ul class="divide-y divide-brand/20">' + body + "</ul></section>";
    }).join("");
    grid.innerHTML = '<div class="mx-wrap hidden lg:block"><table class="mx-table"><caption class="sr-only">' + B.esc(B.t("schedule.matrixCaption")) + "</caption><thead><tr>" + head + "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
      '<div class="grid gap-4 sm:grid-cols-2 lg:hidden">' + cards + "</div>";
    count.textContent = total === 1 ? B.t("schedule.count1") : B.t("schedule.count", { n: total });
  }

  /* "agenda": one sheet per day, hour-by-hour. Fixed routine rows (arrive, snack, pick-up window ...) come from schedule.json "routine";
     club slots are filtered by the chips and carry a Book link. */
  function renderAgenda() {
    var sched = B.data.schedule || { days: [], slots: [], routine: [] };
    var book = B.page("booking"), total = 0, routine = sched.routine || [];
    var days = sched.days.filter(function (d) { return sched.slots.some(function (s) { return s.day === d; }); });
    var sheets = days.map(function (d, di) {
      var dn = B.t("day." + d);
      var slots = sched.slots.filter(function (s) { return s.day === d && (selected === "all" || s.item === selected); });
      total += slots.length;
      var rows = routine.filter(function (r) { return !r.days || r.days.indexOf(d) >= 0; }).map(function (r) { return { k: 0, start: r.start, r: r }; })
        .concat(slots.map(function (s) { return { k: 1, start: s.start, s: s }; }))
        .sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : a.k - b.k; });
      var lis = rows.map(function (x) {
        if (x.k === 0) {
          var r = x.r;
          return '<li class="ag-row ag-routine' + (r.pickup ? " ag-pickup" : "") + '"><p class="ag-time tabular-nums">' + B.esc(B.fmtTime(r.start)) + '<span class="ag-end">' + B.esc(B.fmtTime(r.end)) + "</span></p>" +
            '<span class="ag-node" aria-hidden="true">' + B.icon(r.icon || "clock", "h-4 w-4") + "</span>" +
            '<div class="ag-body"><p class="font-bold text-ink">' + B.esc(B.t(r.key)) + "</p></div></li>";
        }
        var s = x.s, it = itemOf(s.item);
        var seats = s.seats != null && s.seats <= 3 ? '<span class="badge bg-accent/50 text-ink">' + B.esc(B.t("schedule.seats", { n: s.seats })) + "</span>" : "";
        var link = book ? '<a class="ag-book" href="' + B.esc(book) + "?item=" + encodeURIComponent(s.item) + "&slot=" + encodeURIComponent(d + "|" + s.start) + '">' + B.esc(B.t("schedule.book")) +
          '<span class="sr-only"> – ' + B.esc(dn + " " + s.start) + "</span>" + B.icon("arrow-right", "h-4 w-4") + "</a>" : "";
        return '<li class="ag-row ag-club ' + (BORDER[it.color] || "border-brand") + '"><p class="ag-time tabular-nums">' + B.esc(B.fmtTime(s.start)) + '<span class="ag-end">' + B.esc(B.fmtTime(s.end)) + "</span></p>" +
          '<span class="ag-node ag-node-club" aria-hidden="true"></span>' +
          '<div class="ag-body"><p class="font-display text-[17px] font-bold leading-snug text-ink">' + B.esc(B.t("item." + s.item + ".name")) + "</p>" +
          (s.room ? '<p class="text-sm text-muted">' + B.esc(B.t("schedule.room", { room: s.room })) + "</p>" : "") + '<div class="mt-1 flex flex-wrap items-center gap-2">' + seats + link + "</div></div></li>";
      }).join("");
      return '<section class="ag-sheet ag-t' + (di % 3 + 1) + '" aria-label="' + B.esc(B.t("schedule.dayLabel", { day: dn })) + '"><span class="tape tape-c" aria-hidden="true"></span><h3 class="ag-day">' + B.esc(dn) + '</h3>' +
        (slots.length ? "" : '<p class="mt-2 text-sm text-muted">' + B.esc(B.t("schedule.none")) + "</p>") + '<ol class="ag-list">' + lis + "</ol></section>";
    }).join("");
    grid.innerHTML = '<div class="grid gap-7 md:grid-cols-2">' + sheets + "</div>";
    count.textContent = total === 1 ? B.t("schedule.count1") : B.t("schedule.count", { n: total });
  }


  /* "planner": a term planner. Days are rows, start times are columns; each class is a compact coded pill (item.code, e.g. a level code) that links to the booking form;
     a legend decodes the codes. Below lg it becomes one ruled list per day. */
  function renderPlanner() {
    var sched = B.data.schedule || { days: [], slots: [] };
    var book = B.page("booking");
    var days = sched.days.filter(function (d) { return sched.slots.some(function (s) { return s.day === d; }); });
    var live = sched.slots.filter(function (s) { return selected === "all" || s.item === selected; });
    var starts = [];
    sched.slots.forEach(function (s) { if (starts.indexOf(s.start) < 0) starts.push(s.start); });
    starts.sort();
    function href(s, d) { return book ? B.esc(book) + "?item=" + encodeURIComponent(s.item) + "&slot=" + encodeURIComponent(d + "|" + s.start) : "#"; }
    function pill(s, d) {
      var it = itemOf(s.item), nm = B.t("item." + s.item + ".name");
      return '<a class="pl-pill ' + (BORDER[it.color] || "border-brand") + '" href="' + href(s, d) + '"><span class="pl-code">' + B.esc(it.code || nm.slice(0, 2)) + '</span><span class="pl-sub tabular-nums">' + B.esc(B.fmtTime(s.end)) + '</span><span class="sr-only"> ' + B.esc(nm + ", " + B.t("day." + d) + " " + s.start + " – " + s.end + (s.room ? ", " + B.t("schedule.room", { room: s.room }) : "") + ", " + B.t("schedule.book")) + "</span></a>";
    }
    var head = '<th scope="col" class="pl-corner"><span class="sr-only">' + B.esc(B.t("schedule.dayCol")) + "</span></th>" + starts.map(function (st) { return '<th scope="col" class="pl-time tabular-nums">' + B.esc(B.fmtTime(st)) + "</th>"; }).join("");
    var rows = days.map(function (d) {
      return '<tr><th scope="row" class="pl-day">' + B.esc(B.t("day." + d)) + "</th>" + starts.map(function (st) {
        var list = live.filter(function (x) { return x.day === d && x.start === st; });
        return '<td class="pl-cell">' + (list.length ? list.map(function (s) { return pill(s, d); }).join("") : '<span class="pl-none" aria-hidden="true">·</span>') + "</td>";
      }).join("") + "</tr>";
    }).join("");
    var legend = items().filter(function (it) { return it.code; }).map(function (it) {
      return '<li class="pl-key"><span class="pl-keycode ' + (BORDER[it.color] || "border-brand") + '">' + B.esc(it.code) + "</span><span>" + B.esc(B.t("item." + it.id + ".name")) + "</span></li>";
    }).join("");
    var cards = days.map(function (d) {
      var list = live.filter(function (s) { return s.day === d; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      var dn = B.t("day." + d);
      var body = list.length ? list.map(function (s) {
        var it = itemOf(s.item);
        return '<li class="pl-line"><span class="pl-lt tabular-nums">' + B.esc(B.fmtTime(s.start)) + " – " + B.esc(B.fmtTime(s.end)) + '</span><span class="pl-ln"><span class="pl-keycode ' + (BORDER[it.color] || "border-brand") + '">' + B.esc(it.code || "") + "</span> " + B.esc(B.t("item." + s.item + ".name")) +
          (s.room ? '<span class="block text-sm text-muted">' + B.esc(B.t("schedule.room", { room: s.room })) + "</span>" : "") + "</span>" +
          (book ? '<a class="pl-bk" href="' + href(s, d) + '">' + B.esc(B.t("schedule.book")) + '<span class="sr-only"> – ' + B.esc(dn + " " + s.start) + "</span>" + B.icon("arrow-right", "h-4 w-4") + "</a>" : "") + "</li>";
      }).join("") : '<li class="pl-line text-sm text-muted">' + B.esc(B.t("schedule.none")) + "</li>";
      return '<section class="pl-daycard" aria-label="' + B.esc(B.t("schedule.dayLabel", { day: dn })) + '"><h3 class="pl-daytitle">' + B.esc(dn) + "</h3><ul>" + body + "</ul></section>";
    }).join("");
    grid.innerHTML = '<div class="pl-wrap hidden lg:block"><table class="pl-table"><caption class="sr-only">' + B.esc(B.t("schedule.plannerCaption")) + "</caption><thead><tr>" + head + "</tr></thead><tbody>" + rows + "</tbody></table>" +
      '<p class="pl-legend-h">' + B.esc(B.t("schedule.legend")) + '</p><ul class="pl-legend">' + legend + "</ul></div>" +
      '<div class="lg:hidden">' + cards + "</div>";
    count.textContent = live.length === 1 ? B.t("schedule.count1") : B.t("schedule.count", { n: live.length });
  }

  function renderGrid() {
    if (grid.getAttribute("data-variant") === "planner") return renderPlanner();
    if (grid.getAttribute("data-variant") === "agenda") return renderAgenda();
    if (grid.getAttribute("data-variant") === "matrix") return renderMatrix();
    if (grid.getAttribute("data-variant") === "columns") return renderColumns();
    var sched = B.data.schedule || { days: [], slots: [] };
    var book = B.page("booking");
    var total = 0;
    grid.innerHTML = sched.days.map(function (d) {
      var slots = sched.slots.filter(function (s) { return s.day === d && (selected === "all" || s.item === selected); })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      total += slots.length;
      var dayName = B.t("day." + d);
      var cards = slots.map(function (s) {
        var it = itemOf(s.item), f = (it.facts || [])[0];
        var seats = s.seats != null && s.seats <= 3 ? '<span class="badge bg-coral/20 text-ink">' + B.esc(B.t("schedule.seats", { n: s.seats })) + "</span>" : "";
        var meta = [s.room ? B.t("schedule.room", { room: s.room }) : "", f ? B.t(f.key, f.vars || {}) : ""].filter(Boolean).join(" · ");
        var link = book ? '<a class="ml-auto inline-flex min-h-[44px] items-center gap-1 rounded-btn px-3 text-sm font-bold text-brand-dark underline-offset-4 hover:bg-brand-soft hover:underline" href="' + B.esc(book) + "?item=" + encodeURIComponent(s.item) + "&slot=" + encodeURIComponent(d + "|" + s.start) + '">' +
          B.esc(B.t("schedule.book")) + '<span class="sr-only"> – ' + B.esc(dayName + " " + s.start) + "</span>" + B.icon("arrow-right", "h-4 w-4") + "</a>" : "";
        return '<li class="flex flex-col gap-1 rounded-2xl border-l-[10px] bg-white p-4 shadow-soft ring-1 ring-ink/5 ' + (BORDER[it.color] || "border-brand") + '">' +
          '<p class="flex items-center gap-2 text-lg font-extrabold tabular-nums text-ink">' + B.icon("clock", "h-4 w-4 text-muted") + B.esc(B.fmtTime(s.start)) + " – " + B.esc(B.fmtTime(s.end)) + "</p>" +
          '<p class="font-bold text-brand-dark">' + B.esc(B.t("item." + s.item + ".name")) + "</p>" +
          (meta ? '<p class="text-sm text-muted">' + B.esc(meta) + "</p>" : "") +
          '<div class="mt-2 flex flex-wrap items-center justify-between gap-2">' + seats + link + "</div></li>";
      }).join("");
      var body = slots.length ? '<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="' + B.esc(B.t("schedule.dayLabel", { day: dayName })) + '">' + cards + "</ul>"
        : '<p class="rounded-2xl border-2 border-dashed border-ink/15 px-4 py-4 text-sm text-muted">' + B.esc(B.t("schedule.none")) + "</p>";
      return '<div class="grid gap-3 border-t-2 border-ink/10 py-6 first:border-t-0 md:grid-cols-[120px_1fr] md:gap-6">' +
        '<h3 class="font-display text-2xl font-extrabold text-ink">' + B.esc(dayName) + "</h3>" + body + "</div>";
    }).join("");
    count.textContent = total === 1 ? B.t("schedule.count1") : B.t("schedule.count", { n: total });
  }

  filters.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-item]");
    if (!btn) return;
    selected = btn.getAttribute("data-item");
    var url = new URL(window.location.href);
    if (selected === "all") url.searchParams.delete("item"); else url.searchParams.set("item", selected);
    try { window.history.replaceState(null, "", url); } catch (err) {}
    filters.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    renderGrid();
  });

  B.mount(function () { renderFilters(); renderGrid(); });
})();
