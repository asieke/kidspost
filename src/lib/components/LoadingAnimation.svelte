<script lang="ts">
	import { onMount } from 'svelte';

	const funFacts = [
		'🦕 Did you know? T-Rex had tiny arms but could still do push-ups!',
		'🌈 Rainbows are actually full circles - we just see half from the ground!',
		'🐙 Octopuses have three hearts and blue blood!',
		'🚀 A day on Venus is longer than a year on Venus!',
		'🦋 Butterflies taste with their feet!',
		'🌙 The Moon is slowly drifting away from Earth!',
		"🐘 Elephants are the only animals that can't jump!",
		'⭐ There are more stars in the universe than grains of sand on Earth!',
		'🦈 Sharks have been around longer than trees!',
		'🍯 Honey never spoils - 3000-year-old honey is still edible!',
		'🐧 Penguins propose with pebbles!',
		'🌊 The ocean has more historical artifacts than all museums combined!',
		'🦜 Parrots can live for over 80 years!',
		'🌺 Sunflowers face the sun and follow it across the sky!',
		'🐬 Dolphins sleep with one eye open!',
		'🦒 Giraffes have the same number of neck bones as humans (7)!',
		'🍎 Apples float in water because they are 25% air!',
		'🦥 Sloths take two weeks to digest a single meal!',
		'🐢 Some turtles can breathe through their butts!',
		'🍦 Ice cream was once called "cream ice"!',
		'🐝 Bees can fly higher than Mount Everest!',
		'🐄 Cows have "best friends" and get stressed when separated!',
		'🐊 Alligators can live for up to 100 years!',
		'🐦 Hummingbirds are the only birds that can fly backwards!',
		'🍓 Strawberries are the only fruit with seeds on the outside!',
		'⚡ Lightning is five times hotter than the surface of the sun!',
		'🍟 French fries actually come from Belgium!',
		'🐈 Cats have 32 muscles in each ear!',
		'🐾 Polar bear skin is actually black, and their fur is clear!',
		'🌋 The largest volcano in our solar system is on Mars!',
		'🍫 White chocolate isn’t technically chocolate!',
		'🐜 Ants never sleep and don’t have lungs!',
		'🐀 Rats laugh when you tickle them!',
		'🐼 Giant pandas eat up to 28 pounds of bamboo a day!',
		'🐍 Some snakes can fly (gliding through the air)!',
		'🐨 Koalas have fingerprints just like humans!',
		'🍉 Watermelons are technically berries, but strawberries aren’t!',
		'🐚 A snail can sleep for three years!',
		'🦉 Owls don’t have eyeballs; they have "eye tubes"!',
		'🦐 A shrimp’s heart is in its head!',
		'🐎 Seahorses are the only fish that swim upright!',
		'🌲 Some pinecones stay on trees for 10 years before falling!',
		'🍿 Popcorn was invented over 5,000 years ago!',
		'🦍 Gorillas can catch human colds!',
		'🦎 Chameleons can move their eyes in two different directions at once!',
		'🦴 Babies are born with 300 bones, but adults only have 206!',
		'🍌 Bananas grow pointing towards the sun!',
		'🐺 A wolf can smell its prey from nearly two miles away!',
		'🐆 A cheetah can go from 0 to 60 mph in just three seconds!',
		'🐪 Camels have three eyelids to protect their eyes from sand!',
		'🧤 Your funny bone is actually a nerve, not a bone!',
		'🦁 A lion’s roar can be heard from five miles away!',
		'🧀 Some cheese is aged in caves for years!',
		'🧥 Otters hold hands while they sleep so they don’t drift away!',
		'🧩 The Rubik’s Cube has over 43 quintillion combinations!',
		'🛰️ The International Space Station travels at 17,500 miles per hour!',
		'🍬 Gummy bears were originally called "dancing bears"!',
		'🐳 A blue whale’s tongue weighs as much as an elephant!',
		'🦷 Snails have thousands of tiny teeth on their tongues!',
		'🥕 Carrots were originally purple, not orange!',
		'🦅 Bald eagles aren’t actually bald; they have white feathers!',
		'🚲 The first bicycles didn’t have pedals; you pushed with your feet!',
		'🥔 The first vegetable grown in space was a potato!',
		'🪁 Kites were invented in China over 2,000 years ago!',
		'🦀 Some crabs have eyes on long stalks!',
		'🐿️ Squirrels plant thousands of trees by forgetting where they hid nuts!',
		'🦘 Kangaroos can’t walk backwards!',
		'🍄 Some mushrooms glow in the dark!',
		'🎐 Jellyfish have been on Earth for over 500 million years!',
		'🍳 An ostrich egg is equal to about 24 chicken eggs!',
		'🏰 The Great Wall of China is longer than the distance across the USA!',
		'🛶 The world’s oldest boat is over 10,000 years old!',
		'🎹 A standard piano has 88 keys!',
		'⛸️ The first ice skates were made from animal bones!',
		'🧱 LEGO bricks made in 1958 still fit with bricks made today!',
		'💎 Diamonds are the hardest natural substance on Earth!',
		'🪐 Saturn’s rings are mostly made of ice and rock!',
		'🌲 The oldest tree in the world is over 4,800 years old!',
		'🦗 A cricket’s ears are on its front legs!',
		'🚒 The first fire engines were pulled by horses!',
		'🛸 The "Wow!" signal was a mysterious radio signal from space!',
		'🌋 There are about 1,500 active volcanoes on Earth!',
		'🦓 A zebra’s stripes are unique, like a fingerprint!',
		'🍅 Tomatoes are fruits, not vegetables!',
		'🧀 Mice don’t actually like cheese as much as they like sweets!',
		'🦇 Bats are the only mammals that can truly fly!',
		'🦏 A rhinoceros horn is made of the same stuff as your hair!',
		'🌵 Some cacti can live for over 200 years!',
		'🥖 The longest loaf of bread ever baked was over 3,900 feet long!',
		'🌬️ Wind is silent until it hits an object!',
		'🐚 You can hear the "ocean" in a seashell because of your own blood flow!',
		'🚜 The first tractors were powered by steam!',
		'🎻 The world’s smallest violin is less than an inch long!',
		'🫧 Soap bubbles are always round because of surface tension!',
		'🧲 The Earth is like a giant magnet!',
		'🌑 We only ever see one side of the Moon!',
		'🎨 Leonardo da Vinci could write with one hand and draw with the other!',
		'🗼 The Eiffel Tower grows taller in the summer due to heat!',
		'🕯️ Candles were once made from whale fat!',
		'🚂 The first trains traveled slower than a person could run!',
		'🧸 The Teddy Bear was named after President Theodore Roosevelt!',
		'🍫 It takes about 400 cocoa beans to make one pound of chocolate!',
		'🏔️ Mount Everest grows about a quarter of an inch every year!',
		'🥽 The first sunglasses were used by judges in China to hide their eyes!',
		'🛹 The first skateboards were made from wooden crates with roller skate wheels!'
	];

	const loadingMessages = [
		"Searching for today's coolest news...",
		'Finding stories just for you...',
		'Making news fun to read...',
		'Drawing awesome pictures...',
		'Putting together your newspaper...',
		'Adding the finishing touches...',
		'Almost ready for print...'
	];

	let currentFact = $state(funFacts[0]);
	let currentMessage = $state(loadingMessages[0]);
	let messageIndex = $state(0);
	let progress = $state(0);

	onMount(() => {
		// Rotate fun facts every 5 seconds
		const factInterval = setInterval(() => {
			currentFact = funFacts[Math.floor(Math.random() * funFacts.length)];
		}, 5000);

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
