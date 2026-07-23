import {
  Buildings,
  Certificate,
  CheckCircle,
  Factory,
  GlobeHemisphereEast,
  Headset,
  Package,
  ShieldCheck,
  Stack,
  Truck,
} from "@phosphor-icons/react";

export const company = {
  name: "青岛凯丰德包装有限公司",
  englishName: "Qingdao Kaifengde Packaging Co., Ltd.",
  shortName: "KFD Packaging",
  established: "2015年11月10日",
  capital: "5,000万元人民币",
  address: "山东省青岛市莱西市姜山镇昌瑞西路77号",
  addressEn: "No.77 Changruixi Road, Jiangshan Town, Laixi, Qingdao, Shandong, China",
  phone: "+86 137 9329 3986",
  email: "909015753@qq.com",
};

export const navLinks = [
  { label: { zh: "首页", en: "Home" }, href: "/", key: "home" },
  { label: { zh: "产品中心", en: "Products" }, href: "/products", key: "products" },
  { label: { zh: "包装方案", en: "Solutions" }, href: "/solutions", key: "solutions" },
  { label: { zh: "工厂实力", en: "Factory" }, href: "/factory", key: "factory" },
  { label: { zh: "资质认证", en: "Certificates" }, href: "/certifications", key: "certifications" },
  { label: { zh: "联系我们", en: "Contact" }, href: "/contact", key: "contact" },
];

export const heroMetrics = [
  { value: "300,000", unit: "㎡/Day", label: { zh: "纸板日产能", en: "Daily board capacity" }, Icon: Stack },
  { value: "200,000", unit: "㎡/Day", label: { zh: "纸箱日产能", en: "Daily carton capacity" }, Icon: Package },
  { value: "40,000", unit: "㎡", label: { zh: "厂房面积", en: "Factory area" }, Icon: Buildings },
  { value: "3–7", unit: { zh: "天", en: "Days" }, label: { zh: "快速交付", en: "Fast delivery" }, Icon: Truck },
];

export const products = [
  {
    id: "printed-carton",
    name: { zh: "彩印纸箱", en: "Printed Cartons" },
    image: "/assets/product-color-printing-power.png",
    alt: { zh: "工业产品彩印纸箱展示", en: "Printed industrial carton packaging display" },
    description: {
      zh: "高品质印刷与结构定制，兼顾品牌展示、运输保护与出口包装质感。",
      en: "Premium printed cartons with structural customization for branding, protection and export packaging.",
    },
    specs: {
      zh: ["彩印最高 6 色", "最大 1620 × 1050 mm", "支持模切、开槽、钉箱、粘箱"],
      en: ["Up to 6-color printing", "Max 1620 × 1050 mm", "Die-cutting, slotting, stitching and gluing"],
    },
    applications: { zh: "品牌包装 / 工业产品 / 出口展示", en: "Brand packaging / Industrial products / Export display" },
  },
  {
    id: "corrugated-board",
    name: { zh: "瓦楞纸板", en: "Corrugated Board" },
    image: "/assets/product-corrugated-board.png",
    alt: { zh: "高品质瓦楞纸板楞型细节展示", en: "High-quality corrugated board flute detail" },
    description: {
      zh: "稳定纸板品质，覆盖多种楞型与克重方案，适合批量化包装生产。",
      en: "Stable board supply with multiple flute and paper weight options for volume carton production.",
    },
    specs: {
      zh: ["三层 / 五层", "B / C / E / A 楞", "2.8米纸板生产流水线"],
      en: ["3-ply / 5-ply", "B / C / E / A flute", "2.8m corrugated board line"],
    },
    applications: { zh: "纸箱配套 / 批量纸板供应", en: "Carton converting / Bulk board supply" },
  },
  {
    id: "standard-carton",
    name: { zh: "普通纸箱", en: "Regular Cartons" },
    image: "/assets/product-standard-carton.png",
    alt: { zh: "普通瓦楞纸箱商业展示", en: "Regular corrugated carton display" },
    description: {
      zh: "适合仓储、周转、发货与工业产品包装，结构可靠，交付稳定。",
      en: "Reliable corrugated cartons for storage, turnover, shipping and industrial product packaging.",
    },
    specs: {
      zh: ["水印最多 5 色", "支持开槽 / 模切", "钉箱 / 粘箱"],
      en: ["Up to 5-color flexo printing", "Slotting / Die-cutting", "Stitching / Gluing"],
    },
    applications: { zh: "仓储周转 / 发货包装 / 工业保护", en: "Warehouse / Shipping / Industrial protection" },
  },
  {
    id: "oversize-carton",
    name: { zh: "超大规格纸箱", en: "Oversized Cartons" },
    image: "/assets/product-oversize-flexo-printed.png",
    alt: { zh: "超大规格纸箱展示", en: "Oversized corrugated carton display" },
    description: {
      zh: "面向大尺寸产品与出口运输需求，强化边角保护与承压结构。",
      en: "Large-format packaging for oversized products and export transport, with reinforced protection.",
    },
    specs: {
      zh: ["最大 4.5m × 2.6m", "适合大件运输", "可按产品结构定制"],
      en: ["Max 4.5m × 2.6m", "For large-item transport", "Customized to product structure"],
    },
    applications: { zh: "大件产品 / 出口运输 / 强化保护", en: "Large products / Export transport / Reinforced protection" },
  },
];

