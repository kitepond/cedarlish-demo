/* Tuition comparison table (programmes as columns) with a plan toggle (per term / full year).
   Data: assets/data/pricing.js (plans, rounding, enrolment, items{monthly, sessionsPerMonth, classSize, perWeek, classMinutes}) + items.js (code, ages).
   Longer plans are calculated from the monthly price and the plan discount. */
(function () {
  "use strict";
  var B = window.Cedarlish;
  var toggle = document.getElementById("pricing-toggle");
  if (!toggle) return;
  var host = document.getElementById("pricing-table");
  var desc = document.getElementById("pricing-plan-desc");
  var D = function () { return B.data.pricing; };
  var plan = D().defaultPlan || D().plans[0].id;

  function round(v, cur) { var r = (D().rounding || {})[cur] || 1; return Math.round(v / r) * r; }
  function pick(obj, cur) { return obj[cur] != null ? { v: obj[cur], cur: cur } : { v: obj[Object.keys(obj)[0]], cur: Object.keys(obj)[0] }; }
  function current() { return D().plans.filter(function (p) { return p.id === plan; })[0] || D().plans[0]; }
  function list() { return (B.data.items || []).filter(function (l) { return D().items[l.id]; }); }
  function calc(id, p) {
    var it = D().items[id], m = pick(it.monthly, B.currency()), cur = m.cur;
    var gross = round(m.v * p.months, cur), tuition = round(m.v * p.months * (1 - p.discount), cur);
    var enr = D().enrolment ? pick(D().enrolment, cur).v : 0;
    return { cur: cur, tuition: tuition, month: round(tuition / p.months, cur), enrol: enr, first: tuition + enr, save: gross - tuition };
  }
  function money(c, v) { return B.fmtMoney(v, c); }

  function renderToggle() {
    toggle.innerHTML = D().plans.map(function (p) {
      return '<button type="button" role="radio" class="chip" data-plan="' + p.id + '" aria-checked="' + (p.id === plan ? "true" : "false") + '" tabindex="' + (p.id === plan ? "0" : "-1") + '">' +
        B.esc(B.t("pricing.plan." + p.id)) + (p.discount ? ' <span class="fc-save">−' + Math.round(p.discount * 100) + "%</span>" : "") + "</button>";
    }).join("");
  }

  function renderTable() {
    var p = current(), L = list();
    var first = L[0] ? D().items[L[0].id].sessionsPerMonth * p.months : 0;
    desc.textContent = B.t("pricing.plan." + p.id + ".desc", { n: first, pct: Math.round(p.discount * 100) });
    var per = B.t("pricing.per." + p.id);
    var rows = [
      { k: "fees.row.level", f: function (l) { return l.code || ""; } },
      { k: "fees.row.ages", f: function (l) { return l.ages ? B.t("catalog.agesRange", { a: l.ages[0], b: l.ages[1] }) : ""; } },
      { k: "fees.row.size", f: function (l) { return B.t("fees.size", { n: D().items[l.id].classSize }); } },
      { k: "fees.row.hours", f: function (l) { return B.t("fees.hours", { w: D().items[l.id].perWeek, m: D().items[l.id].classMinutes }); } },
      { k: "fees.row.tuition", strong: true, f: function (l) { var c = calc(l.id, p); return money(c.cur, c.tuition) + ' <span class="fc-per">' + B.esc(per) + "</span>"; }, html: true },
      { k: "fees.row.month", f: function (l) { var c = calc(l.id, p); return B.t("fees.perMonth", { price: money(c.cur, c.month) }); } },
      { k: "fees.row.enrol", f: function (l) { var c = calc(l.id, p); return money(c.cur, c.enrol); } },
      { k: "fees.row.first", strong: true, f: function (l) { var c = calc(l.id, p); return money(c.cur, c.first); } },
      { k: "fees.row.save", f: function (l) { var c = calc(l.id, p); return c.save > 0 ? B.t("fees.saving", { price: money(c.cur, c.save) }) : B.t("fees.none"); } }
    ];
    function cell(r, l) { var v = r.f(l); return r.html ? v : B.esc(v); }
    var head = '<th scope="col" class="fc-corner"><span class="sr-only">' + B.esc(B.t("fees.col.prog")) + "</span></th>" + L.map(function (l) {
      return '<th scope="col" class="fc-prog"><span class="fc-pname">' + B.esc(B.t("item." + l.id + ".name")) + "</span></th>";
    }).join("");
    var body = rows.map(function (r) {
      return '<tr class="' + (r.strong ? "is-strong" : "") + '"><th scope="row">' + B.esc(B.t(r.k)) + "</th>" + L.map(function (l) { return "<td>" + cell(r, l) + "</td>"; }).join("") + "</tr>";
    }).join("");
    var cards = L.map(function (l) {
      return '<li class="fcard"><h3 class="fcard-h">' + B.esc(B.t("item." + l.id + ".name")) + '</h3><dl class="fcard-dl">' + rows.map(function (r) {
        return '<div class="' + (r.strong ? "is-strong" : "") + '"><dt>' + B.esc(B.t(r.k)) + "</dt><dd>" + cell(r, l) + "</dd></div>";
      }).join("") + "</dl></li>";
    }).join("");
    host.innerHTML = '<div class="fc-wrap hidden lg:block"><table class="fc-table"><caption class="sr-only">' + B.esc(B.t("pricing.table.caption")) + "</caption><thead><tr>" + head + "</tr></thead><tbody>" + body + "</tbody></table></div>" +
      '<ul class="fcards lg:hidden">' + cards + "</ul>";
  }

  toggle.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-plan]");
    if (!btn) return;
    plan = btn.getAttribute("data-plan");
    renderToggle(); renderTable();
    var nb = toggle.querySelector('[data-plan="' + plan + '"]'); if (nb) nb.focus();
  });
  toggle.addEventListener("keydown", function (e) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!keys[e.key]) return;
    e.preventDefault();
    var ids = D().plans.map(function (p) { return p.id; });
    plan = ids[(ids.indexOf(plan) + keys[e.key] + ids.length) % ids.length];
    renderToggle(); renderTable();
    toggle.querySelector('[data-plan="' + plan + '"]').focus();
  });
  B.mount(function () { renderToggle(); renderTable(); });
})();
