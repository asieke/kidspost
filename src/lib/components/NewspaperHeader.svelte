<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
	}

	let { title, subtitle }: Props = $props();

	const wordColors: Record<string, string> = {
		THE: 'text-red-500',
		"KIDS'": 'text-teal-500',
		WEEKLY: 'text-green-500',
		NEWS: 'text-orange-500'
	};
</script>

<header class="border-b-4 border-double border-gray-800 pb-3 text-center">
	<h1 class="font-headline text-6xl tracking-wide">
		{#each title.split(' ') as word, i (i)}
			<span class={wordColors[word] || 'text-gray-800'}>{word}</span>
			{#if i < title.split(' ').length - 1}
				&nbsp;
			{/if}
		{/each}
	</h1>
	<p class="font-body mt-1 text-base text-gray-600">{subtitle}</p>
</header>
