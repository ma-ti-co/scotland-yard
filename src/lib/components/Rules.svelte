<script>
  import Button from "./ui/button/button.svelte";
  import BvgIcons from '$lib/BVGIcons.svelte'
</script>



<div class="mb-9">
  <p>
  In this game, you'll find yourself in the heart of Berlin, tasked with tracking down the elusive Mr. X. It's a battle of wits and strategy as you join forces with other detectives to bring 
  Mr. X to justice or slip away into the shadows as the elusive fugitive.
  </p>
</div>
<div class="mb-9">
<h2 class="text-xl mb-4 font-bold">Objective:</h2>
  <ul>
    <li>
      For the detectives: Work together to capture Mr. X by landing on the same location as him on the map.
    </li>
    <li>
      For Mr. X: Avoid capture until the end of the game.
    </li>
  </ul>
</div>
<div class="mb-9">
<h2 class="text-xl mb-4 font-bold">Game Setup:</h2>
<ul>
  <li>
    Each player starts from a randomly chosen point on the map. 
  </li>
  <li>
    <div>Each player has a number of tickets for each mode of transport.</div>
    <div>Each ticket is good for a specific number of stops from your current location
      <ul class="mt-2">
        <li class="mb-2"><div class="flex items-center"><BvgIcons type={'subway'} /> <span class="ml-2">Subway tickets: 3 Stops</span></div></li>
        <li class="mb-2"><div class="flex items-center"><BvgIcons type={'suburban'} /> <span class="ml-2">Suburban tickets: 4 Stops</span></div></li>
        <li class="mb-2"><div class="flex items-center"><BvgIcons type={'tram'} /> <span class="ml-2">Tram tickets: 5 Stops</span></div></li>
      </ul>
    </div>
  </li>

</ul>
</div>