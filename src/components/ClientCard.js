const ClientCard = ({ client, onMapClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{client.client}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapIcon className="h-4 w-4 mr-1" />
              <span>{client.wilayaName} ({client.wilayaCode})</span>
            </div>
          </div>
        </div>
        <div className="bg-green-50 px-3 py-1 rounded-full">
          <span className="text-green-700 text-xs font-medium">ID: {client.id}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Commune:</span>
          </div>
          <span className="text-sm text-gray-600">{client.communeName}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Daïra:</span>
          </div>
          <span className="text-sm text-gray-600">{client.dairaName}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Téléphone:</span>
          </div>
          <span className="text-sm text-gray-600">{client.phone}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start mb-3">
          <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
          <div>
            <span className="text-sm font-medium text-gray-700">Localisation:</span>
            <p className="text-sm text-gray-600 mt-1">{client.localisation}</p>
          </div>
        </div>
        
        <button
          onClick={() => onMapClick(client.coordinates, client.localisation)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Voir sur Google Maps
        </button>
      </div>
    </div>
  );
};