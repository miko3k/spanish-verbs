// we must always use ".js"-extension
// https://stackoverflow.com/a/62626938/1623826
// https://github.com/microsoft/TypeScript/issues/16577#issuecomment-754941937
// https://github.com/microsoft/TypeScript/issues/16577#issuecomment-703190339

import { writeFile } from "fs/promises";
import mkdirp from "mkdirp";
import { join } from "path";
import { freqTableNameGen, freqTable, cachedFreqTable } from "./freq-table.js";
import { Get, withCache } from "./get.js";
import { readList } from "./read-list.js";
import { Verbo } from "./schema/verbo.js";

const SCHEMA_FILE = '"./verbo"'
const IMPORT = `import { Verbo } from ${SCHEMA_FILE}`
const TYPE = "Verbo"

interface Arguments {
    get: Get
    dataDir: string;
    outDir: string;
}

const singleFile = (data: Verbo) => 
`
// generated source, do not edit
${IMPORT}

/** Spanish verb "${data.infinitivo}" */
export const ${data.id}: ${TYPE} = ${JSON.stringify(data, undefined, 2)};
`

const makeImport = (value: Verbo) => `import { ${value.id} } from "./${value.id}.js"`
const makeReexport = (value: Verbo) => `export { ${value.id} } from "./${value.id}.js"`
const makeRef = (value: Verbo) => `        ${value.id},`
const byAlphabet = (data: Verbo[]) => [...data].sort((a, b)=>a.id.localeCompare(b.id, "en"))

const multiFile = (data: Verbo[]) => 
`
// generated source, do not edit
export type { Forms, ImperativoForms, Indicativo, Subjuntivo, SubjuntivoAlt, English, Schema, Verbo  } from ${SCHEMA_FILE}
${byAlphabet(data).map(makeReexport).join('\n')}

${IMPORT}
${byAlphabet(data).map(makeImport).join('\n')}

/** Returns the list of spanish verbs, ordererd by importance */
export function verbos(): ${TYPE}[] {
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
        const list: Verbo[] = []
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
    get: withCache('.cache/freq_table', freqTableNameGen),
    dataDir: 'verbs',
    outDir: '.work/typescript'
})