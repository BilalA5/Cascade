// src/modules/generateRecommendations.js

// UPDATED: Function accepts 'healthScore' instead of 'ndvi'
const MAX_FALLBACK_RECS = 4

const fallbackLibrary = [
  {
    title: "Schedule Moisture Check",
    body: "Verify soil moisture sensors are calibrated and confirm readings with a manual probe once per week.",
  },
  {
    title: "Scout for Pest Patterns",
    body: "Walk the field in a zigzag pattern every 48 hours to check undersides of leaves and base of stems.",
  },
  {
    title: "Record Field Notes",
    body: "Log rainfall, fertigation, and observed pest pressure in a field journal to compare against sensor trends.",
  },
  {
    title: "Review Irrigation Hardware",
    body: "Inspect emitters and drip lines for clogs or leaks to ensure uniform water delivery.",
  },
]

export function generateFallbackRecommendations({ ndmi, healthScore, ph, pestRisk, moisture }) {
  const recs = [];

  // --- Watering logic (using NDMI + soil moisture %)
  if (ndmi < 0.15 || moisture < 20) {
    recs.push({
      title: "Irrigate Soon",
      body: "Soil moisture is low. Water early morning or late evening to minimize evaporation."
    });
  } else if (ndmi > 0.45 || moisture > 50) {
    recs.push({
      title: "Skip Watering",
      body: "Moisture levels are sufficient. Over-watering can reduce oxygen to the roots."
    });
  }

  // --- Soil pH balance
  if (ph < 6) {
    recs.push({
      title: "Soil Too Acidic",
      body: "Apply agricultural lime or composted biochar. Retest soil pH in 10–14 days."
    });
  } else if (ph > 7.5) {
    recs.push({
      title: "Soil Too Alkaline",
      body: "Add elemental sulfur or peat moss gradually. Avoid over-correction."
    });
  }

  // --- Plant vigor (Health Score)
  // UPDATED: Logic uses healthScore (0-100) thresholds (35 and 65)
  if (healthScore < 35) { 
    recs.push({
      title: "Low Vegetation Vigor Detected",
      body: "Consider nitrogen-rich compost tea or mild organic fertilizers. Ensure consistent watering."
    });
  } else if (healthScore > 65) { 
    recs.push({
      title: "Strong Vegetation Health",
      body: "No immediate intervention required. Continue current irrigation schedule."
    });
  }

  // --- Pest pressure
  if (pestRisk > 0.6) {
    recs.push({
      title: "High Pest Risk",
      body: "Inspect leaf undersides. Apply neem oil at dusk and consider installing sticky traps."
    });
  } else if (pestRisk > 0.3) {
    recs.push({
      title: "Moderate Pest Activity",
      body: "Monitor plants daily. Remove damaged leaves and keep soil well-aerated."
    });
  }

  let fallbackIndex = 0
  while (recs.length < MAX_FALLBACK_RECS && fallbackIndex < fallbackLibrary.length) {
    const candidate = fallbackLibrary[fallbackIndex]
    if (!recs.find((item) => item.title === candidate.title)) {
      recs.push(candidate)
    }
    fallbackIndex += 1
  }

  return recs;
}

export default generateFallbackRecommendations;