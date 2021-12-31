import { closest } from "fastest-levenshtein";
import { CacheNameGen, Get } from "./get";
import 'core-js'

const urls = [
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-1-5000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-5001-10000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-10001-15000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-15001-20000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-20001-25000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-25001-30000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-30001-35000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-35001-40000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-40001-45000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-45001-50000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-50001-55000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-55001-60000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-60001-65000&action=raw",
    "https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier/Spanish_frequency_list-65001-70000&action=raw"    
]

export const freqTableNameGen: CacheNameGen = (url) => {
    const m = /\d+-\d+/.exec(url);
    if(m && m[0]) {
        return m[0] + ".txt";
    } else {
        console.log(m, url)
        throw new Error(url)
    }
}

export type FreqTable = (word: string) => number

function getFreq(table: Map<string, number>, word: string): number {
    // parenthesis return ugly results
    const idx = word.indexOf('(')
    if (idx > 0) {
        word = word.substring(0, idx).trim()
    }

    let rank = table.get(word)
    if (rank !== undefined) {
        return rank;
    }
    const key = closest(word, [...table.keys()])
    rank = table.get(key)
    if (rank !== undefined) {
        return rank;
    }
    throw new Error();
}

export function cachedFreqTable(tab: FreqTable): FreqTable {
    const cache: { [word: string]: number } = {}

    return (word)=>{
        if(!cache.hasOwnProperty(word)) {
            const res = tab(word)
            cache[word] = res;
        }
        return cache[word];
    }
}

export async function freqTable(get: Get): Promise<FreqTable> {
    const map = new Map<string, number>()
    let rank = 1
    for (const url of urls) {
        const raw = await get(url);
        const lines = raw.split(/\r?\n/);
        lines.map(line => line.replaceAll(/[\s0-9[\]]/g, '')).forEach(word => map.set(word, ++rank))
    }
    return (word) => getFreq(map, word)
}