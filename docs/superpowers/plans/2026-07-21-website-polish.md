# KFD Website Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the existing KFD Chinese website so its content is less repetitive, its solutions are evidence-led, and its navigation and quote flow work reliably on desktop, tablet, and mobile.

**Architecture:** Keep the existing React/Vite single-page entry and route-by-path structure. Extend the existing content model for homepage trust proof and solution detail, keep interaction state local to `Header` and `QuoteDialog`, and make responsive changes in the current stylesheet without introducing a new component framework or dependency.

**Tech Stack:** React 19, Vite 6, Vitest 4, Testing Library, Phosphor Icons, existing CSS design tokens and real assets in `public/assets`.

## Global Constraints

- Preserve the existing KFD logo, ivory background, navy text, orange accent, and subtle motion language.
- Use only the existing real factory, equipment, product, and certification assets.
- Do not display customer names or customer logos.
- Do not invent customer cases, test results, performance numbers, or certification claims.
- Use `909015753@qq.com` as the contact email.
- Do not add a WeChat QR code or an empty QR-code placeholder.
- Do not add routes, replace React/Vite, or add a UI framework.
- Keep Chinese and English variants for all new public-facing copy.
- Respect `prefers-reduced-motion: reduce`.

## File Map

- `src/content.js`: owns verifiable homepage trust copy and structured solution data.
- `src/App.jsx`: renders the homepage trust section, solution cards, and page-level modal isolation.
- `src/components/Header.jsx`: owns desktop navigation and the tablet/mobile drawer lifecycle.
- `src/components/QuoteDialog.jsx`: owns the three-step form, validation, focus, scroll, and submission states.
- `src/components/Footer.jsx`: renders the confirmed contact details without filing-number placeholders.
- `src/styles.css`: preserves the design system while implementing responsive drawer, proof cards, solution cards, compact spacing, and mobile dialog behavior.
- `src/App.test.jsx`: covers public content, navigation, quote behavior, and regressions.

---

### Task 1: Remove duplicate proof and add verifiable homepage trust content

**Files:**
- Modify: `src/content.js:137-176`
- Modify: `src/App.jsx:1-72`
- Modify: `src/components/Footer.jsx:38-40`
- Modify: `src/styles.css:344-489,1208-1251`
- Test: `src/App.test.jsx:13-21`

**Interfaces:**
- Consumes: existing `certifications` entries with `{ name, label, image, file }`.
- Produces: `copy[lang].homeQualityKicker`, `homeQualityTitle`, `homeQualityText`, and `viewCertificates`; one homepage certification proof section; footer copyright text with no placeholder.

- [ ] **Step 1: Write failing homepage and footer regression tests**

Replace the homepage assertion with exact metric counts and add trust/footer checks:

```jsx
test("renders factory, product and certification proof without repeating capacity metrics", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /高品质纸箱制造/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "看得见的工厂实力" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "以可核验资料建立合作信任" })).toBeInTheDocument();
  expect(screen.getAllByText("300,000")).toHaveLength(1);
  expect(screen.getAllByText("200,000")).toHaveLength(1);
  expect(screen.getByRole("link", { name: /查看 ISO9001/ })).toHaveAttribute(
    "href",
    "/certificates/iso9001-quality.pdf",
  );
  expect(screen.getByText(/© 2026 青岛凯丰德包装有限公司/)).toBeInTheDocument();
  expect(screen.queryByText(/备案号待补充|ICP number pending/)).not.toBeInTheDocument();
  expect(screen.getAllByText("909015753@qq.com").length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/App.test.jsx -t "without repeating capacity metrics"`

Expected: FAIL because the trust heading does not exist, metric values appear twice, and the footer still includes the filing placeholder.

- [ ] **Step 3: Add bilingual homepage trust copy**

Add these keys to both branches of `copy` in `src/content.js`:

