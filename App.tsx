
import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MoleculeView from './components/MoleculeView';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { 
  getMoleculeCID, 
  getMoleculeProperties, 
  getMolecule2DImageUrl, 
  getMolecule3DViewerUrl,
  getPubChemPageUrl,
  getWikipediaUrl
} from './services/pubchemService';
import { generateQuickBio, generateKeyProperties } from './services/geminiService';
import type { MoleculeData, GeminiContent, PubChemProperty, SearchLog, IPGeoInfo } from './types';

const MAX_SEARCH_LOGS = 100; // Limit the number of logs stored

type AppView = 'main' | 'adminLogin' | 'adminDashboard';

const App: React.FC = () => {
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [geminiContent, setGeminiContent] = useState<GeminiContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const [currentView, setCurrentView] = useState<AppView>('main');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([]);

  useEffect(() => {
    // Load search logs from localStorage on initial mount
    const storedLogs = localStorage.getItem('searchLogs');
    if (storedLogs) {
      setSearchLogs(JSON.parse(storedLogs));
    }
    // Check for admin session
    const adminSession = sessionStorage.getItem('isAdminLoggedIn');
    if (adminSession === 'true') {
        setIsAdminLoggedIn(true);
        // Potentially redirect to dashboard if hash indicates, or stay on main
        if (window.location.hash === '#admin-dashboard') {
            setCurrentView('adminDashboard');
        }
    }


    const handleHashChange = () => {
      if (window.location.hash === '#admin-login' && !isAdminLoggedIn) {
        setCurrentView('adminLogin');
      } else if (window.location.hash === '#admin-dashboard' && isAdminLoggedIn) {
        setCurrentView('adminDashboard');
      } else if (window.location.hash === '' || window.location.hash === '#') {
         setCurrentView('main');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminLoggedIn]);

  const logSearchActivity = async (query: string) => {
    let ipGeoInfo: Partial<IPGeoInfo> = { ip: 'N/A' };
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json() as IPGeoInfo; // Type assertion
        ipGeoInfo = {
            ip: data.ip || 'N/A',
            city: data.city,
            region: data.region,
            country_name: data.country_name
        };
      } else {
        console.warn('Could not fetch IP geolocation data:', response.status);
      }
    } catch (e) {
      console.error('Error fetching IP geolocation data:', e);
    }

    const newLog: SearchLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      query,
      ip: ipGeoInfo.ip || 'N/A',
      city: ipGeoInfo.city || 'Unknown',
      region: ipGeoInfo.region || 'Unknown',
      country: ipGeoInfo.country_name || 'Unknown',
    };

    setSearchLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs].slice(0, MAX_SEARCH_LOGS);
      localStorage.setItem('searchLogs', JSON.stringify(updatedLogs));
      return updatedLogs;
    });
  };

  const fetchAndSetGeminiContent = useCallback(async (name: string, pubchemProps: PubChemProperty | null) => {
    setIsGeminiLoading(true);
    try {
      const [bio, props] = await Promise.all([
        generateQuickBio(name, pubchemProps),
        generateKeyProperties(name)
      ]);
      setGeminiContent({ quickBio: bio, keyProperties: props });
    } catch (geminiError) {
      console.error("Error fetching Gemini content:", geminiError);
      setGeminiContent({ 
        quickBio: "Could not load AI-generated summary.", 
        keyProperties: null 
      });
    } finally {
      setIsGeminiLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setMoleculeData(null);
    setGeminiContent(null);
    setInitialLoad(false);
    if (currentView !== 'main') { // Ensure view is main on new search, and update hash
      setCurrentView('main');
      window.location.hash = '';
    }


    try {
      await logSearchActivity(query); // Log search activity

      const cid = await getMoleculeCID(query);
      if (!cid) {
        setError(`Molecule "${query}" not found on PubChem.`);
        setIsLoading(false);
        return;
      }

      const properties = await getMoleculeProperties(cid);
      if (!properties) {
        setError(`Could not retrieve properties for "${query}" (CID: ${cid}).`);
        setIsLoading(false);
        return;
      }
      
      const fetchedMoleculeData: MoleculeData = {
        cid: properties.CID,
        name: query, 
        title: properties.Title || query,
        molecularFormula: properties.MolecularFormula,
        molecularWeight: properties.MolecularWeight,
        synonyms: properties.Synonyms || [],
        iupacName: properties.IUPACName,
        imageUrl2D: getMolecule2DImageUrl(cid),
        iframeSrc3D: getMolecule3DViewerUrl(cid),
        pubchemUrl: getPubChemPageUrl(cid),
        wikipediaUrl: getWikipediaUrl(properties.Title || query),
      };
      setMoleculeData(fetchedMoleculeData);
      
      fetchAndSetGeminiContent(fetchedMoleculeData.title, properties);

    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during search.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndSetGeminiContent, currentView]); // Added currentView dependency

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('isAdminLoggedIn', 'true');
    setCurrentView('adminDashboard');
    window.location.hash = '#admin-dashboard';
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('isAdminLoggedIn');
    setCurrentView('main');
    window.location.hash = '';
  };
  
  const navigateToAdminLogin = (e: React.MouseEvent<HTMLAnchorElement>) => { 
    e.preventDefault();
    if (isAdminLoggedIn) {
        setCurrentView('adminDashboard');
        window.location.hash = '#admin-dashboard';
    } else {
        setCurrentView('adminLogin');
        window.location.hash = '#admin-login';
    }
  };

  const renderView = () => {
    if (currentView === 'adminLogin') {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (currentView === 'adminDashboard' && isAdminLoggedIn) {
      return <AdminDashboard logs={searchLogs} onLogout={handleLogout} />;
    }

    // Default to main view
    return (
      <>
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-brand-primary">Molecule Lens</h1>
          <p className="text-lg text-gray-600 mt-2">Your Pocket Guide to the World of Molecules</p>
        </header>

        <main className="container mx-auto max-w-4xl">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {isLoading && <LoadingSpinner message="Fetching molecule data..." size="lg" />}
          {error && <ErrorMessage message={error} />}
          
          {!isLoading && !error && !moleculeData && !initialLoad && (
            <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-500">No molecule data to display. Try a new search.</p>
            </div>
          )}

          {!isLoading && !error && moleculeData && (
            <MoleculeView 
              data={moleculeData} 
              geminiContent={geminiContent} 
              geminiLoading={isGeminiLoading} 
            />
          )}

          {initialLoad && !isLoading && !moleculeData && (
              <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-xl">
                  <img src="https://picsum.photos/seed/moleculeart/600/300" alt="Abstract molecular art" className="w-full max-w-md mx-auto rounded-lg mb-6 shadow-md"/>
                  <h2 className="text-2xl font-semibold text-brand-primary mb-3">Welcome to Molecule Lens!</h2>
                  <p className="text-gray-600 mb-4">
                      Type the name of a chemical compound (like "Aspirin", "Caffeine", or "Glucose") into the search bar above.
                  </p>
                  <p className="text-gray-600">
                      Discover its 2D and 3D structures, chemical properties, and AI-powered insights into what it is and what it does.
                  </p>
              </div>
          )}
        </main>
      </>
    );
  };


  return (
    <div className="min-h-screen bg-brand-background text-brand-text p-4 md:p-8 flex flex-col">
      <div className="flex-grow">
        {renderView()}
      </div>
      <footer className="text-center mt-12 py-6 border-t border-gray-300">
        <p className="text-sm text-gray-500">
          Molecule Lens &copy; {new Date().getFullYear()}. 
          All rights reserved OLAWAMIDE SAMUEL.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <a href="#admin-login" onClick={navigateToAdminLogin} className="hover:underline text-brand-secondary">
            Admin Panel
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
