import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { SpanishVerb } from "./schema/verb.js";
import { SpanishVerbWithId } from "./schema/verb-with-id.js";

export async function* readList(dir: string): AsyncGenerator<SpanishVerbWithId> {
    const suffix = '.json';

    const files = await readdir(dir)
    for(const f of files) {
        if(!f.endsWith(suffix)) {
            continue;
        }
        const body = await readFile(join(dir, f), "utf8")
        const data: SpanishVerb = JSON.parse(body)
        yield {
            id: f.substring(0, f.length-suffix.length),
            ...data
        }
    }
}