```js
// copy.zh
homeQualityKicker: "品质保障",
homeQualityTitle: "以可核验资料建立合作信任",
homeQualityText: "质量、环境、FSC 与材料检测资料集中展示，方便客户进行供应商审核。",
viewCertificates: "查看全部认证",

// copy.en
homeQualityKicker: "QUALITY ASSURANCE",
homeQualityTitle: "Build trust with verifiable documents",
homeQualityText: "Quality, environmental, FSC and material test documents are organized for supplier review.",
viewCertificates: "View all certificates",
```

- [ ] **Step 4: Replace the duplicate metric strip with certification proof**

Change the import and bottom section in `HomePage`:

```jsx
import { certifications, company, copy, products } from "./content.js";

<section className="home-quality" aria-labelledby="home-quality-title">
  <div className="container home-quality-layout">
    <div className="home-quality-copy">
      <p className="section-kicker">{t.homeQualityKicker}</p>
      <h2 id="home-quality-title">{t.homeQualityTitle}</h2>
      <p>{t.homeQualityText}</p>
      <a className="section-link" href="/certifications">
        {t.viewCertificates} <ArrowRight size={18} />
      </a>
    </div>
    <div className="home-quality-cards">
      {certifications.map((certificate) => (
        <a
          className="home-quality-card"
          href={certificate.file}
          key={certificate.name}
          target="_blank"
          rel="noreferrer"
          aria-label={`${lang === "zh" ? "查看" : "View"} ${certificate.name} ${certificate.label[lang]}`}
        >
          <img src={certificate.image} alt="" loading="lazy" />
          <span>{certificate.name}</span>
          <small>{certificate.label[lang]}</small>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 5: Remove the footer filing placeholder**

Replace the footer bottom text:

```jsx
<div className="container footer-bottom">
  © 2026 {lang === "zh" ? company.name : company.englishName}
</div>
```

- [ ] **Step 6: Add trust-section styles and tighten homepage spacing**

Replace `.home-proof` styles with:

```css
.home-clean-section {
  padding: 82px 0 28px;
}

.home-products {
  padding-top: 82px;
  padding-bottom: 82px;
}

.home-quality {
  padding: 78px 0 92px;
  background: #f6f8fb;
}

.home-quality-layout {
  display: grid;
  grid-template-columns: 0.78fr 1.4fr;
  gap: 58px;
  align-items: center;
}

.home-quality-copy > p:not(.section-kicker) {
  color: var(--muted);
  line-height: 1.8;
}

.home-quality-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--line);
  background: #fff;
}

.home-quality-card {
  min-width: 0;
  padding: 22px 18px;
  border-right: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.home-quality-card:last-child {
  border-right: 0;
}

.home-quality-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(3, 23, 47, 0.08);
}

.home-quality-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: top center;
  border: 1px solid var(--line);
}

.home-quality-card span,
.home-quality-card small {
  display: block;
}

.home-quality-card span {
  margin-top: 14px;
  color: var(--navy);
  font-weight: 900;
}

