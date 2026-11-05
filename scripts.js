/* Swatch · combinar colores de ropa
 *
 * Modelo de datos (preparado para las fases 2 y 3)
 * ------------------------------------------------
 * Color   { id, name, hex, neutral, family, custom }
 *           custom: true para los colores que añadas tú (fase 2) o saques de una foto (fase 3, source: "photo").
 * Classic { id, colors: [colorId, ...], label?, custom }
 *           Dos colores = una pareja. Más de dos = grupo cuyos miembros combinan entre sí.
 * Outfit  { id, name, top, bottom, occasions: [], seasons: [], createdAt }   (fase 3)
 *
 * Lo que se guarda en localStorage (clave STORAGE_KEY):
 * {
 *   version: 1,
 *   owned: [colorId],            // fase 2: "Lo tengo"
 *   customColors: [Color],       // fase 2
 *   customClassics: [Classic],   // fase 2
 *   outfits: [Outfit],           // fase 3
 *   filters: { onlyOwned, occasion, season },   // fases 2 y 3
 *   last: { base, pair, swapped } // última combinación vista
 * }
 */

(function () {
  "use strict";

  /* ───────── Datos base ───────── */

  const FAMILIES = [
    { id: "azules", name: "Azules" },
    { id: "grises", name: "Grises" },
    { id: "calidos", name: "Neutros cálidos" },
    { id: "tierras", name: "Tierras" },
    { id: "verdes", name: "Verdes" },
    { id: "rojos", name: "Rojos" },
  ];

  const OCCASIONS = [
    { id: "trabajo", name: "Trabajo" },
    { id: "casual", name: "Casual" },
    { id: "salir", name: "Salir" },
  ];

  const SEASONS = [
    { id: "primavera", name: "Primavera" },
    { id: "verano", name: "Verano" },
    { id: "otono", name: "Otoño" },
    { id: "invierno", name: "Invierno" },
  ];

  const BASE_PALETTE = [
    { id: "azul-marino", name: "Azul marino", hex: "#1F2A44", neutral: true, family: "azules" },
    { id: "camel", name: "Camel", hex: "#C19A6B", neutral: false, family: "tierras" },
    { id: "verde-oliva", name: "Verde oliva", hex: "#6B7040", neutral: false, family: "verdes" },
    { id: "blanco", name: "Blanco", hex: "#F8F8F5", neutral: true, family: "grises" },
    { id: "gris-marengo", name: "Gris marengo", hex: "#3A3D42", neutral: true, family: "grises" },
    { id: "negro", name: "Negro", hex: "#151515", neutral: true, family: "grises" },
    { id: "crema", name: "Crema", hex: "#F0E6D2", neutral: true, family: "calidos" },
    { id: "gris", name: "Gris", hex: "#9EA1A5", neutral: true, family: "grises" },
    { id: "burdeos", name: "Burdeos", hex: "#6D1F2E", neutral: false, family: "rojos" },
    { id: "piedra", name: "Piedra", hex: "#C8BFAE", neutral: true, family: "calidos" },
    { id: "verde-bosque", name: "Verde bosque", hex: "#2E4A35", neutral: false, family: "verdes" },
    { id: "marron", name: "Marrón", hex: "#5C4033", neutral: false, family: "tierras" },
    { id: "tostado", name: "Tostado", hex: "#A47551", neutral: false, family: "tierras" },
    { id: "azul-claro", name: "Azul claro", hex: "#A9C6E0", neutral: false, family: "azules" },
    { id: "beis", name: "Beis", hex: "#D9C7A7", neutral: true, family: "calidos" },
    { id: "marfil", name: "Marfil", hex: "#F6F1E3", neutral: true, family: "calidos" },
    { id: "azul-denim", name: "Azul denim", hex: "#3F5F8A", neutral: false, family: "azules" },
    { id: "arena", name: "Arena", hex: "#D6C4A0", neutral: true, family: "calidos" },
  ].map((c) => ({ ...c, custom: false }));

  // Orden dentro de cada familia en la carta (de claro a oscuro, como una carta de hilos)
  const CARD_ORDER = [
    "azul-claro", "azul-denim", "azul-marino",
    "blanco", "gris", "gris-marengo", "negro",
    "marfil", "crema", "beis", "arena", "piedra",
    "camel", "tostado", "marron",
    "verde-oliva", "verde-bosque",
    "burdeos",
  ];

  const BASE_CLASSICS = [
    ["azul-marino", "camel"],
    ["verde-oliva", "blanco"],
    ["gris-marengo", "negro"],
    ["crema", "gris"],
    ["burdeos", "piedra"],
    ["azul-marino", "gris"],
    ["verde-bosque", "marron"],
    ["blanco", "tostado"],
    ["negro", "verde-oliva"],
    ["azul-claro", "beis"],
    ["gris-marengo", "camel"],
    ["azul-denim", "arena"],
    ["burdeos", "azul-marino"],
    ["verde-oliva", "crema"],
  ]
    .map((colors, i) => ({ id: "c" + (i + 1), colors, custom: false }))
    .concat([{ id: "c15", colors: ["beis", "crema", "marfil", "piedra"], label: "Neutros monocromáticos", custom: false }]);

  /* ───────── Almacenamiento (siempre con try/catch) ───────── */

  const STORAGE_KEY = "swatch:v1";

  function defaultStore() {
    return {
      version: 1,
      owned: [],
      customColors: [],
      customClassics: [],
      outfits: [],
      filters: { onlyOwned: false, occasion: null, season: null },
      last: null,
    };
  }

  function loadStore() {
    const fallback = defaultStore();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return fallback;
      return {
        ...fallback,
        ...data,
        filters: { ...fallback.filters, ...(data.filters || {}) },
        owned: Array.isArray(data.owned) ? data.owned : [],
        customColors: Array.isArray(data.customColors) ? data.customColors : [],
        customClassics: Array.isArray(data.customClassics) ? data.customClassics : [],
        outfits: Array.isArray(data.outfits) ? data.outfits : [],
      };
    } catch (err) {
      return fallback;
    }
  }

  function saveStore() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (err) {
      /* Sin almacenamiento (modo privado o lleno): la app sigue funcionando sin recordar. */
    }
  }

  const store = loadStore();

  /* ───────── Paleta y clásicos efectivos (base + propios) ───────── */

  function palette() {
    return BASE_PALETTE.concat(store.customColors);
  }

  function classics() {
    return BASE_CLASSICS.concat(store.customClassics);
  }

  const byId = (id) => palette().find((c) => c.id === id);

  function isOwned(id) {
    return store.owned.indexOf(id) !== -1;
  }

  // Fase 2: con el filtro "Solo lo que tengo" activo, las sugerencias se limitan al armario
  function passesFilters(color) {
    if (store.filters.onlyOwned && !isOwned(color.id)) return false;
    return true;
  }

  // Número de muestra Nº 01–18 según su posición en la carta
  function cardOrder() {
    const all = palette();
    const ordered = [];
    FAMILIES.forEach((f) => {
      const members = all.filter((c) => c.family === f.id);
      members.sort((a, b) => rank(a.id) - rank(b.id));
      ordered.push(...members);
    });
    all.forEach((c) => { if (ordered.indexOf(c) === -1) ordered.push(c); });
    return ordered;
  }

  function rank(id) {
    const i = CARD_ORDER.indexOf(id);
    return i === -1 ? 999 : i;
  }

  function shadeNo(id) {
    const i = cardOrder().findIndex((c) => c.id === id);
    return String(i + 1).padStart(2, "0");
  }

  /* ───────── Color: conversiones y medidas ───────── */

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHsl({ r, g, b }) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s, l };
  }

  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const lin = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }

  function contrast(a, b) {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  function hueDistance(a, b) {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  function rgbDistance(a, b) {
    const x = hexToRgb(a);
    const y = hexToRgb(b);
    return Math.sqrt((x.r - y.r) ** 2 + (x.g - y.g) ** 2 + (x.b - y.b) ** 2);
  }

  function nearestColor(hex) {
    let best = null;
    let bestD = Infinity;
    palette().forEach((c) => {
      const d = rgbDistance(hex, c.hex);
      if (d < bestD) { bestD = d; best = c; }
    });
    return best;
  }

  const isPale = (hex) => luminance(hex) > 0.78;
  // Tinta impresa sobre una banda: la de mayor contraste
  const inkOn = (hex) => (contrast(hex, "#2A2420") >= contrast(hex, "#F8F4EC") ? "#2A2420" : "#F8F4EC");

  const SVG_NS = "http://www.w3.org/2000/svg";
  function mark(kind, cls) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("class", cls || "mark");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", kind === "star"
      ? "M10 1.6l2.47 5.47 5.96.62-4.45 4.02 1.25 5.87L10 14.6l-5.23 2.98 1.25-5.87L1.57 7.69l5.96-.62z"
      : "M4 10.5l4 4 8-9");
    svg.appendChild(path);
    return svg;
  }

  /* ───────── Lógica de sugerencias ───────── */

  function partnersFromClassics(id) {
    const out = [];
    classics().forEach((cl) => {
      if (cl.colors.indexOf(id) === -1) return;
      cl.colors.forEach((other) => {
        if (other !== id && out.indexOf(other) === -1) out.push(other);
      });
    });
    return out;
  }

  function isClassicPair(a, b) {
    if (a === b) return false;
    return classics().some((cl) => cl.colors.indexOf(a) !== -1 && cl.colors.indexOf(b) !== -1);
  }

  function suggestionsFor(id) {
    const base = byId(id);
    const seen = new Set([id]);
    const groups = [];
    const take = (colors) => colors.filter((c) => c && !seen.has(c.id) && passesFilters(c)).map((c) => { seen.add(c.id); return c; });

    // 1. Tus clásicos
    groups.push({
      id: "classics",
      title: "Tus clásicos",
      why: "",
      colors: take(partnersFromClassics(id).map(byId)),
    });

    // 2. Neutros, de más a menos contraste de luminosidad
    const neutrals = palette()
      .filter((c) => c.neutral)
      .sort((a, b) => contrast(base.hex, b.hex) - contrast(base.hex, a.hex));
    groups.push({ id: "neutrals", title: "Neutros", why: "De más a menos contraste", colors: take(neutrals) });

    // 3. Tono sobre tono
    const family = FAMILIES.find((f) => f.id === base.family);
    groups.push({
      id: "family",
      title: "Tono sobre tono",
      why: "",
      colors: take(palette().filter((c) => c.family === base.family)),
    });

    // 4 y 5. Solo para colores no neutros
    if (!base.neutral) {
      const h = rgbToHsl(hexToRgb(base.hex)).h;
      const chromatic = palette().filter((c) => !c.neutral);

      const comp = chromatic
        .map((c) => ({ c, d: hueDistance(rgbToHsl(hexToRgb(c.hex)).h, (h + 180) % 360) }))
        .filter((x) => x.d <= 55)
        .sort((a, b) => a.d - b.d)
        .map((x) => x.c);
      groups.push({ id: "complementary", title: "Complementario", why: "±55°", colors: take(comp) });

      const analog = chromatic
        .map((c) => ({ c, d: hueDistance(rgbToHsl(hexToRgb(c.hex)).h, h) }))
        .filter((x) => x.d >= 10 && x.d <= 60)
        .sort((a, b) => a.d - b.d)
        .map((x) => x.c);
      groups.push({ id: "analogous", title: "Análogos", why: "10°–60°", colors: take(analog) });
    }

    return { groups: groups.filter((g) => g.colors.length), neutralBase: base.neutral };
  }

  /* ───────── Estado de la vista ───────── */

  const state = {
    base: "azul-marino",
    pair: "camel",
    swapped: false,
  };

  if (store.last && byId(store.last.base)) {
    state.base = store.last.base;
    state.pair = byId(store.last.pair) ? store.last.pair : null;
    state.swapped = !!store.last.swapped;
  }

  function remember() {
    store.last = { base: state.base, pair: state.pair, swapped: state.swapped };
    saveStore();
  }

  /* ───────── Render ───────── */

  const $ = (sel) => document.querySelector(sel);

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "style") Object.keys(v).forEach((p) => node.style.setProperty(p, v[p]));
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach((ch) => ch && node.appendChild(typeof ch === "string" ? document.createTextNode(ch) : ch));
    return node;
  }

  function band(color, { pressed, onClick, label }) {
    const owned = isOwned(color.id);
    return el("button", {
      type: "button",
      class: "band" + (isPale(color.hex) ? " is-pale" : ""),
      "aria-pressed": pressed ? "true" : "false",
      "aria-label": label || color.name + (owned ? ", lo tienes" : ""),
      "data-id": color.id,
      style: { "--c": color.hex, "--on": inkOn(color.hex) },
      onclick: onClick,
    }, [
      el("span", { class: "band__field", "aria-hidden": "true" }, [
        el("span", { class: "band__no", text: shadeNo(color.id) }),
        owned ? mark("check", "band__owned") : null,
      ]),
      el("span", { class: "band__name", "aria-hidden": "true", text: color.name }),
    ]);
  }

  function renderCarta() {
    const root = $("#carta");
    root.textContent = "";
    const all = cardOrder();
    FAMILIES.forEach((f) => {
      const members = all.filter((c) => c.family === f.id);
      if (!members.length) return;
      const row = el("div", { class: "carta__row", role: "group", "aria-label": f.name }, [
        el("span", { class: "carta__family", "aria-hidden": "true", text: f.name }),
      ]);
      members.forEach((c) => {
        row.appendChild(band(c, {
          pressed: c.id === state.base,
          onClick: () => selectBase(c.id),
          label: "Nº " + shadeNo(c.id) + ", " + c.name + (isOwned(c.id) ? ", lo tienes" : ""),
        }));
      });
      root.appendChild(row);
    });
  }

  function renderSuggestions() {
    const base = byId(state.base);
    const { groups, neutralBase } = suggestionsFor(state.base);
    const root = $("#suggestions");
    root.textContent = "";
    root.classList.remove("is-entering");
    if (document.documentElement.classList.contains("is-ready")) {
      void root.offsetWidth; // reinicia la animación de entrada
      root.classList.add("is-entering");
    }
    $("#sug-base").textContent = base.name;

    groups.forEach((g) => {
      const list = el("ul", { class: "strip" });
      g.colors.forEach((c) => {
        list.appendChild(el("li", null, [band(c, {
          pressed: c.id === state.pair,
          onClick: () => selectPair(c.id),
          label: c.name + (isOwned(c.id) ? ", lo tienes" : "") + ". Probar con " + base.name,
        })]));
      });
      root.appendChild(el("section", { class: "group group--" + g.id, "aria-label": g.title }, [
        el("div", { class: "group__head" }, [
          el("h3", { class: "group__title" }, [g.id === "classics" ? mark("star") : null, g.title]),
          g.why ? el("span", { class: "group__why", text: g.why }) : null,
        ]),
        list,
      ]));
    });

    if (neutralBase) {
      root.appendChild(el("p", {
        class: "suggestions__note",
        text: "Sin complementario ni análogos: es un neutro.",
      }));
    }

    if (!groups.length) {
      root.appendChild(el("p", { class: "suggestions__note", text: "No hay sugerencias con los filtros actuales." }));
    }
  }

  function firstSuggestion(id) {
    const { groups } = suggestionsFor(id);
    return groups.length ? groups[0].colors[0].id : null;
  }

  function accentFor() {
    // El 10 %: la primera sugerencia que no sea ni la base ni la pareja, preferiblemente con tono
    const { groups } = suggestionsFor(state.base);
    const flat = groups.reduce((acc, g) => acc.concat(g.colors), []).filter((c) => c.id !== state.pair);
    return flat.find((c) => !c.neutral) || flat[0] || null;
  }

  function renderStage() {
    const base = byId(state.base);
    const pair = state.pair ? byId(state.pair) : null;
    const top = state.swapped && pair ? pair : base;
    const bottom = state.swapped && pair ? base : pair || base;
    $("#garment-top").setAttribute("fill", top.hex);
    $("#garment-bottom").setAttribute("fill", bottom.hex);

    $("#stage-name").textContent = base.name;
    $("#stage-pair").textContent = "";
    if (pair) {
      $("#stage-pair").append("con ", el("strong", { text: pair.name }));
    } else {
      $("#stage-pair").textContent = "Elige con qué combinarlo";
    }

    [["top", top], ["bottom", bottom]].forEach(([pos, c]) => {
      const t = $("#tab-" + pos);
      t.style.setProperty("--c", c.hex);
      t.style.setProperty("--on", inkOn(c.hex));
      t.classList.toggle("is-pale", isPale(c.hex));
      $("#tab-" + pos + "-name").textContent = "Nº " + shadeNo(c.id) + " · " + c.name;
    });

    const verdict = $("#stage-verdict");
    const classic = pair && isClassicPair(base.id, pair.id);
    verdict.classList.toggle("is-classic", !!classic);
    if (classic) {
      verdict.textContent = "";
      verdict.append(mark("star"), "Uno de tus clásicos");
    } else if (pair) {
      const g = suggestionsFor(base.id).groups.find((x) => x.colors.some((c) => c.id === pair.id));
      verdict.textContent = g ? "Sugerencia: " + g.title.toLowerCase() : "Combinación libre";
    } else {
      verdict.textContent = "";
    }

    $("#swap").disabled = !pair;

    // Regla 60-30-10 con los colores actuales
    const accent = accentFor();
    $("#rule-60").style.setProperty("--c", bottom.hex);
    $("#rule-30").style.setProperty("--c", top.hex);
    $("#rule-10").style.setProperty("--c", accent ? accent.hex : base.hex);
    $("#rule-text").textContent =
      "Reparte el conjunto: un 60 % para el color dominante (" + bottom.name.toLowerCase() +
      "), un 30 % para el secundario (" + top.name.toLowerCase() +
      ") y un 10 % para un acento" + (accent ? " como el " + accent.name.toLowerCase() : "") +
      " en zapatos, cinturón o bufanda.";

    document.title = base.name + (pair ? " + " + pair.name : "") + " · Swatch";
  }

  function renderClassics() {
    const root = $("#classics");
    root.textContent = "";
    classics().forEach((cl, i) => {
      const colors = cl.colors.map(byId).filter(Boolean);
      if (colors.length < 2) return;
      const name = colors.map((c) => c.name).join(" + ");
      const btn = el("button", {
        type: "button",
        class: "classic",
        "aria-label": (cl.label ? cl.label + ": " : "") + name + ". Ver en la figura",
        onclick: () => loadClassic(cl),
      }, [
        el("span", { class: "classic__no", "aria-hidden": "true", text: String(i + 1) }),
        el("span", { class: "classic__bands", "aria-hidden": "true" },
          colors.map((c) => el("span", { class: isPale(c.hex) ? "is-pale" : null, style: { "--c": c.hex } }))),
        el("span", { class: "classic__name", "aria-hidden": "true", text: cl.label || name }),
        cl.label ? el("span", { class: "classic__note", "aria-hidden": "true", text: colors.map((c) => c.name).join(", ") + " entre sí" }) : null,
      ]);
      root.appendChild(el("li", null, [btn]));
    });
  }

  function renderAll() {
    renderStage();
    renderSuggestions();
    renderCarta();
  }

  /* ───────── Acciones ───────── */

  function selectBase(id) {
    if (id === state.base) return;
    state.base = id;
    state.pair = firstSuggestion(id);
    state.swapped = false;
    remember();
    renderAll();
  }

  function selectPair(id) {
    state.pair = id;
    remember();
    renderStage();
    // Solo cambia el aro en las sugerencias, sin volver a animar las tiras
    document.querySelectorAll("#suggestions .band").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.id === id ? "true" : "false");
    });
  }

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let flipping = false;

  function swap() {
    if (!state.pair || flipping) return;
    const fig = $(".figure");
    if (reduceMotion) {
      state.swapped = !state.swapped;
      remember();
      renderStage();
      return;
    }
    flipping = true;
    fig.classList.add("is-flipping");
    window.setTimeout(() => {
      state.swapped = !state.swapped;
      remember();
      renderStage();
      fig.classList.add("is-opening");
      fig.classList.remove("is-flipping");
      window.setTimeout(() => {
        fig.classList.remove("is-opening");
        flipping = false;
      }, 280);
    }, 190);
  }

  function loadClassic(cl) {
    state.base = cl.colors[0];
    state.pair = cl.colors[1];
    state.swapped = false;
    remember();
    renderAll();
    activateTab("combinar");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ───────── Color libre ───────── */

  function onFreeColor(e) {
    const hex = e.target.value.toUpperCase();
    const match = nearestColor(hex);
    const out = $("#free-result");
    out.textContent = "";
    out.append("Tu color " + hex + " se parece a ", el("strong", { text: match.name }), " (Nº " + shadeNo(match.id) + ").");
    if (match.id !== state.base) selectBase(match.id);
  }

  /* ───────── Pestañas ───────── */

  const tabs = Array.from(document.querySelectorAll(".tab"));

  function activateTab(name, focus) {
    tabs.forEach((t) => {
      const on = t.id === "tab-" + name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      if (on && focus) t.focus();
    });
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => activateTab(t.id.replace("tab-", "")));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      activateTab(next.id.replace("tab-", ""), true);
    });
  });

  /* ───────── Arranque ───────── */

  $("#swap").addEventListener("click", swap);
  $("#free-color").addEventListener("input", onFreeColor);
  $("#free-color").value = byId(state.base).hex;

  if (!state.pair) state.pair = firstSuggestion(state.base);
  renderAll();
  renderClassics();
  // Las transiciones de color y la entrada de las tiras solo a partir del primer pintado
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-ready")));

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }

  // Punto de acceso para las fases 2 y 3 (y para depurar desde la consola)
  window.Swatch = { FAMILIES, OCCASIONS, SEASONS, palette, classics, suggestionsFor, nearestColor, store, saveStore };
})();
