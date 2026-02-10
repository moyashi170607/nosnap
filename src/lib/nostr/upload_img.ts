import { BlossomClient } from "nostr-tools/nipb7"
import { PlainKeySigner, type Signer } from "nostr-tools/signer";
import { LoginState, loginType } from "./auth/authStore";
import { get } from "svelte/store";
import { getSeckeyInLocal } from "./auth/login";
import { nsec2uint } from "./key/nsec2uint";

const DEFAULT_BLOOSSOM_RELAY = "https://nostrcheck.me/api/v2/media";

export async function uploadImageToNostrCheckme(imageFile: File): Promise<string | null> {
    let signer: Signer
    const loginTypeValue = get(loginType);

    if (loginTypeValue === LoginState.LOGGED_IN_NIP07) {
        signer = {
            getPublicKey: async () => await window.nostr!.getPublicKey(),
            signEvent: async (event) => await window.nostr!.signEvent(event),
        }
    } else if (loginTypeValue === LoginState.LOGGED_IN_SECKEY) {
        const seckey: Uint8Array = nsec2uint(getSeckeyInLocal()!)
        signer = new PlainKeySigner(seckey)
    } else {
        throw new Error("Not logged in");
    }

    const client: BlossomClient = new BlossomClient(DEFAULT_BLOOSSOM_RELAY, signer);

    const ImageBlob: Blob = new Blob([imageFile], { type: imageFile.type });

    try {
        const descriptor = await client.uploadBlob(ImageBlob, imageFile.type);
        console.log("写真のURL" + descriptor.url)
        return descriptor.url
    } catch (error) {
        console.error(`画像のアップロードに失敗\n${error}`);
        return null
    }

}