export interface Soin {
  acte: string;
  frequence: string;
  moment: string[];
  condition: string | null;
}

// export interface PrescriptionJson {
//   contexte: string;
//   soins: Soin[];
// }
export type IA3Cotation = {
  acte: string;
  id: string | null;
  cotation: string | null;
};

export type IA2Soin = {
  acte: string;
  frequence: string;
  moment: string[];
  condition: string | null;
};

export type PrescriptionJson = {
  contexte: string;
  soins: IA2Soin[];
};

export type InterpreterResponse = {
  texte_interprete: string;
  json_structuré: PrescriptionJson;
  cotations_ngap: IA3Cotation[];
};
