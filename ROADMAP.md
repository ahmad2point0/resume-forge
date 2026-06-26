# Roadmap

This roadmap shows where resumeforge is today and where it's headed. It is a living
document - priorities shift, and community input is welcome. Open an issue or start a
discussion if you'd like to propose or pick up an item.

Everything here keeps the project's core promise intact: **local-first, no backend, no
account, your data never leaves your device**.

---

## ✅ Done - already shipped

These capabilities exist in the app today:

- **Resume builder** with 11 sections (summary, experience, education, projects, skills,
  certifications, achievements, publications, languages, interests, references).
- **Drag & drop** to add, remove, reorder, and duplicate sections and entries.
- **8 ATS-aware templates** (Minimal ATS, Software Engineer, Modern Professional, Harvard,
  Startup Founder, Executive, Academic CV, Creative) with **instant switching**.
- **Per-resume customization** - accent color, font, spacing, section order, and page size
  (A4 / Letter).
- **Live preview** as you type.
- **Real-time ATS scoring & completeness** - 9 ATS checks and 5 category scores with
  actionable suggestions.
- **JSON import**, including the privacy-first "convert your old PDF/DOCX with an LLM"
  flow.
- **PDF export** - print (selectable text) or rasterized download, for A4 and Letter.
- **Optional bring-your-own-key AI assistant** running client-side
  (OpenAI / Anthropic / Gemini / DeepSeek / Groq).
- **Autosave + draft recovery**, **undo/redo**, **dark mode**, **keyboard shortcuts**, and
  **keyboard/ARIA accessibility**.
- **100% local storage** - IndexedDB with a localStorage fallback.

---

## 🟢 Now - in progress / next up

- **More templates** - broaden the gallery with additional ATS-safe and styled layouts,
  plus reusable **theme presets** (curated color + font + spacing combinations).
- **PDF import with in-browser text extraction** - parse a PDF locally and pre-fill a
  resume without sending the file anywhere.
- **Tailor a resume to a job description** - paste a job posting and get targeted
  keyword/bullet suggestions (via the existing bring-your-own-key AI assistant).

---

## 🟡 Next - planned

- **Multi-page resume support** - proper page breaks and multi-page export.
- **Cover-letter generator** - generate and edit a matching cover letter from your resume
  and a target role.
- **Additional AI providers & local model support** - more hosted providers, plus the
  ability to point at a local/self-hosted model (e.g. Ollama-style endpoints) for fully
  offline AI.
- **Resume diff / versioning UI** - snapshot versions of a resume and compare them
  side by side.
- **A/B template comparison** - preview the same content across two templates at once to
  pick the best fit.

---

## 🔵 Later - exploring

- **Internationalization (i18n)** - translated UI and locale-aware resume formatting.
- **Privacy-preserving cloud-optional sync** - opt-in, end-to-end encrypted sync across
  devices that never exposes plaintext resume data to any server.
- Richer accessibility and theming options, and continued performance work.

---

> Legend: ✅ Done · 🟢 Now · 🟡 Next · 🔵 Later. Items may move between buckets as work
> progresses. See [CONTRIBUTING.md](./CONTRIBUTING.md) if you'd like to help build any of
> these.
