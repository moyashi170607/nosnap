import { goto } from "$app/navigation";
import { resolve } from '$app/paths';
import type { WindowNostr } from "nostr-tools/nip07";
import { LoginState, loginType } from "./authStore";

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
            loginType.set(LoginState.LOGGED_IN_NIP07);
            return LoginState.LOGGED_IN_NIP07
        } catch (e) {
            loginType.set(LoginState.LOGGED_OUT);
            console.error("Login failed:", e);
            return LoginState.LOGGED_OUT
        }
    } else if (STRAGE_SEC_KEY !== null) {
        //LocalStorage seckey login
        loginType.set(LoginState.LOGGED_IN_SECKEY);
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

export function LoginWithNip07() {
    loginType.set(LoginState.LOGGED_IN_NIP07)
}

export function LoginWithSeckey(seckey: string) {
    loginType.set(LoginState.LOGGED_IN_SECKEY);
    window.localStorage.setItem("nostr-seckey", seckey)
}