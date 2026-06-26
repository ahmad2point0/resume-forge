import type { ResumeData } from "@/global/@types";

/**
 * The "Jordan Avery" sample from the product design. Used to seed the importer's
 * "Load a sample", to preview templates, and as a first-run demo resume.
 */
export const SAMPLE_RESUME_DATA: ResumeData = {
  basics: {
    fullName: "Jordan Avery",
    jobTitle: "Senior Frontend Engineer",
    email: "jordan.avery@email.com",
    phone: "(415) 555-0148",
    location: "San Francisco, CA",
    website: "jordanavery.dev",
    linkedin: "linkedin.com/in/jordanavery",
    github: "github.com/jordanavery",
    summary:
      "Senior frontend engineer with 8+ years building accessible, high-performance web apps at scale. Specializes in design systems, React architecture, and shipping product with small teams. Reduced page-load times by 40% and mentored 6 engineers to senior level.",
  },
  work: [
    {
      id: "w1",
      company: "Stripe",
      position: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      current: true,
      highlights: [
        "Led the rebuild of the merchant dashboard in React and TypeScript, improving Lighthouse performance scores from 62 to 96.",
        "Designed and shipped a shared component library adopted by 9 product teams, cutting UI build time by an estimated 30%.",
        "Drove accessibility to WCAG 2.1 AA across the dashboard, resolving 120+ audit issues.",
      ],
    },
    {
      id: "w2",
      company: "Airbnb",
      position: "Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2017-06",
      endDate: "2021-02",
      current: false,
      highlights: [
        "Built the host onboarding flow used by 2M+ hosts, increasing completion rate by 18%.",
        "Migrated a legacy Backbone codebase to React, reducing bundle size by 35%.",
        "Mentored 4 junior engineers and ran the team's weekly frontend guild.",
      ],
    },
  ],
  education: [
    {
      id: "e1",
      institution: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2009-08",
      endDate: "2013-05",
      current: false,
      gpa: "3.8",
      highlights: ["Dean's List · ACM officer · Teaching assistant for CS61A"],
    },
  ],
  projects: [
    {
      id: "p1",
      name: "openchart",
      description:
        "An open-source, dependency-free charting library for the web with 4k+ GitHub stars.",
      url: "github.com/jordanavery/openchart",
      startDate: "2020-01",
      endDate: "",
      highlights: [
        "Authored a 12kb gzipped rendering engine with full SSR support.",
        "Grew the project to 4,000+ stars and 30 contributors.",
      ],
      keywords: ["TypeScript", "Canvas", "SVG", "Rollup"],
    },
  ],
  skills: [
    {
      id: "s1",
      name: "Languages",
      keywords: ["TypeScript", "JavaScript", "HTML", "CSS", "Python"],
    },
    {
      id: "s2",
      name: "Frameworks",
      keywords: ["React", "Next.js", "Node.js", "Remix", "Vitest"],
    },
    {
      id: "s3",
      name: "Tooling",
      keywords: ["Webpack", "Vite", "Playwright", "Figma", "Storybook"],
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2022-09",
      url: "",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "Internal Hackathon Winner",
      description:
        "Built an internal accessibility-linting tool now used across the org.",
      date: "2023-04",
    },
  ],
  publications: [],
  languages: [
    { id: "l1", name: "English", fluency: "Native" },
    { id: "l2", name: "Spanish", fluency: "Professional" },
  ],
  interests: [
    { id: "i1", name: "Open source" },
    { id: "i2", name: "Trail running" },
    { id: "i3", name: "Typography" },
  ],
  references: [],
};
