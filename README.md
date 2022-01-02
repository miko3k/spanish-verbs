# Improved version of Fred Jehle's Conjugated Spanish Verb Database

JSON databases of 600+ conjugated Spanish verbs forming 11,000+ combinations of moods and tenses. Original work by Fred Jehle and the database orignally compiled by @ghidinelli. 

This repository is a total convertsion into JSON format. It also fixes plenty of issues and adds some additional information from the original source.

There are multiple ways to use the data
    * clone this repo and do something with JSON files directly. 
    * use the npm package

The original database has been incorporated into a number of tools including:

 * Conjug - a free practice tool by @dcomtois is online - http://es.conjug.com
 * es-api - a free web API for accessing the database by @lwm - https://github.com/lwm/es-api
 * conjugarden by @hghwng - https://github.com/hghwng/conjugarden
 * grammar-cards by @twcamper - https://github.com/twcamper/grammar-cards

Licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

## the JSON

[See yourself](verbs/compartir.json), the format is self-explanatory.

## The npm package

First install the package
```
npm i verbos
```


Using the package is quite straightforward
```
// you can import individual words
import { compartir } from "verbos";

console.log(compartir.infinitivo)

// There's also a function which returns the list of all words
// orderd by importance
import { verbos } from "verbos";

console.log(verbos())
```

The list will be ordered by [importance](https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier#Spanish_frequency_list). The package also includes proper typing for Typescript. Note that all javascript for the package is generated from the JSON files. They are also bundled in the package should you need them.