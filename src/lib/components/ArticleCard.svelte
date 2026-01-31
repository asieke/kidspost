<script lang="ts">
	import type { Article } from '$lib/types';

	interface Props {
		article: Article;
	}

	let { article }: Props = $props();
</script>

<article class="flex h-full flex-col gap-2 rounded border-l-4 bg-white p-3 shadow-sm {article.borderColor}">
	<h2 class="font-body leading-tight font-bold {article.headlineColor} {article.featured ? 'text-xl' : 'text-base'}">
		{article.headline}
	</h2>
	{#each article.images as image (image.url)}
		<img
			src={image.url}
			alt={image.alt}
			class="w-full rounded object-cover"
		/>
	{/each}
	<p class="font-body leading-snug text-gray-700 {article.featured ? 'text-sm' : 'text-xs'}">
		{article.bodyText}
	</p>
</article>