export const factoryHighlights = [
  {
    title: { zh: "2.8米纸板生产流水线", en: "2.8m Board Production Line" },
    text: { zh: "覆盖大幅面纸板生产需求，保障稳定供应。", en: "Supports large-format corrugated board supply with stable output." },
    Icon: Factory,
  },
  {
    title: { zh: "6台水印印刷机", en: "6 Flexo Printing Machines" },
    text: { zh: "多规格设备覆盖，支持批量化印刷订单。", en: "Multi-size equipment for volume flexo printed carton orders." },
    Icon: Package,
  },
  {
    title: { zh: "全自动钉箱机", en: "Automatic Stitching Lines" },
    text: { zh: "多尺寸纸箱成型，提高效率与交付稳定性。", en: "Automated forming for different carton sizes and stable delivery." },
    Icon: CheckCircle,
  },
  {
    title: { zh: "1万㎡仓储面积", en: "10,000㎡ Warehousing" },
    text: { zh: "原纸、成品与物流周转空间充足。", en: "Space for raw paper, finished goods and logistics turnover." },
    Icon: Truck,
  },
];

export const solutions = [
  {
    id: "printed-brand",
    productId: "printed-carton",
    image: "/assets/product-color-printing-power.png",
    alt: { zh: "彩印品牌包装实拍", en: "Printed brand packaging" },
    title: { zh: "彩印品牌包装", en: "Printed Brand Packaging" },
    text: { zh: "兼顾品牌展示、结构成型与运输保护。", en: "Balances brand presentation, structural forming and transport protection." },
    application: { zh: "品牌包装、工业产品、出口展示", en: "Brand packaging, industrial products, export display" },
    capability: { zh: "彩印、模切、开槽、钉箱与粘箱", en: "Color printing, die-cutting, slotting, stitching and gluing" },
    rfq: { zh: "尺寸、数量、设计文件、印刷颜色", en: "Size, quantity, artwork and print colors" },
  },
  {
    id: "export-transport",
    productId: "standard-carton",
    image: "/assets/product-standard-carton.png",
    alt: { zh: "出口运输纸箱实拍", en: "Export transport cartons" },
    title: { zh: "出口运输包装", en: "Export Transport Packaging" },
    text: { zh: "围绕堆码、防护与物流距离匹配纸板和箱型。", en: "Matches board and structure to stacking, protection and transport distance." },
    application: { zh: "长途运输、仓储堆码、出口交付", en: "Long-distance transport, warehousing and export delivery" },
    capability: { zh: "多楞型纸板、开槽、模切与成型", en: "Multiple flute options, slotting, die-cutting and forming" },
    rfq: { zh: "产品重量、装箱方式、交付地、堆码要求", en: "Product weight, packing method, destination and stacking needs" },
  },
  {
    id: "industrial",
    productId: "corrugated-board",
    image: "/assets/product-corrugated-board.png",
    alt: { zh: "工业产品瓦楞包装实拍", en: "Industrial corrugated packaging" },
    title: { zh: "工业产品包装", en: "Industrial Product Packaging" },
    text: { zh: "根据尺寸、重量和装箱方式匹配材料与结构。", en: "Matches material and structure to product size, weight and packing method." },
    application: { zh: "设备配件、工业制品、批量周转", en: "Equipment parts, industrial goods and volume turnover" },
    capability: { zh: "纸板配套、结构定制、内衬与成型建议", en: "Board supply, structural customization, inserts and forming advice" },
    rfq: { zh: "产品尺寸、重量、数量、保护要求", en: "Product size, weight, quantity and protection needs" },
  },
  {
    id: "oversize",
    productId: "oversize-carton",
    image: "/assets/product-oversize-flexo-printed.png",
    alt: { zh: "超大规格纸箱实拍", en: "Oversized corrugated cartons" },
    title: { zh: "大尺寸定制包装", en: "Large-size Custom Packaging" },
    text: { zh: "面向大件产品和批量出货定制大幅面包装。", en: "Large-format packaging for oversized products and batch shipment." },
    application: { zh: "大件产品、设备运输、强化防护", en: "Large products, equipment transport and reinforced protection" },
    capability: { zh: "超大规格水印、结构定制与边角防护", en: "Oversized flexo print, custom structure and edge protection" },
    rfq: { zh: "外形尺寸、重量、吊装方式、运输路线", en: "Dimensions, weight, handling method and transport route" },
  },
];

