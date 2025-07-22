const ClientApp = () => {
  const [clients, setClients] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

  useEffect(() => {
    // Load data from JSON files (simulated)
    setClients(clientsData);
    setCities(algerianCitiesData);
    setFilteredClients(clientsData);
  }, []);

  useEffect(() => {
    // Filter clients based on search term and selections
    let filtered = clients.filter(client => {
      const matchesSearch = 
        client.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.wilayaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.communeName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWilaya = !selectedWilaya || client.wilayaCode === selectedWilaya;
      const matchesCommune = !selectedCommune || client.communeName === selectedCommune;

      return matchesSearch && matchesWilaya && matchesCommune;
    });

    setFilteredClients(filtered);
  }, [clients, searchTerm, selectedWilaya, selectedCommune]);

  const openGoogleMaps = (coordinates, address) => {
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=m&z=15`;
    window.open(url, '_blank');
  };

  const getUniqueWilayas = () => {
    const wilayas = [...new Set(cities.map(city => ({ code: city.wilayaCode, name: city.wilayaName })))];
    return wilayas.sort((a, b) => a.code.localeCompare(b.code));
  };

  const getUniqueCommunesForWilaya = () => {
    if (!selectedWilaya) {
      return [...new Set(cities.map(city => city.communeName))].sort();
    }
    return cities
      .filter(city => city.wilayaCode === selectedWilaya)
      .map(city => city.communeName)
      .filter((commune, index, array) => array.indexOf(commune) === index)
      .sort();
  };

  const handleWilayaChange = (wilayaCode) => {
    setSelectedWilaya(wilayaCode);
    setSelectedCommune(''); // Reset commune when wilaya changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mr-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Clients</h1>
                <p className="text-gray-600 mt-1">Système de gestion par Wilaya et Commune</p>
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

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher client, téléphone, localisation..."
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
                  <option key={wilaya.code} value={wilaya.code}>
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <MapIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <select
                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white appearance-none transition-all duration-200"
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                disabled={!selectedWilaya && getUniqueCommunesForWilaya().length > 20}
              >
                <option value="">Toutes les Communes</option>
                {getUniqueCommunesForWilaya().map(commune => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Liste des Clients
              {(selectedWilaya || selectedCommune) && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  - Filtré par {selectedWilaya && cities.find(c => c.wilayaCode === selectedWilaya)?.wilayaName}
                  {selectedCommune && ` / ${selectedCommune}`}
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
                  key={client.id}
                  client={client}
                  onMapClick={openGoogleMaps}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientApp;