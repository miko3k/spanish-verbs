import { readFile, writeFile } from 'fs/promises'
import { basename, join } from 'path'
import { createHash } from 'crypto';
import request from 'request';
import mkdirp from 'mkdirp';

function isErrnoException(t: unknown): t is NodeJS.ErrnoException {
    const e = t as NodeJS.ErrnoException
    if (e.errno || e.code || e.syscall) {
        return true
    } else {
        return false
    }
}

async function ignoreError(code: string, block: () => Promise<void>): Promise<void> {
    return handleError(code, block, async ()=>{})
}

async function handleError<T>(code: string, block: () => Promise<T>, onError: ()=>Promise<T>): Promise<T> {
    try {
        return await block()
    } catch(e) {
        if (!isErrnoException(e) || e.code !== code) {
            throw e
        } else {
            return await onError()
        }
    }
}

export type Get = (url: string) => Promise<string>;

export const get: Get = async (url: string): Promise<string> => {
    return await new Promise<string>((resolve, reject) => {
        request.get({
            url,
            followRedirect: true
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(typeof body !== "string") {
                    reject("body is not string")
                } else {
                    resolve(body)
                }
            } else {
                reject(error);
            }
        })
    });
}

export type CacheNameGen = (url: string) => string;
export const basenameGen: CacheNameGen = url => basename(url)
export const hashGen: CacheNameGen = url => createHash('md5').update(url).digest('hex')

export function withCache(cacheDir: string, nameGenerator: CacheNameGen): Get {
    return async (url: string): Promise<string> => {
        ignoreError('EEXIST', async ()=>{ await mkdirp(cacheDir) })
        const file = join(cacheDir, nameGenerator(url))
    
        return handleError('ENOENT', () => readFile(file, 'utf8'), async () => {
            const data = await get(url)
            await writeFile(file, data);
            return data
        })        
    }
}