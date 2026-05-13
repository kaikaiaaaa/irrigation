# Phase 2: Weather Service - Context

**Gathered:** 2025-05-13
**Status:** Ready for planning

## Phase Boundary

Integrate Open-Meteo API with caching and error handling. This phase delivers weather data integration that feeds into the irrigation recommendation engine (Phase 3).

**In scope:**
- Open-Meteo API client implementation
- Current weather data fetch (temperature, humidity, precipitation)
- 24-hour rain forecast fetch
- Weather data caching with TTL (1h forecast, 15min current)
- Loading states for API calls
- Error handling with user-friendly messages
- Data freshness timestamp display
- Graceful degradation when API fails

**Out of scope:**
- Irrigation recommendation logic (Phase 3)
- 7-day forecast view (v2)
- Weather history/charts (v2)
- Multiple weather source fallback (v2)

## Implementation Decisions

### Weather API
- **D-01:** Use Open-Meteo API (free, no API key, CORS-friendly)
- **D-02:** API endpoint: `https://api.open-meteo.com/v1/forecast`
- **D-03:** Fetch parameters: latitude, longitude, current weather, hourly forecast
- **D-04:** Cache TTL: 15 minutes for current weather, 1 hour for forecast

### Data Flow
- **D-05:** Weather data stored per device (by deviceId)
- **D-06:** Fetch weather when viewing device detail or on manual refresh
- **D-07:** Display weather on device cards (Home page) and device detail page
- **D-08:** Show loading spinner during API calls
- **D-09:** Show error message with retry button on failure
- **D-10:** Show "last updated" timestamp for transparency

### Error Handling
- **D-11:** Network errors: show cached data if available, else error message
- **D-12:** API rate limit: show error with countdown to retry
- **D-13:** Invalid coordinates: show error and prompt user to update location
- **D-14:** Always allow manual retry

### UI Integration
- **D-15:** Weather widget on device detail page
- **D-16:** Compact weather info on device cards (Home page)
- **D-17:** Weather icon + temperature + humidity display
- **D-18:** Rain probability indicator for next 24h

## Canonical References

### Project Documents
- `.planning/PROJECT.md` — Project vision
- `.planning/REQUIREMENTS.md` — WTH-01~05 requirements
- `.planning/ROADMAP.md` — Phase 2 success criteria
- `.planning/research/WEATHER_API.md` — Open-Meteo API details

### Phase 1 Artifacts
- `.planning/phases/01-project-setup/01-SUMMARY.md` — What was built
- `src/stores/weatherStore.ts` — Weather store (prepared)
- `src/types/weather.ts` — Weather types (prepared)

## Existing Code Insights

### Reusable Assets
- `src/stores/weatherStore.ts` — Already created with cache structure
- `src/types/weather.ts` — Weather data types defined
- `src/stores/uiStore.ts` — Loading/error states

### Integration Points
- Device store provides location (lat/lng) for API calls
- Weather store caches data by deviceId
- UI store manages loading/error states
- Device detail page displays weather data

## Specific Ideas

- Weather widget design: icon + temp + humidity in a card
- Rain forecast: simple bar showing probability over next 24h
- Use weather codes from Open-Meteo to show appropriate icons (sun, cloud, rain)
- Add "refresh weather" button on device detail
- Show weather data age (e.g., "2分钟前更新")

## Deferred Ideas

- 7-day forecast view — v2
- Weather history charts — v2
- Multiple weather sources — v2
- Automatic weather refresh based on location change — v2

---

*Phase: 2-Weather Service*
*Context gathered: 2025-05-13*
