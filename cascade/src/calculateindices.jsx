// src/modules/calculateIndices.js

// NDVI = (NIR - Red) / (NIR + Red)
// NDMI = (NIR - SWIR) / (NIR + SWIR)
// pH is passed directly, but normalized into a label range for interpretation.

export function calculateIndices({
    nir,
    red,
    swir,
    soilPH,
    pestScoreRaw,
    moisturePercent
  }) {
    // Safety checks to prevent divide-by-zero
    const safeDivide = (a, b) => (b === 0 ? 0 : a / b);
  
    const ndvi = safeDivide(nir - red, nir + red);
    const ndmi = safeDivide(nir - swir, nir + swir);
  
    // Normalize pest sensor or ML classifier output (0 - 1 range)
    // If input is already 0–100, convert to 0–1
    const pestRisk = pestScoreRaw > 1 ? pestScoreRaw / 100 : pestScoreRaw;
  
    // Moisture is just passed through but included for clarity
    const moisture = moisturePercent;
  
    // Soil health classification zones (used later in UI)
    let soilHealthLabel = "Optimal";
    if (soilPH < 6) soilHealthLabel = "Too Acidic";
    else if (soilPH > 7.5) soilHealthLabel = "Too Alkaline";
  
    return {
      ndvi: Number(ndvi.toFixed(3)),
      ndmi: Number(ndmi.toFixed(3)),
      ph: Number(soilPH.toFixed(1)),
      pestRisk: Number(pestRisk.toFixed(2)),
      moisture: Number(moisture),
      soilHealthLabel
    };
  }
  