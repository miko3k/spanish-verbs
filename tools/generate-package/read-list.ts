import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { Verbo, Schema } from "./schema/verbo.js";


export async function* readList(dir: string): AsyncGenerator<Verbo> {
    const suffix = '.json';

    const files = await readdir(dir)
    for(const f of files) {
        if(!f.endsWith(suffix)) {
            continue;
        }
        const body = await readFile(join(dir, f), "utf8")
        const data: Schema = JSON.parse(body)
        yield {
            id: f.substring(0, f.length-suffix.length),
            ...data
        }
    }
}