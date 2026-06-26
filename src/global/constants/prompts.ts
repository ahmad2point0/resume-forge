/**
 * Copy-paste prompts the user runs in ChatGPT (or any LLM) themselves.
 * This is the privacy-first path from the design: no file ever leaves the
 * device - the user converts their old resume to our JSON shape elsewhere and
 * pastes the result back in. The built-in AI assistant (Settings → AI) is a
 * separate, opt-in, bring-your-own-key enhancement.
 */

export const IMPORT_JSON_SCHEMA_HINT = `{
  "title": "string - a name for this resume",
  "data": {
    "basics": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "github": "", "summary": "" },
    "work": [{ "company": "", "position": "", "location": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "highlights": ["bullet", "bullet"] }],
    "education": [{ "institution": "", "degree": "", "field": "", "location": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "gpa": "", "highlights": [] }],
    "projects": [{ "name": "", "description": "", "url": "", "startDate": "", "endDate": "", "highlights": [], "keywords": [] }],
    "skills": [{ "name": "group name", "keywords": ["skill", "skill"] }],
    "certifications": [{ "name": "", "issuer": "", "date": "", "url": "" }],
    "achievements": [{ "title": "", "description": "", "date": "" }],
    "publications": [{ "title": "", "publisher": "", "date": "", "url": "", "summary": "" }],
    "languages": [{ "name": "", "fluency": "" }],
    "interests": [{ "name": "" }],
    "references": [{ "name": "", "title": "", "contact": "", "reference": "" }]
  }
}`;

export const IMPORT_PROMPT = `You are a strict resume-to-JSON parser. I will attach my existing resume (PDF or DOCX).
Convert it into the EXACT JSON structure below and return RAW JSON only.

Output rules:
- Output ONLY one valid JSON object. No commentary, no explanations, no markdown, no code fences.
- Every value must be PLAIN TEXT. Never use markdown links like [text](url), never wrap anything in [ ] or ( ).
- For email: put just the address (e.g. "jane@site.com"). Do NOT add a "mailto:" prefix or a link.
- For phone: digits and "+ ( ) -" only. Do NOT add a "tel:" prefix or a link.
- For website / linkedin / github / project url: put the bare URL as text (e.g. "https://github.com/me"). No brackets, no markdown, no duplicated link.
- Do NOT hyperlink any value. Strip any auto-formatting your editor adds.
- Use "YYYY-MM" for all dates. Use "" for unknown values and [] for empty lists.
- Set "current": true for the current role and leave its "endDate" as "".
- Split every responsibility/achievement into its own string in "highlights". One sentence per bullet, no leading "-" or "•".
- Group skills sensibly (e.g. Languages, Frameworks, Tools).
- Keep keys and nesting exactly as shown. Do not add, rename, or drop keys.

Before you answer, double-check: is the output a single parseable JSON object with zero markdown and zero [ ]( ) link syntax? If not, fix it.

JSON structure:
${IMPORT_JSON_SCHEMA_HINT}`;

export const IMPROVE_PROMPT = `Act as an expert resume editor and ATS specialist.
Improve the resume JSON I paste below. For each work and project highlight:
- Start with a strong action verb.
- Quantify impact with real metrics where plausible.
- Keep each bullet to one line, ATS-friendly, no buzzword stuffing.
Rewrite the professional summary in 2-4 sentences leading with my title and years of experience.
Return the SAME JSON structure with improved text only - no commentary.`;

export const COVER_LETTER_PROMPT = `Write a tailored, one-page cover letter using my resume JSON (pasted below),
the target role, and the job description. Keep it specific, confident, and free
of clichés. Reference 2-3 concrete achievements from my resume.

Role: [PASTE ROLE]
Company: [PASTE COMPANY]
Job description: [PASTE JOB DESCRIPTION]`;

/** System prompts used by the built-in (opt-in) AI assistant. */
export const AI_SYSTEM_PROMPTS = {
  summary:
    "You are an expert resume writer and ATS specialist. Write concise, professional resume summaries (2-4 sentences) that lead with the candidate's title and years of experience, highlight measurable strengths, and avoid clichés. Return only the summary text.",
  bullet:
    "You are an expert resume editor. Rewrite the resume bullet point to start with a strong action verb, quantify impact when plausible, stay to a single line, and remain ATS-friendly. Return only the rewritten bullet, no quotes or commentary.",
  ats: "You are an ATS optimization engine. Analyze the resume and return concise, actionable suggestions to improve keyword coverage, formatting, and impact.",
  match:
    "You are an ATS job-match analyzer. Compare the resume to the job description and identify matching skills, missing skills, and concrete improvements.",
} as const;
