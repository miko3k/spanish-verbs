# Improved version of Fred Jehle's Conjugated Spanish Verb Database

JSON databases of 600+ conjugated Spanish verbs forming 11,000+ combinations of moods and tenses. Original work by Fred Jehle and the database orignally compiled by @ghidinelli. 

This repository is a convertsion into the JSON format. It also fixes plenty of issues and adds some additional information from the original source.

You are free to use the [JSON data](verbs) directly or grab the [npm package](https://www.npmjs.com/package/verbos).

The original database has been incorporated into a number of tools including:

 * Conjug - a free practice tool by @dcomtois is online - http://es.conjug.com
 * es-api - a free web API for accessing the database by @lwm - https://github.com/lwm/es-api
 * conjugarden by @hghwng - https://github.com/hghwng/conjugarden
 * grammar-cards by @twcamper - https://github.com/twcamper/grammar-cards

Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

## The npm package

Using the [package](https://www.npmjs.com/package/verbos) is quite straightforward
```javascript
// you can import individual words
import { compartir } from "verbos";

console.log(compartir.infinitivo)

// There's also a function which returns the list of all words
// orderd by importance
import { verbos } from "verbos";

console.log(verbos())
```

Keep in mind that:
* The list will be ordered by [importance](https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier#Spanish_frequency_list)
* Typescript typings are included
* Note that all javascript code is generated from the the JSON sources, the JSON is the single source of truth
* The JSON files are also bundled in the package should you need them
* If you are interested only in a few verbs, be please avoid calling `verbos()` as it effectively prohibits the [tree shaking](https://webpack.js.org/guides/tree-shaking/)
* The [Typescript schema](tools/generate-package/schema/verbo.d.ts) is same as JSON one, with one addtional field `id`, which contains the filename without `.json` extension
* No dependencies!
