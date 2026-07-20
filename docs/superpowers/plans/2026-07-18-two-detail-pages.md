# 凯丰德两张跳转内页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为现有凯丰德官网新增产品解决方案页和制造与品质页，并让首页导航、产品入口和询价流程形成完整跳转链路。

**Architecture:** 保持现有 React 单入口和 Vite 结构，通过 `window.location.pathname` 在 `App` 中选择三张页面，不新增路由依赖。Header、Footer、QuoteDialog、PageHero 和 InquiryCta 由三页共用；产品页与制造页各自管理纯展示内容，询价弹窗状态仍由 `App` 统一持有。

**Tech Stack:** React 19、Vite 6、Vitest、Testing Library、Phosphor Icons、CSS 响应式布局。

## Global Constraints

- 保留 PPT 原始 KFD Logo，不重绘、不改色、不改变比例。
- 使用浅米白、深蓝、橙色和柔和金色，不使用渐变。
- 优先使用 PPT 真实厂区、生产线、印刷设备和质检实验室照片。
- 不出现客户名称、客户 Logo、客户案例墙或虚构评价。
- 动效保持轻微并支持 `prefers-reduced-motion`。
- 询价保持前端三步流程，不添加后台提交。
- 真实联系方式和微信二维码在提供前继续标注上线前确认。

---

### Task 1: 页面路径与导航契约

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/components/Header.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `Header({ onOpenQuote })`、现有 `QuoteDialog`。
- Produces: `Header({ onOpenQuote, currentPath })`；`App` 根据 `/`、`/products`、`/manufacturing` 选择页面，未知路径回落首页。

- [ ] **Step 1: 写失败测试**

```jsx
test("routes homepage navigation to the two detail pages", () => {
  window.history.pushState({}, "", "/");
  render(<App />);
  expect(screen.getByRole("link", { name: "产品中心" })).toHaveAttribute("href", "/products");
  expect(screen.getByRole("link", { name: "制造能力" })).toHaveAttribute("href", "/manufacturing");
});

test("falls back to the homepage for an unknown path", () => {
  window.history.pushState({}, "", "/missing");
  render(<App />);
  expect(screen.getByRole("heading", { name: "高端纸包装制造，稳交付，更可靠" })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- --run`
Expected: FAIL，现有导航仍指向 `#products` 和 `#capabilities`。

- [ ] **Step 3: 实现路径选择和动态导航**

```jsx
const path = ["/", "/products", "/manufacturing"].includes(window.location.pathname)
  ? window.location.pathname
  : "/";

<Header currentPath={path} onOpenQuote={() => openQuote()} />
```

Header 使用以下链接：

```jsx
const links = [
  ["首页", "/"],
  ["产品中心", "/products"],
  ["制造能力", "/manufacturing"],
  ["品质保障", "/manufacturing#quality"],
  ["关于我们", "/#about"],
];
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test -- --run`
Expected: Task 1 新增测试 PASS，原有询价测试仍 PASS。

### Task 2: 共用内页首屏和询价收口组件

**Files:**
- Create: `src/components/PageHero.jsx`
- Create: `src/components/InquiryCta.jsx`
- Modify: `src/styles.css`
- Test: `src/App.test.jsx`

**Interfaces:**
- Produces: `PageHero({ eyebrow, title, description, image, imageAlt, children, onOpenQuote })`。
- Produces: `InquiryCta({ eyebrow, title, description, onOpenQuote })`。

- [ ] **Step 1: 写失败测试**

```jsx
test("renders the product page hero and opens its quote entry", async () => {
  window.history.pushState({}, "", "/products");
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole("heading", { name: "从结构保护到品牌呈现" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "提交包装需求" }));
  expect(screen.getByRole("dialog", { name: "提交包装需求" })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- --run`
Expected: FAIL，产品页首屏尚不存在。

- [ ] **Step 3: 创建共用组件**

```jsx
export function PageHero({ eyebrow, title, description, image, imageAlt, children, onOpenQuote }) {
  return <section className="page-hero"><div className="page-hero-copy"><p className="eyebrow dark">{eyebrow}</p><h1>{title}</h1><p>{description}</p><div className="page-hero-actions"><button className="button button-primary" onClick={onOpenQuote}>提交包装需求</button>{children}</div></div><figure><img src={image} alt={imageAlt} /></figure></section>;
}

export function InquiryCta({ eyebrow, title, description, onOpenQuote }) {
  return <section className="inquiry-cta"><div><p>{eyebrow}</p><h2>{title}</h2><span>{description}</span></div><button className="button button-primary" onClick={onOpenQuote}>提交询价</button></section>;
}
```

- [ ] **Step 4: 添加与首页一致的响应式样式**

实现 `.page-hero` 双栏桌面布局、移动端图片在上文字在下、`.inquiry-cta` 深蓝收口区、可见焦点状态和减少动态降级。

- [ ] **Step 5: 运行测试确认通过**

Run: `pnpm test -- --run`
Expected: 共用首屏和询价入口测试 PASS。

### Task 3: 产品解决方案页与产品预选

