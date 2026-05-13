# Irrigation Recommendation Logic — Research Findings

> Research document for a web app that helps farmers decide whether to water their crops.
> Based on FAO-56 guidelines, academic extension publications, and established agronomic best practices.

---

## 1. Weather Factors Affecting Irrigation Decisions

The primary meteorological drivers of crop water demand are:

| Factor | Why It Matters | Data Source |
|--------|---------------|-------------|
| **Solar radiation / sunshine** | Provides the energy that drives evapotranspiration (ET). More sun = more water loss. | Weather API (W/m² or sunshine hours) |
| **Air temperature** | Higher temps increase the vapor pressure deficit and speed up ET. | Weather API (°C) |
| **Relative humidity** | Low humidity increases the evaporative demand of the air. | Weather API (%) |
| **Wind speed** | Wind removes saturated air from the canopy, allowing more evaporation. Stronger effect in arid climates. | Weather API (m/s) |
| **Rainfall** | Directly replenishes soil moisture. Critical for deciding whether to skip irrigation. | Weather API (mm) — current + forecast |
| **Evapotranspiration (ET)** | The combined water loss from soil evaporation + plant transpiration. The single most important derived metric for scheduling. | Calculated from above variables |

**Secondary factors:**
- **Soil type** — determines water holding capacity (field capacity vs wilting point)
- **Crop type & growth stage** — different crops have different water needs (via crop coefficient Kc)
- **Soil moisture** — direct measurement if available from sensors

---

## 2. Simple Rules of Thumb for Irrigation Advice

For a **practical, small-scale farming web app**, these heuristic rules provide immediate value without requiring complex modeling:

### Immediate Overrides (Highest Priority)

| Condition | Recommendation | Rationale |
|-----------|---------------|-----------|
| Rainfall > 10 mm in last 24h | **SKIP watering** | Soil has been naturally replenished |
| Rainfall > 5 mm forecast in next 24h | **DELAY watering** | Avoid wasting water and prevent runoff |
| Temperature < 5°C (cold snap) | **SKIP watering** | Low ET, risk of frost damage if wet |
| Wind speed > 8 m/s (gale) | **DELAY watering** | Sprinkler water drifts, uneven coverage |
| Relative humidity > 85% + no sun | **SKIP or REDUCE** | Very low evaporative demand |

### ET-Based Rules

| Condition | Recommendation |
|-----------|---------------|
| ET₀ > 6 mm/day (hot, dry, windy) | **Water soon** — high water demand |
| ET₀ 3–6 mm/day (moderate) | **Check soil / Water if dry** — normal demand |
| ET₀ < 3 mm/day (cool, humid, cloudy) | **Delay / Skip** — low demand |
| Cumulative ET since last irrigation > 25–40 mm | **Water now** — typical depletion threshold for many crops |

### Soil Moisture Rules (if sensor data available)

| Soil Moisture (% of field capacity) | Recommendation |
|-------------------------------------|---------------|
| > 80% | Skip — soil is wet |
| 50–80% | Monitor — approaching need |
| < 50% (or < RAW threshold) | **Water now** — readily available water depleted |

---

## 3. Simple ET Calculation Methods

### 3.1 The Gold Standard: FAO-56 Penman-Monteith

The FAO Penman-Monteith equation is the internationally recommended standard:

```
ET₀ = [0.408 × Δ × (Rn - G) + γ × (900/(T+273)) × u₂ × (es - ea)]
      ─────────────────────────────────────────────────────────────────
                           Δ + γ × (1 + 0.34 × u₂)
```

Where:
- **ET₀** = reference evapotranspiration (mm/day)
- **Δ** = slope of saturation vapor pressure curve (kPa/°C)
- **Rn** = net radiation at crop surface (MJ/m²/day)
- **G** = soil heat flux density (MJ/m²/day) — often negligible for daily calculations
- **γ** = psychrometric constant (kPa/°C)
- **T** = mean daily air temperature (°C)
- **u₂** = wind speed at 2m height (m/s)
- **es** = saturation vapor pressure (kPa)
- **ea** = actual vapor pressure (kPa)

**For a web app**, implementing the full Penman-Monteith requires:
- Tmax, Tmin (°C)
- RHmax, RHmin (%) or dewpoint
- Solar radiation (MJ/m²/day) or sunshine hours
- Wind speed (m/s)
- Elevation (m)
- Latitude (for extraterrestrial radiation)

### 3.2 Simplified Alternative: Hargreaves Equation

When only temperature data is available (no humidity, wind, or radiation):

```
ET₀ = 0.0023 × (Tmean + 17.8) × (Tmax - Tmin)^0.5 × Ra
```

Where **Ra** = extraterrestrial radiation (mm/day equivalent), which can be looked up by latitude and day-of-year.

**Accuracy:** Hargreaves tends to overestimate in humid regions and underestimate in arid regions, but is usable when data is limited.

### 3.3 Even Simpler: Temperature + Daylight Proxy

