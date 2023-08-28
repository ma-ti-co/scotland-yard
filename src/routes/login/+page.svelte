<script>
	import {enhance} from '$app/forms'
	import { fly, slide } from 'svelte/transition';
	import * as Card from "$lib/components/ui/card";
  import { Textarea } from "$lib/components/ui/textarea";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import {Button} from "$lib/components/ui/button";
	export let data;
	let {session, supabase} = data;
	$: ({session, supabase} = data)

	let form;
	
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="About this app" />
</svelte:head>


<Card.Root class="w-[400px] self-center">
  <Card.Header class="text-center">
    <Card.Title tag="h1">Log In</Card.Title>
  </Card.Header>
  <Card.Content>
		<form method="POST" action="" use:enhance>
			<div class="mb-4">
				<Label for="name">Email</Label>
				<Input name="email" type="text" />
			</div>
			<Label for="name">Password</Label>
			<Input name="password" type="password"/> 
			<div class="mt-4">
				<Button>Log In</Button>
			</div>
		</form>
  </Card.Content>
  <Card.Footer>
    <p><a href="/signup">Create an Account</a></p>
  </Card.Footer>
</Card.Root>




