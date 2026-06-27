/**
 * Single source of truth for product identity and external links.
 * Kept framework-agnostic so it can be imported from server or client.
 */
export const siteConfig = {
  name: "resumeforge",
  tagline: "Build ATS-friendly resumes in minutes",
  description:
    "Create, customize, import and export professional, ATS-friendly resumes with complete control of your data. Everything runs in your browser, so your resume never leaves your device.",
  url: "https://resumeforge.ahmad2point0.com",
  repo: "https://github.com/ahmad2point0/resume-forge",
  license: "MIT",
  badges: {
    stars: "2.4k",
  },
  social: {
    github: "https://github.com/ahmad2point0/resume-forge",
  },
  /**
   * Donations keep this open-source project free and maintained. These are the
   * maintainer's local (Pakistan) payment rails - all share one number.
   */
  donate: {
    accountName: "Muhammad Ahmad",
    methods: [
      { id: "jazzcash", label: "JazzCash", number: "03460830430" },
      { id: "easypaisa", label: "Easypaisa", number: "03460830430" },
      { id: "raast", label: "Raast ID", number: "03460830430" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
