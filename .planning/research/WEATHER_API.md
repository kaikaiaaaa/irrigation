# Weather API Comparison for Irrigation Web Application

> Research date: 2026-05-13
> Requirements: Current weather (temp, humidity), rain forecast (24-48h), free tier, CORS-friendly, good for Chinese users

---

## 1. Recommended API: Open-Meteo

### Why It Is Recommended

| Criteria | Open-Meteo |
|----------|-----------|
| **API Key** | Not required for free tier |
| **Free tier limits** | 10,000 calls/day, 300,000/month |
| **Rate limit** | 600/min, 5,000/hour |
| **CORS** | Yes, browser-friendly |
| **China coverage** | Yes (uses CMA GRAPES Global model among others) |
| **Rain forecast** | Hourly precipitation + probability up to 16 days |
| **Current weather** | Yes (temperature, humidity, etc.) |
| **Data source** | Multiple national weather services (DWD, NOAA, ECMWF, CMA, JMA, etc.) |
| **Resolution** | 1-2 km (local models), 11 km (global) |
| **Update frequency** | Hourly for high-res models |

**Key advantages:**
- No API key needed to start — zero friction for development and small deployments
- Generous free limits (10K/day is plenty for a personal/small irrigation app)
- Open data, well-documented, stable JSON API
- Supports WMO weather codes for easy condition mapping
- Includes precipitation probability (ensemble-based)
- Open-source, can self-host if needed

### How to Use It

**Example request — current + 48h hourly forecast:**

```
https://api.open-meteo.com/v1/forecast?latitude=31.2304&longitude=121.4737&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,weather_code&forecast_days=2&timezone=auto
```

**Example response (truncated):**

```json
{
  "latitude": 31.23,
  "longitude": 121.47,
  "current": {
    "time": "2026-05-13T14:00",
    "temperature_2m": 24.5,
    "relative_humidity_2m": 68,
    "precipitation": 0.0,
    "rain": 0.0,
    "weather_code": 1
  },
  "hourly": {
    "time": ["2026-05-13T14:00", "2026-05-13T15:00", "..."],
    "temperature_2m": [24.5, 24.2, 23.8],
    "relative_humidity_2m": [68, 70, 72],
    "precipitation_probability": [10, 15, 30],
    "precipitation": [0.0, 0.0, 0.5],
    "rain": [0.0, 0.0, 0.5],
    "weather_code": [1, 2, 61]
  }
}
```

**WMO Weather codes for rain:**
- `51-55` = Drizzle
- `61-65` = Rain
- `80-82` = Rain showers
- `95-99` = Thunderstorm

### Limitations

- Free tier is for **non-commercial use only** (commercial requires paid plan)
- No service guarantee on free tier (no SLA)
- Weather codes are WMO numeric codes — need mapping layer for human-readable labels
- No built-in city name search (use separate Geocoding API: `https://geocoding-api.open-meteo.com/v1/search?name=Shanghai`)
- Current conditions are model-based (15-minutely interpolation), not live station data
- Servers in Europe/North America; Asia POP planned but not guaranteed yet

---

## 2. Fallback Options

### Option A: OpenWeatherMap (Free Tier)

| Criteria | Details |
|----------|---------|
| API Key | Required (free signup) |
| Free tier | 1,000 calls/day, 60 calls/min |
| Current weather | Yes |
| Forecast | 5-day / 3-hour forecast (free) |
| Rain forecast | Yes, but 3-hour granularity on free tier |
| CORS | Yes |
| China coverage | Yes |

**Pros:**
- Very popular, extensive documentation, large community
- One Call API 3.0 gives current + hourly + daily in one call (1,000 free/day)
- Human-readable weather descriptions (icons + text)
- Live weather station data (not just models)

**Cons:**
- Requires API key (slight friction)
- Free tier only 1,000 calls/day (vs 10K for Open-Meteo)
- Hourly forecast requires One Call 3.0 (1,000/day limit)
- 3-hour forecast on legacy free tier is too coarse for irrigation decisions
- Historical data not available on free tier

**Best for:** Production apps needing reliable live data and human-readable conditions.

---

### Option B: QWeather (He Feng Tian Qi)

| Criteria | Details |
|----------|---------|
| API Key | Required (free signup) |
| Free tier | Available (generous for dev) |
| Current weather | Yes |
| Hourly forecast | Yes |
| Minute-level precip | **Yes — next 2 hours, 1-min/1-km grid in China** |
| CORS | Yes |
| China coverage | **Excellent** (domestic provider) |
| Language | Chinese + English |

**Pros:**
- Best-in-class China coverage (domestic data sources)
- **Minute-level precipitation forecast for China** (unique advantage for irrigation)
- Chinese language support natively
- Grid weather API (3-5 km resolution)
- Weather alerts for China

**Cons:**
- Requires API key
- Free tier has usage limits (check current policy)
- International coverage may be less comprehensive than Open-Meteo/OpenWeatherMap
- Documentation primarily in Chinese

**Best for:** Apps primarily serving **Chinese users** who need hyper-local precipitation timing.

---

### Option C: WeatherAPI.com (Free Tier)

| Criteria | Details |
|----------|---------|
| API Key | Required |
| Free tier | 100K calls/month |
| Forecast | 3 days (free) |
| Hourly data | Yes (free) |
| CORS | Yes |
| China coverage | Yes |

**Pros:**
- 100K calls/month on free tier
- Simple REST API
- Supports Chinese language (`lang=zh`)
- Air quality data available

**Cons:**
- Only 3-day forecast on free tier (insufficient for 48h rain planning)
- Requires API key
- Less popular, smaller community

**Best for:** Quick prototyping if you already have an account.

---

## 3. Summary Comparison Table

| Feature | **Open-Meteo** | OpenWeatherMap | QWeather | WeatherAPI |
|---------|---------------|----------------|----------|------------|
| **API Key required** | No | Yes | Yes | Yes |
| **Free daily calls** | 10,000 | 1,000 | Varies | ~3,300 |
| **Hourly forecast free** | Yes (16 days) | Yes (1K/day) | Yes | Yes (3 days) |
| **Rain probability** | Yes (ensemble) | Limited | Yes | No |
| **Minute precip** | No | No | **Yes (China)** | No |
| **China accuracy** | Good | Good | **Excellent** | Good |
| **CORS** | Yes | Yes | Yes | Yes |
| **Live station data** | No (model) | Yes | Yes | Yes |
| **Self-hostable** | Yes (open source) | No | No | No |
| **Ease of start** | **Best** | Good | Good | Good |

---

## 4. Recommendation for This Project

**Primary: Open-Meteo**
- Zero setup friction (no key)
- 10K/day is more than enough for an irrigation app
- Hourly precipitation + probability exactly what is needed for 24-48h rain decisions
- Good enough China coverage via CMA model

**Secondary fallback: QWeather**
- If the app is primarily for Chinese users and needs minute-level precipitation
- Sign up for free key at dev.qweather.com

**Tertiary fallback: OpenWeatherMap**
- If live station data becomes important
- If you need human-readable weather descriptions without maintaining a mapping table
