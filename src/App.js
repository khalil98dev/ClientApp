import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Map, Phone, MapPin, AlertCircle, Loader } from 'lucide-react';

// ClientCard Component
const ClientCard = ({ client, onMapClick }) => {
  const parseCoordinates = (locationString) => {
    if (!locationString) return null;
    const [lat, lng] = locationString.split(',').map(coord => parseFloat(coord.trim()));
    return { lat, lng };
  };

  const coordinates = parseCoordinates(client.Location);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{client.FullName}</h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">{client.AllPhones}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm">{client.City}, {client.Wilaya}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-gray-700">{client.Wilaya}</div>
            <div className="text-xs text-gray-500">{client.City}</div>
          </div>
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            ID: {client.ClientID}
          </div>
        </div>
        
        {coordinates && (
          <button
            onClick={() => onMapClick(coordinates, `${client.City}, ${client.Wilaya}`)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
          >
            Voir sur la carte
          </button>
        )}
      </div>
    </div>
  );
};

// Debug Component pour afficher les erreurs
const DebugInfo = ({ error, loading, dataLength }) => {
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center">
          <Loader className="h-5 w-5 text-blue-500 animate-spin mr-3" />
          <span className="text-blue-700 font-medium">Chargement des données...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-red-700 text-sm mb-3">{error}</p>
            <div className="text-xs text-red-600 bg-red-100 p-3 rounded border">
              <strong>Solutions possibles :</strong>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Vérifiez que ClientsData.json est dans le dossier public/</li>
                <li>Vérifiez la structure du fichier JSON</li>
                <li>Ouvrez la console (F12) pour plus de détails</li>
                <li>Essayez d'accéder directement à : <code>http://localhost:3000/ClientsData.json</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dataLength === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-yellow-800 font-semibold mb-2">Fichier chargé mais vide</h3>
            <p className="text-yellow-700 text-sm">Le fichier JSON a été trouvé mais ne contient aucune donnée.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Main App Component
const ClientApp = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Tentative de chargement de ClientsData.json...');
        
        // Essayer différents chemins
        const possiblePaths = [
          '/ClientApp/ClientsData.json',
          './ClientsData.json',
          `${process.env.PUBLIC_URL}/ClientsData.json`
        ];
        
        let response;
        let successPath;
        
        for (const path of possiblePaths) {
          try {
            console.log(`Essai du chemin: ${path}`);
            response = await fetch(path);
            if (response.ok) {
              successPath = path;
              break;
            }
          } catch (e) {
            console.log(`Échec pour ${path}:`, e.message);
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Impossible de charger le fichier JSON. Status: ${response?.status || 'Réseau inaccessible'}`);
        }
        
        console.log(`✅ Fichier trouvé à: ${successPath}`);
        console.log('📊 Response status:', response.status);
        console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log('📄 Contenu brut (premiers 200 caractères):', text.substring(0, 200));
        
        if (!text.trim()) {
          throw new Error('Le fichier JSON est vide');
        }
        
        let clientsData;
        try {
          clientsData = JSON.parse(text);
        } catch (parseError) {
          throw new Error(`Erreur de parsing JSON: ${parseError.message}`);
        }
        
        console.log('✅ Données parsées:', clientsData);
        console.log('📈 Nombre de clients:', Array.isArray(clientsData) ? clientsData.length : 'Pas un tableau');
        
        if (!Array.isArray(clientsData)) {
          throw new Error('Le fichier JSON doit contenir un tableau de clients');
        }
        
        if (clientsData.length === 0) {
          console.warn('⚠️ Le tableau de clients est vide');
        }
        
        setClients(clientsData);
        setFilteredClients(clientsData);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        setError(error.message);
        setClients([]);
        setFilteredClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = 
        client.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.AllPhones?.toString().includes(searchTerm) ||
        client.Wilaya?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.City?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWilaya = !selectedWilaya || client.Wilaya?.toLowerCase() === selectedWilaya.toLowerCase();
      const matchesCity = !selectedCity || client.City?.toLowerCase() === selectedCity.toLowerCase();

      return matchesSearch && matchesWilaya && matchesCity;
    });

    setFilteredClients(filtered);
  }, [clients, searchTerm, selectedWilaya, selectedCity]);

  const openGoogleMaps = (coordinates, address) => {
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=m&z=15`;
    window.open(url, '_blank');
  };

  const getUniqueWilayas = () => {
    const wilayas = [...new Set(clients.map(client => client.Wilaya).filter(Boolean))];
    return wilayas.sort();
  };

  const getUniqueCitiesForWilaya = () => {
    if (!selectedWilaya) {
      return [...new Set(clients.map(client => client.City).filter(Boolean))].sort();
    }
    return clients
      .filter(client => client.Wilaya?.toLowerCase() === selectedWilaya.toLowerCase())
      .map(client => client.City)
      .filter((city, index, array) => city && array.indexOf(city) === index)
      .sort();
  };

  const handleWilayaChange = (wilaya) => {
    setSelectedWilaya(wilaya);
    setSelectedCity('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Debug Info */}
        <DebugInfo error={error} loading={loading} dataLength={clients.length} />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mr-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Clients</h1>
                <p className="text-gray-600 mt-1">Système de gestion par Wilaya et Ville</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-blue-50 px-6 py-4 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{filteredClients.length}</div>
                <div className="text-blue-600 text-sm">Clients</div>
              </div>
              <div className="bg-green-50 px-6 py-4 rounded-xl border border-green-200">
                <div className="text-2xl font-bold text-green-700">{getUniqueWilayas().length}</div>
                <div className="text-green-600 text-sm">Wilayas</div>
              </div>
            </div>
          </div>

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher nom, téléphone, wilaya, ville..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <select
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white appearance-none transition-all duration-200"
                  value={selectedWilaya}
                  onChange={(e) => handleWilayaChange(e.target.value)}
                >
                  <option value="">Toutes les Wilayas</option>
                  {getUniqueWilayas().map(wilaya => (
                    <option key={wilaya} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <Map className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <select
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white appearance-none transition-all duration-200"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedWilaya && getUniqueCitiesForWilaya().length > 20}
                >
                  <option value="">Toutes les Villes</option>
                  {getUniqueCitiesForWilaya().map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Client Cards Grid */}
        {!loading && !error && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Liste des Clients
                {(selectedWilaya || selectedCity) && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    - Filtré par {selectedWilaya}
                    {selectedCity && ` / ${selectedCity}`}
                  </span>
                )}
              </h2>
              {searchTerm && (
                <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                  Recherche: "{searchTerm}" - {filteredClients.length} résultat(s)
                </div>
              )}
            </div>

            {filteredClients.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun client trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche ou de filtrage</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                  <ClientCard
                    key={client.ClientID}
                    client={client}
                    onMapClick={openGoogleMaps}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientApp;