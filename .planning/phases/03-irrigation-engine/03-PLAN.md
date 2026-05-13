# Plan: Phase 3 - Irrigation Engine

**Phase:** 3 - Irrigation Engine
**Date:** 2025-05-13
**Status:** Ready for execution

## Overview

Build rule-based recommendation engine that combines weather data, soil moisture, and expert knowledge to generate irrigation recommendations.

## Requirements Covered

- REC-01: Show irrigation recommendation (WATER / DELAY / SKIP / MONITOR)
- REC-02: Recommendation includes reason
- REC-03: Considers weather, soil moisture, expert rules
- REC-04: Manual override and mark as irrigated
- REC-05: Track last irrigation date

## Plans

### Plan 1: Recommendation Algorithm
**Wave:** 1
**Depends on:** None
**Files Modified:**
- `src/services/irrigationEngine.ts`
- `src/types/irrigation.ts`

**Tasks:**

1. **Create Irrigation Types**
   - `RecommendationType`: 'WATER' | 'DELAY' | 'SKIP' | 'MONITOR'
   - `RecommendationResult`: type, score, reasons, breakdown
   - `DimensionScore`: weather, soil, expert scores

2. **Implement Algorithm**
   - `calculateRecommendation(device, weather)` function
   - Weather dimension scoring:
     - Rain forecast next 24h: -30 to 0
     - Current temperature: 0 to +20
     - Current humidity: 0 to +15
     - Current precipitation: -20 to 0
   - Soil dimension scoring:
     - Moisture vs threshold: 0 to +40
     - Soil type adjustment: ±10
   - Expert dimension scoring:
     - Crop min moisture: 0 to +30
     - Days since irrigation: 0 to +20
   - Final score = weighted average
   - Map score to recommendation type

3. **Generate Reasons**
   - Human-readable reason strings
   - Chinese labels
   - Include specific values (e.g., "土壤湿度35%，低于阈值60%")

### Plan 2: Recommendation Store
**Wave:** 1
**Depends on:** Plan 1
**Files Modified:**
- `src/stores/recommendationStore.ts`
- `src/hooks/useRecommendation.ts`

**Tasks:**

1. **Create Recommendation Store**
   - Store recommendations by deviceId
   - Auto-recalculate when device/weather changes
   - Cache recommendations

2. **Create useRecommendation Hook**
   - Get recommendation for a device
   - Auto-recalculate on dependency changes
   - Return recommendation + loading state

### Plan 3: UI Integration
**Wave:** 2
**Depends on:** Plan 2
**Files Modified:**
- `src/components/irrigation/RecommendationBadge.tsx`
- `src/components/irrigation/RecommendationDetail.tsx`
- `src/pages/Home/index.tsx`
- `src/pages/DeviceDetail/index.tsx`

**Tasks:**

1. **Create RecommendationBadge**
   - Color-coded badge (red/yellow/blue/green)
   - Compact display for device cards
   - Icon + text

2. **Create RecommendationDetail**
   - Full recommendation breakdown
   - Three-dimension scores
   - Progress bars or gauges
   - Reason list
   - "为什么这样建议？" section

3. **Update Home Page**
   - Replace existing recommendation with new algorithm
   - Show RecommendationBadge on cards
   - Show weather + soil + expert indicators

4. **Update DeviceDetail Page**
   - Add RecommendationDetail section
   - Show score breakdown
   - Add manual override button
   - Show recommendation history

### Plan 4: Manual Override
**Wave:** 2
**Depends on:** Plan 3
**Files Modified:**
- `src/stores/deviceStore.ts`
- `src/pages/DeviceDetail/index.tsx`

**Tasks:**

1. **Update Device Store**
   - Add `manualOverride` field to Device
   - Add `clearOverride` action
   - Override affects recommendation until cleared

2. **Update UI**
   - "标记为已灌溉" button
   - "清除建议" button
   - Show override status

## Verification Criteria

- [ ] Algorithm produces correct recommendations for test scenarios
- [ ] Recommendations display on device cards
- [ ] Recommendations display on device detail
- [ ] Score breakdown is accurate
- [ ] Manual override works
- [ ] Chinese labels throughout
- [ ] Build passes without errors

## Must-Haves

1. Working recommendation algorithm
2. Three-dimension scoring
3. UI badges and detail view
4. Manual override
5. Chinese labels

## Notes

- Test with demo data scenarios
- Ensure algorithm handles edge cases
- Keep algorithm transparent (user can understand why)
- Consider adding "confidence level" indicator