.home-quality-card small {
  margin-top: 5px;
  color: var(--muted);
  line-height: 1.45;
}
```

- [ ] **Step 7: Run the focused test and verify pass**

Run: `npm test -- --run src/App.test.jsx -t "without repeating capacity metrics"`

Expected: PASS.

- [ ] **Step 8: Commit the homepage and footer work**

```bash
git add src/content.js src/App.jsx src/components/Footer.jsx src/styles.css src/App.test.jsx
git commit -m "feat: strengthen homepage trust proof"
```

---

### Task 2: Turn the solutions page into image-backed inquiry cards

**Files:**
- Modify: `src/content.js:128-135`
- Modify: `src/App.jsx:103-163,242`
- Modify: `src/styles.css:541-569,1413-1603`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `products` and existing asset URLs.
- Produces: exported `solutions` array with `{ id, productId, image, alt, title, text, application, capability, rfq }`; `SolutionsPage({ lang, onOpenQuote })` calls `onOpenQuote(productName)`.

- [ ] **Step 1: Write a failing solutions-page behavior test**

```jsx
test("solutions use real images, practical proof fields and a preselected quote", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/solutions");
  render(<App />);

  expect(screen.getByRole("img", { name: "彩印品牌包装实拍" })).toHaveAttribute(
    "src",
    "/assets/product-color-printing-power.png",
  );
  expect(screen.getAllByText("适用场景")).toHaveLength(4);
  expect(screen.getAllByText("核心能力")).toHaveLength(4);
  expect(screen.getAllByText("询价资料")).toHaveLength(4);

  await user.click(screen.getByRole("button", { name: "咨询彩印品牌包装" }));
  expect(screen.getByRole("radio", { name: "彩印纸箱" })).toBeChecked();
  expect(screen.queryByText(/海尔|海信|正大|海氏海诺/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/App.test.jsx -t "solutions use real images"`

Expected: FAIL because the current solution cards are text-only and have no card-level inquiry buttons.

- [ ] **Step 3: Replace `solutionCards` with structured, bilingual solution data**

In `src/content.js`, export these four entries:

```js
export const solutions = [
  {
    id: "printed-brand",
    productId: "printed-carton",
    image: "/assets/product-color-printing-power.png",
    alt: { zh: "彩印品牌包装实拍", en: "Printed brand packaging" },
    title: { zh: "彩印品牌包装", en: "Printed Brand Packaging" },
    text: { zh: "兼顾品牌展示、结构成型与运输保护。", en: "Balances brand presentation, structural forming and transport protection." },
    application: { zh: "品牌包装、工业产品、出口展示", en: "Brand packaging, industrial products, export display" },
    capability: { zh: "彩印、模切、开槽、钉箱与粘箱", en: "Color printing, die-cutting, slotting, stitching and gluing" },
    rfq: { zh: "尺寸、数量、设计文件、印刷颜色", en: "Size, quantity, artwork and print colors" },
  },
  {
    id: "export-transport",
    productId: "standard-carton",
    image: "/assets/product-standard-carton.png",
    alt: { zh: "出口运输纸箱实拍", en: "Export transport cartons" },
    title: { zh: "出口运输包装", en: "Export Transport Packaging" },
    text: { zh: "围绕堆码、防护与物流距离匹配纸板和箱型。", en: "Matches board and structure to stacking, protection and transport distance." },
    application: { zh: "长途运输、仓储堆码、出口交付", en: "Long-distance transport, warehousing and export delivery" },
    capability: { zh: "多楞型纸板、开槽、模切与成型", en: "Multiple flute options, slotting, die-cutting and forming" },
    rfq: { zh: "产品重量、装箱方式、交付地、堆码要求", en: "Product weight, packing method, destination and stacking needs" },
  },
  {
    id: "industrial",
    productId: "corrugated-board",
    image: "/assets/product-corrugated-board.png",
    alt: { zh: "工业产品瓦楞包装实拍", en: "Industrial corrugated packaging" },
    title: { zh: "工业产品包装", en: "Industrial Product Packaging" },
    text: { zh: "根据尺寸、重量和装箱方式匹配材料与结构。", en: "Matches material and structure to product size, weight and packing method." },
    application: { zh: "设备配件、工业制品、批量周转", en: "Equipment parts, industrial goods and volume turnover" },
    capability: { zh: "纸板配套、结构定制、内衬与成型建议", en: "Board supply, structural customization, inserts and forming advice" },
    rfq: { zh: "产品尺寸、重量、数量、保护要求", en: "Product size, weight, quantity and protection needs" },
  },
  {
    id: "oversize",
    productId: "oversize-carton",
    image: "/assets/product-oversize-flexo-printed.png",
    alt: { zh: "超大规格纸箱实拍", en: "Oversized corrugated cartons" },
    title: { zh: "大尺寸定制包装", en: "Large-size Custom Packaging" },
    text: { zh: "面向大件产品和批量出货定制大幅面包装。", en: "Large-format packaging for oversized products and batch shipment." },
    application: { zh: "大件产品、设备运输、强化防护", en: "Large products, equipment transport and reinforced protection" },
    capability: { zh: "超大规格水印、结构定制与边角防护", en: "Oversized flexo print, custom structure and edge protection" },
    rfq: { zh: "外形尺寸、重量、吊装方式、运输路线", en: "Dimensions, weight, handling method and transport route" },
  },
];
```

- [ ] **Step 4: Render image-backed solution cards and preselect a valid product**

Import `solutions`, remove the local `cards` array, and render:

```jsx
<div className="container solution-page-grid">
  {solutions.map((solution) => {
    const product = products.find((item) => item.id === solution.productId);
    return (
      <article className="solution-card" key={solution.id}>
        <img src={solution.image} alt={solution.alt[lang]} loading="lazy" />
        <div className="solution-card-copy">
          <h2>{solution.title[lang]}</h2>
          <p>{solution.text[lang]}</p>
          <dl>
            <div><dt>{lang === "zh" ? "适用场景" : "Applications"}</dt><dd>{solution.application[lang]}</dd></div>
            <div><dt>{lang === "zh" ? "核心能力" : "Capability"}</dt><dd>{solution.capability[lang]}</dd></div>
            <div><dt>{lang === "zh" ? "询价资料" : "RFQ inputs"}</dt><dd>{solution.rfq[lang]}</dd></div>
          </dl>
          <button
            className="section-link"
            type="button"
            aria-label={`${lang === "zh" ? "咨询" : "Ask about "}${solution.title[lang]}`}
            onClick={() => onOpenQuote(product.name[lang])}
          >
            {copy[lang].quote} <ArrowRight size={18} />
          </button>
        </div>
      </article>
    );
  })}
</div>
```

Pass the product through the existing app callback:

```jsx
"/solutions": <SolutionsPage lang={lang} onOpenQuote={openQuote} />,
```

- [ ] **Step 5: Replace text-only solution styles**

```css
.solution-page-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
}

.solution-card {
  overflow: hidden;
  border: 1px solid var(--line);
  background: #fff;
  box-shadow: 0 18px 48px rgba(3, 23, 47, 0.055);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.solution-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 62px rgba(3, 23, 47, 0.12);
}

.solution-card > img {
  width: 100%;
  height: 270px;
  object-fit: cover;
}

.solution-card-copy {
  padding: 30px;
}

.solution-card-copy h2 {
  font-size: 28px;
}

.solution-card-copy > p {
  color: var(--muted);
  line-height: 1.75;
}

.solution-card dl {
  display: grid;
  gap: 0;
  margin: 22px 0;
}

.solution-card dl div {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.solution-card dt {
  color: var(--orange);
  font-weight: 900;
}

.solution-card dd {
  margin: 0;
  color: #253552;
  line-height: 1.55;
}
```

- [ ] **Step 6: Run the focused test and verify pass**

Run: `npm test -- --run src/App.test.jsx -t "solutions use real images"`

Expected: PASS.

- [ ] **Step 7: Commit the solutions work**

```bash
git add src/content.js src/App.jsx src/styles.css src/App.test.jsx
git commit -m "feat: add evidence-led solution cards"
```

---

### Task 3: Build a complete tablet and mobile navigation drawer

**Files:**
- Modify: `src/components/Header.jsx:1-57`
- Modify: `src/styles.css:59-146,1413-1477`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: existing `navLinks`, `copy`, `onLanguageChange`, and `onOpenQuote` props.
- Produces: `#mobile-navigation`; menu trigger with `aria-controls`; drawer-local language and quote actions; Escape/scroll-lock/focus restoration behavior.

- [ ] **Step 1: Write a failing mobile-drawer interaction test**

```jsx
test("navigation drawer contains language and quote actions and restores focus", async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = screen.getByRole("button", { name: "打开菜单" });

  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("navigation", { name: "移动导航" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "在菜单中切换到英文" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "在菜单中发起询价" })).toBeInTheDocument();
  expect(document.body.style.overflow).toBe("hidden");

  await user.keyboard("{Escape}");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).toBe("");
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/App.test.jsx -t "navigation drawer"`

Expected: FAIL because the current mobile menu has no drawer-local language/quote actions and no Escape/focus lifecycle.

- [ ] **Step 3: Add the drawer lifecycle to `Header`**

Use refs/effects and one close function:

```jsx
import { useEffect, useRef, useState } from "react";

const toggleRef = useRef(null);

const closeMenu = (restoreFocus = false) => {
  setMenuOpen(false);
  if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
};

useEffect(() => {
  if (!menuOpen) return undefined;
  const previousOverflow = document.body.style.overflow;
  const handleKeyDown = (event) => {
    if (event.key === "Escape") closeMenu(true);
  };
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [menuOpen]);
```

Add `ref={toggleRef}`, `aria-controls="mobile-navigation"`, and `id="mobile-navigation"`. Keep desktop `.main-nav`, then add a separate drawer so desktop screen-reader labels remain unambiguous:

```jsx
<div className={menuOpen ? "mobile-drawer is-open" : "mobile-drawer"} aria-hidden={!menuOpen}>
  <nav className="mobile-nav" aria-label="移动导航">
    {navLinks.map((link) => (
      <a key={link.key} href={link.href} onClick={() => closeMenu(false)}>
        {link.label[lang]}
      </a>
    ))}
  </nav>
  <div className="mobile-drawer-actions">
    <button
      className="language-switch"
      type="button"
      aria-label={lang === "zh" ? "在菜单中切换到英文" : "Switch to Chinese in menu"}
      onClick={() => onLanguageChange(lang === "zh" ? "en" : "zh")}
    >
      <span className={lang === "zh" ? "active" : ""}>中文</span><i>/</i><span className={lang === "en" ? "active" : ""}>EN</span>
    </button>
    <button
      className="button button-primary"
      type="button"
      aria-label={lang === "zh" ? "在菜单中发起询价" : "Get a quote from menu"}
      onClick={() => { closeMenu(false); onOpenQuote(); }}
    >
      {t.quote}
    </button>
  </div>
</div>
```

When `menuOpen` is false, add `inert` to the drawer so hidden controls cannot receive focus:

```jsx
<div
  id="mobile-navigation"
  className={menuOpen ? "mobile-drawer is-open" : "mobile-drawer"}
  aria-hidden={!menuOpen}
  inert={!menuOpen}
>
```

- [ ] **Step 4: Move the responsive navigation breakpoint to 1080px**

At `max-width: 1080px`, hide `.main-nav, .header-actions`, show `.menu-toggle`, and style the full-height drawer:

```css
.mobile-drawer {
  display: none;
}

@media (max-width: 1080px) {
  .main-nav,
  .header-actions {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
    margin-left: auto;
    position: relative;
    z-index: 2;
  }

  .mobile-drawer {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 112px max(24px, calc((100vw - 720px) / 2)) 34px;
    color: #fff;
    background: rgba(3, 23, 47, 0.98);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-12px);
    transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease;
  }

  .mobile-drawer.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .mobile-nav {
    display: grid;
    overflow-y: auto;
  }

  .mobile-nav a {
    padding: 17px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    font-size: clamp(21px, 3vw, 30px);
    font-weight: 900;
  }

  .mobile-drawer-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: auto;
    padding-top: 26px;
  }
}
```

Keep only sizing adjustments in the `max-width: 760px` block; remove its old `.main-nav` and `.header-actions` rules.

- [ ] **Step 5: Run the focused test and verify pass**

Run: `npm test -- --run src/App.test.jsx -t "navigation drawer"`

Expected: PASS.

- [ ] **Step 6: Commit the navigation work**

```bash
git add src/components/Header.jsx src/styles.css src/App.test.jsx
git commit -m "fix: complete responsive navigation drawer"
```

---

### Task 4: Make the three-step quote dialog scroll-safe and keyboard-safe

**Files:**
- Modify: `src/App.jsx:221-259`
- Modify: `src/components/QuoteDialog.jsx:17-300`
- Modify: `src/styles.css:1253-1400,1596-1603`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: existing quote state and webhook payload shape; adds a `returnFocusRef` prop captured by `App.openQuote` before the dialog renders.
- Produces: `.site-shell` inert state; `dialogRef`; `moveToStep(nextStep)`; `focusFirstInvalid(fieldNames)`; required/invalid field semantics; retained data after submit failure.

- [ ] **Step 1: Write failing validation, scroll and focus tests**

```jsx
test("quote validation focuses the first error and scrolls each step to the top", async () => {
  const user = userEvent.setup();
  const scrollTo = vi.fn();
  Element.prototype.scrollTo = scrollTo;
  const { container } = render(<App />);

  await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
  await user.click(container.querySelector(".quote-dialog .button-primary"));
  expect(screen.getByText("请选择产品类型")).toBeInTheDocument();
  expect(screen.getAllByRole("radio")[0]).toHaveFocus();

  await user.click(screen.getAllByRole("radio")[0]);
  await user.click(container.querySelector(".quote-dialog .button-primary"));
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });

  await user.click(container.querySelector(".quote-dialog .button-primary"));
  expect(screen.getByText("请填写包装尺寸")).toBeInTheDocument();
  expect(screen.getByLabelText(/包装尺寸/)).toHaveFocus();
});

test("quote dialog isolates the page and restores the opening control", async () => {
  const user = userEvent.setup();
  render(<App />);
  const opener = screen.getAllByRole("button", { name: "发起询价" })[0];

  await user.click(opener);
  expect(document.querySelector(".site-shell")).toHaveAttribute("inert");
  await user.keyboard("{Escape}");
  expect(document.querySelector(".site-shell")).not.toHaveAttribute("inert");
  expect(opener).toHaveFocus();
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- --run src/App.test.jsx -t "quote validation|quote dialog isolates"`

Expected: FAIL because the dialog does not reset scroll, focus invalid inputs, isolate the site shell, or restore the opener.

- [ ] **Step 3: Isolate page content while the dialog is open**

Capture the active trigger before opening, then wrap the header, page, and footer in `App`:

```jsx
import { useEffect, useRef, useState } from "react";

const quoteTriggerRef = useRef(null);

const openQuote = (product = "") => {
  quoteTriggerRef.current = document.activeElement;
  setSelectedProduct(product);
  setQuoteOpen(true);
};

<div className="site-shell" inert={quoteOpen} aria-hidden={quoteOpen ? "true" : undefined}>
  <Header currentPath={currentPath} lang={lang} onLanguageChange={setLang} onOpenQuote={() => openQuote()} />
  {pages[currentPath]}
  <Footer lang={lang} />
</div>
<QuoteDialog
  lang={lang}
  open={quoteOpen}
  initialProduct={selectedProduct}
  returnFocusRef={quoteTriggerRef}
  onClose={() => setQuoteOpen(false)}
/>
```

- [ ] **Step 4: Add dialog scroll, opener restoration and focus trapping**

Update the signature to `QuoteDialog({ lang = "zh", open, initialProduct = "", returnFocusRef, onClose })`, then add `dialogRef` and field refs:

```jsx
const dialogRef = useRef(null);
const productRef = useRef(null);
const sizeRef = useRef(null);
const quantityRef = useRef(null);
const emailRef = useRef(null);

const fieldRefs = { product: productRef, size: sizeRef, quantity: quantityRef, email: emailRef };

const focusFirstInvalid = (fieldNames) => {
  const first = fieldNames.find((name) => fieldRefs[name]);
  requestAnimationFrame(() => fieldRefs[first]?.current?.focus());
};

const moveToStep = (nextStep) => {
  setErrors({});
  setStep(nextStep);
  requestAnimationFrame(() => dialogRef.current?.scrollTo({ top: 0, behavior: "auto" }));
};
```

On open, preserve the previous body overflow value and trap Tab inside the dialog:

```jsx
const previousOverflow = document.body.style.overflow;
const handleKey = (event) => {
  if (event.key === "Escape") onClose();
  if (event.key !== "Tab") return;
  const focusable = [...dialogRef.current.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
  )];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

return () => {
  document.removeEventListener("keydown", handleKey);
  document.body.style.overflow = previousOverflow;
  requestAnimationFrame(() => returnFocusRef?.current?.focus());
};
```

Attach `ref={dialogRef}` to `.quote-dialog`. Use `moveToStep(step + 1)` and `moveToStep(step - 1)` for step navigation.

- [ ] **Step 5: Add explicit required and invalid field semantics**

Add a reusable required marker and wire refs/labels:

```jsx
const RequiredMark = () => <span className="required-mark" aria-hidden="true">*</span>;

<legend>{t.legend} <RequiredMark /></legend>
{products.map((product, index) => (
<input
  ref={index === 0 ? productRef : undefined}
  aria-label={product.name[lang]}
  aria-invalid={Boolean(errors.product)}
  aria-describedby={errors.product ? "product-error" : undefined}
  required
  type="radio"
  name="product"
  value={product.name[lang]}
  checked={form.product === product.name[lang]}
  onChange={(event) => update("product", event.target.value)}
/>
))}
{errors.product ? <p id="product-error" className="field-error" role="alert">{errors.product}</p> : null}
```

For size, quantity and contact, add matching `htmlFor`, `id`, `ref`, `required`, `aria-invalid`, and error IDs. When validation fails, call:

```js
setErrors(nextErrors);
focusFirstInvalid(Object.keys(nextErrors));
```

Do this in both `next` and `submit`. Keep the existing form state unchanged when validation or network submission fails.

- [ ] **Step 6: Make dialog content and actions independent on mobile**

Use a grid dialog with internal scrolling and sticky actions:

```css
.quote-dialog {
  position: relative;
  width: min(860px, 100%);
  max-height: min(88vh, 860px);
  overflow: auto;
  padding: 42px;
  background: #fff;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34);
  overscroll-behavior: contain;
}

.required-mark {
  margin-left: 4px;
  color: #c93b2c;
}

@media (max-width: 760px) {
  .dialog-backdrop {
    padding: 0;
    place-items: stretch;
  }

  .quote-dialog {
    width: 100%;
    max-height: 100dvh;
    min-height: 100dvh;
    padding: 30px 18px 0;
  }

  .quote-progress {
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .quote-progress span {
    padding: 9px 5px;
    font-size: 12px;
  }

  .dialog-actions {
    position: sticky;
    bottom: 0;
    z-index: 2;
    margin: 26px -18px 0;
    padding: 14px 18px max(14px, env(safe-area-inset-bottom));
    border-top: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.98);
  }
}
```

- [ ] **Step 7: Run quote tests and the existing webhook test**

Run: `npm test -- --run src/App.test.jsx -t "quote"`

Expected: all quote tests PASS, including the existing webhook payload assertions.

- [ ] **Step 8: Commit the quote-dialog work**

```bash
git add src/App.jsx src/components/QuoteDialog.jsx src/styles.css src/App.test.jsx
git commit -m "fix: improve quote dialog accessibility"
```

---

### Task 5: Complete responsive styles and verify the full site

**Files:**
- Modify: `src/styles.css:1413-1633`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: all markup and classes delivered by Tasks 1-4.
- Produces: stable layouts at 1280px, 834px, and 390px; regression coverage for customer-name exclusion and bilingual content.

- [ ] **Step 1: Add final content-boundary regression tests**

```jsx
test("public pages do not expose excluded customer names or placeholders", () => {
  for (const path of ["/", "/solutions", "/contact"]) {
    window.history.pushState({}, "", path);
    const view = render(<App />);
    expect(screen.queryByText(/海尔|海信|正大|海氏海诺/)).not.toBeInTheDocument();
    expect(screen.queryByText(/备案号待补充|ICP number pending/)).not.toBeInTheDocument();
    view.unmount();
  }
});
```

- [ ] **Step 2: Run the full test suite before final responsive changes**

Run: `npm test -- --run`

Expected: PASS. If a failure occurs, fix only the regression introduced by Tasks 1-4 before continuing.

- [ ] **Step 3: Finish tablet and mobile layouts**

Add these rules to the existing responsive blocks:

```css
@media (max-width: 1080px) {
  .home-quality-layout {
    grid-template-columns: 1fr;
  }

  .home-quality-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .home-quality-card:nth-child(2) {
    border-right: 0;
  }

  .home-quality-card:nth-child(-n + 2) {
    border-bottom: 1px solid var(--line);
  }
}

@media (max-width: 760px) {
  .home-clean-section,
  .home-products,
  .home-quality {
    padding-top: 66px;
    padding-bottom: 66px;
  }

  .home-quality-cards,
  .solution-page-grid {
    grid-template-columns: 1fr;
  }

  .home-quality-card,
  .home-quality-card:nth-child(2) {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .home-quality-card:last-child {
    border-bottom: 0;
  }

  .solution-card > img {
    height: 230px;
  }

  .solution-card-copy {
    padding: 24px 22px;
  }

  .solution-card dl div {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .mobile-drawer-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
```

- [ ] **Step 4: Run automated tests and production build**

Run: `npm test -- --run && npm run build`

Expected: all tests PASS and Vite exits successfully with files emitted to `dist/`.

- [ ] **Step 5: Check the running site in the in-app browser at 1280px**

Open `http://localhost:4175/`, then inspect `/solutions`, `/products`, `/factory`, `/certifications`, and `/contact` at approximately 1280px width.

Expected: horizontal desktop navigation remains on one line; the homepage has one capacity-metric set; certification cards are not cropped; solution images fit their cards; all primary links and quote buttons work.

- [ ] **Step 6: Check tablet behavior at 834px**

Use the in-app browser at approximately 834px width.

Expected: hamburger drawer replaces the desktop navigation; drawer contains navigation, language and quote actions; solution and trust cards use two columns; no horizontal scrolling occurs.

- [ ] **Step 7: Check mobile behavior at 390px**

Use the in-app browser at approximately 390px width and complete one quote submission through all three steps without sending to a real webhook.

Expected: drawer and dialog fill the viewport cleanly; progress stays on one compact row; dialog action buttons remain available at the bottom; errors focus the first invalid field; text does not clip; all touch targets remain usable.

- [ ] **Step 8: Check keyboard and reduced-motion behavior**

Use Tab/Shift+Tab/Escape through the drawer and quote dialog, then enable reduced-motion emulation in the browser if available.

Expected: focus remains inside the dialog while open and returns to the opener after closing; Escape closes drawer/dialog; background cannot be focused through the dialog; nonessential animations stop under reduced motion.

- [ ] **Step 9: Commit final responsive and verification changes**

```bash
git add src/styles.css src/App.test.jsx
git commit -m "test: verify responsive website polish"
```

## Final Verification

- [ ] Run `git status --short` and confirm only intentional uncommitted files remain.
- [ ] Run `npm test -- --run` and confirm all tests pass.
- [ ] Run `npm run build` and confirm the production build succeeds.
- [ ] Recheck that `rg -n "海尔|海信|正大|海氏海诺|备案号待补充|ICP number pending" src` returns no public-page matches.
- [ ] Confirm the homepage, solutions page, drawer, and quote dialog match the approved design at 1280px, 834px, and 390px.