For a very simple implementation:

```
ET₀ ≈ k × Tmean × daylight_hours / 12
```

Where **k** is a calibration factor (~0.1–0.15 for temperate climates). This is a rough approximation only.

### 3.4 Crop ET: ETc = Kc × ET₀

Once ET₀ is known, multiply by the **crop coefficient (Kc)** to get actual crop water need:

| Crop | Kc (initial) | Kc (mid-season) | Kc (late) |
|------|-------------|-----------------|-----------|
| Wheat | 0.3 | 1.15 | 0.25 |
| Maize | 0.3 | 1.20 | 0.35 |
| Tomato | 0.4 | 1.15 | 0.80 |
| Potato | 0.4 | 1.15 | 0.75 |
| Rice | 1.05 | 1.20 | 0.90 |
| Lettuce | 0.45 | 1.00 | 0.90 |
| Citrus | 0.70 | 0.65 | 0.70 |
| Grapes | 0.30 | 0.70 | 0.45 |

> Source: FAO Irrigation and Drainage Paper 56, Table 12

---

## 4. Common Irrigation Scheduling Methods for Small-Scale Farming

### Method 1: Checkbook / Water Balance Method
Track daily water inputs and outputs:

```
Soil Water Balance:
  Dr,i = Dr,i-1 - (P - RO)i - Ii + ETc,i + DPi

Where:
  Dr = root zone depletion (mm)
  P  = precipitation (mm)
  RO = runoff (mm)
  I  = irrigation (mm)
  ETc = crop evapotranspiration (mm)
  DP = deep percolation (mm)
```

**Trigger:** Irrigate when Dr reaches RAW (Readily Available Water).

### Method 2: Fixed Interval with ET Adjustment
- Set a base interval (e.g., every 3 days for sandy soil, every 7 for clay)
- Adjust interval based on ET₀: shorten when ET is high, extend when low
- Skip if rain occurred

### Method 3: Percentage Depletion (MAD — Management Allowed Depletion)
- Calculate TAW (Total Available Water) from soil type and root depth
- Set MAD threshold (typically 40–60% of TAW for most crops)
- Irrigate when soil moisture depletion reaches MAD

### Method 4: Simple Calendar + Weather Override
- Farmer sets a typical schedule (e.g., "water every Tuesday and Friday")
- App suggests overrides: skip if rain, add extra if heatwave
- Best for farmers who prefer familiar routines with smart adjustments

### Method 5: Sensor-Based (if hardware available)
- Soil moisture sensor in root zone
- Trigger irrigation when moisture drops below threshold
- Can be combined with ET predictions for proactive alerts

---

## 5. Device Data Model Suggestions

### Per-Device Configuration (what the farmer sets up)

```json
{
  "device_id": "string",
  "name": "North Field - Tomatoes",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "elevation_m": 10
  },
  "crop": {
    "type": "tomato",
    "growth_stage": "mid_season",
    "kc": 1.15,
    "root_depth_m": 0.8,
    "ky": 1.05
  },
  "soil": {
    "type": "loam",
    "field_capacity": 0.30,
    "wilting_point": 0.15,
    "taw_mm_per_m": 150
  },
  "irrigation": {
    "method": "drip",
    "application_rate_mm_per_hour": 5,
    "efficiency": 0.85,
    "typical_duration_minutes": 60,
    "last_irrigation_date": "2024-06-15",
    "last_irrigation_amount_mm": 25
  },
  "thresholds": {
    "mad_fraction": 0.50,
    "raw_mm": 60,
    "min_rain_to_skip_mm": 5,
    "max_rain_forecast_to_delay_mm": 10,
    "max_wind_to_irrigate_ms": 8
  },
  "alerts": {
    "enabled": true,
    "preferred_time": "06:00",
    "advance_hours": 12
  }
}
```

### Daily Computed State (what the app calculates each day)

```json
{
  "device_id": "string",
  "date": "2024-06-16",
  "weather": {
    "et0_mm": 4.2,
    "rain_mm": 0,
    "rain_forecast_24h_mm": 2,
    "tmax_c": 28,
    "tmin_c": 18,
    "rh_max": 75,
    "rh_min": 45,
    "wind_ms": 3.5,
    "solar_radiation_mj_m2": 22
  },
  "water_balance": {
    "etc_mm": 4.83,
    "depletion_mm": 64,
    "taw_mm": 120,
    "raw_mm": 60,
    "depletion_fraction": 0.53,
    "days_since_irrigation": 1
  },
  "recommendation": {
    "action": "delay",
    "reason": "light rain forecast in next 24h (2mm)",
    "confidence": "medium",
    "suggested_amount_mm": null,
    "suggested_duration_min": null,
    "next_check": "2024-06-17T06:00:00Z"
  }
}
```

---

## 6. Simple Decision Algorithm (Pseudocode)

