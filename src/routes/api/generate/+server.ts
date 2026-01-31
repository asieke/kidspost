import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleGenAI } from '@google/genai';
import type { NewspaperData, Article } from '$lib/types';

const gradeToReadingLevel: Record<string, string> = {
	'1': '1st grade',
	'2': '2nd grade',
	'3': '3rd grade',
	'4': '4th grade',
	'5': '5th grade'
};

export const POST: RequestHandler = async ({ request }) => {
	const startTime = Date.now();
	console.log('[generate] Request received');

	try {
		const { gradeLevel, apiKey } = await request.json();
		console.log('[generate] Grade level:', gradeLevel);

		if (!apiKey) {
			console.log('[generate] ERROR: No API key provided');
			return json({ error: 'API key is required' }, { status: 400 });
		}

		if (!gradeLevel) {
			console.log('[generate] ERROR: No grade level provided');
			return json({ error: 'Grade level is required' }, { status: 400 });
		}

		// Create GenAI instance with user-provided API key
		const genAI = new GoogleGenAI({
			apiKey: apiKey
		});

		const readingLevel = gradeToReadingLevel[gradeLevel] || '2nd grade';

		// Layout config: each page has 5 positions, position 2 is featured
		const layoutConfig = [
			// Page 1
			{ page: 1 as const, position: 1 as const, borderColor: 'border-green-500', headlineColor: 'text-green-700', featured: false },
			{ page: 1 as const, position: 2 as const, borderColor: 'border-blue-500', headlineColor: 'text-blue-700', featured: true },
			{ page: 1 as const, position: 3 as const, borderColor: 'border-purple-500', headlineColor: 'text-purple-700', featured: false },
			{ page: 1 as const, position: 4 as const, borderColor: 'border-teal-500', headlineColor: 'text-teal-700', featured: false },
			{ page: 1 as const, position: 5 as const, borderColor: 'border-rose-500', headlineColor: 'text-rose-700', featured: false },
			// Page 2
			{ page: 2 as const, position: 1 as const, borderColor: 'border-orange-500', headlineColor: 'text-orange-700', featured: false },
			{ page: 2 as const, position: 2 as const, borderColor: 'border-indigo-500', headlineColor: 'text-indigo-700', featured: true },
			{ page: 2 as const, position: 3 as const, borderColor: 'border-pink-500', headlineColor: 'text-pink-700', featured: false },
			{ page: 2 as const, position: 4 as const, borderColor: 'border-cyan-500', headlineColor: 'text-cyan-700', featured: false },
			{ page: 2 as const, position: 5 as const, borderColor: 'border-lime-500', headlineColor: 'text-lime-700', featured: false },
		];

		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const dateOpts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
		const today = now.toLocaleDateString('en-US', dateOpts);
		const weekAgoStr = weekAgo.toLocaleDateString('en-US', dateOpts);
		const dateRange = `${weekAgoStr} – ${today}`;

		// Step 1a: Search for real news using grounding (no JSON constraint)
		const searchPrompt = `Today is ${today}. Search for and list the 10 biggest REAL news stories from ${weekAgoStr} to ${today}. Include a mix of: politics, science/technology, world events, business, sports, and environment. For each story, write 2-3 sentences summarizing what happened, including specific names, dates, and facts. These must be real, verifiable current events.`;

		console.log('[generate] Step 1a: Searching for real news with grounding...');
		const searchStartTime = Date.now();

		const searchResult = await genAI.models.generateContent({
			model: 'gemini-3-flash-preview',
			contents: searchPrompt,
			config: {
				temperature: 0.3,
				maxOutputTokens: 4096,
				tools: [{ googleSearch: {} }]
			}
		});

		const searchDuration = Date.now() - searchStartTime;
		const newsText = searchResult.text ?? '';
		console.log(`[generate] Search completed in ${searchDuration}ms, length: ${newsText.length}`);

		// Step 1b: Format the real news into kid-friendly JSON (no grounding needed)
		const formatPrompt = `You are a kids' newspaper editor. Here are today's real news stories:

${newsText}

Rewrite these stories for a ${readingLevel} reading level. Use short sentences and simple words. Keep real names of people and places. Be factually accurate but engaging. Help kids understand why the news matters.

Return ONLY valid JSON (no markdown, no code fences, no extra text). Your response must start with { and end with }.

Return exactly 10 articles: 2 featured articles (the most exciting stories, with 80-100 word bodyText) and 8 regular articles (45-55 word bodyText). Put the 2 featured articles first in the array, then the 8 regular articles.

Each article must have:
- "id": short kebab-case slug
- "headline": 3-8 words, fun and punchy, ending with ! or ?
- "bodyText": the article text
- "featured": true for the 2 featured articles, false for the rest
- "imageAlt": short description of what illustration would fit this article

JSON format:
{
  "title": "THE KIDS' WEEKLY NEWS",
  "subtitle": "Your weekly source for fun and fascinating stories!",
  "articles": [
    {
      "id": "example-slug",
      "headline": "Short Fun Headline!",
      "bodyText": "Simple sentences here...",
      "featured": true,
      "imageAlt": "A rocket launching into space"
    }
  ]
}`;

		console.log('[generate] Step 1b: Formatting news as kid-friendly JSON...');
		const formatStartTime = Date.now();

		const formatResult = await genAI.models.generateContent({
			model: 'gemini-3-flash-preview',
			contents: formatPrompt,
			config: {
				temperature: 0.7,
				maxOutputTokens: 8192,
			}
		});

		const formatDuration = Date.now() - formatStartTime;
		console.log(`[generate] Formatting completed in ${formatDuration}ms`);

		let text = formatResult.text ?? '';
		console.log('[generate] Raw response length:', text.length);

		// Clean up response — strip markdown fences if present
		text = text.trim();
		if (text.startsWith('```json')) {
			text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
		} else if (text.startsWith('```')) {
			text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
		}

		let rawData: { title: string; subtitle: string; articles: Array<{ id: string; headline: string; bodyText: string; featured?: boolean; imageAlt?: string }> };
		try {
			rawData = JSON.parse(text);
			console.log('[generate] JSON parsed successfully, articles:', rawData.articles?.length);
		} catch (parseErr) {
			console.error('[generate] JSON parse failed:', parseErr);
			console.error('[generate] Text that failed to parse:', text.substring(0, 500));
			return json({ error: 'Failed to parse Gemini response as JSON' }, { status: 500 });
		}

		// Assign layout properties (colors, positions, pages) to articles
		// Expected order: 2 featured first, then 8 regular
		const featured = rawData.articles.filter((a) => a.featured);
		const regular = rawData.articles.filter((a) => !a.featured);

		// Build ordered array: for each page, featured goes to position 2 (index 1), rest fill positions 1,3,4,5
		const orderedArticles = [
			regular[0], featured[0], regular[1], regular[2], regular[3], // Page 1
			regular[4], featured[1], regular[5], regular[6], regular[7], // Page 2
		];

		const newspaperData: NewspaperData = {
			title: rawData.title,
			subtitle: rawData.subtitle,
			dateRange,
			articles: orderedArticles.map((article, i) => {
				const layout = layoutConfig[i];
				return {
					id: article?.id ?? `article-${i}`,
					headline: article?.headline ?? 'News Story!',
					bodyText: article?.bodyText ?? '',
					images: [{ url: 'placeholder', alt: article?.imageAlt ?? article?.headline ?? '' }],
					borderColor: layout.borderColor,
					headlineColor: layout.headlineColor,
					page: layout.page,
					position: layout.position,
					featured: layout.featured,
				};
			}),
		};

		// Step 2: Generate images for each article in parallel using Gemini 3 Pro Image (nano banana)
		console.log('[generate] Generating images in parallel with gemini-3-pro-image-preview...');
		const imageStartTime = Date.now();

		const imagePromises = newspaperData.articles.map(async (article, index) => {
			const imagePrompt = `Generate an image: A child-friendly, colorful cartoon illustration for a kids' newspaper article about: ${article.headline}. ${article.bodyText.substring(0, 100)}. Style: bright colors, simple shapes, friendly characters, suitable for children ages 6-10, newspaper illustration style, no text or words in the image.`;

			try {
				console.log(`[generate] Generating image ${index + 1}/10: "${article.id}"`);
				const imageResult = await genAI.models.generateContent({
					model: 'gemini-3-pro-image-preview',
					contents: imagePrompt,
					config: {
						responseModalities: ['IMAGE', 'TEXT']
					}
				});

				// Extract the generated image from response candidates
				// Gemini 3 Pro Image returns inline data in the parts array
				const candidates = imageResult?.candidates;
				if (candidates && candidates.length > 0) {
					const parts = candidates[0]?.content?.parts || [];
					for (const part of parts) {
						// Check for inline image data
						if (part.inlineData?.data) {
							const mimeType = part.inlineData.mimeType || 'image/png';
							console.log(`[generate] Image ${index + 1} generated successfully (${mimeType})`);
							return {
								index,
								url: `data:${mimeType};base64,${part.inlineData.data}`,
								alt: article.images?.[0]?.alt || article.headline
							};
						}
					}
				}

				// Log what we got back for debugging
				console.log(`[generate] Image ${index + 1} response structure:`, JSON.stringify(imageResult, null, 2).substring(0, 500));
				throw new Error('No image data in response');
			} catch (error) {
				console.error(`[generate] Image ${index + 1} failed:`, error);
				// Fallback to placeholder
				return {
					index,
					url: `https://placehold.co/400x300/f59e0b/white?text=${encodeURIComponent(article.headline.substring(0, 20))}`,
					alt: article.images?.[0]?.alt || article.headline
				};
			}
		});

		const imageResults = await Promise.all(imagePromises);
		const imageDuration = Date.now() - imageStartTime;
		console.log(`[generate] All images generated in ${imageDuration}ms`);

		// Step 3: Update articles with generated image URLs
		const articlesWithImages: Article[] = newspaperData.articles.map((article, index) => {
			const imageResult = imageResults.find((r) => r.index === index);
			return {
				...article,
				images: [
					{
						url: imageResult?.url || 'placeholder',
						alt: imageResult?.alt || article.images?.[0]?.alt || article.headline
					}
				]
			};
		});

		const finalData: NewspaperData = {
			...newspaperData,
			articles: articlesWithImages
		};

		const totalDuration = Date.now() - startTime;
		console.log(`[generate] Complete. Total time: ${totalDuration}ms`);

		return json(finalData);
	} catch (err) {
		const totalDuration = Date.now() - startTime;
		console.error(`[generate] ERROR after ${totalDuration}ms:`, err);
		return json(
			{
				error: 'Failed to generate newspaper',
				details: err instanceof Error ? err.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
