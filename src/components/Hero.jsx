import { ArrowRight } from "@phosphor-icons/react";
import { copy, heroMetrics } from "../content.js";

export function Hero({ lang = "zh", onOpenQuote }) {
  const t = copy[lang];

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <img src="/assets/hero-gate-new.png" alt="" />
      </div>
      <div className="container hero-inner">
        <div className="hero-content">
          <p className="eyebrow">KFD PACKAGING · QINGDAO</p>
          <h1>
            {t.heroTitle[0]}
            <span>{t.heroTitle[1]}</span>
          </h1>
          <p>{t.heroText}</p>
          <div className="hero-badges" aria-label={lang === "zh" ? "核心优势" : "Key advantages"}>
            {t.heroBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={onOpenQuote}>
              {t.quote} <ArrowRight size={20} weight="bold" />
            </button>
            <a className="button button-ghost" href="#factory">
              {t.viewFactory} <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="container hero-metrics-wrap">
        <div className="hero-metrics" aria-label="凯丰德包装核心产能">
          {heroMetrics.map(({ value, unit, label, Icon }) => (
            <article key={label.zh}>
              <Icon size={42} weight="light" />
              <div>
                <strong>
                  {value}
                  <small>{typeof unit === "string" ? unit : unit[lang]}</small>
                </strong>
                <span>{label[lang]}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
