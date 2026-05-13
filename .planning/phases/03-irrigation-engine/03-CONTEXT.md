# Phase 3: Irrigation Engine - Context

**Gathered:** 2025-05-13
**Status:** Ready for planning

## Phase Boundary

Build rule-based recommendation engine that combines weather data, soil moisture, and expert knowledge to generate irrigation recommendations.

**In scope:**
- Rule-based irrigation recommendation algorithm
- Combine three dimensions: weather, soil moisture, expert knowledge
- Generate recommendations: WATER / DELAY / SKIP / MONITOR
- Human-readable recommendation reasons
- Manual override (mark as irrigated)
- Track last irrigation date
- Display recommendations on device cards and detail page

**Out of scope:**
- ET-based calculations (v2)
- Crop growth stage tracking (v2)
- Advanced soil moisture analysis (v2)
- Machine learning (future)

## Implementation Decisions

### Algorithm
- **D-01:** Three-dimension scoring system:
  1. Weather dimension (0-100): rain forecast, temperature, humidity
  2. Soil dimension (0-100): current moisture vs threshold
  3. Expert dimension (0-100): crop type + soil type rules
- **D-02:** Final score = weighted average (weather: 30%, soil: 40%, expert: 30%)
- **D-03:** Score thresholds:
  - 0-25: SKIP (无需灌溉)
  - 26-50: DELAY (延迟灌溉)
  - 51-75: MONITOR (监控中)
  - 76-100: WATER (建议灌溉)

### Weather Rules
- **D-04:** Rain in next 24h → reduce score
- **D-05:** High temperature (>30°C) → increase score
- **D-06:** Low humidity (<40%) → increase score
- **D-07:** Current rain → SKIP

### Soil Rules
- **D-08:** Moisture < threshold → increase score
- **D-09:** Moisture > threshold + 20% → decrease score
- **D-10:** Soil type affects threshold (砂土: +10%, 粘土: -10%)

### Expert Rules
- **D-11:** Crop-specific min/max moisture (already in types)
- **D-12:** Growth stage multipliers (v2)

### UI Integration
- **D-13:** Show recommendation badge on device cards
- **D-14:** Show detailed breakdown on device detail
- **D-15:** Allow manual override
- **D-16:** Show recommendation history (v2)

## Canonical References

### Project Documents
- `.planning/PROJECT.md` — Updated core value
- `.planning/REQUIREMENTS.md` — REC-01~05
- `.planning/ROADMAP.md` — Phase 3 success criteria
- `.planning/research/IRRIGATION_LOGIC.md` — Decision algorithms

### Phase 1-2 Artifacts
- `src/types/device.ts` — Expert rules, soil characteristics
- `src/stores/deviceStore.ts` — Device data, moisture tracking
- `src/services/weatherApi.ts` — Weather data
- `src/hooks/useWeather.ts` — Weather hook

## Existing Code Insights

### Reusable Assets
- `EXPERT_RULES` - Crop-specific moisture thresholds
- `SOIL_CHARACTERISTICS` - Soil type properties
- `useWeather` hook - Weather data access
- `deviceStore` - Device state management

### Integration Points
- Home page device cards show recommendations
- Device detail shows recommendation breakdown
- Manual override updates lastIrrigationDate

## Specific Ideas

- Recommendation badge colors: red (WATER), yellow (MONITOR), blue (DELAY), green (SKIP)
- Show "基于天气+土壤+专家建议" label
- Breakdown: "土壤湿度偏低 (35/100) + 未来有雨 (-20) + 水稻需水 (+30) = 建议灌溉"
- Add "为什么这样建议？" expandable section

## Deferred Ideas

- ET-based calculations (Penman-Monteith)
- Crop growth stage tracking
- Historical recommendation accuracy
- Machine learning optimization

---

*Phase: 3-Irrigation Engine*
*Context gathered: 2025-05-13*
