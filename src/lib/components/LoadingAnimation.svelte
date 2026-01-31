<script lang="ts">
	import { onMount } from 'svelte';

	const loadingMessages = [
		"Searching for today's coolest news...",
		'Finding stories just for you...',
		'Making news fun to read...',
		'Drawing awesome pictures...',
		'Putting together your newspaper...',
		'Adding the finishing touches...',
		'Almost ready for print...'
	];

	let currentFact = $state('Loading fun facts...');
	let currentMessage = $state(loadingMessages[0]);
	let messageIndex = $state(0);
	let progress = $state(0);

	onMount(() => {
		let factInterval: ReturnType<typeof setInterval>;

		// Load fun facts lazily
		import('$lib/data/funFacts').then(({ funFacts }) => {
			currentFact = funFacts[Math.floor(Math.random() * funFacts.length)];
			factInterval = setInterval(() => {
				currentFact = funFacts[Math.floor(Math.random() * funFacts.length)];
			}, 5000);
		});

		// Progress through loading messages
		const messageInterval = setInterval(() => {
			messageIndex = Math.min(messageIndex + 1, loadingMessages.length - 1);
			currentMessage = loadingMessages[messageIndex];
		}, 8000);

		// Animate progress bar
		const progressInterval = setInterval(() => {
			progress = Math.min(progress + 1, 95);
		}, 600);

		return () => {
			clearInterval(factInterval);
			clearInterval(messageInterval);
			clearInterval(progressInterval);
		};
	});
</script>

<div class="flex min-h-[400px] flex-col items-center justify-center gap-8 p-8">
	<!-- Animated Newspaper -->
	<div class="newspaper-animation">
		<div class="newspaper">
			<div class="newspaper-line"></div>
			<div class="newspaper-line short"></div>
			<div class="newspaper-line"></div>
			<div class="newspaper-line short"></div>
			<div class="newspaper-line"></div>
		</div>
		<div class="sparkles">
			<span class="sparkle">✨</span>
			<span class="sparkle delay-1">⭐</span>
			<span class="sparkle delay-2">✨</span>
			<span class="sparkle delay-3">🌟</span>
		</div>
	</div>

	<!-- Loading Message -->
	<div class="text-center">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">{currentMessage}</h2>
		<p class="text-gray-500">This takes about 45-60 seconds</p>
	</div>

	<!-- Progress Bar -->
	<div class="w-full max-w-md">
		<div class="h-4 overflow-hidden rounded-full bg-gray-200">
			<div
				class="progress-bar h-full rounded-full transition-all duration-500"
				style="width: {progress}%"
			></div>
		</div>
		<p class="mt-2 text-center text-sm text-gray-500">{progress}%</p>
	</div>

	<!-- Fun Fact -->
	<div class="max-w-md rounded-xl bg-amber-50 p-4 text-center shadow-md">
		<p class="text-sm font-medium text-amber-800">While you wait...</p>
		<p class="mt-1 text-lg text-gray-700">{currentFact}</p>
	</div>

	<!-- Bouncing Icons -->
	<div class="flex gap-4">
		<span class="bounce-icon">📰</span>
		<span class="bounce-icon delay-1">✏️</span>
		<span class="bounce-icon delay-2">🎨</span>
		<span class="bounce-icon delay-3">📸</span>
		<span class="bounce-icon delay-4">🖨️</span>
	</div>
</div>

<style>
	/* Newspaper animation */
	.newspaper-animation {
		position: relative;
		width: 120px;
		height: 140px;
	}

	.newspaper {
		width: 100px;
		height: 120px;
		background: white;
		border-radius: 4px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		animation: float 2s ease-in-out infinite;
	}

	.newspaper-line {
		height: 8px;
		background: linear-gradient(90deg, #e5e7eb, #d1d5db, #e5e7eb);
		background-size: 200% 100%;
		border-radius: 4px;
		animation: shimmer 1.5s infinite;
	}

	.newspaper-line.short {
		width: 60%;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(-2deg);
		}
		50% {
			transform: translateY(-10px) rotate(2deg);
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	/* Sparkles */
	.sparkles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.sparkle {
		position: absolute;
		font-size: 20px;
		animation: sparkle 2s ease-in-out infinite;
	}

	.sparkle:nth-child(1) {
		top: -10px;
		left: 50%;
	}
	.sparkle:nth-child(2) {
		top: 30%;
		right: -20px;
	}
	.sparkle:nth-child(3) {
		bottom: 10px;
		left: -15px;
	}
	.sparkle:nth-child(4) {
		bottom: -10px;
		right: 20%;
	}

	@keyframes sparkle {
		0%,
		100% {
			opacity: 0;
			transform: scale(0.5);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
	}

	.sparkle.delay-1 {
		animation-delay: 0.5s;
	}
	.sparkle.delay-2 {
		animation-delay: 1s;
	}
	.sparkle.delay-3 {
		animation-delay: 1.5s;
	}

	/* Progress bar */
	.progress-bar {
		background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
		background-size: 300% 100%;
		animation: gradient 2s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	/* Bouncing icons */
	.bounce-icon {
		font-size: 24px;
		animation: bounce 1s ease-in-out infinite;
	}

	.bounce-icon.delay-1 {
		animation-delay: 0.1s;
	}
	.bounce-icon.delay-2 {
		animation-delay: 0.2s;
	}
	.bounce-icon.delay-3 {
		animation-delay: 0.3s;
	}
	.bounce-icon.delay-4 {
		animation-delay: 0.4s;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-15px);
		}
	}
</style>
