import React from 'react';
import type { MoleculeData, GeminiContent } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MoleculeViewProps {
  data: MoleculeData;
  geminiContent: GeminiContent | null;
  geminiLoading: boolean;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; gradient?: string; icon?: React.ReactNode }> = ({ 
  title, 
  children, 
  gradient = "from-blue-500 to-purple-500",
  icon 
}) => (
  <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
    <div className={`bg-gradient-to-r ${gradient} p-4 flex items-center gap-3`}>
      {icon && <div className="text-white">{icon}</div>}
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const MoleculeView: React.FC<MoleculeViewProps> = ({ data, geminiContent, geminiLoading }) => {
  return (
    <div className="mt-8 space-y-8 animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {data.title || data.name}
        </h2>
        <p className="text-gray-500 text-lg">CID: {data.cid}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard 
          title="2D Structure" 
          gradient="from-blue-500 to-cyan-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          }
        >
          <div className="relative group/img">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
            <img 
              src={data.imageUrl2D} 
              alt={`${data.name} 2D structure`} 
              className="relative mx-auto border-2 border-gray-200 rounded-lg shadow-md max-w-full h-auto bg-white p-4 hover:scale-105 transition-transform duration-300"
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found')}
            />
          </div>
        </InfoCard>

        <InfoCard 
          title="3D Conformer" 
          gradient="from-purple-500 to-pink-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        >
          <div className="w-full h-96 border-2 border-gray-200 rounded-lg shadow-md overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <iframe
              src={data.iframeSrc3D}
              title={`${data.name} 3D Conformer`}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
        </InfoCard>
      </div>

      <InfoCard 
        title="Chemical Properties" 
        gradient="from-green-500 to-teal-500"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Molecular Formula</p>
            <p className="text-lg font-bold text-gray-800">{data.molecularFormula}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Molecular Weight</p>
            <p className="text-lg font-bold text-gray-800">{data.molecularWeight} g/mol</p>
          </div>
        </div>
        {data.iupacName && (
          <div className="mt-4 p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
            <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide mb-1">IUPAC Name</p>
            <p className="text-sm text-gray-800 break-words">{data.iupacName}</p>
          </div>
        )}
        {data.synonyms && data.synonyms.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">Synonyms</p>
            <div className="flex flex-wrap gap-2">
              {data.synonyms.slice(0, 8).map((syn, idx) => (
                <span key={idx} className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs shadow-sm border border-gray-200">
                  {syn}
                </span>
              ))}
              {data.synonyms.length > 8 && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                  +{data.synonyms.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
      </InfoCard>

      {geminiLoading && !geminiContent && (
        <div className="flex justify-center py-8">
          <LoadingSpinner message="Loading AI insights..." size="lg" />
        </div>
      )}
      
      {geminiContent?.quickBio && (
        <InfoCard 
          title="Quick Bio" 
          gradient="from-orange-500 to-red-500"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">AI</span>
            </div>
            <p className="text-gray-700 leading-relaxed flex-1">{geminiContent.quickBio}</p>
          </div>
        </InfoCard>
      )}

      {geminiContent?.keyProperties && (
         <InfoCard 
           title="Key Properties" 
           gradient="from-violet-500 to-purple-500"
           icon={
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
           }
         >
           <div className="space-y-4">
             <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-violet-50 to-violet-100 rounded-lg">
               <svg className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
               </svg>
               <div>
                 <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Classification</p>
                 <p className="text-gray-800">{geminiContent.keyProperties.classification}</p>
               </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
               <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <div>
                 <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Found In</p>
                 <p className="text-gray-800">{geminiContent.keyProperties.foundIn}</p>
               </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 rounded-lg">
               <svg className="w-5 h-5 text-fuchsia-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
               <div>
                 <p className="text-xs font-semibold text-fuchsia-600 uppercase tracking-wide mb-1">Biochemical Role</p>
                 <p className="text-gray-800">{geminiContent.keyProperties.biochemicalRole}</p>
               </div>
             </div>
           </div>
         </InfoCard>
      )}
      
      <InfoCard 
        title="External Resources" 
        gradient="from-cyan-500 to-blue-500"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        }
      >
        <div className="flex flex-wrap gap-4">
          <a 
            href={data.pubchemUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PubChem
          </a>
          <a 
            href={data.wikipediaUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Wikipedia
          </a>
        </div>
      </InfoCard>
    </div>
  );
};

export default MoleculeView;