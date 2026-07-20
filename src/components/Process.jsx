import { ArrowRight } from "@phosphor-icons/react";
import { copy, processSteps } from "../content.js";

export function Process({ lang = "zh", onOpenQuote }) {
  const t = copy[lang];

  return (
    <section className="section process-section" id="quote">
      <div className="container">
        <div className="section-heading centered">
          <div className="section-kicker">{lang === "zh" ? "合作流程" : "Quote Process"}</div>
          <h2>{lang === "zh" ? "提交需求后，由业务员审核成本再报价" : "Human-reviewed quotes, not blind online pricing"}</h2>
          <p>
            {lang === "zh"
              ? "网页不自动定价。我们会结合纸种、楞型、印刷、辅料、运费、交付周期与订单数量，给出更准确、更可落地的包装方案。"
              : "We review paper grade, flute, printing, accessories, freight, lead time and quantity before quoting, so the result is practical."}
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map(({ number, title, text, Icon }) => (
            <article key={number}>
              <span>{number}</span>
              <Icon size={34} weight="light" />
              <h3>{title[lang]}</h3>
              <p>{text[lang]}</p>
            </article>
          ))}
        </div>

        <div className="quote-panel">
          <div>
            <strong>{lang === "zh" ? "准备开始一个包装项目？" : "Ready to start a packaging project?"}</strong>
            <span>{lang === "zh" ? "提交尺寸、数量、用途和联系方式，我们会尽快跟进。" : "Send size, quantity, application and contact details. We will follow up quickly."}</span>
          </div>
          <button className="button button-primary" type="button" onClick={onOpenQuote}>
            {t.quote} <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
