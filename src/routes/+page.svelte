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

<section class="flex">
		<div class="rounded-md bg-white p-4 lg:min-w-[600px] aspect-square">
			<div class="text-4xl">
				Welcome
			</div>
			<pre>
			</pre>
		</div>
</section>


