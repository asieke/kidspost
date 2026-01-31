<script lang="ts">
	import { onMount } from 'svelte';
	import MasonryPage from '$lib/components/MasonryPage.svelte';
	import LoadingAnimation from '$lib/components/LoadingAnimation.svelte';
	import type { NewspaperData } from '$lib/types';
	import { db, type SavedNewspaper } from '$lib/db';

	let newspaperData = $state<NewspaperData | null>(null);
	let gradeLevel = $state('2');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let savedNewspapers = $state<SavedNewspaper[]>([]);
	let showSavedList = $state(false);

	// API Key state (BYOK)
	let apiKey = $state('');
	let showApiKeyInput = $state(false);
	let apiKeyLoaded = $state(false);
	const API_KEY_STORAGE_KEY = 'kidspost_google_api_key';
	let apiKeySaveTimeout: ReturnType<typeof setTimeout> | null = null;

	const gradeOptions = [
		{ value: '1', label: '1st Grade' },
		{ value: '2', label: '2nd Grade' },
		{ value: '3', label: '3rd Grade' },
		{ value: '4', label: '4th Grade' },
		{ value: '5', label: '5th Grade' }
	];

	// Load saved newspapers and API key on mount
	onMount(() => {
		loadSavedNewspapers();
		loadApiKey();
	});

	async function loadApiKey() {
		try {
			await db.open();
			let setting = await db.settings.get(API_KEY_STORAGE_KEY);
			console.log('[client] Loading API key from IndexedDB:', setting ? 'found' : 'not found');

			// Fallback/migration: if the key exists in localStorage, copy it into IndexedDB
			if (!setting && typeof window !== 'undefined') {
				const stored = window.localStorage.getItem(API_KEY_STORAGE_KEY);
				if (stored) {
					await db.settings.put({ key: API_KEY_STORAGE_KEY, value: stored });
					setting = { key: API_KEY_STORAGE_KEY, value: stored };
					console.log('[client] Migrated API key from localStorage to IndexedDB');
				}
			}

			if (setting) {
				apiKey = setting.value;
				// Mirror to localStorage for easy visibility in DevTools
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(API_KEY_STORAGE_KEY, setting.value);
				}
			}
		} catch (err) {
			console.error('[client] Failed to load API key:', err);
		} finally {
			apiKeyLoaded = true;
		}
	}

	async function saveApiKey(shouldClose = true) {
		try {
			await db.open();
			await db.settings.put({ key: API_KEY_STORAGE_KEY, value: apiKey });
			console.log('[client] Saved API key to IndexedDB');
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
			}
			if (shouldClose) {
				showApiKeyInput = false;
			}
		} catch (err) {
			console.error('[client] Failed to save API key:', err);
			// Best-effort fallback
			if (typeof window !== 'undefined') {
				try {
					window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
				} catch (fallbackErr) {
					console.error('[client] Failed to save API key to localStorage:', fallbackErr);
				}
			}
		}
	}

	function scheduleApiKeySave() {
		if (!apiKey) return;
		if (apiKeySaveTimeout) {
			clearTimeout(apiKeySaveTimeout);
		}
		apiKeySaveTimeout = setTimeout(() => {
			void saveApiKey(false);
		}, 300);
	}

	async function clearApiKey() {
		try {
			await db.open();
			await db.settings.delete(API_KEY_STORAGE_KEY);
			console.log('[client] Cleared API key from IndexedDB');
		} catch (err) {
			console.error('[client] Failed to clear API key:', err);
		} finally {
			apiKey = '';
			if (typeof window !== 'undefined') {
				try {
					window.localStorage.removeItem(API_KEY_STORAGE_KEY);
				} catch (fallbackErr) {
					console.error('[client] Failed to clear API key from localStorage:', fallbackErr);
				}
			}
		}
	}

	async function loadSavedNewspapers() {
		try {
			// Get all newspapers, sorted by timestamp descending (most recent first)
			const newspapers = await db.newspapers.orderBy('timestamp').reverse().toArray();
			savedNewspapers = newspapers;
			console.log('[client] Loaded', savedNewspapers.length, 'saved newspapers from IndexedDB');
		} catch (err) {
			console.error('[client] Failed to load saved newspapers:', err);
			savedNewspapers = [];
		}
	}

	async function saveNewspaper(data: NewspaperData, grade: string) {
		const saved: SavedNewspaper = {
			id: crypto.randomUUID(),
			timestamp: Date.now(),
			gradeLevel: grade,
			data
		};

		try {
			// Save to IndexedDB
			await db.newspapers.add(saved);
			console.log('[client] Saved newspaper to IndexedDB');

			// Reload the list to update UI
			await loadSavedNewspapers();

			// Keep only the last 20 newspapers (IndexedDB can handle much more)
			const count = await db.newspapers.count();
			if (count > 20) {
				// Get the oldest newspapers and delete them
				const oldest = await db.newspapers
					.orderBy('timestamp')
					.limit(count - 20)
					.toArray();
				const idsToDelete = oldest.map((n) => n.id);
				await db.newspapers.bulkDelete(idsToDelete);
				console.log('[client] Cleaned up', idsToDelete.length, 'old newspapers');
				await loadSavedNewspapers();
			}
		} catch (err) {
			console.error('[client] Failed to save newspaper:', err);
		}
	}

	function loadNewspaper(saved: SavedNewspaper) {
		newspaperData = saved.data;
		showSavedList = false;
		console.log('[client] Loaded newspaper from', new Date(saved.timestamp).toLocaleString());
	}

	async function deleteNewspaper(id: string) {
		try {
			await db.newspapers.delete(id);
			savedNewspapers = savedNewspapers.filter((n) => n.id !== id);
			console.log('[client] Deleted newspaper from IndexedDB');
		} catch (err) {
			console.error('[client] Failed to delete newspaper:', err);
		}
	}

	function formatDate(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function getGradeLabel(grade: string): string {
		return gradeOptions.find((o) => o.value === grade)?.label || `Grade ${grade}`;
	}

	function goBack() {
		newspaperData = null;
	}

	async function generateNewspaper() {
		if (isLoading) return;

		if (!apiKey) {
			error = 'Please enter your Google API key first';
			showApiKeyInput = true;
			return;
		}

		isLoading = true;
		error = null;
		console.log('[client] Generating newspaper for grade level:', gradeLevel);
		const startTime = performance.now();

		try {
			console.log('[client] Sending POST to /api/generate...');
			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ gradeLevel, apiKey })
			});

			const elapsed = Math.round(performance.now() - startTime);
			console.log(`[client] Response received: ${response.status} in ${elapsed}ms`);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('[client] Error response:', errorData);
				throw new Error(errorData.error || 'Failed to generate newspaper');
			}

			const data: NewspaperData = await response.json();
			console.log('[client] Parsed data, articles:', data.articles?.length);
			console.log(
				'[client] Article IDs:',
				data.articles?.map((a) => a.id)
			);

			// Save to IndexedDB
			await saveNewspaper(data, gradeLevel);

			newspaperData = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			console.error('[client] Error:', err);
		} finally {
			isLoading = false;
			const total = Math.round(performance.now() - startTime);
			console.log(`[client] Done. Total: ${total}ms`);
		}
	}

	// Split articles by page field (5 articles per page)
	// Layout per page: |1|2| |3|2| |4|5| where 2 is featured (spans 2 rows)
	const page1Articles = $derived(newspaperData?.articles.filter((a) => a.page === 1) || []);
	const page2Articles = $derived(newspaperData?.articles.filter((a) => a.page === 2) || []);
