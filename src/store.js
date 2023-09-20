import { writable } from "svelte/store";

export const MapInstance = writable({})
export const ProfileData = writable({})

// user_id = session.user.id
export const user_id = writable();
// current game data
export const game_data = writable({});
/*focus_state determines which slide
is shown to the user. is set and read
mostly on the top game level. and set
to null after a user checks in.*/
export const focus_state = writable(false);

/*
determines which markers/stops are visible
on the map. usually detemined by game_data.allowed_stops (all stops)
changes only when a user has selected a current_line (e.g. U5) and
if this line is within the allowed moves. is reset after
a user has made a move
*/
export const visible_stops = writable([]);
export const current_route = writable(null);
export const current_line = writable(null);
// is set whenever a user clicks on a Marker
// the latlng is needed to check if a move is allowed
export const current_stop = writable(null);

/*
checks if a user is able to check in to the
currently focused sttion. is set in
gameplay.js and read in Info.svelte
*/
export const move_is_allowed = writable(null);

