<script>
	import {user_id} from "../store";
	import { CalendarDays } from "lucide-svelte";
  import * as HoverCard from "$lib/components/ui/hover-card";
	import {invalidate, goto} from '$app/navigation'
	import {onMount} from 'svelte'
	import { Button } from "$lib/components/ui/button";
	import './styles.css';
  import Avatar from "$lib/components/Avatar.svelte";
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

	<nav class="flex justify-end items-center text-sm p-2 z-10 h-[var(--nav)]">
		{#if session}
		<div>
			<HoverCard.Root>
				<HoverCard.Trigger
					class="hover:underline text-black underline-offset-4 rounded-sm mr-5 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
				>
					Hi <a href="/profile" class="text-black font-bold">{profile.data?.username}</a>

				</HoverCard.Trigger>
				<HoverCard.Content class="w-80">
					<Avatar id={profile.data.id} />
					<div class="flex justify-between space-x-4">
						<div class="space-y-1">
							<h4 class="text-sm font-semibold">{profile.data?.username}</h4>
							<div class="flex items-center pt-2">
								<span class="text-xs text-muted-foreground">
									{profile.data.id}
								</span>
							</div>
						</div>
					</div>
				</HoverCard.Content>
			</HoverCard.Root>
			<Button on:click={logout}>Logout</Button>
		</div>
		{:else}
		<a href="/login" class="text-black">Login</a>
		{/if}
	</nav>
	<main class="flex flex-col justify-center h-full">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main{
		height:calc(100vh - var(--nav));
	}
</style>
