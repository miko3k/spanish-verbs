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

[See yourself](https://github.com/miko3k/verbos/blob/master/verbs/compartir.json), the format is self-explanatory.

## The npm package

First step is to grab the package
```
npm i verbos
```

Second step involves usign the pacakge

```
import { Verbo, verbos, compartir } from "verbos";

// get list
console.log(verbos())

// get one verb
console.log(compartir.infinitivo)
```

The list will be ordered by [importance](https://en.wiktionary.org/w/index.php?title=User:Matthias_Buchmeier). The package also includes proper typing for Typescript. Note that all javascript for the package is generated from the JSON files as well.