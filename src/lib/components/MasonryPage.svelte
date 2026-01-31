<script lang="ts">
	import type { Article } from '$lib/types';

	interface Props {
		articles: Article[];
		showHeader?: boolean;
		showHeaderOnPrint?: boolean;
		title?: string;
		subtitle?: string;
		dateRange?: string;
	}

	let {
		articles,
		showHeader = false,
		showHeaderOnPrint = false,
		title = '',
		subtitle = '',
		dateRange = ''
	}: Props = $props();

	// Get article by position (1-5)
	function getArticle(position: number): Article | undefined {
		return articles.find((a) => a.position === position);
	}

	const pos1 = $derived(getArticle(1));
	const pos2 = $derived(getArticle(2)); // Featured - spans 2 rows
	const pos3 = $derived(getArticle(3));
	const pos4 = $derived(getArticle(4));
	const pos5 = $derived(getArticle(5));

	// Sort articles for mobile: featured first, then rest
	const sortedArticles = $derived([pos2, pos1, pos3, pos4, pos5].filter(Boolean) as Article[]);
</script>

<!-- Mobile View: Floating cards -->
<div class="mobile-view">
	{#if showHeader}
		<header class="mb-4 rounded-xl bg-amber-50 p-4 text-center shadow-lg">
			<h1 class="font-headline text-3xl tracking-wide text-gray-900">
				{title}
			</h1>
			<p class="font-body text-sm text-gray-600 italic">
				{subtitle}
			</p>
			{#if dateRange}
				<div class="mt-1 flex items-center justify-center gap-2 text-xs text-gray-500">
					<span>★</span>
					<span>{dateRange}</span>
					<span>★</span>
				</div>
			{/if}
		</header>
	{/if}

	<div class="mobile-cards">
		{#each sortedArticles as article (article.id)}
			<article
				class="mobile-card rounded-xl border-l-4 bg-white p-4 shadow-lg {article.borderColor}"
				class:featured={article.featured}
			>
				<h2
					class="mb-2 font-body leading-tight font-bold {article.headlineColor} {article.featured
						? 'text-xl'
						: 'text-lg'}"
				>
					{article.headline}
				</h2>
				{#if article.images.length > 0}
					<img
						src={article.images[0].url}
						alt={article.images[0].alt}
						loading="lazy"
						decoding="async"
						width="600"
						height="400"
						class="mb-3 w-full rounded-lg object-cover {article.featured ? 'max-h-64' : 'max-h-48'}"
					/>
				{/if}
				<p
					class="font-body leading-relaxed text-gray-700 {article.featured
						? 'text-base'
						: 'text-sm'}"
				>
					{article.bodyText}
				</p>
			</article>
		{/each}
	</div>
</div>

<!-- Print View: Fixed 2-page layout -->
<div class="print-view page flex flex-col overflow-hidden bg-amber-50 p-6 shadow-xl">
	{#if showHeader}
		<header class="mb-3 border-b-4 border-double border-gray-800 pb-2 text-center">
			<h1 class="font-headline text-4xl tracking-wide text-gray-900">
				{title}
			</h1>
			<p class="font-body text-sm text-gray-600 italic">
				{subtitle}
			</p>
			{#if dateRange}
				<div class="flex items-center justify-center gap-2 text-xs text-gray-500">
					<span>★</span>
					<span>{dateRange}</span>
					<span>★</span>
				</div>
			{/if}
		</header>
	{/if}

	{#if showHeaderOnPrint}
		<header
			class="print-only-header mb-3 border-b-4 border-double border-gray-800 pb-2 text-center"
		>
			<h1 class="font-headline text-4xl tracking-wide text-gray-900">
				{title}
			</h1>
			<p class="font-body text-sm text-gray-600 italic">
				{subtitle}
			</p>
			{#if dateRange}
				<div class="flex items-center justify-center gap-2 text-xs text-gray-500">
					<span>★</span>
					<span>{dateRange}</span>
					<span>★</span>
				</div>
			{/if}
		</header>
	{/if}

	<!-- Grid Layout: |1|2| |3|2| |4|5| -->
	<div class="newspaper-grid flex-1">
		{#if pos1}
			<div class="grid-pos-1">
				<article
					class="flex h-full flex-col overflow-hidden rounded border-l-4 bg-white p-3 shadow-sm {pos1.borderColor}"
				>
					<h2 class="mb-1 font-body text-lg leading-tight font-bold {pos1.headlineColor}">
						{pos1.headline}
					</h2>
					{#if pos1.images.length > 0}
						<img
							src={pos1.images[0].url}
							alt={pos1.images[0].alt}
							loading="lazy"
							decoding="async"
							width="600"
							height="400"
							class="img-small mb-2 w-full rounded object-cover"
						/>
					{/if}
					<p class="article-text font-body text-sm leading-snug text-gray-700">
						{pos1.bodyText}
					</p>
				</article>
			</div>
		{/if}

		{#if pos2}
			<div class="grid-pos-2">
				<article
					class="flex h-full flex-col overflow-hidden rounded border-l-4 bg-white p-4 shadow-md {pos2.borderColor}"
				>
					<h2 class="mb-2 font-body text-2xl leading-tight font-bold {pos2.headlineColor}">
						{pos2.headline}
					</h2>
					{#if pos2.images.length > 0}
						<img
							src={pos2.images[0].url}
							alt={pos2.images[0].alt}
							loading="lazy"
							decoding="async"
							width="600"
							height="400"
							class="img-featured mb-2 w-full rounded object-cover"
						/>
					{/if}
					<p class="article-text font-body text-lg leading-snug text-gray-700">
						{pos2.bodyText}
					</p>
				</article>
			</div>
		{/if}

		{#if pos3}
			<div class="grid-pos-3">
				<article
					class="flex h-full flex-col overflow-hidden rounded border-l-4 bg-white p-3 shadow-sm {pos3.borderColor}"
				>
					<h2 class="mb-1 font-body text-lg leading-tight font-bold {pos3.headlineColor}">
						{pos3.headline}
					</h2>
					{#if pos3.images.length > 0}
						<img
							src={pos3.images[0].url}
							alt={pos3.images[0].alt}
							loading="lazy"
							decoding="async"
							width="600"
							height="400"
							class="img-small mb-2 w-full rounded object-cover"
						/>
					{/if}
					<p class="article-text font-body text-sm leading-snug text-gray-700">
						{pos3.bodyText}
					</p>
				</article>
			</div>
		{/if}

		{#if pos4}
			<div class="grid-pos-4">
				<article
					class="flex h-full flex-col overflow-hidden rounded border-l-4 bg-white p-3 shadow-sm {pos4.borderColor}"
				>
					<h2 class="mb-1 font-body text-lg leading-tight font-bold {pos4.headlineColor}">
						{pos4.headline}
					</h2>
					{#if pos4.images.length > 0}
						<img
							src={pos4.images[0].url}
							alt={pos4.images[0].alt}
							loading="lazy"
							decoding="async"
							width="600"
							height="400"
							class="img-small mb-2 w-full rounded object-cover"
						/>
					{/if}
					<p class="article-text font-body text-sm leading-snug text-gray-700">
						{pos4.bodyText}
					</p>
				</article>
			</div>
		{/if}

		{#if pos5}
			<div class="grid-pos-5">
				<article
					class="flex h-full flex-col overflow-hidden rounded border-l-4 bg-white p-3 shadow-sm {pos5.borderColor}"
				>
					<h2 class="mb-1 font-body text-lg leading-tight font-bold {pos5.headlineColor}">
						{pos5.headline}
					</h2>
					{#if pos5.images.length > 0}
						<img
							src={pos5.images[0].url}
							alt={pos5.images[0].alt}
							loading="lazy"
							decoding="async"
							width="600"
							height="400"
							class="img-small mb-2 w-full rounded object-cover"
						/>
					{/if}
					<p class="article-text font-body text-sm leading-snug text-gray-700">
						{pos5.bodyText}
					</p>
				</article>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Mobile view - show by default, hide on larger screens and print */
	.mobile-view {
		display: block;
		padding: 1rem;
	}

	.mobile-cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.mobile-card {
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.mobile-card:active {
		transform: scale(0.98);
	}

	.mobile-card.featured {
		background: linear-gradient(135deg, #fef3c7 0%, #ffffff 50%);
	}

	/* Print view - hide by default, show on larger screens and print */
	.print-view {
		display: none;
	}

	/* Page 2 print-only header: hidden on screen */
	.print-only-header {
		display: none;
	}

	/* Desktop: show print-ready layout */
	@media (min-width: 900px) {
		.mobile-view {
			display: none;
		}

		.print-view {
			display: flex;
			width: 816px;
			height: 1056px;
		}
	}

	/* Print: always show print layout */
	@media print {
		.mobile-view {
			display: none !important;
		}

		.print-view {
			display: flex !important;
			width: 816px !important;
			height: 1056px !important;
			margin: 0 !important;
			padding: 1.5rem !important; /* Ensure p-6 is maintained/enforced */
			border: none !important; /* Remove any borders that might add width */
			box-shadow: none !important;
		}

		.print-only-header {
			display: block !important;
		}
	}

	/* Print grid layout */
	.newspaper-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 0.5rem;
		overflow: hidden;
		grid-template-areas:
			'pos1 pos2'
			'pos3 pos2'
			'pos4 pos5';
	}

	.grid-pos-1 {
		grid-area: pos1;
		min-height: 0;
		overflow: hidden;
	}
	.grid-pos-2 {
		grid-area: pos2;
		min-height: 0;
		overflow: hidden;
	}
	.grid-pos-3 {
		grid-area: pos3;
		min-height: 0;
		overflow: hidden;
	}
	.grid-pos-4 {
		grid-area: pos4;
		min-height: 0;
		overflow: hidden;
	}
	.grid-pos-5 {
		grid-area: pos5;
		min-height: 0;
		overflow: hidden;
	}

	/* Image constraints for print - percentage based */
	.img-small {
		max-height: 50%;
		flex-shrink: 1;
		min-height: 0;
	}
	.img-featured {
		max-height: 50%;
		flex-shrink: 1;
		min-height: 0;
	}

	/* Flexible text truncation - let flexbox handle overflow */
	.article-text {
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}
</style>
