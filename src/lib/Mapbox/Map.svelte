<div
aria-role="button" 
id="map" 
on:ready={init}
style="height:100%; width:100%"
use:action={
{
  accessToken:PUBLIC_MAPBOX_TOKEN,
  version: 'v2.12.0',
  center: [ 13.404954, 52.520008 ],
  zoom: 3,
  style: 'mapbox://styles/mapbox/dark-v11'
}}
on:recentre
on:dragend
on:click
on:zoomstart
on:zoom
on:zoomend
on:drag
on:keydown
>
{#if map}
  <slot></slot>
{/if}
</div>

<script>
  import { setContext, onDestroy, createEventDispatcher } from 'svelte'
  import { mapboxInstance, mapInstance } from './mapboxContext.js';
  import { contextKey } from './mapbox.js'
  import action from './map-action.js'
  import {PUBLIC_MAPBOX_TOKEN} from '$env/static/public'
  import {onMount} from 'svelte'
  import { EventQueue } from './queue.js'


  let map
  let mapbox

  // context to be consumed by child components
  setContext(contextKey, {
      getMap: () => map,
      getMapbox: () => mapbox
  })

  const dispatch = createEventDispatcher()

  const queue = new EventQueue()


  function init ({ detail }) {
    map = detail.map
    mapbox = detail.mapbox
    // sets the map and mapbox instances 
    // into a global context 2b consumed by 
    // others. See mapboxContext.js
    mapInstance.set(map);
    mapboxInstance.set(mapbox);
    queue.start(map);
    map.flyTo({
      zoom:9,
      center: [ 13.404954, 52.520008 ]
    })
    dispatch('ready')
  }
  

  onDestroy(() => {
    queue.stop()
    mapInstance.set(null);
    mapboxInstance.set(null);
    map = undefined
  })

  function fitBounds (bbox, data = {}) {
    queue.send('fitBounds', [ bbox, data ])
  }

  function flyTo (destination, data = {}) {
    queue.send('flyTo', [ destination, data ])
  }

  function resize () {
    queue.send('resize')
  }

  function setCenter (coords, data = {}) {
    queue.send('setCenter', [ coords, data ])
  }

  function setZoom (value, data = {}) {
    queue.send('setZoom', [ value, data ])
  }

  function addControl (control, position = 'top-right') {
    queue.send('addControl', [ control, position ])
  }

  function getMap () {
    return map
  }

  function getMapbox () {
    return mapbox
  }

</script>

