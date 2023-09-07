<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';
  import { invalidate } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
	import {onMount} from 'svelte'
	export let data;
	let {supabase, session} = data;
	// when supabase or session changes => change data
	$: ({supabase, session} = data)

	let show_rules = false;
onMount(() => {
	 const {
		data: {subscription}
	 } = supabase.auth.onAuthStateChange((event, _session) => {
		if(_session?.expires_at !== session?.expires_at){
			// whenever onAuthStateChange is called, invalidate supabase:auth
			invalidate('supbase:auth')
		}
	 })
	 return () => subscription.unsubscribe();
})
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>


{#if show_rules}
<div class="fixed md:top-1/2 left-1/2 bg-white bg-opacity-60 z-10 p-4 -translate-x-1/2 -translate-y-1/2 w-full lg:max-w-[650px] overflow-y-scroll aspect-square">
	<div class="flex justify-end mb-9">
		<Button variant="ghost" on:click={() => show_rules = false}>
			<X />
		</Button>
	</div>
	<div class="mb-9">
			<p>
			Welcome to the exhilarating world of Scotland Yard, a thrilling board game that will test your deductive skills and strategic thinking. 
			In this game, you'll find yourself in the heart of London, tasked with tracking down the elusive Mr. X, a cunning criminal mastermind 
			who has gone on a crime spree throughout the city. It's a battle of wits and strategy as you join forces with other detectives to bring 
			Mr. X to justice or slip away into the shadows as the elusive fugitive.
			</p>
	</div>
	<div class="mb-9">
		<h2 class="text-xl mb-4 font-bold">Objective:</h2>
			<ul>
				<li>
					For the detectives: Work together to capture Mr. X by landing on the same location as him on the game board.
				</li>
				<li>
					For Mr. X: Avoid capture until you can escape the city or outlast the detectives until the end of the game.
				</li>
			</ul>
	</div>
	<div class="mb-9">
		<h2 class="text-xl mb-4 font-bold">Game Setup:</h2>
		<ul>
			<li>
				Each player starts from a randomly chosen point on the map. 
			</li>
			<li>
				Each player has a number of tickets for each mode of transport.
			</li>

		</ul>
	</div>
</div>
{/if}
<section class="h-full lg:h-fit">
<div class="max-w-[600px] rounded-md bg-white m-auto border {show_rules ? 'blur-xl':''}">
	<div class="overflow-hidden rounded-t-md">
		<img class="" src="mood.jpeg" alt=""/>
	</div>
	<div class="py-4">
		<div class="relative flex overflow-x-hidden">
			<div class="py-12 animate-marquee whitespace-nowrap">
				{#each Array(6) as text}
				<span class="text-4xl mx-4">Kottbusser Damm</span>
				{/each}
			</div>
			<div class="py-12 animate-marquee2 whitespace-nowrap">
				{#each Array(6) as text}
				<span class="text-4xl mx-4">Kottbusser Damm</span>
				{/each}
			</div>
		</div>
	</div>
	<div class="p-4">
		<Button on:click={() => show_rules = true}>Read the Rules</Button>
	</div>
</div>
</section>



