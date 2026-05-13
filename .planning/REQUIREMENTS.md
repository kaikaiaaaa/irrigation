# Requirements: 放心灌 Web版

**Defined:** 2025-05-13
**Core Value:** 用户打开应用就能看到每个设备的当前状态以及基于天气、土壤湿度和专家知识的综合灌溉建议，无需专业知识即可做出正确的浇水决策。

## v1 Requirements

### Device Management

- [ ] **DEV-01**: User can add a new irrigation device/field with name, location, crop type, area, and soil moisture sensor
- [ ] **DEV-02**: User can edit device details (name, location, crop type, area, soil moisture thresholds)
- [ ] **DEV-03**: User can delete a device
- [ ] **DEV-04**: User can view a list of all devices with status summary (including soil moisture level)
- [ ] **DEV-05**: User can view device details including current weather, soil moisture, and irrigation recommendation

### Weather Integration

- [ ] **WTH-01**: App fetches current weather data (temperature, humidity, precipitation) for each device location
- [ ] **WTH-02**: App fetches 24-hour rain forecast for each device location
- [ ] **WTH-03**: Weather data is cached and refreshed every 1 hour (forecasts) / 15 minutes (current)
- [ ] **WTH-04**: App shows weather data freshness timestamp
- [ ] **WTH-05**: App handles weather API failures gracefully (show cached data or manual override)

### Irrigation Recommendations

- [ ] **REC-01**: App shows irrigation recommendation for each device (WATER / DELAY / SKIP / MONITOR)
- [ ] **REC-02**: Recommendation includes reason (e.g., "土壤湿度低于阈值", "未来24小时有雨", "温度适宜灌溉")
- [ ] **REC-03**: Recommendation considers: weather (rain, temperature, humidity), soil moisture level, and crop-specific expert rules
- [ ] **REC-04**: User can manually override recommendation and mark as "irrigated"
- [ ] **REC-05**: App tracks last irrigation date per device

### Data Persistence

- [ ] **DAT-01**: All device data is stored in browser LocalStorage
- [ ] **DAT-02**: Data persists across browser sessions
- [ ] **DAT-03**: User can export device data as JSON file
- [ ] **DAT-04**: User can import device data from JSON file
- [ ] **DAT-05**: App handles LocalStorage quota exceeded gracefully

### UI/UX

- [ ] **UI-01**: App is responsive and works on mobile and desktop
- [ ] **UI-02**: App has a clean, user-friendly interface suitable for outdoor use (large touch targets, high contrast)
- [ ] **UI-03**: App shows loading states for weather data
- [ ] **UI-04**: App shows error messages in user-friendly language
- [ ] **UI-05**: App supports Chinese language

## v2 Requirements

### Advanced Weather

- **WTH-06**: 7-day weather forecast view
- **WTH-07**: Weather history/charts
- **WTH-08**: Multiple weather source fallback

### Advanced Irrigation

- **REC-06**: ET-based irrigation calculation (Penman-Monteith or Hargreaves)
- **REC-07**: Crop coefficient (Kc) based on growth stage
- **REC-08**: Advanced soil moisture analysis (trends, historical data)
- **REC-09**: Irrigation scheduling (calendar view)

### Data & Sync

- **DAT-06**: Cloud backup/sync (optional backend)
- **DAT-07**: Data visualization (charts, trends)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend server/database | v1 is pure frontend, LocalStorage only |
| User authentication | Single-user app, no login needed |
| Real-time device communication | No IoT integration in v1 |
| Push notifications | Browser notifications deferred to v2 |
| Multi-user collaboration | Single-user focus for v1 |
| Mobile app (native) | Web app only, PWA considered for v2 |
| Advanced ET modeling | Rule-based approach sufficient for v1 |
| Real-time soil sensor hardware | Manual input or simulated data for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEV-01 | Phase 1 | Pending |
| DEV-02 | Phase 1 | Pending |
| DEV-03 | Phase 1 | Pending |
| DEV-04 | Phase 1 | Pending |
| DEV-05 | Phase 2 | Pending |
| WTH-01 | Phase 2 | Pending |
| WTH-02 | Phase 2 | Pending |
| WTH-03 | Phase 2 | Pending |
| WTH-04 | Phase 3 | Pending |
| WTH-05 | Phase 3 | Pending |
| REC-01 | Phase 3 | Pending |
| REC-02 | Phase 3 | Pending |
| REC-03 | Phase 3 | Pending |
| REC-04 | Phase 3 | Pending |
| REC-05 | Phase 3 | Pending |
| DAT-01 | Phase 1 | Pending |
| DAT-02 | Phase 1 | Pending |
| DAT-03 | Phase 4 | Pending |
| DAT-04 | Phase 4 | Pending |
| DAT-05 | Phase 4 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| UI-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2025-05-13*
*Last updated: 2025-05-13 after initial definition*
