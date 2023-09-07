<script>
  import { invalidate } from '$app/navigation';
	import {onMount} from 'svelte'
	export let data;
let {supabase, session} = data;
// when supabase or session changes => change data
$: ({supabase, session} = data)

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

<section class="flex justify-center">
		<div class="rounded-md-4 w-full lg:min-w-[600px] aspect-square p-4">
				<div class="text-xl font-bold">
					Welcome to Scotland Yard.
				</div>
				<div>
					A game is for 2 to 4 people. 
				</div>
		</div>
</section>


