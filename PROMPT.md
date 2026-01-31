# Google Gemini Prompt — Kids' Weekly News

Copy and paste the following prompt into Google Gemini:

---

You are a kids' newspaper editor. Do the following:

1. **Find the top 10 news stories from the last 7 days** that would be interesting and appropriate for a 10-year-old. Pick a mix: science, animals, sports, technology, weather, arts, world events, and feel-good stories. Avoid anything violent, scary, or politically divisive.

2. **Rewrite each story at a 2nd grade reading level.** Use short sentences. Use simple words. Avoid jargon. The tone should be fun and exciting.

3. **For each story, find one real image from the web** that relates to the story. The image URL must be a direct link to an actual image file (ending in .jpg, .png, .webp, etc.) that is publicly accessible. Prefer images from major news outlets, Wikimedia Commons, or official sources. Do NOT generate images — only use real images found on the web.

4. **JUST RETURN JSON. NO ADDITIONAL TEXT AT ALL.** No explanation. No commentary. No markdown formatting. No code fences. No "here you go" or "sure!" — NOTHING except the raw JSON object. Your entire response must start with `{` and end with `}`. I need to copy and paste it directly into code.

**Rules for the JSON:**

- There must be exactly **10 articles**.
- **Article 1** (row 1): `borderColor: "border-green-500"`, `headlineColor: "text-green-700"`
- **Article 2** (row 1): `borderColor: "border-blue-500"`, `headlineColor: "text-blue-700"`, `colSpan: 2`, `featured: true` — this is the biggest/most exciting story of the week
- **Article 3** (row 1): `borderColor: "border-purple-500"`, `headlineColor: "text-purple-700"`
- **Article 4** (row 2): `borderColor: "border-teal-500"`, `headlineColor: "text-teal-700"`
- **Article 5** (row 2): `borderColor: "border-rose-500"`, `headlineColor: "text-rose-700"`
- **Article 6** (row 2): `borderColor: "border-green-500"`, `headlineColor: "text-green-700"`
- **Article 7** (row 2): `borderColor: "border-yellow-500"`, `headlineColor: "text-yellow-700"`
- **Article 8** (row 3): `borderColor: "border-green-500"`, `headlineColor: "text-green-700"`
- **Article 9** (row 3): `borderColor: "border-blue-500"`, `headlineColor: "text-blue-700"`
- **Article 10** (row 3): `borderColor: "border-teal-500"`, `headlineColor: "text-teal-700"`
- Each `id` should be a short kebab-case slug (e.g. `"space-rocket"`, `"baby-panda"`).
- Each `headline` should be 3–8 words, fun and punchy, ending with `!` or `?`.
- Each `bodyText` must be **30–40 words** for regular articles and **50–60 words** for the featured article (article 2).
- Each article has exactly **one image**. The `images` array must contain a single object with `url` (a real image URL found on the web) and `alt` (a short description).
- The `row` field must be `1` for articles 1–3, `2` for articles 4–7, and `3` for articles 8–10.
- Only article 2 has `colSpan: 2` and `featured: true`. All other articles must NOT include `colSpan` or `featured`.

**Exact JSON format:**

```json
{
  "title": "THE KIDS' WEEKLY NEWS",
  "subtitle": "Your weekly source for fun and fascinating stories!",
  "articles": [
    {
      "id": "example-slug",
      "headline": "Short Fun Headline!",
      "bodyText": "Simple sentences here. About 30 to 40 words for regular articles. Use easy words a 2nd grader can read. Make it fun and interesting for kids!",
      "images": [
        {
          "url": "URL_OF_IMAGE_FROM_WEB",
          "alt": "Short description of the image"
        }
      ],
      "borderColor": "border-green-500",
      "headlineColor": "text-green-700",
      "row": 1
    }
  ]
}
```

REMEMBER: YOUR ENTIRE RESPONSE MUST BE ONLY THE JSON OBJECT. START WITH `{` AND END WITH `}`. NO OTHER TEXT.