</script>

<div class="print-wrapper min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
	{#if isLoading}
		<!-- Loading Animation -->
		<div class="flex min-h-screen items-center justify-center p-4">
			<div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
				<LoadingAnimation />
			</div>
		</div>
	{:else if !newspaperData}
		<!-- Generate UI -->
		<div class="flex min-h-screen items-center justify-center p-4">
			<div
				class="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
			>
				<h1 class="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
					📰 Kids' Weekly News
				</h1>
				<p class="text-center text-gray-600">
					Generate a personalized newspaper for your grade level!
				</p>

				{#if !showSavedList}
					<!-- Main Generation Form -->
					<div class="flex w-full flex-col gap-4">
						<!-- API Key Section -->
						{#if !apiKeyLoaded}
							<div class="flex justify-center py-4">
								<div
									class="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
								></div>
							</div>
						{:else if !apiKey || showApiKeyInput}
							<div class="rounded border border-amber-200 bg-amber-50 p-4">
								<label for="api-key" class="block text-sm font-medium text-gray-700">
									🔑 Google API Key (required)
								</label>
								<p class="mb-2 text-xs text-gray-500">
									Get your key from <a
										href="https://aistudio.google.com/apikey"
										target="_blank"
										class="text-blue-600 underline">Google AI Studio</a
									>
								</p>
								<input
									id="api-key"
									type="password"
									bind:value={apiKey}
									oninput={scheduleApiKeySave}
									onpaste={scheduleApiKeySave}
									placeholder="Enter your Google API key"
									class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
								/>
								<div class="mt-2 flex gap-2">
									<button
										onclick={() => saveApiKey(true)}
										disabled={!apiKey}
										class="rounded bg-green-600 px-4 py-1 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
									>
										Save Key
									</button>
									{#if apiKey && showApiKeyInput}
										<button
											onclick={() => (showApiKeyInput = false)}
											class="rounded bg-gray-200 px-4 py-1 text-sm text-gray-700 hover:bg-gray-300"
										>
											Cancel
										</button>
									{/if}
								</div>
							</div>
						{:else}
							<div
								class="flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2 text-sm"
							>
								<span class="text-green-700">✓ API Key saved</span>
								<div class="flex gap-2">
									<button
										onclick={() => (showApiKeyInput = true)}
										class="text-blue-600 hover:text-blue-800"
									>
										Change
									</button>
									<button onclick={clearApiKey} class="text-red-600 hover:text-red-800">
										Clear
									</button>
								</div>
							</div>
						{/if}

						<label for="grade-select" class="text-sm font-medium text-gray-700">
							Select Grade Level:
						</label>
						<select
							id="grade-select"
							bind:value={gradeLevel}
							disabled={isLoading}
							class="rounded border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
						>
							{#each gradeOptions as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>

						<button
							onclick={generateNewspaper}
							disabled={isLoading || !apiKey || !apiKeyLoaded}
							class="rounded bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
						>
							{isLoading ? 'Generating...' : 'Generate New Newspaper'}
						</button>

						{#if savedNewspapers.length > 0}
							<div class="mt-2 border-t border-gray-200 pt-4">
								<button
									onclick={() => (showSavedList = true)}
									class="w-full rounded border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50"
								>
									📰 Load Saved Newspaper ({savedNewspapers.length})
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Saved Newspapers List -->
					<div class="flex w-full flex-col gap-4">
						<div class="flex items-center justify-between">
							<h2 class="text-xl font-semibold text-gray-800">Saved Newspapers</h2>
							<button
								onclick={() => (showSavedList = false)}
								class="text-sm text-blue-600 hover:text-blue-800"
							>
								← Back
							</button>
						</div>

						{#if savedNewspapers.length === 0}
							<p class="py-4 text-center text-gray-500">No saved newspapers yet.</p>
						{:else}
							<div class="flex max-h-[400px] flex-col gap-2 overflow-y-auto">
								{#each savedNewspapers as saved (saved.id)}
									<div
										class="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-3"
									>
										<button
											onclick={() => loadNewspaper(saved)}
											class="flex-1 text-left hover:text-blue-600"
										>
											<div class="font-medium">{formatDate(saved.timestamp)}</div>
											<div class="text-sm text-gray-500">{getGradeLabel(saved.gradeLevel)}</div>
										</button>
										<button
											onclick={() => deleteNewspaper(saved.id)}
											class="rounded p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
											title="Delete"
										>
											🗑️
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				{#if error}
					<div class="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
						<p class="font-medium">Error:</p>
						<p class="text-sm">{error}</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Newspaper Display -->
		<div class="newspaper-display">
			<!-- Back/Print buttons (hidden when printing) -->
			<div
				class="sticky top-0 z-10 flex justify-center gap-3 bg-gradient-to-b from-white/90 to-white/0 p-4 print:hidden"
			>
				<button
					onclick={goBack}
					class="rounded-full bg-gray-700 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl"
				>
					← Back
				</button>
				<button
					onclick={() => window.print()}
					class="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
				>
					🖨️ Print Newspaper
				</button>
			</div>

			<!-- Page 1: Header + 5 articles -->
			<MasonryPage
				articles={page1Articles}
				showHeader={true}
				title={newspaperData.title}
				subtitle={newspaperData.subtitle}
				dateRange={newspaperData.dateRange}
			/>

			<!-- Page 2: 5 articles (header only shows in print) -->
			<MasonryPage
				articles={page2Articles}
				showHeader={false}
				showHeaderOnPrint={true}
				title={newspaperData.title}
				subtitle={newspaperData.subtitle}
				dateRange={newspaperData.dateRange}
			/>
		</div>
	{/if}
</div>

<style>
	.newspaper-display {
		min-height: 100vh;
		padding-bottom: 2rem;
	}

	/* Desktop: center the pages */
	@media (min-width: 900px) {
		.newspaper-display {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 2rem;
			padding: 2rem;
			background: #d1d5db;
		}
	}

	/* Print styles */
	@media print {
		.newspaper-display {
			padding: 0;
			gap: 0;
			background: none;
		}
	}
</style>
