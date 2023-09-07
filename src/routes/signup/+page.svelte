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
	<title>Sign Up</title>
	<meta name="description" content="About this app" />
</svelte:head>


{#if form}
<div class="w-[400px] self-center rounded-md bg-red-300 text-red-700 p-4 mb-2">
	{form.error}
</div>
{/if}


<Card.Root class="w-[400px] self-center">
  <Card.Header class="text-center">
    <Card.Title tag="h1">Sign Up</Card.Title>
  </Card.Header>
  <Card.Content>
		<form method="POST" action="" use:enhance>
			<div class="mb-4">
				<Label for="uname">Username</Label>
				<Input name="uname" type="text" />
				{#if form && form.includes("uname")}
				<div class="text-xs text-red-600 mt-2">
					Please enter a username
				</div>
				{/if}
			</div>
			<div class="mb-4">
				<Label for="email">Email</Label>
				<Input name="email" type="text" />
				{#if form && form.includes("email")}
				<div class="text-xs text-red-600 mt-2">
					Please enter an email
				</div>
				{/if}
			</div>
			<Label for="password">Password</Label>
			<Input name="password" type="password"/>
			{#if form && form.includes("password")}
				<div class="text-xs text-red-600 mt-2">
					Please enter a password
				</div>
			{/if} 
			<div class="mt-4">
				<Button>Sign Up</Button>
			</div>
		</form>
  </Card.Content>
  <Card.Footer>
    <p><a href="/login" class="text-gray-600 text-xs">Go to Login</a></p>
  </Card.Footer>
</Card.Root>




