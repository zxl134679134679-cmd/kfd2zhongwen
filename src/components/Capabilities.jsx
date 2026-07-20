import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { certifications, company } from "../content.js";

export function Capabilities({ lang = "zh" }) {
  return (
    <section className="section cert-section" id="certifications">
      <div className="container cert-grid">
        <div>
          <div className="section-kicker">{lang === "zh" ? "资质认证" : "Certificates"}</div>
          <h2>{lang === "zh" ? "国际标准认证，品质值得信赖" : "Certified materials and production control"}</h2>
          <p>
            {lang === "zh"
              ? "通过多项质量、环境与材料相关认证检测，适合国内客户与外贸客户做供应商初筛。"
              : "Quality, environmental and material-compliance documents help overseas buyers verify supplier readiness."}
          </p>
          <div className="cert-notes">
            <span><CheckCircle size={18} weight="fill" /> {lang === "zh" ? "FSC 森林产销监管链认证" : "FSC Chain of Custody"}</span>
            <span><CheckCircle size={18} weight="fill" /> {lang === "zh" ? "REACH 等有害物质检测" : "REACH restricted substance test"}</span>
            <span><CheckCircle size={18} weight="fill" /> {lang === "zh" ? "支持出口包装资料配合" : "Export document support"}</span>
          </div>
        </div>
        <div className="cert-card-grid">
          {certifications.map((cert) => (
            <a className="cert-card" key={cert.name} href={cert.file} target="_blank" rel="noreferrer">
              <img src={cert.image} alt={`${cert.name} ${cert.label[lang]}`} loading="lazy" />
              <strong>{cert.name}</strong>
              <span>{cert.label[lang]}</span>
              <em>{lang === "zh" ? "查看 PDF" : "View PDF"}</em>
            </a>
          ))}
        </div>
      </div>

      <div className="about-band" id="about">
        <div className="container about-grid">
          <div>
            <div className="section-kicker">{lang === "zh" ? "关于我们" : "About KFD"}</div>
            <h2>{lang === "zh" ? company.name : company.englishName}</h2>
            <p>
              {lang === "zh"
                ? "公司成立于2015年11月，注册资本5,000万元人民币，专注瓦楞纸板、普通纸箱、彩印纸箱及大尺寸包装的研发、生产与销售。"
                : "Founded in November 2015 with registered capital of RMB 50 million, KFD focuses on corrugated board, regular cartons, printed cartons and large-size packaging."}
            </p>
            <p>
              {lang === "zh"
                ? "我们以客户需求为导向，以品质与交付为核心，为电子电器、工业产品及出口包装客户创造更大价值。"
                : "We support customers with stable manufacturing, reliable delivery and practical packaging solutions for industrial and export applications."}
            </p>
            <a className="button button-primary" href="#contact">
              {lang === "zh" ? "联系工厂" : "Contact Factory"} <ArrowRight size={19} />
            </a>
          </div>
          <img src="/assets/product-oversize-flexo-printed.png" alt={lang === "zh" ? "超大规格水印印刷纸箱展示" : "Oversized flexo printed carton display"} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