```
function getIrrigationRecommendation(device, weather, forecast):

    // Step 1: Calculate ET₀ from weather data
    et0 = calculatePenmanMonteith(weather)
    // OR: et0 = getFromWeatherAPI() if provider offers ET

    // Step 2: Calculate crop ET
    etc = et0 * device.crop.kc

    // Step 3: Update soil water balance
    device.balance.depletion += etc
    device.balance.depletion -= weather.rain_mm
    device.balance.depletion = max(0, device.balance.depletion)

    // Step 4: Check high-priority overrides
    if weather.rain_mm > device.thresholds.min_rain_to_skip_mm:
        return { action: "SKIP", reason: "Recent rainfall sufficient" }

    if forecast.rain_24h > device.thresholds.max_rain_forecast_to_delay_mm:
        return { action: "DELAY", reason: "Rain forecast in next 24h" }

    if weather.wind_ms > device.thresholds.max_wind_to_irrigate_ms:
        return { action: "DELAY", reason: "High wind — poor distribution" }

    if weather.tmax_c < 5:
        return { action: "SKIP", reason: "Cold weather — low ET, frost risk" }

    // Step 5: Check soil moisture / depletion threshold
    depletion_fraction = device.balance.depletion / device.soil.taw_mm

    if depletion_fraction < device.thresholds.mad_fraction * 0.5:
        return { action: "SKIP", reason: "Soil moisture adequate" }

    if depletion_fraction >= device.thresholds.mad_fraction:
        // Step 6: Calculate irrigation amount
        amount_mm = device.balance.depletion * 1.1  // 10% extra for efficiency
        amount_mm = min(amount_mm, device.soil.taw_mm * 0.8)  // don't overfill
        duration_min = (amount_mm / device.irrigation.application_rate_mm_per_hour) * 60

        return {
            action: "IRRIGATE",
            reason: "Soil depletion reached MAD threshold",
            amount_mm: round(amount_mm),
            duration_min: round(duration_min),
            best_time: "early_morning"  // 5-8 AM minimizes evaporation loss
        }

    // Step 6b: Approaching threshold — warn
    if depletion_fraction >= device.thresholds.mad_fraction * 0.8:
        return { action: "MONITOR", reason: "Approaching irrigation threshold" }

    // Default
    return { action: "SKIP", reason: "No irrigation needed today" }
```

---

## 7. Weather Thresholds Summary Table

| Parameter | Skip Threshold | Delay Threshold | Irrigate Trigger |
|-----------|---------------|-----------------|------------------|
| Recent rain | > 5–10 mm | — | — |
| Forecast rain (24h) | — | > 5–10 mm | — |
| Wind speed | — | > 8 m/s | — |
| Temperature | < 5°C | — | — |
| ET₀ (daily) | < 2 mm (low demand) | — | > 6 mm (high demand) |
| Soil depletion | < 25% TAW | — | > 50% TAW (MAD) |
| Cumulative ET since irrigation | — | — | > 25–40 mm |

---

## 8. References & Best Practices

1. **FAO Irrigation and Drainage Paper 56** — "Crop evapotranspiration: Guidelines for computing crop water requirements" by Allen, Pereira, Raes, and Smith (1998). The definitive reference for ET₀ calculation and crop coefficients.
   - https://www.fao.org/3/x0490e/x0490e00.htm

2. **FAO Chapter 8** — ETc under soil water stress conditions. Covers TAW, RAW, Ks, and water balance methodology.
   - https://www.fao.org/3/x0490e/x0490e0e.htm

3. **University of Florida EDIS AE256** — "Evapotranspiration: Potential or Reference?" by Irmak & Haman. Explains ETo vs ETp concepts.
   - https://edis.ifas.ufl.edu/publication/AE256

4. **University of Florida EDIS AE459** — "Step by Step Calculation of the Penman-Monteith Evapotranspiration (FAO-56 Method)" by Zotarelli et al. Practical implementation guide.
   - https://edis.ifas.ufl.edu/publication/AE459

5. **Wikipedia: Evapotranspiration** — Good overview of methods, factors, and measurement approaches.
   - https://en.wikipedia.org/wiki/Evapotranspiration

6. **ASCE-EWRI Standardized Reference ET Equation** (2005) — American Society of Civil Engineers standardization for ETos and ETrs.

---

## 9. Implementation Notes for Developers

- **ET₀ calculation complexity:** Consider using a weather API that provides ET₀ directly (e.g., Open-Meteo, AgWeatherNet) to avoid implementing Penman-Monteith from scratch.
- **Rain forecast reliability:** Weather forecasts beyond 24h have diminishing accuracy. Use 24h forecast for skip/delay decisions; use 7-day for planning.
- **Soil calibration:** If no soil sensor, the water balance model needs periodic calibration against farmer observations or soil moisture checks.
- **Localization:** Crop coefficients and MAD values vary by region. Allow farmers to adjust defaults based on local extension recommendations.
- **Offline capability:** Cache weather data and run calculations locally so farmers can check recommendations without connectivity.

---

*Document version: 1.0*
*Date: 2025-05-13*
