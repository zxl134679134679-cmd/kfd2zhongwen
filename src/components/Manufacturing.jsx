import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { factoryHighlights, solutions } from "../content.js";
import { ResponsiveImage } from "./ResponsiveImage.jsx";

const factoryMedia = [
  {
    title: { zh: "现代化生产车间", en: "Modern Production Workshop" },
    text: { zh: "大幅面纸板生产线与标准化车间环境，支撑稳定批量交付。", en: "Large-format board production and standardized workshop environment support stable volume delivery." },
    image: "/assets/workshop-panorama.png",
  },
  {
    title: { zh: "1米62高宝印刷机", en: "1.62m KBA Printing Machine" },
    text: { zh: "高品质印刷设备，适合高要求彩印纸箱与品牌包装呈现。", en: "High-quality printing equipment for premium printed cartons and brand packaging." },
    image: "/assets/kba-printing.png",
  },
  {
    title: { zh: "水印印刷能力", en: "Flexo Printing Capability" },
    text: { zh: "多台水印印刷设备覆盖不同尺寸订单，支撑普通纸箱与大规格纸箱批量印刷。", en: "Multiple flexo printing machines support different carton sizes and volume production." },
    image: "/assets/printing-machine-side-clean.png",
  },
  {
    title: { zh: "成品仓储与周转", en: "Finished Goods Warehouse" },
    text: { zh: "成品仓储、分区管理与物流周转，配合持续供货需求。", en: "Finished goods storage and logistics turnover support continuous supply requirements." },
    image: "/assets/finished-warehouse.png",
  },
];

const equipmentRows = [
  {
    title: { zh: "2.8米纸板生产流水线", en: "2.8m board production line" },
    value: { zh: "纸板日产能约 300,000㎡", en: "Approx. 300,000㎡/day board capacity" },
    text: { zh: "适合多规格纸板供应与大批量订单。", en: "For multi-size corrugated board supply and volume orders." },
  },
  {
    title: { zh: "水印印刷机 6台", en: "6 flexo printing machines" },
    value: { zh: "水印最多 5 色", en: "Up to 5-color flexo printing" },
    text: { zh: "覆盖多尺寸普通纸箱和运输包装。", en: "For regular cartons and transport packaging in multiple sizes." },
  },
  {
    title: { zh: "高宝印刷设备", en: "KBA printing equipment" },
    value: { zh: "彩印最高 6 色", en: "Up to 6-color printed cartons" },
    text: { zh: "提升彩箱外观、品牌展示与海外客户第一印象。", en: "Improves visual quality for printed cartons and brand packaging." },
  },
  {
    title: { zh: "多规格全自动钉箱机", en: "Automatic carton stitching lines" },
    value: { zh: "纸箱日产能约 200,000㎡", en: "Approx. 200,000㎡/day carton capacity" },
    text: { zh: "支持开槽、模切、钉箱、粘箱等成型工艺。", en: "Supports slotting, die-cutting, stitching and gluing." },
  },
  {
    title: { zh: "厂房面积约 40,000㎡", en: "Approx. 40,000㎡ factory area" },
    value: { zh: "仓储面积约 10,000㎡", en: "Approx. 10,000㎡ warehouse area" },
    text: { zh: "原纸、成品与物流周转空间充足。", en: "Enough space for raw paper, finished goods and logistics turnover." },
  },
  {
    title: { zh: "快速交付能力", en: "Fast delivery capability" },
    value: { zh: "最快 3–7 天", en: "Fastest 3–7 days" },
    text: { zh: "根据订单规格、数量和交付地安排生产节奏。", en: "Production schedule depends on size, quantity and destination." },
  },
];

const process = [
  { zh: "原纸入库", en: "Raw paper" },
  { zh: "纸板生产", en: "Board production" },
  { zh: "印刷开槽", en: "Printing & slotting" },
  { zh: "模切成型", en: "Die-cutting" },
  { zh: "钉箱/粘箱", en: "Stitching / gluing" },
  { zh: "检验发货", en: "QC & shipping" },
];

