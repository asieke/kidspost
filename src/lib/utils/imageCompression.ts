const MAX_WIDTH = 600;
const QUALITY = 0.7;

/**
 * Compress an image URL using canvas.
 * Returns a compressed data URL (WebP with JPEG fallback).
 */
export async function compressImageUrl(url: string): Promise<string> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			const scale = Math.min(1, MAX_WIDTH / img.naturalWidth);
			const width = Math.round(img.naturalWidth * scale);
			const height = Math.round(img.naturalHeight * scale);

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve(url);
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);

			// Try WebP first, fall back to JPEG
			let dataUrl = canvas.toDataURL('image/webp', QUALITY);
			if (!dataUrl.startsWith('data:image/webp')) {
				dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
			}

			resolve(dataUrl);
		};
		img.onerror = () => resolve(url);
		img.src = url;
	});
}

/**
 * Compress all images in a NewspaperData object.
 */
export async function compressNewspaperImages(
	articles: { images: { url: string; alt: string }[] }[]
): Promise<void> {
	const tasks: Promise<void>[] = [];

	for (const article of articles) {
		for (const image of article.images) {
			if (image.url && !image.url.startsWith('data:')) {
				tasks.push(
					compressImageUrl(image.url).then((compressed) => {
						image.url = compressed;
					})
				);
			}
		}
	}

	await Promise.all(tasks);
}
