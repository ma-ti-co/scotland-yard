import { writable } from "svelte/store";

export const MapInstance = writable({})
export const ProfileData = writable({})

export const user_id = writable();
export const game_data = writable({});
export const focus_state = writable(false);
export const visible_stops = writable([]);
export const current_route = writable(null);
export const current_line = writable(null);