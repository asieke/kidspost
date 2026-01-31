<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
	<div class="flex max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-2xl">
		<div class="text-6xl">📰</div>
		<h1 class="font-headline text-3xl text-gray-800">Oops!</h1>
		<p class="text-lg text-gray-600">
			{#if page.status === 404}
				We couldn't find that page. It might have blown away in the wind!
			{:else}
				Something went wrong. Even the best newspapers have off days!
			{/if}
		</p>
		{#if page.error?.message}
			<p class="text-sm text-gray-400">{page.error.message}</p>
		{/if}
		<a
			href="/"
			class="rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
		>
			Go Home
		</a>
	</div>
</div>
