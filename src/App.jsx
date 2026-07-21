import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Capabilities } from "./components/Capabilities.jsx";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { Manufacturing } from "./components/Manufacturing.jsx";
import { Process } from "./components/Process.jsx";
import { Products } from "./components/Products.jsx";
import { QuoteDialog } from "./components/QuoteDialog.jsx";
import { certifications, company, copy, products, solutions } from "./content.js";

function HomePage({ lang, onOpenQuote }) {
  const featured = products.slice(0, 3);
  const t = copy[lang];

  return (
    <main>
      <Hero lang={lang} onOpenQuote={onOpenQuote} />

      <section className="home-clean-section">
        <div className="container home-showcase">
          <div className="home-showcase-copy">
            <p className="eyebrow dark">MANUFACTURING BASE</p>
            <h2>{t.homeFactoryTitle}</h2>
            <p>{t.homeFactoryText}</p>
            <a className="section-link" href="/factory">
              {t.viewFactory} <ArrowRight size={18} />
            </a>
          </div>
          <div className="home-image-pair">
            <img src="/assets/kfd-kba-printing-final.png" alt={lang === "zh" ? "1米62高宝印刷机" : "KBA 1620 printing machine"} loading="lazy" />
            <img src="/assets/workshop-panorama.png" alt={lang === "zh" ? "凯丰德包装生产车间" : "KFD Packaging production workshop"} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section home-products" id="products">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">{t.homeProductsKicker}</div>
              <h2>{t.homeProductsTitle}</h2>
            </div>
            <a className="section-link" href="/products">
              {t.enterProducts} <ArrowRight size={18} />
            </a>
          </div>
          <div className="featured-product-grid">
            {featured.map((product) => (
              <a className="featured-product-card" href={`/products#${product.id}`} key={product.id}>
                <img src={product.image} alt={product.alt[lang]} loading="lazy" />
                <span>{product.name[lang]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

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
    </main>
  );
}

function PageHero({ eyebrow, title, text, image }) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg">
        <img src={image} alt="" />
      </div>
      <div className="container page-hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

function ProductsPage({ lang, onOpenQuote }) {
  return (
    <main>
      <PageHero
        eyebrow="PRODUCTS"
        title={lang === "zh" ? "产品中心" : "Products"}
        text={lang === "zh" ? "彩印纸箱、瓦楞纸板、普通纸箱与超大规格纸箱，覆盖品牌展示与工业运输需求。" : "Printed cartons, corrugated board, regular cartons and oversized cartons for brand display and industrial transport."}
        image="/assets/product-color-industrial.png"
      />
      <Products lang={lang} onOpenQuote={onOpenQuote} />
    </main>
  );
}

function SolutionsPage({ lang, onOpenQuote }) {
  const checklist = lang === "zh"
    ? ["产品尺寸：长 × 宽 × 高", "预计数量与交付地", "材质 / 楞型 / 承重要求", "印刷颜色与设计文件", "是否需要打样或出口资料"]
    : ["Product size: L × W × H", "Estimated quantity and destination", "Material / flute / loading requirements", "Printing colors and artwork files", "Sample or export document needs"];

  return (
    <main>
      <PageHero
        eyebrow="PACKAGING SOLUTIONS"
        title={lang === "zh" ? "包装方案" : "Packaging Solutions"}
        text={lang === "zh" ? "少讲概念，多解决真实问题：展示、保护、运输、交付。" : "Practical packaging solutions for display, protection, transport and delivery."}
        image="/assets/product-oversize-flexo-printed.png"
      />
      <section className="section solution-page">
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
        <div className="container rfq-guide">
          <span>{lang === "zh" ? "询价建议" : "RFQ checklist"}</span>
          {checklist.map((item) => (
            <em key={item}>{item}</em>
          ))}
        </div>
        <div className="container quote-panel">
          <div>
            <strong>{lang === "zh" ? "把尺寸和数量发给我们" : "Send us your size and quantity"}</strong>
            <span>{lang === "zh" ? "我们会根据材料、工艺和交付地审核后报价。" : "We review material, process and destination before quoting."}</span>
          </div>
          <button className="button button-primary" type="button" onClick={onOpenQuote}>
            {copy[lang].quote} <ArrowRight size={19} />
          </button>
        </div>
      </section>
    </main>
  );
}

function FactoryPage({ lang }) {
  return (
    <main>
      <PageHero
        eyebrow="FACTORY"
        title={lang === "zh" ? "工厂实力" : "Factory Strength"}
        text={lang === "zh" ? "真实车间、生产线、仓储与物流能力，是客户选择长期供应商的关键。" : "Real workshops, production lines, warehousing and logistics capability for long-term supply."}
        image="/assets/workshop-panorama.png"
      />
      <Manufacturing lang={lang} />
    </main>
  );
}

function CertificationsPage({ lang }) {
  return (
    <main>
      <PageHero
        eyebrow="CERTIFICATIONS"
        title={lang === "zh" ? "资质认证" : "Certifications"}
        text={lang === "zh" ? "质量、环境、FSC 与有害物质检测资料，为国内外客户建立信任基础。" : "Quality, environmental, FSC and restricted substance documents for supplier verification."}
        image="/assets/paper-warehouse-clean.png"
      />
      <Capabilities lang={lang} />
    </main>
  );
}

function ContactPage({ lang, onOpenQuote }) {
  return (
    <main>
      <PageHero
        eyebrow="CONTACT"
        title={lang === "zh" ? "联系我们" : "Contact Us"}
        text={lang === "zh" ? "欢迎发送包装尺寸、数量、用途与交付地，我们会尽快核算并回复。" : "Send packaging size, quantity, application and destination. We will review and reply quickly."}
        image="/assets/finished-warehouse.png"
      />
      <section className="section contact-page">
        <div className="container contact-card">
          <div>
            <h2>{lang === "zh" ? company.name : company.englishName}</h2>
            <p>{lang === "zh" ? "电话 / 微信：" : "Phone / WeChat: "}{company.phone}</p>
            <p>{lang === "zh" ? "邮箱：" : "Email: "}{company.email}</p>
            <p>{lang === "zh" ? "地址：" : "Address: "}{lang === "zh" ? company.address : company.addressEn}</p>
            <p>{lang === "zh" ? "建议发送尺寸、数量、材质、印刷要求和交付地，我们会在收到完整资料后尽快回复。" : "Please send size, quantity, material, printing requirements and destination for a faster quote."}</p>
          </div>
          <button className="button button-primary" type="button" onClick={onOpenQuote}>
            {copy[lang].quote} <ArrowRight size={19} />
          </button>
        </div>
      </section>
      <Process lang={lang} onOpenQuote={onOpenQuote} />
    </main>
  );
}

export function App() {
  const [lang, setLang] = useState("zh");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const quoteTriggerRef = useRef(null);

  const openQuote = (product = "", returnFocusTarget = document.activeElement) => {
    quoteTriggerRef.current = returnFocusTarget;
    setSelectedProduct(product);
    setQuoteOpen(true);
  };
  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  const currentPath = ["/", "/products", "/solutions", "/factory", "/certifications", "/contact"].includes(window.location.pathname)
    ? window.location.pathname
    : "/";

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const pages = {
    "/": <HomePage lang={lang} onOpenQuote={() => openQuote()} />,
    "/products": <ProductsPage lang={lang} onOpenQuote={openQuote} />,
    "/solutions": <SolutionsPage lang={lang} onOpenQuote={openQuote} />,
    "/factory": <FactoryPage lang={lang} />,
    "/certifications": <CertificationsPage lang={lang} />,
    "/contact": <ContactPage lang={lang} onOpenQuote={() => openQuote()} />,
  };

  return (
    <>
      <div className="site-shell" inert={quoteOpen} aria-hidden={quoteOpen ? "true" : undefined}>
        <Header
          currentPath={currentPath}
          lang={lang}
          onLanguageChange={setLang}
          onOpenQuote={(returnFocusTarget) => openQuote("", returnFocusTarget)}
        />
        {pages[currentPath]}
        <Footer lang={lang} />
      </div>
      <QuoteDialog
        lang={lang}
        open={quoteOpen}
        initialProduct={selectedProduct}
        returnFocusRef={quoteTriggerRef}
        onClose={closeQuote}
      />
    </>
  );
}