const factorySolutionStrip = [
  ...solutions.map((solution) => solution.title),
  { zh: "普通周转纸箱", en: "Regular Shipping Cartons" },
  { zh: "纸板供应方案", en: "Board Supply Solution" },
];

export function Manufacturing({ lang = "zh" }) {
  const [selected, setSelected] = useState(0);
  const current = factoryMedia[selected];

  return (
    <section className="factory-section" id="factory">
      <div className="container factory-grid">
        <div className="factory-copy">
          <div className="section-kicker on-dark">{lang === "zh" ? "工厂实力" : "Factory Strength"}</div>
          <h2>{lang === "zh" ? "真实产线与稳定交付能力" : "Real production lines, stable delivery"}</h2>
          <p>
            {lang === "zh"
              ? "客户选择包装供应商，看的不只是价格，更是设备、产能、仓储和交付稳定性。这里把凯丰德最核心的制造能力集中展示出来。"
              : "A packaging supplier is judged by equipment, capacity, storage and delivery reliability — not price alone."}
          </p>
          <a className="button button-outline" href="/contact">
            {lang === "zh" ? "获取工厂资料" : "Request factory profile"} <ArrowRight size={19} />
          </a>
        </div>

        <div className="factory-visual">
          <div className="factory-main-image">
            <ResponsiveImage src={current.image} alt={current.title[lang]} sizes="(max-width: 760px) calc(100vw - 28px), 50vw" loading="lazy" />
            <div className="factory-caption">
              <strong>{current.title[lang]}</strong>
              <span>{current.text[lang]}</span>
            </div>
          </div>
          <div className="factory-thumbs" aria-label="工厂照片切换">
            {factoryMedia.map((item, index) => (
              <button
                className={selected === index ? "is-active" : ""}
                key={item.title.zh}
                type="button"
                onClick={() => setSelected(index)}
                aria-label={lang === "zh" ? `查看${item.title.zh}` : `View ${item.title.en}`}
              >
                <ResponsiveImage src={item.image} alt="" sizes="140px" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container highlight-grid">
        {factoryHighlights.map(({ title, text, Icon }) => (
          <article key={title.zh}>
            <Icon size={30} weight="light" />
            <h3>{title[lang]}</h3>
            <p>{text[lang]}</p>
          </article>
        ))}
      </div>

      <div className="container factory-deep">
        <div className="factory-deep-heading">
          <div>
            <span>CAPACITY DETAILS</span>
            <h2>{lang === "zh" ? "让客户看到你能承接订单的底气" : "Capacity details buyers need before sending an RFQ"}</h2>
          </div>
          <p>{lang === "zh" ? "把产线、印刷、成型、仓储和交付能力放清楚，减少海外客户反复追问。" : "Clear production, printing, forming, storage and delivery details reduce repeated questions."}</p>
        </div>

        <div className="equipment-grid">
          {equipmentRows.map(({ title, value, text }) => (
            <article key={title.zh}>
              <CheckCircle size={22} weight="fill" />
              <h3>{title[lang]}</h3>
              <strong>{value[lang]}</strong>
              <p>{text[lang]}</p>
            </article>
          ))}
        </div>

        <div className="production-flow">
          {process.map((item, index) => (
            <div key={item.zh}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item[lang]}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="container solution-strip" id="solutions">
        <div>
          <span>{lang === "zh" ? "包装方案" : "Packaging Solutions"}</span>
          <strong>
            {lang === "zh"
              ? "面向工业、品牌、出口与大尺寸产品，提供结构、印刷与交付一体化方案。"
              : "Integrated structure, printing and delivery solutions for industrial, brand, export and large-size products."}
          </strong>
        </div>
        <ul>
          {factorySolutionStrip.map((item) => (
            <li key={item.zh}>{item[lang]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
