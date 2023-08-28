<script>
	import { CalendarDays } from "lucide-svelte";
  import * as HoverCard from "$lib/components/ui/hover-card";
	import * as Avatar from "$lib/components/ui/avatar";
	import {invalidate, goto} from '$app/navigation'
	import {onMount} from 'svelte'
	import { Button } from "$lib/components/ui/button";
	import './styles.css';

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
		const {error} = await supabase.auth.signOut();
		if(!error){
			goto('/');
		}
	}

</script>







<div class="app p-6">

	<nav class="flex justify-end">
		{#if session}
		<div>
			<HoverCard.Root>
				<HoverCard.Trigger
					class="hover:underline text-black underline-offset-4 rounded-sm mr-5 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
				>
					Hi <strong>{profile.data.id} {profile.data.username}</strong>

				</HoverCard.Trigger>
				<HoverCard.Content class="w-80">
					<Avatar.Root>
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex justify-between space-x-4">
						<div class="space-y-1">
							<h4 class="text-sm font-semibold">@sveltejs</h4>
							<p class="text-sm">Cybernetically enhanced web apps.</p>
							<div class="flex items-center pt-2">
								<CalendarDays class="mr-2 h-4 w-4 opacity-70" />{" "}
								<span class="text-xs text-muted-foreground">
									Joined September 2022
								</span>
							</div>
						</div>
					</div>
				</HoverCard.Content>
			</HoverCard.Root>
			<Button on:click={logout}>Logout</Button>
		</div>
		{:else}
		<a href="/login">Login</a>
		{/if}
	</nav>
	<main class="h-full flex flex-col justify-center flex-grow">
		<slot />
	</main>

	<footer>

	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

</style>
