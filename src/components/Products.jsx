import { ArrowRight } from "@phosphor-icons/react";
import { copy, products } from "../content.js";

export function Products({ lang = "zh", onOpenQuote }) {
  const t = copy[lang];

  return (
    <section className="section products-section" id="products">
      <div className="container">
        <div className="section-kicker">{lang === "zh" ? "产品中心" : "Products"}</div>
        <div className="section-heading">
          <div>
            <h2>{lang === "zh" ? "高品质瓦楞包装产品" : "High-quality corrugated packaging"}</h2>
            <p>
              {lang === "zh"
                ? "把客户最关心的尺寸、印刷、工艺和应用场景放清楚，减少反复沟通。"
                : "Clear size, printing, process and application details help buyers qualify faster."}
            </p>
          </div>
          <button className="section-link" type="button" onClick={() => onOpenQuote()}>
            {t.quote} <ArrowRight size={18} />
          </button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id} id={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.alt[lang]} loading="lazy" />
              </div>
              <div className="product-card-copy">
                <h3>{product.name[lang]}</h3>
                <p>{product.description[lang]}</p>
                <div className="product-application">{product.applications[lang]}</div>
                <ul className="product-specs">
                  {product.specs[lang].map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
                <button type="button" onClick={() => onOpenQuote(product.name[lang])}>
                  {lang === "zh" ? "咨询此产品" : "Quote this product"} <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
