import { writable } from 'svelte/store';
// mapbox instance that can be consumed by the +page
export const mapInstance = writable(null);
export const mapboxInstance = writable(null);