# Plan: Phase 2 - Weather Service

**Phase:** 2 - Weather Service
**Date:** 2025-05-13
**Status:** Ready for execution

## Overview

Integrate Open-Meteo API with caching and error handling. This phase delivers weather data integration that feeds into the irrigation recommendation engine (Phase 3).

## Requirements Covered

- WTH-01: Fetch current weather data (temperature, humidity, precipitation)
- WTH-02: Fetch 24-hour rain forecast
- WTH-03: Weather data cached with TTL
- WTH-04: Show data freshness timestamp
- WTH-05: Handle API failures gracefully
- UI-03: Loading states for weather data
- UI-04: Error messages in user-friendly language

## Plans

### Plan 1: Open-Meteo API Client
**Wave:** 1
**Depends on:** None
**Files Modified:**
- `src/services/weatherApi.ts`
- `src/types/weather.ts`

**Tasks:**

1. **Create Weather API Service**
   - Implement `fetchWeatherData(lat, lng)` function
   - Use Open-Meteo forecast endpoint
   - Request parameters:
     - `current`: temperature_2m, relative_humidity_2m, precipitation, weather_code
     - `hourly`: temperature_2m, precipitation_probability, precipitation, weather_code
     - `forecast_days`: 2
     - `timezone`: auto
   - Parse and validate response
   - Transform to app WeatherData format

2. **Update Weather Types**
   - Ensure types match Open-Meteo response structure
   - Add WMO weather code mapping
   - Add error response types

### Plan 2: Weather Store Enhancement
**Wave:** 1
**Depends on:** Plan 1
**Files Modified:**
- `src/stores/weatherStore.ts`
- `src/hooks/useWeather.ts`

**Tasks:**

1. **Enhance Weather Store**
   - Add `fetchWeather` action that calls API service
   - Implement cache validation logic
   - Store fetch timestamp
   - Add loading state management

2. **Create useWeather Hook**
   - Custom hook for components to fetch weather
   - Auto-fetch on mount if cache expired
   - Return weather data, loading state, error, refetch function
   - Handle cache TTL checks

### Plan 3: Weather UI Components
**Wave:** 2
**Depends on:** Plan 2
**Files Modified:**
- `src/components/weather/WeatherCard.tsx`
- `src/components/weather/WeatherIcon.tsx`
- `src/components/weather/RainForecast.tsx`
- `src/pages/DeviceDetail/index.tsx`
- `src/pages/Home/index.tsx`

**Tasks:**

1. **Create WeatherIcon Component**
   - Map WMO weather codes to Lucide icons
   - Support: clear, cloudy, rain, snow, thunderstorm
   - Size variants for card vs detail view

2. **Create WeatherCard Component**
   - Display current weather: icon, temp, humidity
   - Show "last updated" timestamp
   - Show refresh button
   - Loading skeleton state
   - Error state with retry button

3. **Create RainForecast Component**
   - Show 24-hour precipitation probability
   - Simple bar chart or timeline
   - Highlight high-probability hours

4. **Integrate into DeviceDetail Page**
   - Add WeatherCard to device detail
   - Show weather for device location
   - Auto-fetch on page load

5. **Integrate into Home Page**
   - Show compact weather on device cards
   - Display temperature and weather icon
   - Show rain alert if high probability

### Plan 4: Error Handling & Loading States
**Wave:** 2
**Depends on:** Plan 3
**Files Modified:**
- `src/components/common/LoadingSpinner.tsx`
- `src/components/common/ErrorMessage.tsx`
- `src/stores/uiStore.ts`

**Tasks:**

1. **Create LoadingSpinner Component**
   - Centered spinner for async operations
   - Size variants
   - Overlay option for page-level loading

2. **Create ErrorMessage Component**
   - Display error with icon
   - Retry button
   - Chinese error messages
   - Different styles for warning vs error

3. **Update UI Store**
   - Add weather-specific loading states
   - Add weather error handling
   - Clear errors on successful fetch

## Verification Criteria

- [ ] Weather API returns valid data for test coordinates
- [ ] Weather data displays on device detail page
- [ ] Weather data displays on device cards (Home)
- [ ] Cache works (no duplicate API calls within TTL)
- [ ] Loading spinner shows during API calls
- [ ] Error message shows on API failure
- [ ] Retry button works
- [ ] Timestamp shows data freshness
- [ ] Graceful degradation when offline
- [ ] Build passes without errors

## Must-Haves

1. Working Open-Meteo API integration
2. Weather display on device pages
3. Cache with TTL
4. Error handling with retry
5. Chinese UI labels

## Notes

- Test with Shanghai coordinates (31.2304, 121.4737)
- Handle API rate limits (10,000/day free tier)
- Consider adding mock data for development/testing
- Weather codes reference: https://open-meteo.com/en/docs
