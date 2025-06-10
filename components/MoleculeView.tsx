
import React from 'react';
import type { MoleculeData, GeminiContent } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MoleculeViewProps {
  data: MoleculeData;
  geminiContent: GeminiContent | null;
  geminiLoading: boolean;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold text-brand-primary mb-3 border-b pb-2">{title}</h3>
    {children}
  </div>
);

const MoleculeView: React.FC<MoleculeViewProps> = ({ data, geminiContent, geminiLoading }) => {
  return (
    <div className="mt-8 space-y-6 animate-fadeInUp">
      <h2 className="text-4xl font-bold text-center text-brand-text mb-6">{data.title || data.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <InfoCard title="2D Structure">
          <img 
            src={data.imageUrl2D} 
            alt={`${data.name} 2D structure`} 
            className="mx-auto border rounded-md shadow-sm max-w-full h-auto"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found')}
          />
        </InfoCard>

        <InfoCard title="3D Conformer">
          <div className="aspect-square border rounded-md shadow-sm overflow-hidden">
            <iframe
              src={data.iframeSrc3D}
              title={`${data.name} 3D Conformer`}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
        </InfoCard>
      </div>

      <InfoCard title="Chemical Properties">
        <ul className="space-y-2 text-gray-700">
          <li><strong>Molecular Formula:</strong> {data.molecularFormula}</li>
          <li><strong>Molecular Weight:</strong> {data.molecularWeight} g/mol</li>
          {data.iupacName && <li><strong>IUPAC Name:</strong> {data.iupacName}</li>}
          {data.synonyms && data.synonyms.length > 0 && (
            <li><strong>Synonyms:</strong> {data.synonyms.slice(0, 5).join(', ')}{data.synonyms.length > 5 ? '...' : ''}</li>
          )}
        </ul>
      </InfoCard>

      {geminiLoading && !geminiContent && <LoadingSpinner message="Loading AI insights..." />}
      
      {geminiContent?.quickBio && (
        <InfoCard title="Quick Bio (AI Generated)">
          <p className="text-gray-700 leading-relaxed">{geminiContent.quickBio}</p>
        </InfoCard>
      )}

      {geminiContent?.keyProperties && (
         <InfoCard title="Key Properties (AI Generated)">
           <ul className="space-y-2 text-gray-700">
             <li><strong>Classification:</strong> {geminiContent.keyProperties.classification}</li>
             <li><strong>Commonly Found In:</strong> {geminiContent.keyProperties.foundIn}</li>
             <li><strong>Biochemical Role:</strong> {geminiContent.keyProperties.biochemicalRole}</li>
           </ul>
         </InfoCard>
      )}
      
      <InfoCard title="External Links">
        <div className="flex flex-wrap gap-4">
          <a href={data.pubchemUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-blue-700 hover:underline font-medium">
            View on PubChem
          </a>
          <a href={data.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-blue-700 hover:underline font-medium">
            View on Wikipedia
          </a>
        </div>
      </InfoCard>
    </div>
  );
};

export default MoleculeView;