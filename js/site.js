/* Canopy Custom Print site: nav, rotating headline word, curved gallery, instant quote, tabs, pricing toggles.
   Prices mirror the price book in dashboard/index.html and plan/BUSINESS-PLAN.md section 5. Keep them in sync. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Contact details: fill these in and the contact card, email buttons and sign-up switch on automatically.
  const CONTACT = { name: "", phone: "", email: "" };
  const CONTACT_EMAIL = CONTACT.email;

  /* ---------- nav ---------- */
  const nav = $(".nav");
  $(".menu-toggle").addEventListener("click", e => {
    const open = nav.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  const closeDrops = except => $$(".has-drop").forEach(li => { if (li !== except) { li.classList.remove("open"); $(".drop-btn", li).setAttribute("aria-expanded", "false"); } });
  $$(".has-drop").forEach(li => {
    const btn = $(".drop-btn", li);
    btn.addEventListener("click", () => { const open = !li.classList.contains("open"); closeDrops(li); li.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); });
    li.addEventListener("mouseenter", () => { if (matchMedia("(min-width:981px)").matches) { closeDrops(li); li.classList.add("open"); btn.setAttribute("aria-expanded", "true"); } });
    li.addEventListener("mouseleave", () => { if (matchMedia("(min-width:981px)").matches) { li.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  });
  document.addEventListener("click", e => { if (!e.target.closest(".has-drop")) closeDrops(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrops(); });
  $$(".nav-menu a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); closeDrops(); }));

  /* ---------- rotating headline word ---------- */
  const words = ["pre-roll wraps", "jar labels", "strain cards", "mylar panels", "tamper seals", "lid inserts", "loyalty cards"];
  const rot = $("#rot-word");
  if (!reduced) {
    let wi = 0;
    setInterval(() => {
      rot.classList.add("out");
      setTimeout(() => {
        wi = (wi + 1) % words.length; rot.textContent = words[wi];
        rot.classList.remove("out"); rot.classList.add("in");
        requestAnimationFrame(() => requestAnimationFrame(() => rot.classList.remove("in")));
      }, 420);
    }, 2400);
  }

  /* ---------- curved gallery ---------- */
  const IMG = {
    wrap:["tile-wrap.jpg","Two pre-roll tubes in geometric wrap labels"], preroll:["preroll.jpg","A row of pre-roll tubes with printed wraps"],
    pouch:["tile-pouch.jpg","A pouch with a full geometric front panel"], mylar:["mylar.jpg","Three pouches with printed face panels"],
    printer:["tile-printer.jpg","Round stickers coming out of the printer"], sheets:["hero.jpg","Printed label sheets and finished pouches"],
    jars:["jars.jpg","Jars with printed lid and side labels"], seal:["tile-seal.jpg","A VOID tamper seal peeled back on a jar lid"],
    cards:["cards.jpg","Shelf cards in acrylic stands"], loyalty:["tile-loyalty.jpg","A fan of printed punch cards"],
    trimmer:["tile-trimmer.jpg","Shelf cards being trimmed"], logistics:["logistics.jpg","A tote label and COA pages"]
  };
  const SETS = {
    all:["wrap","pouch","printer","preroll","seal","mylar","loyalty","jars","trimmer","cards","logistics"],
    labels:["wrap","preroll","pouch","mylar","printer","jars"],
    instore:["cards","loyalty","trimmer","cards","loyalty","trimmer"],
    seals:["seal","jars","logistics","seal","printer","logistics"]
  };
  const arc = $("#arc"), ring = $("#arc-ring");
  /* Cards ride a parabolic rail: far and small in the middle, near and angled at the edges.
     World units are scaled by f = stage width / 1280 so the curve holds at any width. */
  const N = 22, SP = 128, SPAN = N * SP, CARD = 120, DEPTH = 700, K = 0.0030, PERS = 750, EDGE = 590;
  const cards = [];
  for (let i = 0; i < N; i++) {
    const d = document.createElement("div"); d.className = "arc-card";
    const im = document.createElement("img"); im.decoding = "async";
    d.appendChild(im); ring.appendChild(d); cards.push({ el: d, img: im, base: i * SP });
  }
  function fill(set, first) {
    const list = SETS[set] || SETS.all;
    cards.forEach((c, i) => {
      const [src, alt] = IMG[list[i % list.length]];
      if (c.img.getAttribute("src") === "img/" + src) return;
      if (first) { c.img.src = "img/" + src; c.img.alt = alt; return; }
      c.img.style.opacity = 0;
      setTimeout(() => {
        c.img.onload = () => { c.img.style.opacity = 1; };
        c.img.src = "img/" + src; c.img.alt = alt;
        if (c.img.complete) c.img.style.opacity = 1;
      }, 180);
    });
  }
  fill("all", true);
  let offset = 0, f = 1, paused = false, dragging = false;
  function measure() {
    f = Math.max(0.62, Math.min(1.25, arc.clientWidth / 1280));
    arc.style.perspective = PERS * f + "px";
    arc.style.height = Math.round(CARD * 1.3 * f * 1.55) + "px";
  }
  function place() {
    const w = CARD * f, h = w * 1.3;
    for (const c of cards) {
      const x = ((c.base + offset) % SPAN + SPAN * 1.5) % SPAN - SPAN / 2;   // world x in [-SPAN/2, SPAN/2)
      const ax = Math.abs(x);
      if (ax > EDGE + 40) { c.el.style.visibility = "hidden"; continue; }
      const z = -DEPTH + K * x * x;
      const turn = -Math.atan(2 * K * x) * 180 / Math.PI * 0.62;
      c.el.style.visibility = "visible";
      c.el.style.opacity = ax > EDGE - 30 ? Math.max(0, (EDGE + 40 - ax) / 70) : 1;
      c.el.style.width = w + "px"; c.el.style.height = h + "px";
      c.el.style.transform = `translate3d(${x * f - w / 2}px, ${-h / 2}px, ${z * f}px) rotateY(${turn}deg)`;
    }
  }
  measure(); place();
  addEventListener("resize", () => { measure(); place(); });
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(64, now - last) / 1000; last = now;
    if (!paused && !dragging && !reduced) { offset -= 22 * dt; place(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  arc.addEventListener("mouseenter", () => paused = true);
  arc.addEventListener("mouseleave", () => paused = false);
  let startX = 0, startOff = 0;
  arc.addEventListener("pointerdown", e => { dragging = true; startX = e.clientX; startOff = offset; arc.setPointerCapture(e.pointerId); });
  arc.addEventListener("pointermove", e => { if (!dragging) return; offset = startOff + (e.clientX - startX) / f * 0.9; place(); });
  const endDrag = () => { dragging = false; };
  arc.addEventListener("pointerup", endDrag); arc.addEventListener("pointercancel", endDrag);
  $$(".arc-tabs [role=tab]").forEach(t => t.addEventListener("click", () => {
    $$(".arc-tabs [role=tab]").forEach(o => o.setAttribute("aria-selected", o === t));
    fill(t.dataset.set);
  }));

  /* ---------- pricing data ---------- */
  const P_ = {
    preroll:{cat:"Packaging label", name:"Pre-roll tube wrap", plural:"pre-roll wraps", spec:"1.5\" × 3.5\" or 2\" × 3\", weatherproof gloss", tiers:[[1,.85],[100,.65],[500,.38]]},
    jar:{cat:"Packaging label", name:"Jar top + side set", plural:"jar label sets", spec:"Lid circle plus side strip, 1/8 oz to 1 oz jars", tiers:[[1,1.10],[100,.90],[500,.55]], est:true},
    lid:{cat:"Packaging label", name:"Concentrate lid insert", plural:"lid inserts", spec:"1.25\" circle, brand and strain ID", tiers:[[1,.35],[100,.20],[500,.135]]},
    panel:{cat:"Packaging label", name:"Mylar face panel", plural:"mylar face panels", spec:"3\" × 5\", you apply", tiers:[[1,1.50],[100,1.25],[500,.675]]},
    bundle:{cat:"Packaging label", name:"Mylar bag + panel applied", plural:"mylar bags with panels applied", spec:"Your bags or stock bags we source, 50 minimum", tiers:[[1,1.95],[100,1.75],[250,1.55],[500,1.35]], min:50},
    seal:{cat:"Security", name:"Tamper-evident seal", plural:"tamper-evident seals", spec:"4\" × 1\" VOID security film, laser printed", tiers:[[1,.35],[100,.25],[500,.18]]},
    strain:{cat:"In-store", name:"Strain card", plural:"strain cards", spec:"3.5\" × 5\", 80 lb cover, trimmed", tiers:[[1,1.25],[100,1.00],[500,.575]]},
    loyalty:{cat:"In-store", name:"Loyalty punch card", plural:"loyalty cards", spec:"Wallet size, matte, for dispensaries", tiers:[[1,.30],[100,.22],[500,.15]]}
  };
  const FLAT = { club:{name:"Shelf Talker Club", price:149, unit:"a month", note:"Up to 50 strain cards a week, delivered on your route day. Month to month."},
                 opening:{name:"Store opening kit", price:395, unit:"per kit", note:"100 strain cards, 500 loyalty cards and 250 care cards, 3 designs."},
                 strip:{name:"Adhesion test strip", price:0, unit:"", note:"Free before your first order, printed on the stock you'll use."} };
  const SETUP = 35, MIN = 75, FREE_DEL = 150, DEL = 25, RUSH = .25;
  const money = (n, d = 2) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: Math.min(d, 2), maximumFractionDigits: d });
  const tierFor = (p, q) => p.tiers.reduce((t, x) => q >= x[0] ? x : t, p.tiers[0]);

  /* ---------- pricing cards + toggles ---------- */
  let qtyTier = 100;
  function renderPrices() {
    $("#price-jobs").innerHTML = Object.entries(P_).map(([k, p]) => {
      const t = tierFor(p, qtyTier);
      return `<article class="price-card"><span class="cat">${p.cat}</span><h3>${p.name}</h3><span class="spec">${p.spec}</span>
        <span class="amt">${money(t[1], 3)} <small>each at ${t[0]}+${p.est ? " · estimate" : ""}</small></span>
        <span class="ladder">${p.tiers.map(x => `${x[0]}+ ${money(x[1], 3)}`).join(" · ")}</span>
        <button class="btn btn-light" type="button" data-q="${qtyTier} ${p.plural}">Price ${qtyTier}</button></article>`;
    }).join("");
  }
  renderPrices();
  function setPlan(plan) {
    $$("[data-plan-btn]").forEach(b => b.setAttribute("aria-pressed", b.dataset.planBtn === plan));
    $("#price-jobs").hidden = plan !== "jobs"; $("#price-programs").hidden = plan !== "programs"; $("#qty-seg").hidden = plan !== "jobs";
  }
  $$("[data-plan-btn]").forEach(b => b.addEventListener("click", () => setPlan(b.dataset.planBtn)));
  $$("[data-qty]").forEach(b => b.addEventListener("click", () => { qtyTier = +b.dataset.qty; $$("[data-qty]").forEach(o => o.setAttribute("aria-pressed", o === b)); renderPrices(); }));
  $$("[data-plan]").forEach(a => a.addEventListener("click", () => setPlan(a.dataset.plan)));

  /* ---------- instant quote ---------- */
  const KEYS = [
    ["opening", /opening|new store|grand opening/], ["club", /club|subscription|every week|weekly/], ["strip", /test strip|adhesion|sample/],
    ["bundle", /(bag|pouch|mylar)s?.*(applied|apply|with panel)|applied/], ["seal", /seal|tamper|void/],
    ["lid", /lid|concentrate|rosin|wax|circle|round/], ["panel", /mylar|pouch|bag|panel/], ["jar", /jar/],
    ["preroll", /pre-?roll|preroll|tube|wrap|joint|blunt/], ["strain", /strain|shelf|talker|menu card/], ["loyalty", /loyalty|punch|reward/]
  ];
  function parse(text) {
    const t = text.toLowerCase().replace(/,(?=\d{3})/g, "");
    const kind = (KEYS.find(([, re]) => re.test(t)) || [])[0];
    let qty = null; const m = t.match(/(\d+(?:\.\d+)?)\s*(k)?\b/);
    if (m) qty = Math.round(parseFloat(m[1]) * (m[2] ? 1000 : 1));
    return { kind, qty, rush: /rush|today|same.?day|asap|tonight/.test(t), reorder: /reorder|re-order|same art|again/.test(t), text: text.trim() };
  }
  const est = $("#estimate");
  function mailHref(summary, text) {
    const body = `Hi Canopy,\n\nI'd like a quote:\n${text}\n\nYour estimate: ${summary}\n\nQuantity per design:\nSize / container:\nDue date:\nDelivery address or pickup:\nBusiness name and license no.:\n`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request: " + text)}&body=${encodeURIComponent(body)}`;
  }
  function show(html) { est.innerHTML = html; est.hidden = false; }
  function estimate(text) {
    const r = parse(text);
    if (!r.kind) {
      show(`<h3>Tell us the product and a quantity</h3><p class="note">For example "250 pre-roll wraps", "500 lid inserts" or "48 strain cards". We print pre-roll wraps, jar labels, lid inserts, mylar panels, tamper-evident seals, strain cards and loyalty cards.</p>`);
      return;
    }
    if (FLAT[r.kind]) {
      const f = FLAT[r.kind];
      const summary = f.price ? `${f.name}: ${money(f.price, 0)} ${f.unit}` : `${f.name}: free`;
      show(`<p class="eyebrow">Estimate</p><h3>${f.name}</h3><div class="total">${f.price ? money(f.price, 0) : "Free"} <small>${f.unit}</small></div><p class="note">${f.note}</p>
        <div class="row">${CONTACT_EMAIL ? `<a class="btn btn-primary" href="${mailHref(summary, r.text)}">Email this request</a>` : ""}<button class="btn btn-light" type="button" data-copy="${encodeURIComponent(summary + " — " + r.text)}">Copy</button></div>`);
      return;
    }
    const p = P_[r.kind];
    const qty = r.qty || 100, t = tierFor(p, qty);
    const unit = t[1] * (r.rush ? 1 + RUSH : 1), sub = unit * qty;
    const setup = r.reorder ? 0 : SETUP;
    const top = Math.max(0, MIN - (sub + setup));
    const total = sub + setup + top;
    const summary = `${qty.toLocaleString()} ${p.plural} at ${money(unit, 3)} each${r.rush ? " (rush)" : ""}, about ${money(total)} before delivery and tax`;
    show(`<p class="eyebrow">Estimate${r.qty ? "" : " · assumed 100 pieces"}</p>
      <h3>${qty.toLocaleString()} ${p.plural}</h3>
      <div class="total">${money(total)}</div>
      <dl>
        <dt>${qty.toLocaleString()} × ${money(unit, 3)}${r.rush ? " (rush +25%)" : ""} · ${t[0]}+ tier</dt><dd>${money(sub)}</dd>
        <dt>Setup, new artwork${r.reorder ? " (skipped on reorder)" : ""}</dt><dd>${money(setup)}</dd>
        ${top ? `<dt>Top-up to the $75 minimum</dt><dd>${money(top)}</dd>` : ""}
        <dt>Delivery on your route day</dt><dd>${sub >= FREE_DEL ? "Free" : money(DEL)}</dd>
      </dl>
      <p class="note">${p.min && qty < p.min ? `This item starts at ${p.min} pieces. ` : ""}${p.est ? "Jar-set prices are confirmed per jar size. " : ""}An estimate from our price list; your final quote comes with the proof. NY sales tax applies unless you give us a resale certificate.</p>
      <div class="row">${CONTACT_EMAIL ? `<a class="btn btn-primary" href="${mailHref(summary, r.text)}">Email this request</a>` : ""}<button class="btn btn-light" type="button" data-copy="${encodeURIComponent(summary)}">Copy estimate</button></div>`);
  }
  $("#quote-bar").addEventListener("submit", e => { e.preventDefault(); const v = $("#q").value; if (v.trim()) estimate(v); else $("#q").focus(); });
  document.addEventListener("click", async e => {
    const q = e.target.closest("[data-q]");
    if (q) { $("#q").value = q.dataset.q; estimate(q.dataset.q); $("#quote-bar").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); return; }
    const c = e.target.closest("[data-copy]");
    if (c) { const txt = decodeURIComponent(c.dataset.copy); try { await navigator.clipboard.writeText(txt); c.textContent = "Copied"; } catch (err) { c.textContent = "Copy failed"; } }
  });
  // contact card: fill known details, hide empty rows and email buttons until an address is set
  ["name", "phone", "email"].forEach(k => $$(`[data-c="${k}"]`).forEach(el => { if (CONTACT[k]) { if (el.tagName === "DD") el.textContent = CONTACT[k]; } else el.hidden = true; }));
  if (CONTACT_EMAIL) $("#mail-cta").href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request")}`;
  else { $("#mail-cta").hidden = true; $("#contact-soon").hidden = false; $("#news").hidden = true; }

  /* ---------- persona tabs (keyboard accessible) ---------- */
  const ptabs = $$(".persona-tabs [role=tab]");
  function selectTab(tab) {
    ptabs.forEach(t => { const on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; $("#" + t.getAttribute("aria-controls")).hidden = !on; });
  }
  ptabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", e => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { const n = ptabs[(i + d + ptabs.length) % ptabs.length]; selectTab(n); n.focus(); }
    });
  });

  /* ---------- newsletter (no backend: opens an email) ---------- */
  $("#news").addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#news-email").value.trim();
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Add me to the price sheet list")}&body=${encodeURIComponent("Please send new price sheets to: " + em)}`;
  });
})();
