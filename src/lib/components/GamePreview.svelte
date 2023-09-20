<script>
  import { fade } from 'svelte/transition';
  import { Loader2 } from "lucide-svelte";
  import { X } from 'lucide-svelte';
  import {createEventDispatcher} from 'svelte';
  import { enhance } from "$app/forms";
  import { MoreVertical } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card";
  import { UserPlus2 } from 'lucide-svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import Label from "./ui/label/label.svelte";
  import Avatar from "./Avatar.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import ConfirmationStatus from "$lib/components/ConfirmationStatus.svelte"
  import { onMount } from "svelte";
  import toast, { Toaster } from 'svelte-french-toast';

  export let game
  export let user_id

  let error;
  let dialog_open = false;
  let is_loading = false;
  let game_is_active = game.game_status;
  let game_is_deleted;
 

  const dispatch = createEventDispatcher();


  const handleGameStatusChange = (status) => {
    game_is_active = status
  }
</script>


<Card.Root>
  <Card.Header>
    <Card.Title>Game #{game.id}</Card.Title>
  </Card.Header>
  <Card.Content>
    {#each game.data as player}
    <div class="flex items-center justify-between pb-4"  transition:fade={{ delay: 250, duration: 300 }}>
      <div class="flex items-center mr-6">
       <Avatar id={player.g_uid} />
        <div class="mx-6 mt-2">
          <div class="font-bold">{player.g_uname}</div>
          <ConfirmationStatus on:status_update={(event) => handleGameStatusChange(event.detail.game_is_active)} game_id={game.id} player_id={player.g_uid} player_status={player.g_status} user_id={user_id} game_owner={game.owner} />
        </div>
      </div>
      {#if user_id === game.owner && player.g_uid !== user_id}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <MoreVertical />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <form action="?/removePlayer" method="POST" use:enhance={({formElement, formData, action, cancel, submitter}) => {
                game.data = game.data.filter((node) => node.g_uid !== player.g_uid)
                formData.append('game_id', game.id);
                return async ({ result, update }) => {
                  if(result.data?.actionNotAllowed){
                    toast.error('Game is active. Player cannot be deleted at the moment.', {
                      duration:3000
                  })
                    return
                  }
                  update()
                  toast.error('Player deleted.', {
                    duration:3000
                  })
                }
              }}>
                <button name="user" value={player.g_uid} variant="destructive">Remove Player</button>
              </form>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {/if}
    </div>
    {/each}
    {#if user_id === game.owner && game.game_status < 1}
    <Button name="email" variant="ghost" on:click={() => {dialog_open = !dialog_open}}>
      {#if !dialog_open}
      <UserPlus2 class="mr-2"/>
      Add Player
      {:else}
      <X class="mr-2"/>
      {/if}
    </Button>
    {/if}
    {#if dialog_open}
    <div>
      <form method="POST" action="?/addPlayer" use:enhance={({formElement, formData, action, cancel, submitter}) => {
        is_loading = true;
        return async ({ result, update }) => {
          if(result.data && result.data.error){
            error = result.data.error;
            let t = setTimeout(() => {
              error = null;
            }, 3000)
            return () => t.clearTimeout()
          }else{
            is_loading = false;
            const {id, username} = result.data.data;
            let new_user = {g_uid:id, g_uname:username, g_status:0}
            game.data = [...game.data, new_user];
            toast.success('Player added');
            dialog_open = !dialog_open;
            update()
          }

        };
      }}>
        <input class="hidden" name="game_id" value={game.id}/>
        {#if error}
        <div class="rounded-md bg-red-300 text-red-900 p-4">{error}</div>
        {/if}
        <div class="flex itmes-center gap-2 mt-2">
          <Input name="email" class="w-full" placeholder="Enter an Email Address"/>
          {#if is_loading}
          <Button disabled variant="success">
            <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Add
          </Button>
          {:else}
          <Button type="submit">Add</Button>
          {/if}
        </div>
    </form>
    </div>
    {/if}
  </Card.Content>
  <Card.Footer>
    <div class="flex justify-between w-full xl:mt-14 flex-wrap">
      {#if game_is_active}
          <Button data-sveltekit-preload-data="hover" href={`/play/${game.id}`}>{game.game_status > 1 ? 'Rejoin':'Start'} Game</Button>
      {:else}
      <div class="flex items-center flex-1 basis-full mb-4 xl:basis-1/2 xl:mb-0 text-gray-300"><Loader2 class="mr-2 h-4 w-4 animate-spin" /> Waiting for all players to confirm.</div>
      {/if}
      {#if user_id === game.owner}
      <div>
        <form action="?/deleteGame" method="POST" use:enhance={({}) => {
          is_loading = true;
          return async ({result, update}) => {
            game_is_deleted = game.id;
            dispatch('delete', {
			      id: game.id
		        });
          }
        }}>
          {#if is_loading && game.id === game_is_deleted}
          <Button disabled variant="destructive">
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          </Button>
          {:else}
          <Button name="game_id" value={game.id} variant="destructive">Delete Game</Button>
          {/if}
        </form>
      </div>
      {/if}
    </div>
  </Card.Footer>
</Card.Root>
<Toaster />