**Files:**
- Create: `src/pages/ProductSolutionsPage.jsx`
- Modify: `src/components/Products.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `products`、`PageHero`、`InquiryCta`。
- Produces: `ProductSolutionsPage({ onOpenQuote })`，其中 `onOpenQuote(productName?: string)` 可带产品名。

- [ ] **Step 1: 写失败测试**

```jsx
test("preselects a product from the product solutions page", async () => {
  window.history.pushState({}, "", "/products");
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "针对彩印纸箱询价" }));
  expect(screen.getByRole("radio", { name: "彩印纸箱" })).toBeChecked();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- --run`
Expected: FAIL，产品内页和按钮尚不存在。

- [ ] **Step 3: 实现产品内页**

页面包含三类产品方案卡、应用需求矩阵、四项定制能力、选择建议和底部 InquiryCta。每张产品卡调用：

```jsx
<button type="button" onClick={() => onOpenQuote(product.name)} aria-label={`针对${product.name}询价`}>
  针对该产品询价
</button>
```

首页产品卡“了解更多”改为：

```jsx
<a aria-label={`了解更多：${product.name}`} href={`/products#${product.id}`}>了解更多</a>
```

- [ ] **Step 4: 完成桌面三列和移动单列样式**

产品卡使用现有生成图片；需求矩阵使用文本和 Phosphor 图标，不创建 CSS 图形或占位资产。

- [ ] **Step 5: 运行测试确认通过**

Run: `pnpm test -- --run`
Expected: 产品页渲染、产品预选和首页跳转测试 PASS。

### Task 4: 制造与品质页

**Files:**
- Create: `src/pages/ManufacturingPage.jsx`
- Copy: PPT `image29.png` to `public/assets/kfd-watermark-line.png`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `metrics`、`PageHero`、`InquiryCta`、PPT 图片资产。
- Produces: `ManufacturingPage({ onOpenQuote })`。

- [ ] **Step 1: 写失败测试**

```jsx
test("renders real manufacturing evidence and opens the quote flow", async () => {
  window.history.pushState({}, "", "/manufacturing");
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole("heading", { name: "让每一次交付，都有制造依据" })).toBeInTheDocument();
  expect(screen.getByAltText("凯丰德高宝六色胶印设备")).toHaveAttribute("src", "/assets/kfd-kba-printing.png");
  await user.click(screen.getByRole("button", { name: "提交包装需求" }));
  expect(screen.getByRole("dialog", { name: "提交包装需求" })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- --run`
Expected: FAIL，制造内页尚不存在。

- [ ] **Step 3: 复制并接入真实 PPT 图片**

复制水印生产线图片并在页面中使用以下既有资产：`kfd-corrugator.jpeg`、`kfd-kba-printing.png`、`kfd-watermark-line.png`、`kfd-quality-lab.png`。

- [ ] **Step 4: 实现制造内页**

页面包含首屏数据、四段设备与工艺、品质控制四节点、五步制造流程、交付保障和底部 InquiryCta；图片必须使用真实 PPT 资产和准确替代文本。

- [ ] **Step 5: 完成响应式样式**

桌面端采用交替图文带和品质四列；移动端改为图片在上、文字在下且无横向溢出。

- [ ] **Step 6: 运行测试确认通过**

Run: `pnpm test -- --run`
Expected: 制造页真实图片、标题、询价入口和客户名称禁用测试 PASS。

### Task 5: 全面验证与设计 QA

**Files:**
- Modify: `AGENTS.md`
- Modify: `design-qa.md`
- Create: `qa/products-desktop.png`
- Create: `qa/manufacturing-desktop.png`
- Create: `qa/products-mobile.png`
- Create: `qa/manufacturing-mobile.png`

**Interfaces:**
- Consumes: 三页完整实现。
- Produces: 通过的自动化测试、生产构建和 `design-qa.md`。

- [ ] **Step 1: 运行完整自动化测试和生产构建**

Run: `pnpm test -- --run && pnpm build`
Expected: 所有测试 PASS，Vite build exit 0。

- [ ] **Step 2: 浏览器验证桌面端**

在 1440 × 900 分别打开 `/products` 和 `/manufacturing`，检查导航、首屏、主要内容、询价弹窗、图片裁切和控制台。

- [ ] **Step 3: 浏览器验证移动端**

在 390 × 844 分别打开两页，检查菜单、首屏、卡片、询价弹窗和 `scrollWidth === innerWidth`。

- [ ] **Step 4: 完成设计 QA**

将两张内页截图与首页设计系统截图放入同一对照图。修复全部 P0、P1、P2 问题，并让 `design-qa.md` 以 `final result: passed` 结束。

- [ ] **Step 5: 记录持久项目决策**

在 `AGENTS.md` 记录 `/products`、`/manufacturing`、共用品牌系统、真实 PPT 图片和产品预选询价要求。

- [ ] **Step 6: 保留本地预览并交付**

保持 `http://localhost:4174/` 运行，将产品页和制造页链接交付给用户。

## Plan Self-Review

- Spec coverage: 两页结构、真实素材、无客户名称、询价联动、路径降级、响应式和浏览器 QA 均有对应任务。
- Placeholder scan: 无 TBD、TODO、模糊实现步骤或未定义接口。
- Type consistency: 所有页面统一消费 `onOpenQuote(productName?: string)`；`PageHero` 和 `InquiryCta` 参数在创建与使用处一致。
- Repository note: 当前目录没有 Git 仓库，因此计划中的验证检查点替代提交步骤，不执行 Git commit。
