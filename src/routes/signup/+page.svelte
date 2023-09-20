<script>
	import {enhance} from '$app/forms'
	import { fly, slide } from 'svelte/transition';
	import * as Card from "$lib/components/ui/card";
  import { Textarea } from "$lib/components/ui/textarea";
	import { Input } from "$lib/components/ui/input";
	import { Loader2 } from "lucide-svelte";
	import { Label } from "$lib/components/ui/label";
	import {Button} from "$lib/components/ui/button";
  import { beforeNavigate } from '$app/navigation';
	export let data;
	let is_loading = false;
	let error_msg;
	let {session, supabase} = data;
	$: ({session, supabase} = data)

	export let form;


	
</script>

<svelte:head>
	<title>Sign Up</title>
	<meta name="description" content="About this app" />
</svelte:head>


{#if error_msg}
<div class="w-[400px] self-center rounded-md bg-red-300 text-red-700 p-4 mb-2">
	{error_msg}
</div>
{/if}


<Card.Root class="w-[400px] self-center m-4">
  <Card.Header class="text-center">
    <Card.Title tag="h1">Sign Up</Card.Title>
  </Card.Header>
  <Card.Content>
		<form method="POST" action="" use:enhance={({}) => {
			is_loading = true;
			return async ({ result, update }) => {
				is_loading = false;
				if(result.status === 400){
					error_msg = result.data.error
				}else{
					update();
				}
			}
		}}>
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
				{#if is_loading}
				<Button disabled>
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Sign Up
				</Button>
				{:else}
				<Button>Sign Up</Button>
				{/if}
			</div>
		</form>
  </Card.Content>
  <Card.Footer>
    <p><a href="/login" class="text-gray-600 text-xs">Go to Login</a></p>
  </Card.Footer>
</Card.Root>




