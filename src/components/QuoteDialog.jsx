import { ArrowLeft, ArrowRight, CheckCircle, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { company, products } from "../content.js";

const emptyForm = {
  product: "",
  size: "",
  quantity: "",
  material: "",
  printing: "",
  destination: "",
  notes: "",
  phone: "",
  email: "",
};

const dialogCopy = {
  zh: {
    close: "关闭询价窗口",
    requiredProduct: "请选择产品类型",
    requiredSize: "请填写包装尺寸",
    requiredQuantity: "请填写预计数量",
    requiredPhone: "请填写联系电话",
    requiredContact: "请填写邮箱或微信",
    received: "需求已记录",
    successText: "感谢提交包装需求。正式上线接入邮箱 / n8n 后，信息将自动发送给业务人员；当前您也可以直接通过电话、微信或邮箱联系我们，我们会尽快跟进。",
    done: "完成",
    title: "提交包装需求",
    progress: ["选择产品", "填写规格", "联系信息"],
    legend: "您需要哪类包装？",
    size: "包装尺寸（长 × 宽 × 高）",
    sizePh: "例如 4500 × 2600 mm",
    quantity: "预计数量",
    quantityPh: "例如 10,000 件 / 20,000㎡",
    material: "材质 / 楞型",
    materialPh: "例如 三层B楞 / 五层BC楞",
    printing: "印刷需求",
    printingPh: "例如 水印3色 / 彩印6色",
    destination: "交付地区",
    destinationPh: "例如 青岛 / 美国洛杉矶 / 欧洲仓",
    notes: "补充说明",
    notesPh: "可填写用途、承重、打样、交期、出口包装要求等",
    phone: "联系电话",
    contact: "邮箱 / 微信 / WhatsApp",
    back: "返回",
    next: "下一步",
    submit: "提交需求",
  },
  en: {
    close: "Close quote dialog",
    requiredProduct: "Please choose a product type",
    requiredSize: "Please enter packaging size",
    requiredQuantity: "Please enter estimated quantity",
    requiredPhone: "Please enter phone number",
    requiredContact: "Please enter email, WeChat or WhatsApp",
    received: "Request received",
    successText: "Thank you for sending your packaging request. Once email / n8n is connected, the request will be sent to our sales team automatically. For now, you can also contact us directly by phone, WeChat or email.",
    done: "Done",
    title: "Submit Packaging Request",
    progress: ["Product", "Specifications", "Contact"],
    legend: "What packaging do you need?",
    size: "Package size (L × W × H)",
    sizePh: "e.g. 4500 × 2600 mm",
    quantity: "Estimated quantity",
    quantityPh: "e.g. 10,000 pcs / 20,000㎡",
    material: "Material / flute",
    materialPh: "e.g. 3-ply B flute / 5-ply BC flute",
    printing: "Printing requirement",
    printingPh: "e.g. 3-color flexo / 6-color printed",
    destination: "Delivery destination",
    destinationPh: "e.g. Qingdao / Los Angeles / Europe warehouse",
    notes: "Additional notes",
    notesPh: "Application, load, sample, lead time, export packaging requirements, etc.",
    phone: "Phone",
    contact: "Email / WeChat / WhatsApp",
    back: "Back",
    next: "Next",
    submit: "Submit Request",
  },
};

const RequiredMark = () => <span className="required-mark" aria-hidden="true">*</span>;

export function QuoteDialog({ lang = "zh", open, initialProduct = "", returnFocusRef, onClose }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("editing");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ ...emptyForm, product: initialProduct });
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const productRef = useRef(null);
  const sizeRef = useRef(null);
  const quantityRef = useRef(null);
  const emailRef = useRef(null);
  const t = dialogCopy[lang];
  const fieldRefs = {
    product: productRef,
    size: sizeRef,
    quantity: quantityRef,
    email: emailRef,
  };
  const webhookUrl = (
    import.meta.env?.VITE_N8N_QUOTE_WEBHOOK_URL ||
    (typeof window !== "undefined" ? window.__KFD_QUOTE_WEBHOOK_URL__ : "") ||
    ""
  ).trim();

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    setStep(1);
    setStatus("editing");
    setErrors({});
    setForm({ ...emptyForm, product: initialProduct });
    closeRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = [...dialog.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeIndex = focusable.indexOf(document.activeElement);

      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
      } else if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (activeIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      const opener = returnFocusRef?.current;
      opener?.focus();
      requestAnimationFrame(() => {
        if (document.activeElement !== opener) opener?.focus();
      });
    };
  }, [initialProduct, onClose, open, returnFocusRef]);

  if (!open) return null;

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const focusFirstInvalid = (fieldNames) => {
    const first = fieldNames.find((name) => fieldRefs[name]);
    const field = fieldRefs[first]?.current;
    field?.focus();
    requestAnimationFrame(() => {
      if (document.activeElement !== field) field?.focus();
    });
  };

  const moveToStep = (nextStep) => {
    setErrors({});
    setStep(nextStep);
    dialogRef.current?.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      if (dialogRef.current?.scrollTop) {
        dialogRef.current.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  };

  const next = () => {
    if (step === 1 && !form.product) {
      const nextErrors = { product: t.requiredProduct };
      setErrors(nextErrors);
      focusFirstInvalid(Object.keys(nextErrors));
      return;
    }
    if (step === 2) {
      const nextErrors = {};
      if (!form.size.trim()) nextErrors.size = t.requiredSize;
      if (!form.quantity.trim()) nextErrors.quantity = t.requiredQuantity;
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        focusFirstInvalid(Object.keys(nextErrors));
        return;
      }
    }
    moveToStep(Math.min(3, step + 1));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = t.requiredContact;
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      focusFirstInvalid(Object.keys(nextErrors));
      return;
    }
    setErrors({});
    setStatus("submitting");

    const payload = {
      source: "kfdpack-website",
      recipientEmail: company.email,
      language: lang,
      submittedAt: new Date().toISOString(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      product: form.product,
      size: form.size,
      quantity: form.quantity,
      material: form.material,
      printing: form.printing,
      destination: form.destination,
      notes: form.notes,
      contact: form.email,
    };

    try {
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Webhook request failed: ${response.status}`);
      }
      setStatus("success");
    } catch {
      setStatus("editing");
      setErrors({
        submit: lang === "zh"
          ? "提交失败，请稍后重试，或直接通过邮箱 / 微信联系我们。"
          : "Submission failed. Please try again later or contact us by email / WeChat.",
      });
    }
  };

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="quote-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-title" tabIndex="-1">
        <button ref={closeRef} className="dialog-close" type="button" onClick={onClose} aria-label={t.close}>
          <X size={24} />
        </button>

        {status === "success" ? (
          <div className="quote-success">
            <CheckCircle size={58} weight="light" aria-hidden="true" />
            <p className="eyebrow dark">REQUEST RECEIVED</p>
            <h2 id="quote-title">{t.received}</h2>
            <p>
              {t.successText}
              <br />
              {company.email} · {company.phone}
            </p>
            <button className="button button-primary" type="button" onClick={onClose}>{t.done}</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="eyebrow dark">QUOTE REQUEST</p>
            <h2 id="quote-title">{t.title}</h2>
            <div className="quote-progress" aria-label={lang === "zh" ? `询价进度：第 ${step} 步，共 3 步` : `Quote progress: step ${step} of 3`}>
              {t.progress.map((label, index) => (
                <span className={step >= index + 1 ? "active" : ""} key={label}>{index + 1}. {label}</span>
              ))}
            </div>

            {step === 1 ? (
              <fieldset className="product-options">
                <legend>{t.legend} <RequiredMark /></legend>
                {products.map((product, index) => (
                  <label key={product.id}>
                    <input
                      ref={index === 0 ? productRef : undefined}
                      aria-label={product.name[lang]}
                      aria-invalid={Boolean(errors.product)}
                      aria-describedby={errors.product ? "product-error" : undefined}
                      required
                      type="radio"
                      name="product"
                      value={product.name[lang]}
                      checked={form.product === product.name[lang]}
                      onChange={(event) => update("product", event.target.value)}
                    />
                    <span>
                      <strong>{product.name[lang]}</strong>
                      <small>{product.description[lang]}</small>
                    </span>
                  </label>
                ))}
                {errors.product ? <p id="product-error" className="field-error" role="alert">{errors.product}</p> : null}
              </fieldset>
            ) : null}

            {step === 2 ? (
              <div className="form-grid">
                <label htmlFor="quote-size">
                  <span>{t.size} <RequiredMark /></span>
                  <input
                    id="quote-size"
                    ref={sizeRef}
                    required
                    aria-invalid={Boolean(errors.size)}
                    aria-describedby={errors.size ? "size-error" : undefined}
                    value={form.size}
                    onChange={(event) => update("size", event.target.value)}
                    placeholder={t.sizePh}
                  />
                  {errors.size ? <span id="size-error" className="field-error" role="alert">{errors.size}</span> : null}
                </label>
                <label htmlFor="quote-quantity">
                  <span>{t.quantity} <RequiredMark /></span>
                  <input
                    id="quote-quantity"
                    ref={quantityRef}
                    required
                    aria-invalid={Boolean(errors.quantity)}
                    aria-describedby={errors.quantity ? "quantity-error" : undefined}
                    value={form.quantity}
                    onChange={(event) => update("quantity", event.target.value)}
                    placeholder={t.quantityPh}
                  />
                  {errors.quantity ? <span id="quantity-error" className="field-error" role="alert">{errors.quantity}</span> : null}
                </label>
                <label>
                  {t.material}
                  <input value={form.material} onChange={(event) => update("material", event.target.value)} placeholder={t.materialPh} />
                </label>
                <label>
                  {t.printing}
                  <input value={form.printing} onChange={(event) => update("printing", event.target.value)} placeholder={t.printingPh} />
                </label>
                <label className="full-field">
                  {t.destination}
                  <input value={form.destination} onChange={(event) => update("destination", event.target.value)} placeholder={t.destinationPh} />
                </label>
                <label className="full-field">
                  {t.notes}
                  <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows="4" placeholder={t.notesPh} />
                </label>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="form-grid">
                <label className="full-field" htmlFor="quote-email">
                  <span>{t.contact} <RequiredMark /></span>
                  <input
                    id="quote-email"
                    ref={emailRef}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                  {errors.email ? <span id="email-error" className="field-error" role="alert">{errors.email}</span> : null}
                </label>
              </div>
            ) : null}

            <div className="dialog-actions">
              {step > 1 ? (
                <button className="dialog-back" type="button" onClick={() => moveToStep(step - 1)}>
                  <ArrowLeft size={18} /> {t.back}
                </button>
              ) : <span />}
              {step < 3 ? (
                <button className="button button-primary" type="button" onClick={next}>
                  {t.next} <ArrowRight size={18} />
                </button>
              ) : (
                <button className="button button-primary" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? (lang === "zh" ? "提交中..." : "Sending...") : t.submit} <ArrowRight size={18} />
                </button>
              )}
            </div>
            {errors.submit ? <p className="field-error" role="alert">{errors.submit}</p> : null}
          </form>
        )}
      </section>
    </div>
  );
}
