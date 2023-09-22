<script>
  import { PUBLIC_SUPABASE_URL } from '$env/static/public'
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card";
  import Button from "./ui/button/button.svelte";
  import Avatar from "$lib/components/Avatar.svelte";
  import {user_id} from '../../store'
  import { Loader2 } from "lucide-svelte";
  import { Check } from 'lucide-svelte';
  import toast from 'svelte-french-toast';
  import { onMount } from "svelte";
  import { redirect } from "@sveltejs/kit";
  export let profile;
  let error_msg;
  let is_loading;
  let files;
  let upload_error

  $: if (files !== undefined){
    if(files[0].size > 500_000){
      upload_error = 'Filesize is too large. Please choose a file below 5MB'
    }else{
      upload_error = false
    }
  }
  onMount(() => {
    if(profile.data.avatar_url === null){
      toast('Hi! Remember to upload your Avatar!', {icon:'😎'
      })
    }
  })
</script>


<div class="order-1 lg:min-w-[400px]">
  <Card.Root>
    <Card.Header class="flex justify-center">
      <div class="flex justify-center my-6">
        {#if profile.data.avatar_url}
        <img class="bg-gray-400 rounded-full h-16 aspect-square" src={`${PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.data.id}`} alt="" />
        {:else}
        
          <form method="POST" action="?/uploadImage" use:enhance={({}) => {
            is_loading = true;
            return async ({result, update}) => {
              console.log(result);
              if(result.type === "error"){
                is_loading = false;
                toast.error('Error. Please choose a different file.')
              }else{
                is_loading = false;
                toast.success("Profile image was updated.");
                update();
              }
            }
          }}>
          <div class="flex flex-col items-center align-center w-full">
          <label for="dropzone-file" class="flex mb-2 rounded-full justify-center h-16 aspect-square border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center">
                  <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
              </div>
              <input accept="image/png, image/jpeg" bind:files id="dropzone-file"  name="image" disabled={is_loading} type="file" class="hidden" />
            </label>
          {#if is_loading}
            <Button disabled>
              <Loader2 class="mr-2 h-4 w-4 animate-spin"/>
            </Button>
          {:else if upload_error}
          <div class="text-xs bg-red-300 text-red-700 rounded-md p-4 max-w-md">
            {upload_error}
          </div>
          {:else if files}
            <Button class="hover:bg-green-700 bg-green-500 text-white">
              <Check class="mr-2"/>
              Ready to Upload
            </Button>
          {/if}
        </div> 
          </form>
      {/if}
      </div>
      <Card.Title class="flex justify-center">{profile.data.username}</Card.Title>
      <Card.Description class="flex justify-center">{profile.data.email}</Card.Description>
    </Card.Header>
    <div class="flex justify-center p-6">
      <Button variant="destructive">Delete Profile</Button>
    </div>
  </Card.Root>
  </div>