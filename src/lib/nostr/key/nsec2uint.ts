import { nip19 } from "nostr-tools"

export function nsec2uint(nsec: string): Uint8Array {
    const decoded = nip19.decode(nsec)
    const seckey = decoded.data as Uint8Array

    return seckey;
}