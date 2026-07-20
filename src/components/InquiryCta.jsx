import { ArrowRight } from "@phosphor-icons/react";

export function InquiryCta({ eyebrow, title, description, onOpenQuote }) {
  return (
    <section className="inquiry-cta-wrap">
      <div className="container inquiry-cta">
        <div>
          <p>{eyebrow}</p>
          <h2>{title}</h2>
          <span>{description}</span>
        </div>
        <button className="button button-primary" type="button" onClick={onOpenQuote}>
          提交询价 <ArrowRight size={19} weight="bold" />
        </button>
      </div>
    </section>
  );
}
