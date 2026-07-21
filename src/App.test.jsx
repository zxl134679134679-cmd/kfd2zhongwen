import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { App } from "./App.jsx";

const originalElementScrollTo = Element.prototype.scrollTo;
let scrollToMock;

describe("KFD website", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    delete window.__KFD_QUOTE_WEBHOOK_URL__;
    vi.restoreAllMocks();
    scrollToMock = vi.fn();
    Element.prototype.scrollTo = scrollToMock;
  });

  afterEach(() => {
    Element.prototype.scrollTo = originalElementScrollTo;
  });

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

  test("primary navigation opens all jump pages", () => {
    render(<App />);

    expect(screen.getAllByRole("link", { name: "产品中心" })[0]).toHaveAttribute("href", "/products");
    expect(screen.getAllByRole("link", { name: "包装方案" })[0]).toHaveAttribute("href", "/solutions");
    expect(screen.getAllByRole("link", { name: "工厂实力" })[0]).toHaveAttribute("href", "/factory");
    expect(screen.getAllByRole("link", { name: "资质认证" })[0]).toHaveAttribute("href", "/certifications");
    expect(screen.getAllByRole("link", { name: "联系我们" })[0]).toHaveAttribute("href", "/contact");
  });

  test("language switch changes homepage copy to English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换到英文" }));
    expect(screen.getByRole("heading", { name: /Custom Carton Manufacturing/ })).toBeInTheDocument();
    expect(screen.getByText("Factory direct")).toBeInTheDocument();
  });

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

    await user.click(screen.getByRole("button", { name: "切换到英文" }));
    const englishTrigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(englishTrigger);
    expect(englishTrigger).toHaveAccessibleName("Close menu");
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
  });

  test("products page opens and keeps printed cartons as the first offer", () => {
    window.history.pushState({}, "", "/products");
    render(<App />);

    expect(screen.getByRole("heading", { name: "产品中心" })).toBeInTheDocument();
    const productHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(productHeadings[0]).toHaveTextContent("彩印纸箱");
  });

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

  test("factory page keeps its six solution-strip labels after solution data changes", () => {
    window.history.pushState({}, "", "/factory");
    render(<App />);

    expect(screen.getByRole("heading", { name: "工厂实力" })).toBeInTheDocument();
    expect(screen.getByText("彩印品牌包装")).toBeInTheDocument();
    expect(screen.getByText("普通周转纸箱")).toBeInTheDocument();
    expect(screen.getByText("纸板供应方案")).toBeInTheDocument();
    expect(document.querySelectorAll(".solution-strip li")).toHaveLength(6);
  });

  test("certification links point to uploaded PDF files", () => {
    window.history.pushState({}, "", "/certifications");
    render(<App />);

    expect(screen.getByRole("link", { name: /ISO9001/ })).toHaveAttribute("href", "/certificates/iso9001-quality.pdf");
    expect(screen.getByRole("link", { name: /FSC/ })).toHaveAttribute("href", "/certificates/fsc-chain-of-custody.pdf");
  });

  test("quote dialog opens from the main CTA", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    expect(screen.getByRole("dialog", { name: "提交包装需求" })).toBeInTheDocument();
  });

  test("quote validation focuses the first error and scrolls each step to the top", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    const product = screen.getAllByRole("radio")[0];
    let productSemanticsAtFocus = false;
    product.addEventListener("focus", () => {
      const errorId = product.getAttribute("aria-describedby");
      productSemanticsAtFocus = product.getAttribute("aria-invalid") === "true" && Boolean(document.getElementById(errorId));
    });
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    expect(screen.getByText("请选择产品类型")).toBeInTheDocument();
    await waitFor(() => {
      expect(product).toHaveFocus();
      expect(product).toHaveAttribute("aria-invalid", "true");
      expect(document.getElementById(product.getAttribute("aria-describedby"))).toBeInTheDocument();
    });
    expect(productSemanticsAtFocus).toBe(true);

    await user.click(product);
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "auto" });

    const size = screen.getByLabelText(/包装尺寸/);
    let sizeSemanticsAtFocus = false;
    size.addEventListener("focus", () => {
      const errorId = size.getAttribute("aria-describedby");
      sizeSemanticsAtFocus = size.getAttribute("aria-invalid") === "true" && Boolean(document.getElementById(errorId));
    });
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    expect(screen.getByText("请填写包装尺寸")).toBeInTheDocument();
    await waitFor(() => {
      expect(size).toHaveFocus();
      expect(size).toHaveAttribute("aria-invalid", "true");
      expect(document.getElementById(size.getAttribute("aria-describedby"))).toBeInTheDocument();
    });
    expect(sizeSemanticsAtFocus).toBe(true);
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

  test("quote opened from the drawer restores the visible menu trigger", async () => {
    const user = userEvent.setup();
    render(<App />);
    const menuTrigger = screen.getByRole("button", { name: "打开菜单" });

    await user.click(menuTrigger);
    await user.click(screen.getByRole("button", { name: "在菜单中发起询价" }));
    expect(menuTrigger).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(menuTrigger).toHaveAccessibleName("打开菜单");
    expect(menuTrigger).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector(".mobile-drawer")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".mobile-drawer")).not.toHaveClass("is-open");
    expect(menuTrigger).toHaveFocus();
  });

  test("quote state survives a language rerender while open", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(screen.getByRole("button", { name: /下一步/ }));
    const size = screen.getByLabelText(/包装尺寸/);
    await user.type(size, "4500 x 2600 mm");

    await user.click(document.querySelector(".header-actions .language-switch"));

    expect(screen.getByLabelText("Quote progress: step 2 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Package size/)).toHaveValue("4500 x 2600 mm");
    expect(document.body.style.overflow).toBe("hidden");
  });

  test("quote dialog traps tab navigation and restores the prior body overflow", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "clip";
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    const close = screen.getByRole("button", { name: "关闭询价窗口" });
    const next = screen.getByRole("button", { name: /下一步/ });
    expect(close).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    await user.tab({ shift: true });
    expect(next).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();

    screen.getByRole("dialog").focus();
    await user.tab({ shift: true });
    expect(next).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("clip");
    document.body.style.overflow = "";
  });

  test("quote fields expose required and error relationships", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    const product = screen.getAllByRole("radio")[0];
    expect(product).toBeRequired();
    expect(product).toHaveAttribute("aria-invalid", "true");
    expect(product).toHaveAttribute("aria-describedby", "product-error");
    expect(screen.getByText("请选择产品类型")).toHaveAttribute("role", "alert");

    await user.click(product);
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    const size = screen.getByLabelText(/包装尺寸/);
    const quantity = screen.getByLabelText(/预计数量/);
    expect(size).toBeRequired();
    expect(quantity).toBeRequired();
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    expect(size).toHaveAttribute("aria-describedby", "size-error");
    expect(quantity).toHaveAttribute("aria-describedby", "quantity-error");

    await user.type(size, "4500 x 2600 mm");
    await user.type(quantity, "1000 pcs");
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    const contact = screen.getByLabelText(/邮箱 \/ 微信 \/ WhatsApp/);
    expect(contact).toBeRequired();
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    expect(contact).toHaveAttribute("aria-invalid", "true");
    expect(contact).toHaveAttribute("aria-describedby", "email-error");
  });

  test("quote dialog retains entered data after a failed submission", async () => {
    const user = userEvent.setup();
    const originalFetch = globalThis.fetch;
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    globalThis.fetch = fetchMock;
    window.__KFD_QUOTE_WEBHOOK_URL__ = "https://n8n.example/webhook/quote";
    const { container } = render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    await user.type(screen.getByLabelText(/包装尺寸/), "4500 x 2600 mm");
    await user.type(screen.getByLabelText(/预计数量/), "1000 pcs");
    await user.type(screen.getByLabelText(/材质 \/ 楞型/), "5-ply BC flute");
    await user.type(screen.getByLabelText(/印刷需求/), "3-color flexo");
    await user.type(screen.getByLabelText(/交付地区/), "Los Angeles");
    await user.type(screen.getByLabelText(/补充说明/), "Need export packaging samples.");
    await user.click(container.querySelector(".quote-dialog .button-primary"));
    const contact = screen.getByLabelText(/邮箱 \/ 微信 \/ WhatsApp/);
    await user.type(contact, "buyer@example.com");
    await user.click(container.querySelector(".quote-dialog .button-primary"));

    expect(await screen.findByText(/提交失败/)).toBeInTheDocument();
    expect(contact).toHaveValue("buyer@example.com");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /返回/ }));
    expect(screen.getByLabelText(/包装尺寸/)).toHaveValue("4500 x 2600 mm");
    expect(screen.getByLabelText(/预计数量/)).toHaveValue("1000 pcs");
    expect(screen.getByLabelText(/材质 \/ 楞型/)).toHaveValue("5-ply BC flute");
    expect(screen.getByLabelText(/印刷需求/)).toHaveValue("3-color flexo");
    expect(screen.getByLabelText(/交付地区/)).toHaveValue("Los Angeles");
    expect(screen.getByLabelText(/补充说明/)).toHaveValue("Need export packaging samples.");

    await user.click(screen.getByRole("button", { name: /返回/ }));
    expect(screen.getAllByRole("radio")[0]).toBeChecked();
    await user.click(screen.getByRole("button", { name: /下一步/ }));
    await user.click(screen.getByRole("button", { name: /下一步/ }));
    expect(screen.getByLabelText(/邮箱 \/ 微信 \/ WhatsApp/)).toHaveValue("buyer@example.com");
    globalThis.fetch = originalFetch;
  });

  test("quote dialog posts customer requirements to the configured webhook", async () => {
    const user = userEvent.setup();
    const originalFetch = globalThis.fetch;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;
    window.__KFD_QUOTE_WEBHOOK_URL__ = "https://n8n.example/webhook/quote";

    const { container } = render(<App />);

    await user.click(screen.getAllByRole("button", { name: "发起询价" })[0]);
    await user.click(container.querySelector('input[type="radio"]'));
    await user.click(container.querySelector(".quote-dialog .button-primary"));

    const specInputs = container.querySelectorAll(".quote-dialog input");
    await user.type(specInputs[0], "4500 x 2600 mm");
    await user.type(specInputs[1], "1000 pcs");
    await user.type(specInputs[2], "5-ply BC flute");
    await user.type(specInputs[3], "3-color flexo");
    await user.type(specInputs[4], "Los Angeles");
    await user.type(container.querySelector(".quote-dialog textarea"), "Need export packaging samples.");
    await user.click(container.querySelector(".quote-dialog .button-primary"));

    await user.type(container.querySelector(".quote-dialog input"), "buyer@example.com / WhatsApp +1 555 0100");
    await user.click(container.querySelector(".quote-dialog .button-primary"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, request] = fetchMock.mock.calls[0];
    const payload = JSON.parse(request.body);
    expect(fetchMock.mock.calls[0][0]).toBe("https://n8n.example/webhook/quote");
    expect(payload.recipientEmail).toBe("909015753@qq.com");
    expect(payload.size).toBe("4500 x 2600 mm");
    expect(payload.quantity).toBe("1000 pcs");
    expect(payload.material).toBe("5-ply BC flute");
    expect(payload.printing).toBe("3-color flexo");
    expect(payload.destination).toBe("Los Angeles");
    expect(payload.notes).toBe("Need export packaging samples.");
    expect(payload.contact).toBe("buyer@example.com / WhatsApp +1 555 0100");
    expect(payload.source).toBe("kfdpack-website");

    globalThis.fetch = originalFetch;
    delete window.__KFD_QUOTE_WEBHOOK_URL__;
  });
});
