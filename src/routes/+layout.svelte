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

	<nav class="flex justify-end text-xs p-2 z-10">
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
							<div class="text-sm">
								<form method="POST" action="/profile?/uploadImgae" use:enhance>
									<input type="file" class="flex mb-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
									<Button variant="outline">Upload</Button>
								</form>
							</div>
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
	<main class="flex flex-col justify-center">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: calc(100vh-10px);
	}

</style>
