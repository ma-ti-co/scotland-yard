<script>
  import { PUBLIC_SUPABASE_URL } from '$env/static/public'
  import { onMount, getContext, createEventDispatcher, beforeUpdate, afterUpdate } from 'svelte'
  import { contextKey } from './mapbox.js';
  import { getRoutesForLine} from '$lib/gameplay.js'
  import {current_line, filtered_stops} from '../../store.js'
  import { mapboxInstance, mapInstance } from '$lib/Mapbox/mapboxContext.js'; 


  const dispatch = createEventDispatcher();



  let map
  let mapbox
  let _current_line
  let _filtered_stops
  current_line.subscribe((data) => _current_line = data)
  filtered_stops.subscribe((data) => _filtered_stops = data)
  
  mapInstance.subscribe(value => {
    map = value;
  });
  mapboxInstance.subscribe(value => {
    mapbox = value;
  });


  function move (lng, lat) {
    marker.setLngLat({ lng, lat })
  }

  export let lat
  export let lng
  export let markerOffset = [ 0, 0 ]
  export let markerOptions = {}
  export let type
  export let uid = null
  export let color
  export let mister_x = false

  let marker
  let element
  let elementPopup


  $: marker && move(lng, lat)


  onMount(() => {
    const namedParams = Object.assign(
      {
        offset: markerOffset,
        type: type
      },
      element.hasChildNodes() ? { element } : { color }
    )
    marker = new mapbox.Marker(Object.assign(namedParams, markerOptions))
    
    if(type!=="location"){
      element.style.background = `linear-gradient(#e66465, #9198e5)`;
      element.style.backgroundImage = `url(${PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${uid})`;
      element.style.width = `30px`;
      element.style.height = `30px`;
      element.style.borderRadius = `99999px`;
      element.style.backgroundSize = '100%';
    }
    
    marker
      .setLngLat({ lng, lat })
      .addTo(map)

      marker.getElement().addEventListener('click', showDetails);
      

    if (!element.hasChildNodes()) element.remove()

    return () => marker.remove()
  })

  export function getMarker () {
    return marker
  }

  export function showDetails(event){
    map.flyTo({ 
      center:[lng, lat],
      zoom:14
    });
    // set higlight dot on current station
    // once the map has finished zooming
    map.on('zoomend', () => {
      const pointData = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [lng,lat]
          }
        }
      ]
    }

    if(map.getSource('highlightDot')===undefined){
      map.addSource('highlightDot', {
        type: 'geojson',
        data: pointData
      });
      map.addLayer({
      id: 'circle-layer',
      type: 'circle',
      source: 'highlightDot', // Reference to the data source
      paint: {
        'circle-radius': 40,
        'circle-color': 'red',
        'circle-opacity': 0.2

      }
    });
    }else{
      pointData.features[0].geometry.coordinates = [lng, lat]
      map.getSource('highlightDot').setData(pointData);
    }
    });
    dispatch('clickForDetails');

  }

</script>

<div bind:this={element}>
  {#if type==='location'}
  <slot></slot>
  {:else}
  <span class="relative flex h-3 w-3">
    <div></div>
    {#if mister_x}
    <span class="animate-ping absolute top-0 left-0 inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75 pointer-events-none"></span>
    {:else}
    <span class="animate-ping absolute top-0 left-0 inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-75 pointer-events-none"></span>
    {/if}
  </span>
  {/if}
</div>


