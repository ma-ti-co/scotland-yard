<script>
	import {enhance} from '$app/forms'

	export let data;
	let {session, supabase} = data;
	$: ({session, supabase} = data)

	let form;
	
</script>

<svelte:head>
	<title>Sign Up</title>
	<meta name="description" content="About this app" />
</svelte:head>
<div class="text-column">
	<form method="POST" action="">
    <input type="uname" name="uname" />
		<input type="email" name="email" />
		<input type="password" name="password" />
		<button>Sign Up</button>
	</form>
</div>