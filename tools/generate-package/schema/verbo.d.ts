export interface Forms {
    yo: string;
    tu: string;
    ud: string;
    nosotros: string;
    vosotros: string;	
    uds: string;
}

export interface ImperativoForms {
    tu: string;
    vosotros: string;	
    ud: string;
    uds: string;
}

export type Indicativo<T> = {
    presente: T;
    futuro: T;
    imperfecto: T;
    preterito: T;
    condicional: T;
    presentePerfecto: T;	
    futuroPerfecto: T;
    pluscuamperfecto: T;
    preteritoAnterior?: T;
    condicionalPerfecto: T;
}

export type Subjuntivo<T> = {
    presente: T;
    imperfecto: T;
    futuro?: T;
    presentePerfecto: T;
    futuroPerfecto?: T;
    pluscuamperfecto: T;
}

export type SubjuntivoAlt<T> = {
    imperfectoAlt: T
    pluscuamperfectoAlt: T
}

export type English = {
    note: string;
    indicativo: Indicativo<string>
    subjuntivo: Subjuntivo<string>
    infinitivo: string;
    afirmativo: string;
    negativo: string;
    gerundio: string;
    participioPasado: string;
}

/**
 * This corresponds to the JSON data
 */
export interface Schema {
    regular: boolean
    indicativo: Indicativo<Forms>
    subjuntivo: Subjuntivo<Forms> & SubjuntivoAlt<Forms>
    infinitivo: string;
    afirmativo: ImperativoForms;
    negativo: ImperativoForms;
    gerundio: string;
    participioPasado: string;
    english: English;
    attribution: string;
}

export interface Verbo extends Schema {
    id: string;
}