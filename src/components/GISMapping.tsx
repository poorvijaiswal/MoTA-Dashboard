import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Update path if necessary
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import holdersData from '@/data/holders.json';
import districtsGeoJSON from '@/data/districts.json'; // GeoJSON file of district boundaries

const defaultCenter: [number, number] = [22.5, 80.5];
const holders = holdersData.holders.filter(h => h.latitude && h.longitude);

const availableStates = ["Madhya Pradesh", "Odisha", "Tripura", "Telangana"];

const GISMapping = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Filter holders by state and district
  const filteredHolders = holders.filter(h =>
    (!selectedState || h.state === selectedState) &&
    (!selectedDistrict || h.district === selectedDistrict)
  );

  // Claim statistics
  const totalClaims = filteredHolders.length;
  const approvedClaims = filteredHolders.filter(h => h.status === "Approved").length;

  // Find district boundary in GeoJSON
  const selectedBoundaryFeature = districtsGeoJSON.features.find(
    (f: any) =>
      f.properties.state_name === selectedState &&
      f.properties.district_name === selectedDistrict
  );

  const selectedBoundary = selectedBoundaryFeature
    ? { type: "FeatureCollection", features: [selectedBoundaryFeature] }
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        <h2 className="font-bold text-2xl mb-4 text-green-800">GIS Mapping</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="font-semibold text-gray-700">State:</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict("");
              }}
              className="ml-2 p-2 border rounded shadow-sm focus:outline-green-400"
            >
              <option value="">All</option>
              {availableStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-700">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="ml-2 p-2 border rounded shadow-sm focus:outline-green-400"
              disabled={!selectedState}
            >
              <option value="">All</option>
              {[...new Set(holders
                .filter(h => h.state === selectedState)
                .map(h => h.district))].map(d => (
                  <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 text-gray-800">
          <span className="mr-6"><b>Total Claims:</b> {totalClaims}</span>
          <span><b>Approved Claims:</b> {approvedClaims}</span>
        </div>

        {/* Map */}
        <div className="w-full flex justify-center items-center">
          <MapContainer
            center={defaultCenter}
            zoom={5}
            style={{
              height: "500px",
              width: "100%",
              maxWidth: "1200px",
              borderRadius: "16px",
              boxShadow: "0 4px 16px #0002",
              border: "2px solid #38a169",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {selectedBoundary && (
              <GeoJSON
                data={selectedBoundary}
                style={{
                  color: "#006400",
                  weight: 3,
                  fillColor: "#32CD32",
                  fillOpacity: 0.25,
                }}
              />
            )}

            {/* Markers */}
            {filteredHolders.map(h => (
              <Marker key={h.id} position={[h.latitude, h.longitude]}>
                <Popup>
                  <div className="text-green-900 font-bold">{h.name}</div>
                  <div><b>Tribe:</b> {h.tribe}</div>
                  <div><b>State:</b> {h.state}</div>
                  <div><b>District:</b> {h.district}</div>
                  <div><b>Land:</b> {h.land_size}</div>
                  <div><b>Status:</b> {h.status || "Not Available"}</div>
                  <div><b>Claim ID:</b> {h.claim_id}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-center">
          * Only holders with latitude/longitude are shown. Update your data for accurate mapping.
        </div>
      </main>
    </div>
  );
};

export default GISMapping;
