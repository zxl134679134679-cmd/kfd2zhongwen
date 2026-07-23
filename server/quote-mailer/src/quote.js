const FIELD_LIMITS = {
  source: 40,
  language: 5,
  submittedAt: 40,
  pageUrl: 500,
  product: 120,
  size: 200,
  quantity: 200,
  material: 500,
  printing: 500,
  destination: 500,
  notes: 4000,
  contact: 500,
  website: 200,
};

const REQUIRED_FIELDS = ["source", "product", "size", "quantity", "contact"];

const FIELD_LABELS = [
  ["product", "产品类型"],
  ["size", "包装尺寸"],
  ["quantity", "预计数量"],
  ["material", "材质 / 楞型"],
  ["printing", "印刷需求"],
  ["destination", "交付地区"],
  ["notes", "补充说明"],
  ["contact", "客户联系方式"],
  ["pageUrl", "提交页面"],
  ["language", "页面语言"],
  ["submittedAt", "客户提交时间"],
];

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export function validateAndNormalizeQuote(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "invalid_submission" };
  }

  const quote = {};
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    const fieldValue = value[field] ?? "";
    if (typeof fieldValue !== "string" || fieldValue.length > limit) {
      return { ok: false, error: "invalid_submission" };
    }
    quote[field] = fieldValue.trim();
  }

  if (
    quote.source !== "kfdpack-website" ||
    quote.website ||
    REQUIRED_FIELDS.some((field) => !quote[field])
  ) {
    return { ok: false, error: "invalid_submission" };
  }

  return { ok: true, quote };
}

function displayValue(value) {
  return value || "未填写";
}

function subjectValue(value) {
  return displayValue(value).replace(/[\r\n]+/g, " ").slice(0, 80);
}

export function buildQuoteMail(quote, receivedAt = new Date()) {
  const receivedTime = receivedAt.toISOString();
  const rows = [
    ...FIELD_LABELS.map(([field, label]) => [label, displayValue(quote[field])]),
    ["服务器接收时间", receivedTime],
  ];
  const subject = `【凯丰德官网新询价】${subjectValue(quote.product)} - ${subjectValue(quote.contact)}`;
  const text = [
    "凯丰德官网收到新的包装询价",
    "",
    ...rows.map(([label, value]) => `${label}：${value}`),
  ].join("\n");
  const htmlRows = rows.map(([label, value]) => (
    `<tr><th style="padding:8px;text-align:left;background:#f4f1e8;border:1px solid #d8d2c3;">${escapeHtml(label)}</th>` +
    `<td style="padding:8px;border:1px solid #d8d2c3;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`
  )).join("");
  const html = [
    '<div style="font-family:Arial,\'Microsoft YaHei\',sans-serif;color:#102642;">',
    "<h2>凯丰德官网新询价</h2>",
    '<table style="border-collapse:collapse;width:100%;max-width:760px;">',
    htmlRows,
    "</table>",
    "</div>",
  ].join("");

  return { subject, text, html };
}
