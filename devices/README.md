# Devices App - MetaPlayer Backend

## Overview
This app handles device registration, M3U playlist management, and caching for the MetaPlayer IPTV application.

## Database Schema

### Device Model
- `mac_address`: Unique MAC address identifier (17 chars, format: XX:XX:XX:XX:XX:XX)
- `device_name`: Optional device name
- `m3u_url`: URL to the M3U playlist file
- `m3u_cache`: Cached M3U content (to avoid re-downloading large files)
- `m3u_cache_updated`: Timestamp when cache was last updated
- `cache_expiry_hours`: Cache expiry time in hours (default: 24)
- `m3u_last_modified`: Last modified timestamp from source
- `m3u_etag`: ETag from source (for cache validation)
- `is_active`: Whether device is active
- `created_at`: Device registration timestamp
- `last_seen`: Last API access timestamp

## API Endpoints

### 1. Register Device
**POST** `/api/devices/register/`

Request body:
```json
{
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_name": "My Android TV",
    "m3u_url": "http://example.com/playlist.m3u"
}
```

Response:
```json
{
    "success": true,
    "device": {
        "mac_address": "AA:BB:CC:DD:EE:FF",
        "device_name": "My Android TV",
        "m3u_url": "http://example.com/playlist.m3u",
        "created": true
    }
}
```

### 2. Get Playlist
**GET** `/api/devices/{mac_address}/playlist.m3u`

Query parameters:
- `refresh=true` - Force refresh cache

Returns: M3U file content

### 3. Get Device Info
**GET** `/api/devices/{mac_address}/info/`

Response:
```json
{
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_name": "My Android TV",
    "m3u_url": "http://example.com/playlist.m3u",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "last_seen": "2024-01-01T12:00:00Z",
    "cache": {
        "has_cache": true,
        "cache_valid": true,
        "cache_updated": "2024-01-01T10:00:00Z",
        "cache_expires_in_hours": 24,
        "cache_size_bytes": 31457280
    }
}
```

### 4. Refresh Playlist
**POST** `/api/devices/{mac_address}/refresh/`

Force refresh the M3U cache for a device.

## Features

### Caching Strategy
- M3U files are cached in the database to avoid re-downloading large files
- Cache expires after configured hours (default: 24 hours)
- Cache can be force-refreshed via API
- Uses ETag and Last-Modified headers for efficient cache validation

### Performance
- Indexed MAC address for fast lookups
- Cached content reduces server load
- Supports large M3U files (150MB+)

## SQL Schema

See `schema.sql` for the complete SQL CREATE statements.

## Usage Example

```python
# Register a device
POST /api/devices/register/
{
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "m3u_url": "http://example.com/playlist.m3u"
}

# Get playlist (uses cache if valid)
GET /api/devices/AA:BB:CC:DD:EE:FF/playlist.m3u

# Force refresh
GET /api/devices/AA:BB:CC:DD:EE:FF/playlist.m3u?refresh=true
```
