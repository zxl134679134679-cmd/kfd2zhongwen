import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { ResponsiveImage } from "./ResponsiveImage.jsx";

export function PageHero({ eyebrow, title, description, image, imageAlt, anchorHref, anchorLabel, children, onOpenQuote }) {
  return (
    <section className="page-hero" id="top">
      <div className="page-hero-copy">
        <div>
          <p className="eyebrow dark">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="page-hero-actions">
            <button className="button button-primary" type="button" onClick={onOpenQuote}>
              提交包装需求 <ArrowRight size={18} weight="bold" />
            </button>
            {anchorHref ? <a className="text-link" href={anchorHref}>{anchorLabel} <ArrowDown size={18} /></a> : null}
          </div>
          {children}
        </div>
      </div>
      <figure className="page-hero-image">
        <ResponsiveImage src={image} alt={imageAlt} fetchPriority="high" />
      </figure>
    </section>
  );
}
