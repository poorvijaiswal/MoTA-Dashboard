// src/hooks/useRecommendations.ts
// Custom hook for managing real-time scheme recommendations

import { useMemo, useState, useCallback } from 'react';
import { 
  Claim, 
  Scheme, 
  RecommendationRow, 
  generateRecommendations 
} from '../lib/schemeEngine';

export interface FilterState {
  selectedState: string;
  selectedDistrict: string;
  selectedVillage: string;
  selectedTribe: string;
  selectedSchemeId: string;
  searchText: string;
  pattalType: string;
  waterIndex: string;
  incomeLevel: string;
  priorityLevel: string;
  showOnlyEligible: boolean;
}

export interface SortState {
  sortBy: "score" | "priority" | "holderName";
  sortDesc: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export function useRecommendations(claims: Claim[], schemes: Scheme[]) {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    selectedState: "",
    selectedDistrict: "",
    selectedVillage: "",
    selectedTribe: "",
    selectedSchemeId: "",
    searchText: "",
    pattalType: "",
    waterIndex: "",
    incomeLevel: "",
    priorityLevel: "",
    showOnlyEligible: false,
  });

  // Sort state
  const [sort, setSort] = useState<SortState>({
    sortBy: "score",
    sortDesc: true,
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  // Generate recommendations based on current filters
  const allRecommendations = useMemo(() => {
    return generateRecommendations(claims, schemes, filters);
  }, [claims, schemes, filters]);

  // Filter recommendations based on eligibility
  const filteredRecommendations = useMemo(() => {
    return filters.showOnlyEligible 
      ? allRecommendations.filter(r => r.score > 0 && r.suggestedSchemes.length > 0)
      : allRecommendations;
  }, [allRecommendations, filters.showOnlyEligible]);

  // Sort recommendations
  const sortedRecommendations = useMemo(() => {
    const sorted = [...filteredRecommendations].sort((a, b) => {
      if (sort.sortBy === "score") {
        return sort.sortDesc ? b.score - a.score : a.score - b.score;
      } else if (sort.sortBy === "priority") {
        const rank = { High: 3, Medium: 2, Low: 1 } as any;
        return sort.sortDesc 
          ? rank[b.priority] - rank[a.priority] 
          : rank[a.priority] - rank[b.priority];
      } else {
        const A = (a.holderName || "").toLowerCase();
        const B = (b.holderName || "").toLowerCase();
        return sort.sortDesc 
          ? (B < A ? -1 : B > A ? 1 : 0) 
          : (A < B ? -1 : A > B ? 1 : 0);
      }
    });
    return sorted;
  }, [filteredRecommendations, sort]);

  // Paginate recommendations
  const paginatedRecommendations = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return sortedRecommendations.slice(start, start + pagination.pageSize);
  }, [sortedRecommendations, pagination]);

  // Derived statistics
  const stats = useMemo(() => {
  const total = filteredRecommendations.length;
  const eligible = filteredRecommendations.filter(r => r.suggestedSchemes && r.suggestedSchemes.some(s => s.score > 0.3)).length;
    const highPriority = filteredRecommendations.filter(r => r.priority === 'High').length;
    const mediumPriority = filteredRecommendations.filter(r => r.priority === 'Medium').length;
    const lowPriority = filteredRecommendations.filter(r => r.priority === 'Low').length;
    
    // Scheme distribution
    const schemeDistribution: Record<string, number> = {};
    filteredRecommendations.forEach(r => {
      r.suggestedSchemes.forEach(s => {
        schemeDistribution[s.name] = (schemeDistribution[s.name] || 0) + 1;
      });
    });

    const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

    return {
      total,
      eligible,
      highPriority,
      mediumPriority,
      lowPriority,
      schemeDistribution,
      totalPages,
    };
  }, [filteredRecommendations, pagination.pageSize]);

  // Derived location lists for filters
  const locationOptions = useMemo(() => {
    const allStates = Array.from(new Set(claims.map(c => c.state).filter(Boolean))).sort();
    
    const districtsForState = Array.from(
      new Set(
        claims
          .filter(c => (filters.selectedState ? c.state === filters.selectedState : true))
          .map(c => c.district)
          .filter(Boolean)
      )
    ).sort();
    
    const villagesForDistrict = Array.from(
      new Set(
        claims
          .filter(c => 
            (filters.selectedDistrict ? c.district === filters.selectedDistrict : true) &&
            (filters.selectedState ? c.state === filters.selectedState : true)
          )
          .map(c => c.village)
          .filter(Boolean)
      )
    ).sort();
    
    const tribesList = Array.from(new Set(claims.map(c => c.tribe).filter(Boolean))).sort();

    return {
      states: allStates,
      districts: districtsForState,
      villages: villagesForDistrict,
      tribes: tribesList,
    };
  }, [claims, filters.selectedState, filters.selectedDistrict]);

  // Filter update functions
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateSort = useCallback((sortBy: SortState['sortBy'], sortDesc?: boolean) => {
    setSort(prev => ({
      sortBy,
      sortDesc: sortDesc !== undefined ? sortDesc : prev.sortBy === sortBy ? !prev.sortDesc : true
    }));
  }, []);

  const updatePagination = useCallback((updates: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      selectedState: "",
      selectedDistrict: "",
      selectedVillage: "",
      selectedTribe: "",
      selectedSchemeId: "",
      searchText: "",
      pattalType: "",
      waterIndex: "",
      incomeLevel: "",
      priorityLevel: "",
      showOnlyEligible: false,
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Bulk update filters (for location cascading)
  const updateLocationFilters = useCallback((state?: string, district?: string, village?: string) => {
    setFilters(prev => ({
      ...prev,
      selectedState: state || "",
      selectedDistrict: district || "",
      selectedVillage: village || "",
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return {
    // Data
    recommendations: paginatedRecommendations,
    allRecommendations: sortedRecommendations,
    stats,
    locationOptions,
    
    // State
    filters,
    sort,
    pagination,
    
    // Actions
    updateFilter,
    updateSort,
    updatePagination,
    resetFilters,
    updateLocationFilters,
  };
}