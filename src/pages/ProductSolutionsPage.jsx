import { ArrowRight, CheckCircle, CirclesFour, Package, ShieldCheck, Stack, Wrench } from "@phosphor-icons/react";
import { InquiryCta } from "../components/InquiryCta.jsx";
import { PageHero } from "../components/PageHero.jsx";
import { ResponsiveImage } from "../components/ResponsiveImage.jsx";
import { products } from "../content.js";

const productDetails = {
  board: ["纸板加工与后续成箱", "多种楞型与克重", "平整度与强度兼顾"],
  carton: ["运输与仓储保护", "按承重与堆码定制", "结构简洁、交付稳定"],
  color: ["品牌展示与零售包装", "胶印与水印工艺", "保护性能与识别度兼顾"],
};

const scenarios = [
  { title: "运输保护", text: "根据产品重量、运输距离和搬运方式匹配纸板强度与箱型结构。", Icon: ShieldCheck, recommendation: "推荐：瓦楞纸板 / 普通纸箱" },
  { title: "仓储堆码", text: "结合堆码层数、仓储周期与环境条件，关注抗压和耐破表现。", Icon: Stack, recommendation: "推荐：普通纸箱" },
  { title: "品牌呈现", text: "通过彩色印刷、结构细节和表面工艺强化产品识别与开箱体验。", Icon: Package, recommendation: "推荐：彩印纸箱" },
];

const customizations = [
  { title: "尺寸与结构", text: "按产品尺寸、装箱方式与运输条件确认箱型。", Icon: CirclesFour },
  { title: "材料与楞型", text: "结合承重、堆码和成本目标匹配纸张与楞型。", Icon: Stack },
  { title: "印刷与工艺", text: "支持水印、胶印及品牌视觉的工艺适配。", Icon: Wrench },
  { title: "品质与交付", text: "从打样确认到量产检验，由专人持续跟进。", Icon: CheckCircle },
];

export function ProductSolutionsPage({ onOpenQuote }) {
  return (
    <main className="detail-page product-detail-page">
      <PageHero
        eyebrow="PRODUCT SOLUTIONS"
        title="从结构保护到品牌呈现"
        description="围绕产品特性、运输环境和品牌需求，匹配纸板、箱型、材料与印刷工艺，让每一份包装都有清晰依据。"
        image="/assets/product-color.png"
        imageAlt="蓝色彩印包装纸箱"
        anchorHref="#solutions"
        anchorLabel="查看产品方案"
        onOpenQuote={() => onOpenQuote()}
      />

      <section className="detail-section" id="solutions">
        <div className="container">
          <div className="detail-heading">
            <div><p className="eyebrow dark">THREE SOLUTIONS</p><h2>三类产品，回应不同包装目标</h2></div>
            <p>不以固定模板代替需求判断。提供用途、尺寸、数量和承重信息后，由业务人员协助匹配。</p>
          </div>
          <div className="solution-grid">
            {products.map((product, index) => (
              <article className="solution-card" id={product.id} key={product.id}>
                <figure><ResponsiveImage src={product.image} alt={product.alt} loading="lazy" /></figure>
                <div className="solution-card-copy">
                  <span>0{index + 1}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <ul>{productDetails[product.id].map((item) => <li key={item}>{item}</li>)}</ul>
                  <button type="button" onClick={() => onOpenQuote(product.name)} aria-label={`针对${product.name}询价`}>
                    针对该产品询价 <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section scenario-section">
        <div className="container">
          <div className="section-heading centered-heading">
            <p className="eyebrow dark">APPLICATION</p>
            <h2>先明确使用场景，再确定包装方案</h2>
          </div>
          <div className="scenario-grid">
            {scenarios.map(({ title, text, Icon, recommendation }) => (
              <article key={title}><Icon size={34} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{text}</p><strong>{recommendation}</strong></article>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section customization-section">
        <div className="container customization-layout">
          <div className="customization-intro"><p className="eyebrow dark">CUSTOMIZATION</p><h2>从需求到量产，四项能力协同</h2><p>如果暂不确定材料和工艺，只需先提供用途、尺寸、数量与承重要求，后续由专人协助确认。</p></div>
          <div className="customization-grid">
            {customizations.map(({ title, text, Icon }) => <article key={title}><Icon size={30} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <InquiryCta eyebrow="START A PROJECT" title="让包装需求变得更清晰" description="选择产品或直接提交用途、尺寸和数量，我们会继续与您确认。" onOpenQuote={() => onOpenQuote()} />
    </main>
  );
}
