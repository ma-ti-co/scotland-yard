<script>
	import {enhance} from '$app/forms'
	import { fly, slide } from 'svelte/transition';
	import * as Card from "$lib/components/ui/card";
  import { Textarea } from "$lib/components/ui/textarea";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import {Button} from "$lib/components/ui/button";
  import { beforeNavigate } from '$app/navigation';
	export let data;
	let {session, supabase} = data;
	$: ({session, supabase} = data)

	export let form;


	
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
		{#if form && form?.includes("validation_error")}
				<div class="text-xs bg-red-200 text-red-600 p-4 rounded-md mb-2">
					Incorrect email or password. Try again
				</div>
		{/if} 
		<form method="POST" action="" use:enhance>
			<div class="mb-4">
				<Label for="name">Email</Label>
				<Input name="email" type="text" />
				{#if form && form.includes("email")}
				<div class="text-xs text-red-600 mt-2">
					Please enter an email
				</div>
				{/if}
			</div>
			<Label for="name">Password</Label>
			<Input name="password" type="password"/>
			{#if form && form.includes("password")}
				<div class="text-xs text-red-600 mt-2">
					Please enter a password
				</div>
			{/if} 
			<div class="mt-4">
				<Button>Log In</Button>
			</div>
		</form>
  </Card.Content>
  <Card.Footer>
    <p><a href="/signup" class="text-gray-600 text-xs">Create an Account</a></p>
  </Card.Footer>
</Card.Root>




