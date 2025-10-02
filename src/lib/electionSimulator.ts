export interface DemographicStats {
  share: number;
  Harris: number;
  Trump: number;
  Other: number;
}

export interface DemographicGroups {
  [key: string]: DemographicStats;
}

export interface ExitPollData {
  [category: string]: DemographicGroups;
}

export const exitPollData: ExitPollData = {
  gender: {
    "Men": { share: 45, Harris: 43, Trump: 55, Other: 2 },
    "Women": { share: 54, Harris: 52, Trump: 46, Other: 1 },
    "Nonbinary/Other": { share: 1, Harris: 72, Trump: 21, Other: 6 }
  },
  race: {
    "White": { share: 75, Harris: 42, Trump: 56, Other: 1 },
    "Black": { share: 10, Harris: 83, Trump: 16, Other: 1 },
    "Latino": { share: 10, Harris: 55, Trump: 43, Other: 2 },
    "Other": { share: 5, Harris: 55, Trump: 41, Other: 3 }
  },
  education: {
    "High school or less": { share: 27, Harris: 39, Trump: 59, Other: 1 },
    "Some college": { share: 31, Harris: 46, Trump: 53, Other: 1 },
    "College grad": { share: 26, Harris: 53, Trump: 45, Other: 2 },
    "Postgrad": { share: 16, Harris: 61, Trump: 37, Other: 1 }
  }
};

export function renormalizeDistribution(
  groups: DemographicGroups,
  turnoutShifts: { [key: string]: number }
): DemographicGroups {
  const adjusted: DemographicGroups = {};
  
  for (const [group, stats] of Object.entries(groups)) {
    const shift = turnoutShifts[group] || 0;
    const newShare = Math.max(0, stats.share + shift);
    adjusted[group] = { ...stats, share: newShare };
  }

  const total = Object.values(adjusted).reduce((sum, g) => sum + g.share, 0);
  
  if (total === 0) {
    throw new Error("Total turnout collapsed to 0 after shifts!");
  }

  for (const group in adjusted) {
    adjusted[group].share = (adjusted[group].share / total) * 100;
  }

  return adjusted;
}

export function applySwing(
  groups: DemographicGroups,
  swingShifts: { [key: string]: number }
): DemographicGroups {
  const adjusted: DemographicGroups = {};
  
  for (const [group, stats] of Object.entries(groups)) {
    const swing = swingShifts[group] || 0;
    const newStats = { ...stats };

    if (swing !== 0) {
      newStats.Harris = Math.max(0, Math.min(100, stats.Harris + swing));
      newStats.Trump = Math.max(0, Math.min(100, stats.Trump - swing));
      
      const total = newStats.Harris + newStats.Trump + newStats.Other;
      newStats.Harris = (newStats.Harris / total) * 100;
      newStats.Trump = (newStats.Trump / total) * 100;
      newStats.Other = (newStats.Other / total) * 100;
    }

    adjusted[group] = newStats;
  }
  
  return adjusted;
}

export function computeResults(groups: DemographicGroups): {
  Harris: number;
  Trump: number;
  Other: number;
} {
  const totals = { Harris: 0, Trump: 0, Other: 0 };
  
  for (const stats of Object.values(groups)) {
    const share = stats.share / 100;
    totals.Harris += share * stats.Harris;
    totals.Trump += share * stats.Trump;
    totals.Other += share * stats.Other;
  }
  
  return totals;
}
