import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import holdersData from "../data/holders.json";

const defaultCenter: [number, number] = [22.5, 80.5];

const holders = holdersData.holders.filter(h => h.latitude && h.longitude);

const GISMapping = () => (
  <div className="p-6 bg-gray-50">
    <h2 className="font-bold text-2xl mb-4 text-green-800">GIS Mapping</h2>
    <div className="mb-2 text-gray-700">
      <span className="font-semibold">Showing actual locations of patta holders (if available)</span>
    </div>
    <div className="w-full flex justify-center items-center">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{
          height: "500px",
          width: "90vw",
          maxWidth: "1200px",
          borderRadius: "16px",
          boxShadow: "0 4px 16px #0002",
          border: "2px solid #38a169",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {holders.map((h, idx) => (
          <Marker
            key={h.id || idx}
            position={[h.latitude, h.longitude]}
          >
            <Popup>
              <div className="text-green-900 font-bold">{h.name}</div>
              <div><b>Tribe:</b> {h.tribe}</div>
              <div><b>State:</b> {h.state}</div>
              <div><b>Land:</b> {h.land_size}</div>
              <div><b>Claim ID:</b> {h.claim_id}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
    <div className="mt-2 text-xs text-gray-500 text-center">
      * Only holders with latitude/longitude are shown. Update your data for accurate mapping.
    </div>
  </div>
);

export default GISMapping;