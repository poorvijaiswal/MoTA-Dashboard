// src/pages/DSSEngineModular.tsx
import { useState } from "react";
import claimsRaw from "../data/claims.json";
import schemesRaw from "../data/schemes.json";
import { useRecommendations } from "../hooks/useRecommendations";
import { Claim, Scheme, RecommendationRow } from "../lib/schemeEngine";

/**
 * DSS Engine — Modular Real-time Recommendations
 *
 * Features:
 * - Real-time recommendations (no "Run DSS" button needed)
 * - Modular scheme engine for better maintainability
 * - Enhanced filtering and sorting
 * - Professional UI with detailed insights
 * - Export capabilities
 */

/* ----------------------- Load data ----------------------- */
const rawClaims: any = (claimsRaw as any).claims || claimsRaw;
const rawSchemes: any = (schemesRaw as any).schemes || schemesRaw;
const claims: Claim[] = Array.isArray(rawClaims) ? rawClaims : Object.values(rawClaims);
const schemes: Scheme[] = Array.isArray(rawSchemes) ? rawSchemes : Object.values(rawSchemes);

/* ----------------------- Component ----------------------- */

export default function DSSEngine(): JSX.Element {
  // Use the modular recommendations hook
  const {
    recommendations,
    allRecommendations,
    stats,
    locationOptions,
    filters,
    sort,
    pagination,
    updateFilter,
    updateSort,
    updatePagination,
    resetFilters,
    updateLocationFilters,
  } = useRecommendations(claims, schemes);

  // UI state
  const [selectedRow, setSelectedRow] = useState<RecommendationRow | null>(null);
  const [showMainContent, setShowMainContent] = useState(false);

  /* ----------------------- Export functions ----------------------- */
  function exportCSV() {
    const headers = [
      "Recommendation ID", "Holder ID", "Holder Name", "Location", 
      "Priority", "Match Score", "Suggested Schemes", "Top Scheme", "Eligibility Reason"
    ];
    const rows = [headers.join(",")].concat(
      allRecommendations.map((r) =>
        [
          r.recommendationId,
          r.holderId ?? "",
          `"${(r.holderName ?? "").replace(/"/g, '""')}"`,
          `"${r.target.replace(/"/g, '""')}"`,
          r.priority,
          Math.round(r.score * 100),
          `"${r.suggestedSchemes.map((s) => s.name).join("; ").replace(/"/g, '""')}"`,
          `"${r.suggestedSchemes.length > 0 ? r.suggestedSchemes[0].name : 'None'}"`,
          `"${r.suggestedSchemes.length > 0 ? r.suggestedSchemes[0].reason || '' : ''}"`,
        ].join(",")
      )
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dss_recommendations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportGeoJSON() {
    const features = allRecommendations
      .filter(r => r.raw?.coords)
      .map(r => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: Array.isArray(r.raw.coords) 
            ? [r.raw.coords[0], r.raw.coords[1]]
            : [r.raw.coords.lon, r.raw.coords.lat]
        },
        properties: {
          recommendationId: r.recommendationId,
          holderName: r.holderName,
          location: r.target,
          priority: r.priority,
          matchScore: Math.round(r.score * 100),
          suggestedSchemes: r.suggestedSchemes.map(s => s.name).join(", "),
          topScheme: r.suggestedSchemes.length > 0 ? r.suggestedSchemes[0].name : null,
          eligibilityReason: r.suggestedSchemes.length > 0 ? r.suggestedSchemes[0].reason : null
        }
      }));

    const geojson = {
      type: "FeatureCollection",
      features: features
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dss_recommendations_${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ----------------------- UI helpers ----------------------- */
  function priorityBadge(p: "High" | "Medium" | "Low") {
    if (p === "High") return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold">High</span>;
    if (p === "Medium") return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">Medium</span>;
    return <span className="px-2 py-1 rounded bg-green-50 text-green-800 text-xs font-semibold">Low</span>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Decision Support System</h1>
            <p className="text-sm text-gray-600 mt-1">Real-time scheme recommendations for patta holders</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={exportCSV}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span>Export CSV</span>
            </button>
            <button 
              onClick={exportGeoJSON}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span>Export GeoJSON</span>
            </button>
            <button 
              onClick={resetFilters}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Segment Builder Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-auto min-h-screen overflow-y-auto">
          <div className="px-6 py-2">
            {/* <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-blue-100 rounded">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Segment Builder</h2>
            </div> */}

            <div className="space-y-2">
              {/* ...existing filters... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={filters.selectedState} 
                  onChange={(e) => updateLocationFilters(e.target.value)}
                >
                  <option value="">All States</option>
                  {locationOptions.states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={filters.selectedDistrict} 
                  onChange={(e) => updateLocationFilters(filters.selectedState, e.target.value)}
                  disabled={!filters.selectedState}
                >
                  <option value="">All Districts</option>
                  {locationOptions.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Village Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={filters.selectedVillage} 
                  onChange={(e) => updateLocationFilters(filters.selectedState, filters.selectedDistrict, e.target.value)}
                  disabled={!filters.selectedDistrict}
                >
                  <option value="">All Villages</option>
                  {locationOptions.villages.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>


              {/* Scheme Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Category</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={filters.selectedSchemeId} 
                  onChange={(e) => updateFilter('selectedSchemeId', e.target.value)}
                >
                  <option value="">All Schemes (Multi-scheme analysis)</option>
                  {schemes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Show Only Eligible */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showOnlyEligible"
                  checked={filters.showOnlyEligible}
                  onChange={(e) => updateFilter('showOnlyEligible', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showOnlyEligible" className="ml-2 text-sm text-gray-700">
                  Show only eligible recommendations
                </label>
              </div>
            </div>

            {/* Run DSS Button */}
            <div className="mt-8 flex justify-center">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                onClick={() => setShowMainContent(true)}
              >
                Run DSS
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area (conditionally rendered) */}
        <div className="flex-1 overflow-hidden">
          {!showMainContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Run DSS to see scheme recommendations</h2>
                <p className="text-gray-500">Click the <span className="font-semibold text-blue-600">Run DSS</span> button in the sidebar to generate recommendations for patta holders.</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Stats and Top Schemes at top */}
              <div className="flex flex-col md:flex-row gap-6 px-6 pt-6">
                {/* Live Statistics */}
                <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Live Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Patta Holders:</span>
                      <span className="text-sm font-semibold">{stats.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Eligible for Schemes:</span>
                      <span className="text-sm font-semibold">{stats.eligible.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">High Priority:</span>
                      <span className="text-sm font-semibold text-red-600">{stats.highPriority}</span>
                    </div>
                    
                  </div>
                </div>
                {/* Top Schemes */}
                <div className="flex-1 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">Most Recommended Schemes</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.schemeDistribution)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([schemeName, count]) => (
                        <div key={schemeName} className="flex justify-between">
                          <span className="text-xs text-blue-700 truncate">{schemeName}</span>
                          <span className="text-xs font-semibold text-blue-900">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/* ...existing recommendations and pagination code... */}
              {/* Recommendations Header */}
              

              {/* Recommendations List */}
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-4">
                  {recommendations.map((r) => (
                    <div key={r.recommendationId} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedRow(r)}>
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-medium text-gray-900">{r.holderName}</h3>
                                {priorityBadge(r.priority)}
                                <span className="text-sm text-gray-500">→ {Math.round(r.score * 100)}% match</span>
                              </div>
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                <span>{r.target}</span>
                                <span>Updated now</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedRow(r); }}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              >
                                View Profile
                              </button>
                              <button className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800">
                                Generate Letter
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Scheme Recommendations */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {r.suggestedSchemes.slice(0, 3).map((scheme) => (
                            <div key={scheme.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm text-gray-900">{scheme.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{Math.round((scheme.score || 0) * 100)}% match</div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {r.suggestedSchemes.length === 0 && (
                            <div className="col-span-3 p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                              No scheme recommendations available for current filters
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {recommendations.length === 0 && (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Try adjusting your filters or enable "Show only eligible recommendations" to see results.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {stats.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4">
                    <div className="text-sm text-gray-700">
                      Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, stats.total)} of {stats.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updatePagination({ page: 1 })} 
                        disabled={pagination.page === 1} 
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        First
                      </button>
                      <button 
                        onClick={() => updatePagination({ page: Math.max(1, pagination.page - 1) })} 
                        disabled={pagination.page === 1} 
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {/* Page Numbers */}
                      {[...Array(Math.min(5, stats.totalPages))].map((_, i) => {
                        const pageNum = Math.max(1, pagination.page - 2) + i;
                        if (pageNum > stats.totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updatePagination({ page: pageNum })}
                            className={`px-3 py-2 text-sm border rounded-md ${
                              pagination.page === pageNum 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button 
                        onClick={() => updatePagination({ page: Math.min(stats.totalPages, pagination.page + 1) })} 
                        disabled={pagination.page === stats.totalPages} 
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                      <button 
                        onClick={() => updatePagination({ page: stats.totalPages })} 
                        disabled={pagination.page === stats.totalPages} 
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Detail Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRow.holderName}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{selectedRow.target}</span>
                      {priorityBadge(selectedRow.priority)}
                      <span>Match Score: {Math.round(selectedRow.score * 100)}%</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRow(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patta Holder Information */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Patta Holder Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Holder ID</label>
                        <div className="text-sm text-gray-900">{selectedRow.holderId || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <div className="text-sm text-gray-900">{selectedRow.target}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Land Area</label>
                        <div className="text-sm text-gray-900">{selectedRow.raw?.area || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tribe</label>
                        <div className="text-sm text-gray-900">{selectedRow.raw?.tribe || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <div className="text-sm text-gray-900">{selectedRow.raw?.state || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Type</label>
                        <div className="text-sm text-gray-900">{selectedRow.raw?.type || 'Individual'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheme Recommendations */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Recommended Schemes ({selectedRow.suggestedSchemes.length})
                    </h3>
                    {selectedRow.suggestedSchemes.length ? (
                      <div className="space-y-4">
                        {selectedRow.suggestedSchemes.map((scheme, index) => (
                          <div key={scheme.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                    index === 0 ? 'bg-green-100 text-green-800' :
                                    index === 1 ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {index + 1}
                                  </span>
                                  <h4 className="text-base font-medium text-gray-900">{scheme.name}</h4>
                                  <span className="text-sm text-gray-500">ID: {scheme.id}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                  <strong>Eligibility Reason:</strong> {scheme.reason}
                                </div>
                                <div className="mt-2 flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">
                                    Match Score: <span className="font-medium text-gray-900">{Math.round((scheme.score || 0) * 100)}%</span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Ministry: <span className="font-medium text-gray-900">
                                      {scheme.ministry || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                                  View Details
                                </button>
                                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200">
                                  Apply Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">No scheme recommendations available</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting the filters to see recommendations</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last updated: now • Generated by Modular DSS Engine
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Export Report
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Generate Recommendation Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}