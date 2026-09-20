import { KB } from "./agent/kb";
import type { SupportConfig } from "./support-kit/types";

export const SUPPORT: SupportConfig = {
  productSlug: "saaspend",
  productName: "SaaSpend",
  feedbackEmail: process.env.FEEDBACK_TO_EMAIL || "lixingliangsy@163.com",
  kb: KB,
  chatHost: process.env.APP_URL || "https://saaspend.lxsaihub.com",
  brandColor: "#2563EB",
  complianceDisclaimer:
    "This assistant is for reference only and is not legal, tax, or professional advice.",
};
