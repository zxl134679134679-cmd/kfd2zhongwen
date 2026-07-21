import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { copy, navLinks } from "../content.js";

export function Header({ currentPath = "/", lang = "zh", onLanguageChange, onOpenQuote }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);
  const t = copy[lang];
  const menuLabel = lang === "zh"
    ? (menuOpen ? "关闭菜单" : "打开菜单")
    : (menuOpen ? "Close menu" : "Open menu");

  const closeMenu = (restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) {
      toggleRef.current?.focus();
      requestAnimationFrame(() => toggleRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const desktopMedia = typeof window.matchMedia === "function"
      ? window.matchMedia("(min-width: 1081px)")
      : null;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      const toggle = toggleRef.current;
      if (!drawer || !toggle) return;
      const focusable = [
        toggle,
        ...drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ];
      const activeIndex = focusable.indexOf(document.activeElement);
      const nextIndex = activeIndex === -1
        ? (event.shiftKey ? focusable.length - 1 : 1)
        : (activeIndex + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;

      event.preventDefault();
      focusable[nextIndex]?.focus();
    };
    const handleDesktopChange = (event) => {
      if (event.matches) closeMenu();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    desktopMedia?.addEventListener("change", handleDesktopChange);
    const focusTimer = window.setTimeout(() => {
      if (drawerRef.current?.classList.contains("is-open")) {
        drawerRef.current.querySelector("a[href]")?.focus();
      }
    }, 0);

    if (desktopMedia?.matches) closeMenu();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      desktopMedia?.removeEventListener("change", handleDesktopChange);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="青岛凯丰德包装首页">
          <img src="/assets/kfd-logo-final.png" alt="凯丰德包装 KFD Packaging" />
        </a>

        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          {menuOpen ? <X size={26} /> : <List size={26} />}
        </button>

        <nav className="main-nav" aria-label="主导航">
          {navLinks.map((link) => (
            <a
              className={currentPath === link.href ? "is-current" : ""}
              key={link.key}
              href={link.href}
            >
              {link.label[lang]}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="language-switch"
            type="button"
            aria-label={lang === "zh" ? "切换到英文" : "Switch to Chinese"}
            onClick={() => onLanguageChange(lang === "zh" ? "en" : "zh")}
          >
            <span className={lang === "zh" ? "active" : ""}>中文</span>
            <i>/</i>
            <span className={lang === "en" ? "active" : ""}>EN</span>
          </button>
          <button className="button button-primary header-cta" type="button" onClick={() => onOpenQuote()}>
            {t.quote}
          </button>
        </div>
      </div>

      <div
        ref={drawerRef}
        id="mobile-navigation"
        className={menuOpen ? "mobile-drawer is-open" : "mobile-drawer"}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="mobile-nav" aria-label={lang === "zh" ? "移动导航" : "Mobile navigation"}>
          {navLinks.map((link) => (
            <a key={link.key} href={link.href} onClick={() => closeMenu()}>
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
            <span className={lang === "zh" ? "active" : ""}>中文</span>
            <i>/</i>
            <span className={lang === "en" ? "active" : ""}>EN</span>
          </button>
          <button
            className="button button-primary"
            type="button"
            aria-label={lang === "zh" ? "在菜单中发起询价" : "Get a quote from menu"}
            onClick={() => {
              closeMenu();
              onOpenQuote(toggleRef.current);
            }}
          >
            {t.quote}
          </button>
        </div>
      </div>
    </header>
  );
}
