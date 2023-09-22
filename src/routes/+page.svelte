<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';
	import BvgIcons from '$lib/BVGIcons.svelte'
  import { invalidate } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
	import Rules from '$lib/components/Rules.svelte';
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
	<title>Kottbusser Damm - Home</title>
	<meta name="description" content="Kottbusser Damm" />
</svelte:head>


{#if show_rules}
<div class="fixed top-1/2 left-1/2 bg-white bg-opacity-60 z-10 p-4 -translate-x-1/2 -translate-y-1/2 w-full lg:max-w-[650px] overflow-y-scroll lg:aspect-square">
	<div class="flex justify-end mb-9">
		<Button variant="ghost" on:click={() => show_rules = false}>
			<X />
		</Button>
	</div>
	<Rules />
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
	<div class="p-4 flex">
		<div>
		<Button on:click={() => show_rules = true}>Read the Rules</Button>
		</div>
		<div class="ml-2" >
			<Button href="/signup">Create an Account</Button>
		</div>
	</div>
</div>
</section>



