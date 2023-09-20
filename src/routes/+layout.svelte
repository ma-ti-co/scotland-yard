<script>
	import {user_id} from "../store";
	import { CalendarDays } from "lucide-svelte";
  import * as HoverCard from "$lib/components/ui/hover-card";
	import {invalidate, goto} from '$app/navigation'
	import {onMount} from 'svelte'
	import { Button } from "$lib/components/ui/button";
	import './styles.css';
  import Avatar from "$lib/components/Avatar.svelte";
	import { Toaster } from 'svelte-french-toast';
	import {afterNavigate} from '$app/navigation'
  import { enhance } from "$app/forms";
	export let data


	let {supabase, profile, session} = data;
	$: ({supabase, profile, session} = data)

	onMount(() => {
		// when onAuthState changes, run load() function in layout.ts again;
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if(_session?.expires_at !== session?.expires_at){
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})

	async function logout(){
		user_id.set(null);
		const {error} = await supabase.auth.signOut();
		if(!error){
			goto('/');
		}
	}

</script>







<div class="app">

	<nav class="flex justify-between items-center text-sm px-4 z-10 h-[var(--nav)] border-b">
		<a href="/" class="italic font-extrabold text-xl">X</a>
		
		<div>
			{#if session}
			Hi <a href="/profile" class="text-black font-bold mr-6">{profile.data?.username}</a>
			<Button on:click={logout}>Log Out</Button>
			{:else}
			<a href="/login" class="text-black">Login</a>
			{/if}
		</div>
	</nav>
	<main class="flex flex-col justify-center h-full">
		<slot />
	</main>
	<Toaster />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
