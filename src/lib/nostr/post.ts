import { finalizeEvent, SimplePool, type EventTemplate, type VerifiedEvent } from "nostr-tools";
import { uploadImageToNostrCheckme } from "./upload_img";
import { LoginState, loginType } from "./auth/authStore";
import { get } from "svelte/store";
import { getSeckeyInLocal, relayListManager } from "./auth/login";
import { nsec2uint } from "./key/nsec2uint";

const pool = new SimplePool()

export async function postImage(imageFile: File, content: string) {
    const image_url = await uploadImageToNostrCheckme(imageFile)

    const EventTemp: EventTemplate = {
        content: content + "\n" + "#nosnap" + "\n" + image_url,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [
            ["t", "nosnap"]
        ]
    }

    let signedEvent!: VerifiedEvent

    switch (get(loginType)) {
        case LoginState.LOGGED_IN_NIP07:
            signedEvent = await window.nostr!.signEvent(EventTemp)
            break;

        case LoginState.LOGGED_IN_SECKEY: {
            const seckey = nsec2uint(getSeckeyInLocal()!)
            signedEvent = finalizeEvent(EventTemp, seckey);
        }
            break;

        case LoginState.LOGGED_OUT:
            alert("ログインされていません")
            throw Error("ログインされていない")
        //tryLogin();
    }

    if (get(loginType) != LoginState.LOGGED_OUT) {
        const RELAYS = relayListManager.readList
        await Promise.any(pool.publish(RELAYS, signedEvent))
    }
}