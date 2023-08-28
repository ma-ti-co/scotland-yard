<script>
  import { onMount, getContext, createEventDispatcher } from 'svelte'
  import { contextKey } from './mapbox.js';
  import { mapboxInstance, mapInstance } from '$lib/Mapbox/mapboxContext.js'; 


  const dispatch = createEventDispatcher();



  let map
  let mapbox
  
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
      element.style.backgroundImage = `url(https://udazzzqqskonsleaxpwz.supabase.co/storage/v1/object/public/avatars/${uid})`;
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
  <div></div>
  {/if}
</div>


