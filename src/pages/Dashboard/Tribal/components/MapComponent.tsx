import { MapPin, Trees, Droplets } from "lucide-react";

interface Claim {
  id: string;
  coordinates: {
    type: string;
    coordinates: number[][][];
  };
  area_hectares: number;
  claim_type: string;
}

interface Asset {
  id: string;
  name: string;
  type: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

interface MapComponentProps {
  selectedClaim: Claim | null;
}

const MapComponent = ({ selectedClaim }: MapComponentProps) => {
  // Mock assets data
  const assets: Asset[] = [
    {
      id: 'AST001',
      name: 'Gadchiroli Reserve Forest',
      type: 'Forest',
      coordinates: { latitude: 20.1400, longitude: 79.9600 },
      description: 'Dense forest area with teak and bamboo plantation'
    },
    {
      id: 'AST002',
      name: 'Community Pond',
      type: 'Water Body',
      coordinates: { latitude: 20.1350, longitude: 79.9550 },
      description: 'Traditional community pond used for irrigation and fishing'
    }
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg relative overflow-hidden border">
      {/* Mock Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Selected Land Claim */}
      {selectedClaim && (
        <div className="absolute inset-4">
          <div 
            className="bg-primary/20 border-2 border-primary rounded-lg p-4 h-32 w-48 mx-auto mt-8"
            style={{ 
              position: 'relative',
              transform: 'rotate(-5deg)'
            }}
          >
            <div className="bg-white/90 rounded p-2 text-xs">
              <h3 className="font-medium text-primary">{selectedClaim.claim_type}</h3>
              <p className="text-gray-600">Area: {selectedClaim.area_hectares} hectares</p>
              <p className="text-gray-600">ID: {selectedClaim.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Asset Markers */}
      <div className="absolute top-4 right-4">
        <div className="bg-success/80 text-white rounded-full p-2 mb-2" title="Gadchiroli Reserve Forest">
          <Trees className="w-4 h-4" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <div className="bg-primary/80 text-white rounded-full p-2" title="Community Pond">
          <Droplets className="w-4 h-4" />
        </div>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-3 text-xs">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="font-medium">Gadchiroli, Maharashtra</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Land Claim</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trees className="w-3 h-3 text-success" />
            <span>Forest</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="w-3 h-3 text-primary" />
            <span>Water Body</span>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="absolute top-2 left-2 bg-warning/80 text-warning-foreground text-xs px-2 py-1 rounded">
        Demo Map View
      </div>

      {/* Assets Info Panel */}
      <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-3 max-w-48">
        <h4 className="font-medium text-sm mb-2">Nearby Assets</h4>
        <div className="space-y-2 text-xs">
          {assets.map((asset) => (
            <div key={asset.id} className="flex items-start space-x-2">
              {asset.type === 'Forest' ? (
                <Trees className="w-3 h-3 text-success mt-0.5" />
              ) : (
                <Droplets className="w-3 h-3 text-primary mt-0.5" />
              )}
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-gray-500 text-xs">{asset.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;