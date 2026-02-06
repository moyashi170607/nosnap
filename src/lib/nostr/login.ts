import { goto } from "$app/navigation";
import { resolve } from '$app/paths';
import type { WindowNostr } from "nostr-tools/nip07";

declare global {
    interface Window {
        nostr?: WindowNostr;
    }
}

export async function tryLogin() {
    const STRAGE_SEC_KEY = localStorage.getItem("nostr-seckey");

    if (window.nostr) {
        //Nip-07 login
        try {
            const PUBKEY = await window.nostr.getPublicKey();
            return PUBKEY;
        } catch (e) {
            console.error("Login failed:", e);
            return null;
        }
    } else if (STRAGE_SEC_KEY !== null) {
        return STRAGE_SEC_KEY;
    } else {
        const loginUrl = resolve("/login/");
        goto(loginUrl);
    }
}

tryLogin();
