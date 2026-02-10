import { goto } from "$app/navigation";
import { resolve } from '$app/paths';
import type { WindowNostr } from "nostr-tools/nip07";
import { LoginState, loginType } from "./authStore";
import { RelayListManager } from "../relay_list";
import { getPublicKey } from "nostr-tools";
import { nsec2uint } from "../key/nsec2uint";

export let relayListManager: RelayListManager;

declare global {
    interface Window {
        nostr?: WindowNostr;
    }
}

export async function tryLogin(): Promise<LoginState> {
    const STRAGE_SEC_KEY = localStorage.getItem("nostr-seckey");

    if (window.nostr) {
        //Nip-07 login
        try {
            await LoginWithNip07()
            return LoginState.LOGGED_IN_NIP07
        } catch (e) {
            loginType.set(LoginState.LOGGED_OUT);
            console.error("Login failed:", e);
            return LoginState.LOGGED_OUT
        }
    } else if (STRAGE_SEC_KEY !== null) {
        //LocalStorage seckey login
        LoginWithSeckey(STRAGE_SEC_KEY);
        return LoginState.LOGGED_IN_SECKEY
    } else {
        //Not logged in
        loginType.set(LoginState.LOGGED_OUT);
        const loginUrl = resolve("/login/");
        goto(loginUrl);
        return LoginState.LOGGED_OUT
    }
}

export function getSeckeyInLocal() {
    return window.localStorage.getItem("nostr-seckey")
}

export async function LoginWithNip07() {
    loginType.set(LoginState.LOGGED_IN_NIP07)
    relayListManager = new RelayListManager(await window.nostr!.getPublicKey())
}

export function LoginWithSeckey(seckey: string) {
    window.localStorage.setItem("nostr-seckey", seckey)

    loginType.set(LoginState.LOGGED_IN_SECKEY);
    const uint_sec = nsec2uint(seckey)
    const pubkey = getPublicKey(uint_sec)
    relayListManager = new RelayListManager(pubkey)
}