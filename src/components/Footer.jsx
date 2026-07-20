import { company, navLinks } from "../content.js";

export function Footer({ lang = "zh" }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/assets/kfd-logo-final.png" alt="凯丰德包装 KFD Packaging" />
          <p>
            {lang === "zh"
              ? "专注高品质纸箱制造与瓦楞包装定制，为国内外客户提供稳定、高效、可信赖的纸制包装解决方案。"
              : "Factory-direct corrugated packaging solutions for domestic and overseas customers, with stable capacity and reliable delivery."}
          </p>
        </div>

        <div>
          <span>{lang === "zh" ? "网站导航" : "Navigation"}</span>
          {navLinks.slice(1).map((link) => (
            <a key={link.key} href={link.href}>{link.label[lang]}</a>
          ))}
        </div>

        <div>
          <span>{lang === "zh" ? "产品中心" : "Products"}</span>
          <a href="/products#printed-carton">{lang === "zh" ? "彩印纸箱" : "Printed cartons"}</a>
          <a href="/products#corrugated-board">{lang === "zh" ? "瓦楞纸板" : "Corrugated board"}</a>
          <a href="/products#standard-carton">{lang === "zh" ? "普通纸箱" : "Regular cartons"}</a>
          <a href="/products#oversize-carton">{lang === "zh" ? "超大规格纸箱" : "Oversized cartons"}</a>
        </div>

        <div>
          <span>{lang === "zh" ? "联系我们" : "Contact"}</span>
          <p>{lang === "zh" ? "电话 / 微信：" : "Phone / WeChat: "}<a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></p>
          <p>{lang === "zh" ? "邮箱：" : "Email: "}<a href={`mailto:${company.email}`}>{company.email}</a></p>
          <p>{lang === "zh" ? company.address : company.addressEn}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 {lang === "zh" ? company.name : company.englishName}　{lang === "zh" ? "备案号待补充" : "ICP number pending"}
      </div>
    </footer>
  );
}
