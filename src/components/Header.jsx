import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { copy, navLinks } from "../content.js";

export function Header({ currentPath = "/", lang = "zh", onLanguageChange, onOpenQuote }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[lang];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="青岛凯丰德包装首页">
          <img src="/assets/kfd-logo-final.png" alt="凯丰德包装 KFD Packaging" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={26} /> : <List size={26} />}
        </button>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="主导航">
          {navLinks.map((link) => (
            <a
              className={currentPath === link.href ? "is-current" : ""}
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
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
          <button className="button button-primary header-cta" type="button" onClick={onOpenQuote}>
            {t.quote}
          </button>
        </div>
      </div>
    </header>
  );
}
