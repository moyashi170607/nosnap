import { writable } from "svelte/store";

export enum LoginState {
    LOGGED_OUT,
    LOGGED_IN_NIP07,
    LOGGED_IN_SECKEY
}

export const loginType = writable<LoginState>();