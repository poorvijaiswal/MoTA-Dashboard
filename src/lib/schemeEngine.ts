// src/lib/schemeEngine.ts
// Modular scheme recommendation engine for real-time processing

export type Claim = {
  id: string;
  holder_name?: string;
  area?: number | string;
  village?: string;
  district?: string;
  state?: string;
  tribe?: string;
  type?: string;
  assets?: any;
  forest_produce?: any;
  water_index?: number | null;
  coords?: { lat: number; lon: number } | number[] | null;
  [k: string]: any;
};

export type Scheme = {
  id: string;
  name: string;
  ministry?: string;
  policy_rules?: any;
  [k: string]: any;
};

export type SchemeMatch = {
  id: string;
  name: string;
  score: number;
  reason: string;
  ministry?: string;
};

export type RecommendationRow = {
  recommendationId: string;
  holderId?: string;
  holderName?: string;
  target: string;
  suggestedSchemes: SchemeMatch[];
  priority: "High" | "Medium" | "Low";
  score: number;
  beneficiaries: number;
  raw?: Claim;
};

export type VillageAgg = {
  state: string;
  district: string;
  village: string;
  holders: Claim[];
  count: number;
  avgArea: number;
  hasMFP: boolean;
  waterIndex?: number;
  priorityLevel?: "high" | "medium" | "low";
};

// Utility functions
export function parseArea(area: any): number {
  if (area === undefined || area === null) return 0;
  if (typeof area === "number") return area;
  if (typeof area === "string") {
    const m = area.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  }
  return 0;
}