export const certifications = [
  { name: "ISO9001", label: { zh: "质量管理体系", en: "Quality Management" }, image: "/assets/cert-iso9001.png", file: "/certificates/iso9001-quality.pdf" },
  { name: "ISO14001", label: { zh: "环境管理体系", en: "Environmental Management" }, image: "/assets/cert-iso14001.png", file: "/certificates/iso14001-environment.pdf" },
  { name: "FSC", label: { zh: "森林产销监管链", en: "Chain of Custody" }, image: "/assets/cert-fsc.png", file: "/certificates/fsc-chain-of-custody.pdf" },
  { name: "REACH", label: { zh: "有害物质检测", en: "Restricted Substance Test" }, image: "/assets/cert-reach.png", file: "/certificates/reach-test-report.pdf" },
];

export const processSteps = [
  { number: "01", title: { zh: "提交需求", en: "Send Requirements" }, text: { zh: "尺寸、数量、材质、印刷与交付地。", en: "Size, quantity, material, printing and destination." }, Icon: Headset },
  { number: "02", title: { zh: "成本审核", en: "Cost Review" }, text: { zh: "结合原纸、工艺、运费与周期核算。", en: "Review paper, process, freight and lead time." }, Icon: ShieldCheck },
  { number: "03", title: { zh: "确认报价", en: "Confirm Quote" }, text: { zh: "确认结构、样品、单价与交付安排。", en: "Confirm structure, samples, unit price and delivery." }, Icon: Certificate },
  { number: "04", title: { zh: "快速跟进", en: "Fast Follow-up" }, text: { zh: "收到完整资料后尽快回复，复杂项目可先打样确认。", en: "We reply quickly after complete details; sampling can be arranged." }, Icon: GlobeHemisphereEast },
];

export const copy = {
  zh: {
    quote: "发起询价",
    viewFactory: "查看工厂实力",
    homeFactoryTitle: "看得见的工厂实力",
    homeFactoryText: "真实厂区、稳定设备、清晰产能，是客户判断供应商的第一层信任。",
    homeProductsKicker: "精选产品",
    homeProductsTitle: "先让客户看到包装质感",
    enterProducts: "进入产品中心",
    homeQualityKicker: "品质保障",
    homeQualityTitle: "以可核验资料建立合作信任",
    homeQualityText: "质量、环境、FSC 与材料检测资料集中展示，方便客户进行供应商审核。",
    viewCertificates: "查看全部认证",
    heroTitle: ["高品质纸箱制造", "与瓦楞包装定制"],
    heroText: "彩印纸箱、瓦楞纸板、出口运输纸箱一体化定制；支持大尺寸、快速打样与批量交付。",
    heroBadges: ["工厂直供", "支持出口包装", "1个工作日内跟进"],
  },
  en: {
    quote: "Get a Quote",
    viewFactory: "View Factory",
    homeFactoryTitle: "Factory strength you can verify",
    homeFactoryText: "Real production lines, clear capacity and stable delivery help buyers qualify us faster.",
    homeProductsKicker: "Selected Products",
    homeProductsTitle: "Packaging quality buyers can see",
    enterProducts: "View Products",
    homeQualityKicker: "QUALITY ASSURANCE",
    homeQualityTitle: "Build trust with verifiable documents",
    homeQualityText: "Quality, environmental, FSC and material test documents are organized for supplier review.",
    viewCertificates: "View all certificates",
    heroTitle: ["Custom Carton Manufacturing", "Corrugated Packaging Solutions"],
    heroText: "Printed cartons, corrugated board and export transport packaging from one factory — large sizes, fast sampling and stable volume delivery.",
    heroBadges: ["Factory direct", "Export-ready packaging", "Follow-up within 1 business day"],
  },
};
