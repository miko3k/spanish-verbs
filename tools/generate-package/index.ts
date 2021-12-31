// we must always use ".js"-extension
// https://stackoverflow.com/a/62626938/1623826
// https://github.com/microsoft/TypeScript/issues/46452
import { writeFile } from "fs/promises";
import mkdirp from "mkdirp";
import { join } from "path";
import { SpanishVerbWithId } from "./schema/verb-with-id.js";
import { freqTableNameGen, freqTable, cachedFreqTable } from "./freq-table.js";
import { Get, withCache } from "./get.js";
import { readList } from "./read-list.js";

const IMPORT = 'import { SpanishVerbWithId } from "./verb-with-id"'


interface Arguments {
    get: Get
    dataDir: string;
    outDir: string;
    //schemaDir: string;
}

const singleFile = (data: SpanishVerbWithId) => 
`
// generated source, do not edit
${IMPORT}

/** Spanish verb "${data.infinitivo}" */
export const ${data.id}: SpanishVerbWithId = ${JSON.stringify(data, undefined, 2)};
`

const makeImport = (value: SpanishVerbWithId) => `import { ${value.id} } from "./${value.id}"`
const makeReexport = (value: SpanishVerbWithId) => `export { ${value.id} } from "./${value.id}"`
const makeRef = (value: SpanishVerbWithId) => `        ${value.id},`
const byAlphabet = (data: SpanishVerbWithId[]) => [...data].sort((a, b)=>a.id.localeCompare(b.id, "en"))

const multiFile = (data: SpanishVerbWithId[]) => 
`
// generated source, do not edit
${IMPORT}
${byAlphabet(data).map(makeImport).join('\n')}
${byAlphabet(data).map(makeReexport).join('\n')}

/** Returns the list of spanish verbs, ordererd by importance */
export default function verbos(): SpanishVerbWithId[] {
    return [
        ${data.map(makeRef).join('\n')}
    ]
}
`
/*
async function copySchema(args: Arguments, file: string) {
    const data = await readFile(join(args.schemaDir, file), "utf8");
    await writeFile(join(args.outDir, file), data, { encoding: 'utf8' })
}*/

async function main(args: Arguments) {
    try {
        const freq = cachedFreqTable(await freqTable(args.get));
        const list: SpanishVerbWithId[] = []
        await mkdirp(args.outDir);

        for await (let value of readList(args.dataDir)) {
            list.push(value)
        }
        list.sort((a, b)=>freq(a.infinitivo)-freq(b.infinitivo))

        for(const item of list) {
            await writeFile(join(args.outDir, item.id + ".ts"), singleFile(item), { encoding: 'utf8' })
        }
        await writeFile(join(args.outDir, "index.ts"), multiFile(list), { encoding: 'utf8' })
/*
        for (const schema of ['verb.d.ts', 'verb-with-id.d.ts'] ) {
            copySchema(args, schema)
        }*/
    } catch(e) {
        console.log(e)
    }
}

main({
    get: withCache('.work/freq_table', freqTableNameGen),
    dataDir: 'verbs',
    outDir: '.work/typescript'
})