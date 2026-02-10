import { type Event, type Filter, SimplePool } from "nostr-tools";
import { RelayList } from "nostr-tools/kinds";



interface ParsedKind10002 {
    read: string[],
    write: string[]
}

export const DEFAULT_RELAY_LIST: string[] = [
    'wss://nostr.wine/',
    'wss://relay.snort.social/',
    'wss://wot.utxo.one/',
    'wss://nostrelites.org/',
    'https://yabu.me',
    'https://nostrcheck.me',
    'https://nostr.build'
]

export class RelayListManager {
    readonly DEFAULT_DISCOVER_RELAY: string[] = [
        "wss://directory.yabu.me/",
        "wss://purplepag.es/",
        "wss://indexer.coracle.social/",
        "wss://relay.damus.io",
        "wss://nos.lol",
        "wss://yabu.me"
    ];

    pool: SimplePool = new SimplePool();

    pubkey: string;
    readList: string[] = [];
    writeList: string[] = [];

    constructor(pk: string) {
        this.pubkey = pk;
        this.updateList();
    }

    //リレーリストの更新を行う
    async updateList(): Promise<void> {
        const filter: Filter = {
            kinds: [RelayList],
            authors: [this.pubkey],
            limit: 5
        }

        let discoverRelay: string[];

        if (this.readList.length <= 0) {
            discoverRelay = this.DEFAULT_DISCOVER_RELAY;
        } else {
            discoverRelay = this.readList;
        }

        const event: Event[] = await this.pool.querySync(discoverRelay, filter);

        if (event.length >= 2) {
            event.sort((a, b) => b.created_at - a.created_at);
        }

        if (event.length <= 0) {
            alert("kind10002を取得できませんでした。")
            this.writeList = DEFAULT_RELAY_LIST;
            this.readList = DEFAULT_RELAY_LIST;
        } else {
            const list: ParsedKind10002 = this.parseKind10002(event[0]);
            this.readList = structuredClone(list.read);
            this.writeList = structuredClone(list.write);
        }

        this.pool.close(discoverRelay);
    }

    private parseKind10002(event: Event): ParsedKind10002 {
        const parsed: ParsedKind10002 = {
            read: [],
            write: []
        }

        const tags = event.tags;

        for (let i = 0; i < event.tags.length; i++) {
            if (tags[i][0] === "r") {
                if (tags[i][2] === undefined || tags[i][2] === "read") {
                    parsed.read.push(tags[i][1]);
                }

                if (tags[i][2] === undefined || tags[i][2] === "write") {
                    parsed.write.push(tags[i][1]);
                }
            }
        }

        return parsed;
    }
}
