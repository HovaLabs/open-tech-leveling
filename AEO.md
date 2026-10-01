# Answer Engine Optimization (AEO)

How this site is set up to be found, understood, and cited by search engines and AI answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews, Copilot, etc.).

## What's in place

### 📄 index.html

- **Descriptive title and meta description** naming the topic ("Software Engineering Career Levels L1–L8") instead of just the brand
- **Canonical URL on `www`**: the apex domain 301-redirects to `www`, so canonical, Open Graph, and Twitter URLs all use `https://www.opentechleveling.com/`
- **`robots` meta** with `max-snippet:-1` so engines can quote full answers
- **JSON-LD structured data** (`@graph`):
  - `Organization` (Hova Labs) and `WebSite`
  - `WebPage` + `FAQPage` with the FAQ questions and answers
  - `DefinedTermSet` with one `DefinedTerm` per level (L1–L8), each linked to its table row anchor (`#L1`…`#L8`)
- **Visible FAQ section** with question headings and short, answer-first paragraphs, which is the format answer engines quote most
- **Deep-linkable anchors** on every level row and FAQ item

### 🤖 robots.txt

Allows all crawlers, and explicitly allows AI search, assistant, and training crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.). Points to the sitemap.

### 🗺️ sitemap.xml

Lists the canonical URL with a `lastmod` date.

### 🧠 llms.txt

A plain-markdown summary of the framework, following the [llms.txt](https://llmstxt.org/) proposal, so LLMs can read the full level definitions without parsing HTML.

## Updating content

The level definitions and FAQ live in several places. When you change them, update all of these:

1. **Table** in `index.html`
2. **FAQ section** in `index.html` and the matching `FAQPage` answers in the JSON-LD (the text must match what's visible)
3. **`DefinedTerm` descriptions** in the JSON-LD if a level changes
4. **`llms.txt`**
5. **`README.md`** table
6. **Dates**: `dateModified` in the JSON-LD and `<lastmod>` in `sitemap.xml`

## Validating

- [Schema.org validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results) for the JSON-LD
- [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters): submit `https://www.opentechleveling.com/sitemap.xml` (Bing's index also feeds ChatGPT search and Copilot)
