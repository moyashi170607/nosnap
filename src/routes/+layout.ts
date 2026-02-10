// If you're using a fallback (i.e. SPA mode) you don't need to prerender all
// pages by setting this here, but should prerender as many as possible to
// avoid large performance and SEO impacts
export const prerender = true;
export const ssr = false;

import { tryLogin } from "$lib/nostr/auth/login";
import { LoginState } from "../lib/nostr/auth/authStore";

const LOGIN_RESULT: LoginState = await tryLogin();

switch (LOGIN_RESULT) {
    case LoginState.LOGGED_IN_NIP07:
        break;

    case LoginState.LOGGED_IN_SECKEY:
        break;

    case LoginState.LOGGED_OUT:
        break;
}

