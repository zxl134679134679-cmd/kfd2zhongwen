import { CheckCircle, Factory, Headset, Package, ShieldCheck, Stack, Wrench } from "@phosphor-icons/react";
import { InquiryCta } from "../components/InquiryCta.jsx";
import { PageHero } from "../components/PageHero.jsx";
import { ResponsiveImage } from "../components/ResponsiveImage.jsx";
import { metrics } from "../content.js";

const capabilities = [
  { number: "01", title: "瓦楞纸板生产", text: "2800mm 瓦楞纸板流水线覆盖纸板成型与后续加工，形成稳定的基础制造能力。", image: "/assets/kfd-corrugator.jpeg", alt: "凯丰德瓦楞纸板生产线" },
  { number: "02", title: "高宝六色胶印", text: "高宝 1620 × 1120 六色胶印设备兼顾印刷效率与画面表现，为彩色包装提供工艺支撑。", image: "/assets/kfd-kba-printing.png", alt: "凯丰德高宝六色胶印设备" },
  { number: "03", title: "水印生产能力", text: "水印生产线面向多规格纸箱印刷需求，与开槽、模切和成箱工序形成协同。", image: "/assets/kfd-watermark-line.png", alt: "凯丰德水印生产线" },
  { number: "04", title: "品质检测实验室", text: "通过检测设备对原纸、纸板与成品进行过程验证，为稳定量产提供数据依据。", image: "/assets/kfd-quality-lab.png", alt: "凯丰德品质检测实验室" },
];

const qualitySteps = [
  { title: "来料确认", text: "关注原纸基础指标与批次一致性。", Icon: Stack },
  { title: "过程控制", text: "对生产参数和关键工序持续检查。", Icon: Wrench },
  { title: "成品检验", text: "结合尺寸、印刷和结构要求完成验证。", Icon: ShieldCheck },
  { title: "稳定交付", text: "按计划组织生产、检验与出库。", Icon: CheckCircle },
];

const flow = [
  ["01", "需求确认", "明确用途、规格与交付要求", Headset],
  ["02", "打样验证", "确认结构、材料和印刷效果", Package],
  ["03", "排产制造", "多工序协同组织量产", Factory],
  ["04", "品质检验", "过程与成品分层检查", ShieldCheck],
  ["05", "按时交付", "专人跟进生产与出库", CheckCircle],
];

export function ManufacturingPage({ onOpenQuote }) {
  return (
    <main className="detail-page manufacturing-detail-page">
      <PageHero
        eyebrow="MANUFACTURING & QUALITY"
        title="让每一次交付，都有制造依据"
        description="从纸板成型、印刷加工到品质检测，以真实设备、清晰流程和稳定产能支撑每一次包装需求。"
        image="/assets/kfd-corrugator.jpeg"
        imageAlt="凯丰德瓦楞纸板生产现场"
        anchorHref="#equipment"
        anchorLabel="查看设备与工艺"
        onOpenQuote={() => onOpenQuote()}
      >
        <div className="page-hero-metrics">
          {metrics.slice(0, 3).map(({ value, suffix, label }) => <div key={label}><strong>{value}{suffix}</strong><span>{label}</span></div>)}
        </div>
      </PageHero>

      <section className="detail-section equipment-section" id="equipment">
        <div className="container">
          <div className="detail-heading"><div><p className="eyebrow dark">EQUIPMENT</p><h2>设备与工艺，构成制造闭环</h2></div><p>以下照片均来自凯丰德企业介绍资料中的实际厂区、生产线和检测现场。</p></div>
          <div className="equipment-list">
            {capabilities.map((item, index) => (
              <article className={index % 2 ? "is-reversed" : ""} key={item.number}>
                <figure><ResponsiveImage src={item.image} alt={item.alt} loading="lazy" /></figure>
                <div><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section quality-detail-section" id="quality">
        <div className="container">
          <div className="section-heading centered-heading"><p className="eyebrow dark">QUALITY CONTROL</p><h2>四个控制节点，让品质更可追踪</h2></div>
          <div className="quality-step-grid">
            {qualitySteps.map(({ title, text, Icon }) => <article key={title}><Icon size={34} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="detail-section manufacturing-flow-section">
        <div className="container">
          <div className="detail-heading"><div><p className="eyebrow dark">WORKFLOW</p><h2>从需求确认到按时交付</h2></div><p>业务、技术、生产与品质环节围绕同一份需求协同推进。</p></div>
          <div className="manufacturing-flow-grid">
            {flow.map(([number, title, text, Icon]) => <article key={number}><span>{number}</span><Icon size={31} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <InquiryCta eyebrow="RELIABLE DELIVERY" title="从制造现场开始建立信任" description="提交产品用途、规格和数量，我们会结合工艺与交付条件继续沟通。" onOpenQuote={() => onOpenQuote()} />
    </main>
  );
}
