
export interface PubChemProperty {
  CID: number;
  MolecularFormula: string;
  MolecularWeight: string;
  Synonyms: string[];
  Title: string;
  IUPACName?: string; // IUPACName might not always be present
}

export interface MoleculeData {
  cid: number;
  name: string; // The searched name, can be used as title if PubChem Title is not good
  title: string; // From PubChem
  molecularFormula: string;
  molecularWeight: string;
  synonyms: string[];
  iupacName?: string;
  imageUrl2D: string;
  iframeSrc3D: string;
  pubchemUrl: string;
  wikipediaUrl: string;
}

export interface KeyProperties {
  classification: string;
  foundIn: string;
  biochemicalRole: string;
}

export interface GeminiContent {
  quickBio: string;
  keyProperties: KeyProperties | null;
}

export interface PubChemCIDResponse {
  IdentifierList?: {
    CID: number[];
  };
}

export interface PubChemPropertiesResponse {
  PropertyTable?: {
    Properties: PubChemProperty[];
  };
}

export interface SearchLog {
  id: string; // Unique ID for the log entry
  timestamp: string;
  query: string;
  ip: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface IPGeoInfo {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string; // As per ipapi.co
}