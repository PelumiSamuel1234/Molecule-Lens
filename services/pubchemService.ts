
import { PUBCHEM_API_BASE } from '../constants';
import type { PubChemProperty, PubChemCIDResponse, PubChemPropertiesResponse } from '../types';

async function getDetailedPubChemError(response: Response, context: string): Promise<string> {
  let errorMessage = `Status: ${response.status} (${response.statusText || 'No status text'})`;
  try {
    const errorData = await response.json();
    if (errorData && errorData.Fault) {
      const fault = errorData.Fault;
      if (fault.Message) {
        errorMessage += ` - Message: ${fault.Message}`;
      }
      if (fault.Details && Array.isArray(fault.Details) && fault.Details.length > 0) {
        errorMessage += ` - Details: ${fault.Details.join('; ')}`;
      } else if (fault.Details) {
        errorMessage += ` - Details: ${JSON.stringify(fault.Details)}`;
      }
    } else {
      // If not the expected Fault structure, attempt to re-read as text
      // This is a bit tricky because response.json() consumes the body.
      // For simplicity, we'll rely on the initial status if .json() doesn't yield a Fault.
      // A more robust solution might involve cloning the response if we need to try multiple parsing methods.
      // const textResponse = await response.text(); 
      // if (textResponse) errorMessage += ` - Response: ${textResponse.substring(0, 200)}`;
    }
  } catch (e) {
    // If JSON parsing fails
    // console.warn(`Could not parse error response body as JSON for ${context}:`, e);
    // Try to get text, but the body might have been consumed or be non-existent
    try {
        const textResponse = await response.text(); // This will fail if body already read by response.json()
        if (textResponse) errorMessage += ` - Raw Response: ${textResponse.substring(0,200)}`;
    } catch (textError) {
        // console.warn(`Could not read error response body as text for ${context}:`, textError);
    }
  }
  return `PubChem API error (${context}): ${errorMessage}`;
}

export async function getMoleculeCID(name: string): Promise<number | null> {
  try {
    const response = await fetch(`${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`);
    if (!response.ok) {
      if (response.status === 404) return null; // Not found is a valid case
      const detailedError = await getDetailedPubChemError(response, 'fetching CID');
      throw new Error(detailedError);
    }
    const data = await response.json() as PubChemCIDResponse;
    if (data.IdentifierList && data.IdentifierList.CID && data.IdentifierList.CID.length > 0) {
      return data.IdentifierList.CID[0];
    }
    return null;
  } catch (error) {
    console.error("Error in getMoleculeCID for PubChem:", error);
    // Re-throw the original error if it's already detailed, or the new error
    throw error; 
  }
}

export async function getMoleculeProperties(cid: number): Promise<PubChemProperty | null> {
  try {
    // "Synonyms" was removed as it caused "Invalid property" error.
    // PubChem might return synonyms by default or they might be part of other fields.
    // If not, properties.Synonyms will be undefined, which is handled.
    const properties = "MolecularFormula,MolecularWeight,Title,IUPACName";
    const response = await fetch(`${PUBCHEM_API_BASE}/compound/cid/${cid}/property/${properties}/JSON`);
    if (!response.ok) {
      const detailedError = await getDetailedPubChemError(response, 'fetching properties');
      throw new Error(detailedError);
    }
    const data = await response.json() as PubChemPropertiesResponse;
    if (data.PropertyTable && data.PropertyTable.Properties && data.PropertyTable.Properties.length > 0) {
      // Ensure Synonyms is at least an empty array if not provided by the API
      const props = data.PropertyTable.Properties[0];
      if (!props.Synonyms) {
        props.Synonyms = [];
      }
      return props;
    }
    return null;
  } catch (error) {
    console.error("Error in getMoleculeProperties for PubChem:", error);
    throw error;
  }
}

export function getMolecule2DImageUrl(cidOrName: number | string): string {
  if (typeof cidOrName === 'number') {
    return `${PUBCHEM_API_BASE}/compound/cid/${cidOrName}/PNG?image_size=300x300`;
  }
  return `${PUBCHEM_API_BASE}/compound/name/${encodeURIComponent(cidOrName)}/PNG?image_size=300x300`;
}

export function getMolecule3DViewerUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=3D-Conformer&embed=true`;
}

export function getPubChemPageUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
}

export function getWikipediaUrl(moleculeName: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(moleculeName)}`;
}
