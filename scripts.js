/* Swatch · combinar colores de ropa
 *
 * Modelo de datos (preparado para las fases 2 y 3)
 * ------------------------------------------------
 * Color   { id, name, hex, neutral, family, custom, no?, source? }
 *           custom: true para los colores que añadas tú (fase 2) o saques de una foto (fase 3, source: "photo").
 *           no: número de muestra fijo de los colores propios (19, 20…), para que la carta no se renumere.
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
    { id: "otros", name: "Otros" },   // para colores propios que no encajen en ninguna familia
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
      members.sort((a, b) => rank(a) - rank(b));
      ordered.push(...members);
    });
    all.forEach((c) => { if (ordered.indexOf(c) === -1) ordered.push(c); });
    return ordered;
  }

  function rank(color) {
    const i = CARD_ORDER.indexOf(color.id);
    return i === -1 ? 1000 + (color.no || 0) : i;
  }

  // Los 18 de base van del 01 al 18 en orden de carta; los propios conservan el número que recibieron
  function shadeNo(id) {
    const c = byId(id);
    const n = c && c.custom ? c.no : CARD_ORDER.indexOf(id) + 1;
    return String(n || 0).padStart(2, "0");
  }

  /* ───────── Fase 2: armario, colores y clásicos propios ───────── */

  const newId = (prefix) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function toggleOwned(id) {
    const i = store.owned.indexOf(id);
    if (i === -1) store.owned.push(id);
    else store.owned.splice(i, 1);
    saveStore();
  }

  function normalizeName(name) {
    return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("es");
  }

  // Devuelve { color } o { error } con un mensaje para mostrar
  function addColor({ name, hex, family, neutral, owned, source }) {
    const clean = name.trim().replace(/\s+/g, " ");
    if (!clean) return { error: "Ponle un nombre al color." };
    if (palette().some((c) => normalizeName(c.name) === normalizeName(clean))) {
      return { error: "Ya hay un color llamado " + clean + " en la carta. Elige otro nombre." };
    }
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return { error: "El color no es válido. Vuelve a elegirlo." };
    const no = palette().reduce((max, c) => Math.max(max, c.custom ? c.no || 0 : CARD_ORDER.length), CARD_ORDER.length) + 1;
    const color = {
      id: newId("u-"),
      name: clean.charAt(0).toLocaleUpperCase("es") + clean.slice(1),
      hex: hex.toUpperCase(),
      neutral: !!neutral,
      family: FAMILIES.some((f) => f.id === family) ? family : "otros",
      custom: true,
      no,
      source: source === "photo" ? "photo" : "manual",
    };
    store.customColors.push(color);
    if (owned) store.owned.push(color.id);
    saveStore();
    return { color };
  }

  function deleteColor(id) {
    const c = byId(id);
    if (!c || !c.custom) return;
    store.customColors = store.customColors.filter((x) => x.id !== id);
    store.owned = store.owned.filter((x) => x !== id);
    store.customClassics = store.customClassics
      .map((cl) => ({ ...cl, colors: cl.colors.filter((x) => x !== id) }))
      .filter((cl) => cl.colors.length >= 2);
    store.outfits = store.outfits.filter((o) => o.top !== id && o.bottom !== id);
    saveStore();
  }

  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.indexOf(x) !== -1);

  function findClassic(colors) {
    return classics().find((cl) => sameSet(cl.colors, colors));
  }

  function addClassic(colors, label) {
    const ids = colors.filter((id, i) => byId(id) && colors.indexOf(id) === i);
    if (ids.length < 2) return { error: "Elige al menos dos colores." };
    if (ids.length > 4) return { error: "Como mucho cuatro colores por combinación." };
    const existing = findClassic(ids);
    if (existing) return { error: "Esa combinación ya está en tus clásicos." };
    const classic = { id: newId("k-"), colors: ids, custom: true };
    const cleanLabel = (label || "").trim().replace(/\s+/g, " ");
    if (cleanLabel) classic.label = cleanLabel;
    store.customClassics.push(classic);
    saveStore();
    return { classic };
  }

  function deleteClassic(id) {
    store.customClassics = store.customClassics.filter((cl) => cl.id !== id);
    saveStore();
  }

  /* ───────── Fase 3: conjuntos guardados ───────── */

  const nameOf = (list, id) => (list.find((x) => x.id === id) || {}).name;

  function addOutfit({ name, top, bottom, occasions, seasons }) {
    if (!byId(top) || !byId(bottom)) return { error: "Ese conjunto tiene un color que ya no está en la carta." };
    const clean = (name || "").trim().replace(/\s+/g, " ");
    const outfit = {
      id: newId("o-"),
      name: clean || byId(top).name + " con " + byId(bottom).name.toLocaleLowerCase("es"),
      top,
      bottom,
      occasions: OCCASIONS.map((o) => o.id).filter((id) => occasions.indexOf(id) !== -1),
      seasons: SEASONS.map((x) => x.id).filter((id) => seasons.indexOf(id) !== -1),
      createdAt: Date.now(),
    };
    store.outfits.unshift(outfit);
    saveStore();
    return { outfit };
  }

  function deleteOutfit(id) {
    store.outfits = store.outfits.filter((o) => o.id !== id);
    saveStore();
  }

  // Sin etiquetas de ocasión = vale para cualquiera; sin temporada = todo el año
  function outfitPasses(o) {
    const { occasion, season } = store.filters;
    if (occasion && o.occasions.length && o.occasions.indexOf(occasion) === -1) return false;
    if (season && o.seasons.length && o.seasons.indexOf(season) === -1) return false;
    return true;
  }

  function validOutfits() {
    return store.outfits.filter((o) => o && byId(o.top) && byId(o.bottom))
      .map((o) => ({ ...o, occasions: Array.isArray(o.occasions) ? o.occasions : [], seasons: Array.isArray(o.seasons) ? o.seasons : [] }));
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

  const toHex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

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
    path.setAttribute("d", {
      star: "M10 1.6l2.47 5.47 5.96.62-4.45 4.02 1.25 5.87L10 14.6l-5.23 2.98 1.25-5.87L1.57 7.69l5.96-.62z",
      check: "M4 10.5l4 4 8-9",
      cross: "M5 5l10 10M15 5L5 15",
    }[kind]);
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
    if (base.family !== "otros") {
      groups.push({
        id: "family",
        title: "Tono sobre tono",
        why: "",
        colors: take(palette().filter((c) => c.family === base.family)),
      });
    }

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
    armario: false,        // modo "Marcar mi armario" en la carta
    classicDraft: [],      // colores elegidos en el formulario de nueva combinación
    freshOutfit: null,     // el conjunto recién guardado, para marcarlo en la lista
  };

  // Lo que hay ahora en la figura, arriba y abajo
  function current() {
    const base = byId(state.base);
    const pair = state.pair ? byId(state.pair) : null;
    return {
      top: state.swapped && pair ? pair : base,
      bottom: state.swapped && pair ? base : pair || base,
    };
  }

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

  function band(color, { pressed, onClick, label, extraClass }) {
    const owned = isOwned(color.id);
    return el("button", {
      type: "button",
      class: "band" + (isPale(color.hex) ? " is-pale" : "") + (extraClass ? " " + extraClass : ""),
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
    root.classList.toggle("is-armario", state.armario);
    const all = cardOrder();
    FAMILIES.forEach((f) => {
      const members = all.filter((c) => c.family === f.id);
      if (!members.length) return;
      const cells = el("div", { class: "carta__cells" });
      members.forEach((c) => {
        const owned = isOwned(c.id);
        cells.appendChild(band(c, state.armario ? {
          pressed: owned,
          onClick: () => { toggleOwned(c.id); renderAfterOwnership(); },
          label: c.name + (owned ? ", lo tienes" : ", no lo tienes"),
        } : {
          pressed: c.id === state.base,
          onClick: () => selectBase(c.id),
          label: "Nº " + shadeNo(c.id) + ", " + c.name + (owned ? ", lo tienes" : ""),
        }));
      });
      root.appendChild(el("div", { class: "carta__row", role: "group", "aria-label": f.name }, [
        el("span", { class: "carta__family", "aria-hidden": "true", text: f.name }),
        cells,
      ]));
    });

    const total = palette().length;
    const mine = palette().filter((c) => isOwned(c.id)).length;
    $("#carta-hint").textContent = state.armario
      ? "Toca los colores que tienes en el armario. Llevas " + mine + " de " + total + "."
      : mine
        ? "Elige el color de tu prenda. Tienes " + mine + " de " + total + " en el armario."
        : "Elige el color de tu prenda.";
    const modeBtn = $("#armario-mode");
    modeBtn.setAttribute("aria-pressed", state.armario ? "true" : "false");
    modeBtn.textContent = state.armario ? "Hecho" : "Marcar mi armario";
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

    if (neutralBase && groups.length) {
      root.appendChild(el("p", {
        class: "suggestions__note",
        text: "Sin complementario ni análogos: es un neutro.",
      }));
    }

    if (!groups.length) {
      const nothingOwned = !store.owned.length;
      root.appendChild(el("div", { class: "empty" }, [
        el("p", { class: "empty__title", text: nothingOwned ? "Aún no has marcado nada de tu armario." : "Nada de tu armario combina con " + base.name + "." }),
        el("p", { class: "empty__text", text: nothingOwned
          ? "Marca los colores que tienes y aquí verás solo lo que puedes ponerte ya."
          : "Quita el filtro para ver todas las sugerencias, o marca más colores como tuyos." }),
        el("div", { class: "empty__actions" }, [
          nothingOwned ? el("button", { type: "button", class: "button button--small", text: "Marcar mi armario", onclick: () => startArmario() }) : null,
          el("button", { type: "button", class: "link", text: "Ver todas las sugerencias", onclick: () => setOnlyOwned(false) }),
        ]),
      ]));
    }

    const sw = $("#only-owned");
    sw.setAttribute("aria-checked", store.filters.onlyOwned ? "true" : "false");
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

  function paintTabBand(node, c) {
    node.style.setProperty("--c", c.hex);
    node.style.setProperty("--on", inkOn(c.hex));
    node.classList.toggle("is-pale", isPale(c.hex));
    node.querySelector(".tab-band__name").textContent = "Nº " + shadeNo(c.id) + " · " + c.name;
  }

  // Copia pequeña de la figura con otros colores (para la lista de conjuntos)
  function miniFigure(top, bottom) {
    const svg = $(".silhouette").cloneNode(true);
    svg.removeAttribute("role");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "silhouette silhouette--mini");
    svg.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    svg.querySelector(".garment--top path").setAttribute("fill", top.hex);
    svg.querySelector(".garment--bottom path").setAttribute("fill", bottom.hex);
    return svg;
  }

  function renderStage() {
    const base = byId(state.base);
    const pair = state.pair ? byId(state.pair) : null;
    const { top, bottom } = current();
    $("#garment-top").setAttribute("fill", top.hex);
    $("#garment-bottom").setAttribute("fill", bottom.hex);

    $("#stage-name").textContent = base.name;
    $("#stage-pair").textContent = "";
    if (pair) {
      $("#stage-pair").append("con ", el("strong", { text: pair.name }));
    } else {
      $("#stage-pair").textContent = "Elige con qué combinarlo";
    }

    paintTabBand($("#tab-top"), top);
    paintTabBand($("#tab-bottom"), bottom);

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
    if (!pair) {
      $("#rule-text").textContent = "Reparte el conjunto: 60 % un color dominante, 30 % uno secundario y 10 % un acento. Elige con qué combinar " + base.name.toLowerCase() + " para verlo aquí.";
    } else $("#rule-text").textContent =
      "Reparte el conjunto: un 60 % para el color dominante (" + bottom.name.toLowerCase() +
      "), un 30 % para el secundario (" + top.name.toLowerCase() +
      ") y un 10 % para un acento" + (accent ? " como el " + accent.name.toLowerCase() : "") +
      " en zapatos, cinturón o bufanda.";

    // Fase 2: Lo tengo, guardar como clásico y eliminar colores propios
    const own = $("#own-toggle");
    const owned = isOwned(base.id);
    own.setAttribute("aria-pressed", owned ? "true" : "false");
    $("#save-classic").hidden = !pair || !!classic;
    resetConfirm($("#delete-color"), "Eliminar este color de la carta");
    $("#delete-color").hidden = !base.custom;

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
        cl.label ? el("span", { class: "classic__note", "aria-hidden": "true", text: colors.length > 2 ? colors.map((c) => c.name).join(", ") + " entre sí" : name }) : null,
      ]);
      const remove = cl.custom ? el("button", {
        type: "button",
        class: "classic__remove",
        "aria-label": "Quitar " + (cl.label || name) + " de mis clásicos",
      }, [mark("cross", "classic__remove-icon"), el("span", { class: "classic__remove-text", text: "Quitar" })]) : null;
      if (remove) {
        remove.addEventListener("click", () => confirmThen(remove, "Quitar", () => {
          deleteClassic(cl.id);
          renderClassics();
          renderAll();
        }));
      }
      root.appendChild(el("li", { class: "classics__item" + (cl.custom ? " is-custom" : "") }, [btn, remove]));
    });
  }

  /* Confirmación en dos toques: el primer toque arma el botón, el segundo ejecuta */
  function confirmThen(btn, idleText, action, armedText) {
    if (btn.dataset.armed === "true") {
      action();
      return;
    }
    btn.dataset.armed = "true";
    btn.classList.add("is-armed");
    const text = btn.querySelector(".classic__remove-text") || btn;
    text.textContent = armedText || (btn.classList.contains("classic__remove") ? "Confirmar" : "Toca otra vez para eliminarlo");
    window.clearTimeout(btn._t);
    btn._t = window.setTimeout(() => resetConfirm(btn, idleText), 3500);
  }

  function resetConfirm(btn, idleText) {
    if (!btn) return;
    window.clearTimeout(btn._t);
    btn.dataset.armed = "false";
    btn.classList.remove("is-armed");
    const text = btn.querySelector(".classic__remove-text") || btn;
    text.textContent = idleText;
  }

  function renderOutfits() {
    const all = validOutfits();
    const root = $("#outfits");
    root.textContent = "";
    $("#outfit-filters").hidden = !all.length;
    syncFilterInputs();

    const shown = all.filter(outfitPasses);
    const filtered = !!(store.filters.occasion || store.filters.season);
    $("#outfit-count").textContent = filtered
      ? "Ves " + shown.length + " de " + all.length + (all.length === 1 ? " conjunto." : " conjuntos.")
      : "";

    if (!all.length) {
      root.appendChild(el("li", { class: "empty" }, [
        el("p", { class: "empty__title", text: "Aún no has guardado ningún conjunto." }),
        el("p", { class: "empty__text", text: "Combina dos colores en la figura y guárdalo aquí con un nombre, para qué ocasión es y en qué temporada te lo pones." }),
        el("div", { class: "empty__actions" }, [
          el("button", { type: "button", class: "button button--small", text: "Guardar el de la figura", onclick: () => openOutfitForm() }),
        ]),
      ]));
      return;
    }

    if (!shown.length) {
      const occ = nameOf(OCCASIONS, store.filters.occasion);
      const sea = nameOf(SEASONS, store.filters.season);
      const what = [occ ? "para " + occ.toLocaleLowerCase("es") : "", sea ? "en " + sea.toLocaleLowerCase("es") : ""].filter(Boolean).join(" ");
      root.appendChild(el("li", { class: "empty" }, [
        el("p", { class: "empty__title", text: "Ningún conjunto " + what + "." }),
        el("p", { class: "empty__text", text: "Prueba con otra ocasión o temporada, o guarda uno nuevo con esas etiquetas." }),
        el("div", { class: "empty__actions" }, [
          el("button", { type: "button", class: "link", text: "Ver todos los conjuntos", onclick: () => setOutfitFilter({ occasion: null, season: null }) }),
        ]),
      ]));
      return;
    }

    shown.forEach((o) => {
      const top = byId(o.top);
      const bottom = byId(o.bottom);
      const colors = top.id === bottom.id
        ? top.name + " de arriba abajo"
        : top.name + " arriba, " + bottom.name.toLocaleLowerCase("es") + " abajo";
      const tags = (o.occasions.length ? o.occasions.map((id) => nameOf(OCCASIONS, id)).join(", ") : "Cualquier ocasión") +
        " · " + (o.seasons.length ? o.seasons.map((id) => nameOf(SEASONS, id)).join(", ") : "Todo el año");
      const classic = isClassicPair(top.id, bottom.id);
      // El nombre es el botón; su ::after cubre toda la fila, y Quitar queda por encima
      const open = el("button", {
        type: "button",
        class: "outfit__open",
        "aria-label": o.name + ": " + colors + (classic ? ", uno de tus clásicos" : "") + ". " + tags + ". Ver en la figura",
        onclick: () => loadOutfit(o),
      }, [classic ? mark("star", "mark outfit__star") : null, o.name]);
      const remove = el("button", {
        type: "button",
        class: "classic__remove",
        "aria-label": "Quitar " + o.name + " de mis conjuntos",
      }, [mark("cross", "classic__remove-icon"), el("span", { class: "classic__remove-text", text: "Quitar" })]);
      remove.addEventListener("click", () => confirmThen(remove, "Quitar", () => {
        deleteOutfit(o.id);
        renderOutfits();
      }));
      root.appendChild(el("li", { class: "outfits__item" + (o.id === state.freshOutfit ? " is-fresh" : "") }, [
        el("span", { class: "outfit__figure", "aria-hidden": "true" }, [miniFigure(top, bottom)]),
        el("div", { class: "outfit__body" }, [
          open,
          el("span", { class: "outfit__colors", "aria-hidden": "true" }, [colors]),
          el("div", { class: "outfit__foot" }, [el("span", { class: "outfit__tags", "aria-hidden": "true", text: tags }), remove]),
        ]),
      ]));
    });
    state.freshOutfit = null;
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

  function loadOutfit(o) {
    state.base = o.top;
    state.pair = o.bottom === o.top ? null : o.bottom;
    state.swapped = false;
    remember();
    renderAll();
    activateTab("combinar");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function renderAfterOwnership() {
    renderCarta();
    renderStage();
    if (store.filters.onlyOwned) refreshSuggestionsKeepingPair();
    else renderSuggestions();
  }

  function refreshSuggestionsKeepingPair() {
    const { groups } = suggestionsFor(state.base);
    const stillThere = groups.some((g) => g.colors.some((c) => c.id === state.pair));
    if (!stillThere) state.pair = groups.length ? groups[0].colors[0].id : null;
    remember();
    renderStage();
    renderSuggestions();
  }

  function setOnlyOwned(on) {
    store.filters.onlyOwned = !!on;
    saveStore();
    refreshSuggestionsKeepingPair();
  }

  function startArmario() {
    state.armario = true;
    renderCarta();
    $("#carta-title").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function toggleArmario() {
    state.armario = !state.armario;
    renderCarta();
  }

  /* ───────── Formulario: color nuevo ───────── */

  let colorSource = "manual";

  function openColorForm(hex, source) {
    colorSource = source || "manual";
    const form = $("#add-color-form");
    form.hidden = false;
    $("#add-color-toggle").setAttribute("aria-expanded", "true");
    if (hex) $("#new-color-hex").value = hex;
    const near = nearestColor($("#new-color-hex").value);
    if (near) {
      $("#new-color-family").value = near.family;
      $("#new-color-neutral").checked = near.neutral;
    }
    setNameError("");
    $("#new-color-name").focus();
  }

  function setNameError(msg) {
    $("#new-color-error").textContent = msg;
    if (msg) $("#new-color-name").setAttribute("aria-invalid", "true");
    else $("#new-color-name").removeAttribute("aria-invalid");
  }

  function closeColorForm() {
    const form = $("#add-color-form");
    form.hidden = true;
    form.reset();
    $("#add-color-toggle").setAttribute("aria-expanded", "false");
    setNameError("");
  }

  function onColorSubmit(e) {
    e.preventDefault();
    const res = addColor({
      name: $("#new-color-name").value,
      hex: $("#new-color-hex").value,
      family: $("#new-color-family").value,
      neutral: $("#new-color-neutral").checked,
      owned: $("#new-color-owned").checked,
      source: colorSource,
    });
    if (res.error) {
      setNameError(res.error);
      $("#new-color-name").focus();
      return;
    }
    closeColorForm();
    $("#free-add").hidden = true;
    $("#photo-add").hidden = true;
    renderClassicPicker();
    state.base = res.color.id;
    state.pair = firstSuggestion(res.color.id);
    state.swapped = false;
    remember();
    renderAll();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ───────── Formulario: nueva combinación ───────── */

  function renderClassicPicker() {
    const root = $("#classic-picker");
    root.textContent = "";
    cardOrder().forEach((c) => {
      const pos = state.classicDraft.indexOf(c.id);
      root.appendChild(band(c, {
        pressed: pos !== -1,
        onClick: () => toggleDraft(c.id),
        label: c.name + (pos !== -1 ? ", elegido" : ""),
      }));
    });
    const chosen = state.classicDraft.map(byId).filter(Boolean);
    const preview = $("#classic-preview");
    preview.textContent = "";
    chosen.forEach((c) => preview.appendChild(el("span", { class: isPale(c.hex) ? "is-pale" : null, style: { "--c": c.hex } })));
    preview.hidden = !chosen.length;
    $("#classic-summary").textContent = chosen.length ? chosen.map((c) => c.name).join(" + ") : "Nada elegido todavía.";
  }

  function toggleDraft(id) {
    const i = state.classicDraft.indexOf(id);
    $("#new-classic-error").textContent = "";
    if (i !== -1) state.classicDraft.splice(i, 1);
    else if (state.classicDraft.length >= 4) {
      $("#new-classic-error").textContent = "Como mucho cuatro colores. Quita uno para cambiarlo.";
      return;
    } else state.classicDraft.push(id);
    renderClassicPicker();
  }

  function openClassicForm(prefill) {
    state.classicDraft = prefill ? prefill.slice() : [];
    $("#add-classic-form").hidden = false;
    $("#add-classic-toggle").setAttribute("aria-expanded", "true");
    $("#new-classic-error").textContent = "";
    renderClassicPicker();
  }

  function closeClassicForm() {
    state.classicDraft = [];
    const form = $("#add-classic-form");
    form.hidden = true;
    form.reset();
    $("#add-classic-toggle").setAttribute("aria-expanded", "false");
    $("#new-classic-error").textContent = "";
  }

  function onClassicSubmit(e) {
    e.preventDefault();
    const res = addClassic(state.classicDraft, $("#new-classic-label").value);
    if (res.error) {
      $("#new-classic-error").textContent = res.error;
      return;
    }
    closeClassicForm();
    renderClassics();
    renderAll();
  }

  function saveCurrentAsClassic() {
    if (!state.pair) return;
    const res = addClassic([state.base, state.pair]);
    if (res.error) return;
    renderClassics();
    renderAll();
  }

  // Al eliminar un color también caen los conjuntos y clásicos propios que lo usan: se avisa al armar
  function deleteColorWarning(id) {
    const outfits = store.outfits.filter((o) => o.top === id || o.bottom === id).length;
    const classicsGone = store.customClassics.filter((cl) => cl.colors.indexOf(id) !== -1 && cl.colors.length - 1 < 2).length;
    const parts = [];
    if (outfits) parts.push(outfits + (outfits === 1 ? " conjunto" : " conjuntos"));
    if (classicsGone) parts.push(classicsGone + (classicsGone === 1 ? " clásico" : " clásicos"));
    return parts.length ? "Toca otra vez: también se quita" + (outfits + classicsGone > 1 ? "n " : " ") + parts.join(" y ") : null;
  }

  /* ───────── Fase 3: guardar un conjunto ───────── */

  function choiceList(root, items, name) {
    items.forEach((it) => {
      root.appendChild(el("label", { class: "check" }, [
        el("input", { type: "checkbox", name, value: it.id }),
        el("span", { text: it.name }),
      ]));
    });
  }

  const checkedIn = (root) => Array.from(root.querySelectorAll("input:checked")).map((i) => i.value);

  function renderOutfitDraft() {
    const { top, bottom } = current();
    paintTabBand($("#draft-top"), top);
    paintTabBand($("#draft-bottom"), bottom);
    const fig = $("#outfit-draft-figure");
    fig.textContent = "";
    fig.appendChild(miniFigure(top, bottom));
  }

  function openOutfitForm() {
    const form = $("#add-outfit-form");
    // Si hay un filtro puesto, el conjunto nuevo nace con esas etiquetas
    if (form.hidden) {
      form.reset();
      [["#new-outfit-occasions", store.filters.occasion], ["#new-outfit-seasons", store.filters.season]].forEach(([sel, val]) => {
        if (!val) return;
        const box = $(sel).querySelector('input[value="' + val + '"]');
        if (box) box.checked = true;
      });
    }
    form.hidden = false;
    $("#add-outfit-toggle").setAttribute("aria-expanded", "true");
    $("#outfits").classList.add("is-drafting");
    renderOutfitDraft();
    // En el móvil no se abre el teclado por un campo opcional: el foco va al formulario
    const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    (fine ? $("#new-outfit-name") : form).focus({ preventScroll: true });
  }

  function closeOutfitForm() {
    const form = $("#add-outfit-form");
    form.hidden = true;
    form.reset();
    $("#add-outfit-toggle").setAttribute("aria-expanded", "false");
    $("#outfits").classList.remove("is-drafting");
  }

  function onOutfitSubmit(e) {
    e.preventDefault();
    const { top, bottom } = current();
    const res = addOutfit({
      name: $("#new-outfit-name").value,
      top: top.id,
      bottom: bottom.id,
      occasions: checkedIn($("#new-outfit-occasions")),
      seasons: checkedIn($("#new-outfit-seasons")),
    });
    if (res.error) return;
    closeOutfitForm();
    state.freshOutfit = res.outfit.id;
    // Que el recién guardado se vea aunque el filtro activo lo dejara fuera
    if (!outfitPasses(res.outfit)) { store.filters.occasion = null; store.filters.season = null; saveStore(); }
    renderOutfits();
    $("#add-outfit-toggle").focus({ preventScroll: true });
  }

  function saveOutfitFromStage() {
    activateTab("conjuntos");
    openOutfitForm();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ───────── Fase 3: filtros de ocasión y temporada ───────── */

  function filterOptions(root, items, key) {
    [{ id: "", name: "Todas" }].concat(items).forEach((it) => {
      root.appendChild(el("label", { class: "filter__option" }, [
        el("input", {
          type: "radio",
          class: "visually-hidden",
          name: "filter-" + key,
          value: it.id,
          onchange: () => setOutfitFilter({ [key]: it.id || null }),
        }),
        el("span", { text: it.name }),
      ]));
    });
  }

  function syncFilterInputs() {
    [["#filter-occasion", store.filters.occasion], ["#filter-season", store.filters.season]].forEach(([sel, val]) => {
      $(sel).querySelectorAll("input").forEach((i) => { i.checked = i.value === (val || ""); });
    });
  }

  function setOutfitFilter(patch) {
    Object.assign(store.filters, patch);
    saveStore();
    renderOutfits();
  }

  /* ───────── Fase 3: sacar el color de una foto ───────── */

  const photo = { img: null, x: 0.5, y: 0.5, placed: false, hex: null };

  function onPhotoChosen(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // permite volver a elegir la misma foto
    if (!file) return;
    $("#photo-error").textContent = "";
    if (!/^image\//.test(file.type || "image/")) {
      $("#photo-error").textContent = "Eso no es una imagen. Elige una foto de la prenda.";
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      drawPhoto(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      $("#photo-error").textContent = "No he podido abrir esa foto. Prueba con otra, mejor en JPG o PNG.";
    };
    img.src = url;
  }

  function drawPhoto(img) {
    // Se reduce a 1200 px por el lado largo: de sobra para leer un color y ligera en memoria
    const scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = $("#photo-canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    photo.img = img;
    photo.placed = false;
    $("#photo-panel").hidden = false;
    $("#photo-result").hidden = true;
    $("#photo-reticle").hidden = true;
    $("#photo-hint").textContent = "Toca la prenda en la foto. La foto no se guarda.";
    $("#photo-pick-label").textContent = "Elegir otra foto";
    fitPhoto();
    $("#photo-panel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  // Encaja la foto en el ancho disponible sin pasar de media pantalla de alto
  function fitPhoto() {
    const canvas = $("#photo-canvas");
    if (!photo.img) return;
    const frame = canvas.parentElement;
    const maxW = frame.clientWidth;
    const maxH = Math.max(220, Math.min(window.innerHeight * 0.5, 520));
    const k = Math.min(maxW / canvas.width, maxH / canvas.height);
    canvas.style.width = Math.round(canvas.width * k) + "px";
    canvas.style.height = Math.round(canvas.height * k) + "px";
    placeReticle();
  }

  function placeReticle() {
    const r = $("#photo-reticle");
    r.hidden = !photo.placed;
    if (!photo.placed) return;
    const canvas = $("#photo-canvas");
    r.style.left = canvas.offsetLeft + photo.x * canvas.clientWidth + "px";
    r.style.top = canvas.offsetTop + photo.y * canvas.clientHeight + "px";
  }

  function samplePhoto() {
    const canvas = $("#photo-canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const cx = Math.round(photo.x * (canvas.width - 1));
    const cy = Math.round(photo.y * (canvas.height - 1));
    // Media de un cuadradito alrededor del punto: la trama del tejido no engaña tanto como un píxel suelto
    const rad = Math.max(2, Math.round(Math.min(canvas.width, canvas.height) * 0.012));
    const x0 = Math.max(0, cx - rad);
    const y0 = Math.max(0, cy - rad);
    const w = Math.min(canvas.width, cx + rad + 1) - x0;
    const h = Math.min(canvas.height, cy + rad + 1) - y0;
    let data;
    try {
      data = ctx.getImageData(x0, y0, w, h).data;
    } catch (err) {
      $("#photo-error").textContent = "No he podido leer los colores de esa foto. Prueba con otra.";
      return;
    }
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    }
    if (!n) return;
    const hex = toHex(r / n, g / n, b / n);
    photo.hex = hex;
    placeReticle();

    const match = nearestColor(hex);
    const sample = $("#photo-sample");
    sample.style.setProperty("--c", hex);
    sample.style.setProperty("--on", inkOn(hex));
    sample.classList.toggle("is-pale", isPale(hex));
    const m = $("#photo-match");
    m.style.setProperty("--c", match.hex);
    m.style.setProperty("--on", inkOn(match.hex));
    m.classList.toggle("is-pale", isPale(match.hex));
    $("#photo-match-cap").textContent = "Nº " + shadeNo(match.id) + " · " + match.name;

    const text = $("#photo-text");
    text.textContent = "";
    text.append("Se parece a ", el("strong", { text: match.name }), ". Ya está en la figura.");
    $("#photo-result").hidden = false;
    $("#photo-add").hidden = rgbDistance(hex, match.hex) < 18;
    $("#photo-hint").textContent = "Toca otro punto para afinar. La foto no se guarda.";
    if (match.id !== state.base) {
      // Las sugerencias de arriba cambian de alto: que la foto no se mueva bajo el dedo
      const before = canvas.getBoundingClientRect().top;
      selectBase(match.id);
      const shift = canvas.getBoundingClientRect().top - before;
      if (Math.abs(shift) > 1) window.scrollBy(0, shift);
    }
  }

  function onPhotoTap(e) {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    photo.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    photo.y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    photo.placed = true;
    samplePhoto();
  }

  function onPhotoKey(e) {
    const step = e.shiftKey ? 0.1 : 0.025;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      if (photo.placed) {
        photo.x = Math.min(1, Math.max(0, photo.x + moves[e.key][0]));
        photo.y = Math.min(1, Math.max(0, photo.y + moves[e.key][1]));
      }
      photo.placed = true;
      samplePhoto();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      photo.placed = true;
      samplePhoto();
    }
  }

  function closePhoto() {
    photo.img = null;
    photo.placed = false;
    const canvas = $("#photo-canvas");
    canvas.width = canvas.height = 0;
    $("#photo-panel").hidden = true;
    $("#photo-pick-label").textContent = "Sacar el color de una foto";
    $("#photo-error").textContent = "";
    $(".photo__pick input").focus({ preventScroll: true });
  }

  /* ───────── Color libre ───────── */

  function onFreeColor(e) {
    const hex = e.target.value.toUpperCase();
    const match = nearestColor(hex);
    const out = $("#free-result");
    out.textContent = "";
    out.append("Tu color " + hex + " se parece a ", el("strong", { text: match.name }), " (Nº\u00a0" + shadeNo(match.id) + ").");
    // Si está lejos de cualquier color de la carta, ofrece añadirlo tal cual
    $("#free-add").hidden = rgbDistance(hex, match.hex) < 18;
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
    // El formulario de conjunto siempre enseña lo que hay ahora en la figura
    if (name === "conjuntos" && !$("#add-outfit-form").hidden) renderOutfitDraft();
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
  $("#own-toggle").addEventListener("click", () => { toggleOwned(state.base); renderAfterOwnership(); });
  $("#save-classic").addEventListener("click", saveCurrentAsClassic);
  $("#delete-color").addEventListener("click", (e) => confirmThen(e.currentTarget, "Eliminar este color de la carta", () => {
    deleteColor(state.base);
    state.base = "azul-marino";
    state.pair = firstSuggestion(state.base);
    state.swapped = false;
    remember();
    renderAll();
    renderClassics();
    renderOutfits();
  }, deleteColorWarning(state.base)));
  $("#only-owned").addEventListener("click", () => setOnlyOwned(!store.filters.onlyOwned));
  $("#armario-mode").addEventListener("click", toggleArmario);

  FAMILIES.forEach((f) => $("#new-color-family").appendChild(el("option", { value: f.id, text: f.name })));
  $("#add-color-toggle").addEventListener("click", () => ($("#add-color-form").hidden ? openColorForm() : closeColorForm()));
  $("#add-color-cancel").addEventListener("click", closeColorForm);
  $("#add-color-form").addEventListener("submit", onColorSubmit);
  $("#new-color-name").addEventListener("input", () => { if ($("#new-color-error").textContent) setNameError(""); });
  $("#new-color-hex").addEventListener("input", (e) => {
    const near = nearestColor(e.target.value);
    if (near) { $("#new-color-family").value = near.family; $("#new-color-neutral").checked = near.neutral; }
  });
  $("#free-add").addEventListener("click", () => openColorForm($("#free-color").value));

  $("#add-classic-toggle").addEventListener("click", () => ($("#add-classic-form").hidden ? openClassicForm() : closeClassicForm()));
  $("#add-classic-cancel").addEventListener("click", closeClassicForm);
  $("#add-classic-form").addEventListener("submit", onClassicSubmit);
  $("#free-color").addEventListener("input", onFreeColor);

  $("#save-outfit").addEventListener("click", saveOutfitFromStage);
  choiceList($("#new-outfit-occasions"), OCCASIONS, "occasion");
  choiceList($("#new-outfit-seasons"), SEASONS, "season");
  filterOptions($("#filter-occasion"), OCCASIONS, "occasion");
  filterOptions($("#filter-season"), SEASONS, "season");
  $("#add-outfit-toggle").addEventListener("click", () => ($("#add-outfit-form").hidden ? openOutfitForm() : closeOutfitForm()));
  $("#add-outfit-cancel").addEventListener("click", closeOutfitForm);
  $("#add-outfit-form").addEventListener("submit", onOutfitSubmit);
  $("#draft-go-combinar").addEventListener("click", () => activateTab("combinar", true));

  $("#photo-input").addEventListener("change", onPhotoChosen);
  $("#photo-canvas").addEventListener("click", onPhotoTap);
  $("#photo-canvas").addEventListener("keydown", onPhotoKey);
  $("#photo-close").addEventListener("click", closePhoto);
  $("#photo-add").addEventListener("click", () => photo.hex && openColorForm(photo.hex, "photo"));
  window.addEventListener("resize", () => { if (photo.img) fitPhoto(); });
  $("#free-color").value = byId(state.base).hex;

  if (!state.pair) state.pair = firstSuggestion(state.base);
  renderAll();
  renderClassics();
  renderOutfits();
  // Alturas reales de la cabecera y de la figura fija, para el sticky y los saltos de sección
  if ("ResizeObserver" in window) {
    const root = document.documentElement.style;
    const ro = new ResizeObserver(() => {
      root.setProperty("--mast-h", $(".masthead").offsetHeight + "px");
      root.setProperty("--stage-h", $(".stage").offsetHeight + "px");
    });
    ro.observe($(".masthead"));
    ro.observe($(".stage"));
  }

  // Las transiciones de color y la entrada de las tiras solo a partir del primer pintado
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-ready")));

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }

  // Punto de acceso para las fases 2 y 3 (y para depurar desde la consola)
  window.Swatch = { FAMILIES, OCCASIONS, SEASONS, palette, classics, suggestionsFor, nearestColor, store, saveStore, addColor, addClassic, addOutfit, toggleOwned };
})();