export function makeId(prefix = "REC"): string {
  try {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
      return `${prefix}-${(crypto as any).randomUUID()}`;
    }
  } catch (e) {
    // ignore
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeCoords(coords: any): { lat: number; lon: number } | null {
  if (!coords) return null;
  if (Array.isArray(coords) && coords.length >= 2) {
    return { lat: coords[1], lon: coords[0] };
  }
  if (typeof coords === 'object' && coords.lat && coords.lon) {
    return { lat: coords.lat, lon: coords.lon };
  }
  return null;
}

// Village aggregation
export function computeVillageAggs(claims: Claim[]): Record<string, VillageAgg> {
  const map: Record<string, VillageAgg> = {};
  
  for (const c of claims) {
    const key = `${c.state || "_"}||${c.district || "_"}||${c.village || "_"}`;
    if (!map[key]) {
      map[key] = {
        state: c.state || "",
        district: c.district || "",
        village: c.village || "",
        holders: [],
        count: 0,
        avgArea: 0,
        hasMFP: false,
      };
    }
    map[key].holders.push(c);
  }

  for (const k of Object.keys(map)) {
    const v = map[k];
    v.count = v.holders.length;
    const totalArea = v.holders.reduce((s, h) => s + parseArea(h.area), 0);
    v.avgArea = v.count ? totalArea / v.count : 0;
    
    // Check for forest produce
    v.hasMFP = v.holders.some((h) => {
      if (h.forest_produce) {
        if (Array.isArray(h.forest_produce)) return h.forest_produce.length > 0;
        if (typeof h.forest_produce === 'object') return Object.keys(h.forest_produce).length > 0;
        return !!h.forest_produce;
      }
      return !!(h.assets && h.assets.mfp);
    });
    
    // Calculate water index
    const waterVals = v.holders
      .map((h) => (typeof h.water_index === "number" ? h.water_index : null))
      .filter(Boolean);
    
    if (waterVals.length) {
      v.waterIndex = Math.round((waterVals as number[]).reduce((a, b) => a + b, 0) / waterVals.length);
    } else {
      // Generate from coordinates if available
      let avgWaterIndex = 50;
      const coordsWithWater = v.holders
        .map(h => {
          const coords = normalizeCoords(h.coords);
          if (coords) {
            // Simple heuristic based on location
            if (coords.lat > 22 && coords.lon > 78) return 35; // Northern regions
            if (coords.lat < 21 && coords.lon < 78) return 75; // Southern regions
            return 55; // Central regions
          }
          return null;
        })
        .filter(Boolean);
      
      if (coordsWithWater.length) {
        avgWaterIndex = Math.round((coordsWithWater as number[]).reduce((a, b) => a + b, 0) / coordsWithWater.length);
      }
      v.waterIndex = avgWaterIndex;
    }
    
    // Calculate priority level
    const lowAreaCount = v.holders.filter(h => parseArea(h.area) <= 1.0).length;
    const lowAreaRatio = v.count ? lowAreaCount / v.count : 0;
    const avgWaterIndex = v.waterIndex || 50;
    
    if (lowAreaRatio >= 0.7 && avgWaterIndex <= 40) {
      v.priorityLevel = "high";
    } else if (lowAreaRatio >= 0.5 || avgWaterIndex <= 60) {
      v.priorityLevel = "medium";
    } else {
      v.priorityLevel = "low";
    }
  }
  
  return map;
}

// Enhanced scheme matching rules
export function buildSchemeRules(schemes: Scheme[], villageAggs: Record<string, VillageAgg>) {
  const rules: Record<string, (holder: Claim) => { eligible: boolean; reason: string; score: number }> = {};

  // PM-KISAN: Agricultural land holders
  const pmk = schemes.find((s) => 
    (s.name || "").toLowerCase().includes("pm-kisan") || 
    (s.id || "") === "S001"
  );
  if (pmk) {
    rules[pmk.id] = (h) => {
      const area = parseArea(h.area);
      const hasLand = area > 0;
      const eligible = hasLand;
      const score = eligible ? Math.min(1, 0.6 + (area / 10) * 0.4) : 0;
      return {
        eligible,
        reason: eligible 
          ? `Land holder with ${area} acres eligible for direct income support`
          : "No cultivable land for agricultural support",
        score
      };
    };
  }

  // MGNREGA: Rural employment
  const mgn = schemes.find((s) => 
    (s.name || "").toLowerCase().includes("mgnrega") || 
    (s.id || "") === "S002"
  );
  if (mgn) {
    rules[mgn.id] = (h) => {
      const area = parseArea(h.area);
      const isSmallFarmer = area <= 2.0;
      const isRural = !!(h.village && h.village.length > 0);
      const eligible = isRural && (area === 0 || isSmallFarmer);
      const score = eligible ? (area === 0 ? 0.9 : Math.max(0.5, (2.5 - area) / 2.5)) : 0;
      return {
        eligible,
        reason: eligible 
          ? `Small/marginal farmer (${area} acres) needs employment guarantee`
          : "Large land holder not eligible for employment scheme",
        score
      };
    };
  }

  // Jal Jeevan Mission: Water access
  const jal = schemes.find((s) => 
    (s.name || "").toLowerCase().includes("jal jeevan") || 
    (s.id || "") === "S003"
  );
  if (jal) {
    rules[jal.id] = (h) => {
      const key = `${h.state || "_"}||${h.district || "_"}||${h.village || "_"}`;
      const v = villageAggs[key];
      let waterIndex = h.water_index || 50;
      
      if (v && typeof v.waterIndex === "number") {
        waterIndex = v.waterIndex;
      } else {
        // Generate from coordinates
        const coords = normalizeCoords(h.coords);
        if (coords) {
          if (coords.lat > 22 && coords.lon > 78) waterIndex = 35;
          else if (coords.lat < 21 && coords.lon < 78) waterIndex = 75;
        }
      }
      
      const hasWaterAssets = !!(h.assets && (h.assets.well || h.assets.pond || h.assets.water_body));
      const needsWater = waterIndex <= 60 || !hasWaterAssets;
      const eligible = needsWater;
      const score = eligible ? Math.min(1, (70 - waterIndex) / 50 + 0.4) : 0;
      
      return {
        eligible,
        reason: eligible 
          ? `Water scarce area (index: ${waterIndex}) needs tap water connection`
          : `Adequate water access available (index: ${waterIndex})`,
        score
      };
    };
  }

  // Van Dhan Vikas Yojana: Forest produce
  const vd = schemes.find((s) => 
    (s.name || "").toLowerCase().includes("van dhan") || 
    (s.id || "") === "S004"
  );
  if (vd) {
    rules[vd.id] = (h) => {
      const key = `${h.state || "_"}||${h.district || "_"}||${h.village || "_"}`;
      const v = villageAggs[key];
      
      const hasForestProduce = !!(h.forest_produce && (
        Array.isArray(h.forest_produce) ? h.forest_produce.length > 0 : 
        typeof h.forest_produce === 'object' ? Object.keys(h.forest_produce).length > 0 :
        !!h.forest_produce
      ));
      
      const hasForestAssets = !!(h.assets && (h.assets.forest_land || h.assets.mfp_collection || h.assets.mfp));
      const hasMFP = hasForestProduce || hasForestAssets || (v && v.hasMFP);
      const isTribal = !!(h.tribe && h.tribe.length > 0);
      const eligible = hasMFP && isTribal;
      const score = eligible ? (hasForestProduce ? 0.85 : 0.65) : 0;
      
      return {
        eligible,
        reason: eligible 
          ? "Tribal community with forest produce collection rights"
          : !isTribal ? "Not from tribal community" : "No forest produce collection",
        score
      };
    };
  }

  // PM Awas Yojana: Housing
  const pmay = schemes.find((s) => 
    (s.name || "").toLowerCase().includes("awas") || 
    (s.id || "") === "S005"
  );
  if (pmay) {
    rules[pmay.id] = (h) => {
      const hasHouse = !!(h.assets && (h.assets.house || h.assets.homestead));
      const area = parseArea(h.area);
      const isBelowPoverty = area <= 1.0;
      const eligible = !hasHouse && isBelowPoverty;
      const score = eligible ? 0.75 : 0;
      
      return {
        eligible,
        reason: eligible 
          ? "Small farmer without proper housing eligible for Awas Yojana"
          : hasHouse ? "Already has adequate housing" : "Income above poverty line",
        score
      };
    };
  }

  // Ensure default schemes exist
  const defaultSchemes = [
    { id: "S005", name: "PM Awas Yojana", ministry: "Ministry of Housing and Urban Affairs" },
    { id: "S006", name: "Community Forest Rights", ministry: "Ministry of Tribal Affairs" },
    { id: "S007", name: "Skill Development Scheme", ministry: "Ministry of Skill Development" }
  ];

  defaultSchemes.forEach(scheme => {
    if (!schemes.find(s => s.id === scheme.id)) {
      schemes.push(scheme);
    }
  });

  // Community Forest Rights
  if (!rules["S006"]) {
    rules["S006"] = (h) => {
      const key = `${h.state || "_"}||${h.district || "_"}||${h.village || "_"}`;
      const v = villageAggs[key];
      const hasForestAssets = !!(h.assets && h.assets.forest_land);
      const isTribal = !!(h.tribe && h.tribe.length > 0);
      const isCommunityType = h.type === "CFR";
      const largeVillage = !!(v && v.count >= 10);
      const eligible = (hasForestAssets || isCommunityType) && isTribal && largeVillage;
      const score = eligible ? 0.8 : 0;
      
      return {
        eligible,
        reason: eligible 
          ? "Tribal community eligible for Community Forest Rights"
          : !isTribal ? "Not from tribal community" : "Village too small for CFR",
        score
      };
    };
  }

  // Skill Development
  if (!rules["S007"]) {
    rules["S007"] = (h) => {
      const area = parseArea(h.area);
      const needsSkills = area <= 1.5;
      const eligible = needsSkills;
      const score = eligible ? 0.6 : 0;
      
      return {
        eligible,
        reason: eligible 
          ? "Small farmer family needs skill development for additional income"
          : "Large farmer may not need skills training",
        score
      };
    };
  }

  // Add default rules for any remaining schemes
  schemes.forEach(s => {
    if (!rules[s.id]) {
      rules[s.id] = (h) => {
        const area = parseArea(h.area);
        const isTribal = !!(h.tribe && h.tribe.length > 0);
        const eligible = isTribal && area > 0;
        const score = eligible ? 0.4 : 0;
        return {
          eligible,
          reason: eligible 
            ? "General scheme for tribal land holders"
            : "Not eligible for this scheme",
          score
        };
      };
    }
  });

  return rules;
}

// Main recommendation engine
export function generateRecommendations(
  claims: Claim[],
  schemes: Scheme[],
  filters: {
    selectedState?: string;
    selectedDistrict?: string;
    selectedVillage?: string;
    selectedTribe?: string;
    selectedSchemeId?: string;
    searchText?: string;
    pattalType?: string;
    waterIndex?: string;
    incomeLevel?: string;
    priorityLevel?: string;
  }
): RecommendationRow[] {
  // Compute village aggregates
  const villageAggs = computeVillageAggs(claims);
  
  // Build rules
  const rules = buildSchemeRules(schemes, villageAggs);
  
  // Filter claims
  const filteredClaims = claims.filter((c) => {
    if (filters.selectedState && c.state !== filters.selectedState) return false;
    if (filters.selectedDistrict && c.district !== filters.selectedDistrict) return false;
    if (filters.selectedVillage && c.village !== filters.selectedVillage) return false;
    if (filters.selectedTribe && c.tribe !== filters.selectedTribe) return false;
    
    // Patta type filter
    if (filters.pattalType && filters.pattalType !== "") {
      const holderPattalType = c.type === "CFR" ? "Community" : "Individual";
      if (filters.pattalType !== holderPattalType) return false;
    }
    
    // Water index filter
    if (filters.waterIndex && filters.waterIndex !== "") {
      const key = `${c.state || "_"}||${c.district || "_"}||${c.village || "_"}`;
      const vagg = villageAggs[key];
      let holderWaterIndex = 50;
      
      if (vagg && typeof vagg.waterIndex === "number") {
        holderWaterIndex = vagg.waterIndex;
      } else {
        const coords = normalizeCoords(c.coords);
        if (coords) {
          if (coords.lat > 22 && coords.lon > 78) holderWaterIndex = 35;
          else if (coords.lat < 21 && coords.lon < 78) holderWaterIndex = 75;
        }
      }
      
      if (filters.waterIndex === "high" && holderWaterIndex <= 70) return false;
      if (filters.waterIndex === "medium" && (holderWaterIndex <= 40 || holderWaterIndex > 70)) return false;
      if (filters.waterIndex === "low" && holderWaterIndex > 40) return false;
    }
    
    // Income level filter
    if (filters.incomeLevel && filters.incomeLevel !== "") {
      const area = parseArea(c.area);
      const holderIncomeLevel = area <= 1.0 ? "below_poverty" : area <= 2.5 ? "low" : "medium";
      if (filters.incomeLevel !== holderIncomeLevel) return false;
    }
    
    // Priority level filter
    if (filters.priorityLevel && filters.priorityLevel !== "") {
      const key = `${c.state || "_"}||${c.district || "_"}||${c.village || "_"}`;
      const vagg = villageAggs[key];
      const holderPriorityLevel = vagg?.priorityLevel || "medium";
      if (filters.priorityLevel !== holderPriorityLevel) return false;
    }
    
    // Search filter
    if (filters.searchText) {
      const s = filters.searchText.toLowerCase();
      const hay = `${c.holder_name ?? ""} ${c.village ?? ""} ${c.district ?? ""} ${c.state ?? ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    
    return true;
  });

  // Calculate all scores first
  const recs = filteredClaims.map((h) => {
    let combined = 0;
    let topSchemes: SchemeMatch[] = [];
    if (filters.selectedSchemeId) {
      // Single scheme analysis
      const rule = rules[filters.selectedSchemeId];
      const result = rule ? rule(h) : { eligible: false, reason: "Scheme not found", score: 0 };
      const key = `${h.state || "_"}||${h.district || "_"}||${h.village || "_"}`;
      const vagg = villageAggs[key];
      let villageUrgency = 0;
      if (vagg) {
        if (typeof vagg.waterIndex === "number") {
          villageUrgency += Math.max(0, (50 - vagg.waterIndex) / 50) * 0.3;
        }
        if (vagg.hasMFP) villageUrgency += 0.1;
        villageUrgency += Math.min(vagg.count / 100, 0.15);
      }
      combined = Math.min(1, result.score + villageUrgency);
      topSchemes = result.score > 0 ? [{
        id: filters.selectedSchemeId,
        name: schemes.find(s => s.id === filters.selectedSchemeId)?.name || filters.selectedSchemeId,
        score: result.score,
        reason: result.reason,
        ministry: schemes.find(s => s.id === filters.selectedSchemeId)?.ministry
      }] : [];
    } else {
      // Multi-scheme analysis
      const schemeScores: SchemeMatch[] = [];
      Object.keys(rules).forEach(schemeId => {
        const rule = rules[schemeId];
        const result = rule(h);
        if (result.eligible && result.score > 0) {
          const scheme = schemes.find(s => s.id === schemeId);
          schemeScores.push({
            id: schemeId,
            name: scheme?.name || schemeId,
            score: result.score,
            reason: result.reason,
            ministry: scheme?.ministry
          });
        }
      });
      const key = `${h.state || "_"}||${h.district || "_"}||${h.village || "_"}`;
      const vagg = villageAggs[key];
      let villageUrgency = 0;
      if (vagg) {
        if (typeof vagg.waterIndex === "number") {
          villageUrgency += Math.max(0, (50 - vagg.waterIndex) / 50) * 0.3;
        }
        if (vagg.hasMFP) villageUrgency += 0.1;
        villageUrgency += Math.min(vagg.count / 100, 0.15);
      }
      const enhancedSchemes = schemeScores.map(s => ({
        ...s,
        score: Math.min(1, s.score + villageUrgency)
      }));
      enhancedSchemes.sort((a, b) => b.score - a.score);
      topSchemes = enhancedSchemes.slice(0, 3);
      combined = topSchemes.length ? topSchemes[0].score : Math.min(1, villageUrgency * 0.8);
    }
    return {
      recommendationId: makeId("REC"),
      holderId: h.id,
      holderName: h.holder_name ?? h.id,
      target: `${h.village ?? "-"}, ${h.district ?? "-"}`,
      suggestedSchemes: topSchemes,
      score: combined,
      beneficiaries: 1,
      raw: h,
      priority: undefined as "High" | "Medium" | "Low" | undefined,
    };
  });

  // Sort all by score
  const sorted = [...recs].sort((a, b) => b.score - a.score);
  const total = sorted.length;
  const highCount = Math.floor(total / 3);
  const mediumCount = Math.floor(total / 3);
  // Assign priorities
  sorted.forEach((rec, idx) => {
    if (idx < highCount) rec.priority = "High";
    else if (idx < highCount + mediumCount) rec.priority = "Medium";
    else rec.priority = "Low";
  });

  // Restore original order
  const recMap = new Map(sorted.map(r => [r.recommendationId, r.priority]));
  return recs.map(r => ({
    ...r,
    priority: recMap.get(r.recommendationId) as "High" | "Medium" | "Low"
  }));
}