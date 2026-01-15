# MetaPlayer Activation System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Activation Types](#activation-types)
3. [API Endpoints](#api-endpoints)
4. [Scenarios](#scenarios)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [Database Schema](#database-schema)

---

## Overview

The MetaPlayer activation system manages device licensing with:
- **7-day free trial** for new devices
- **Yearly activation** (365 days)
- **Lifetime activation** (never expires)
- Automatic expiration checking
- Activity tracking (heartbeat)

### Key Features
- Devices can be registered without M3U URL
- Automatic trial period assignment (7 days from registration)
- Expired devices are blocked from accessing playlists
- Activity tracking updates `last_activity` timestamp
- Status checking on all critical endpoints

---

## Activation Types

| Type | Duration | Expires At |
|------|----------|------------|
| `FREE_TRIAL` | 7 days | `created_at + 7 days` |
| `YEARLY` | 365 days | `activated_at + 365 days` |
| `LIFETIME` | Forever | `null` (never expires) |

---

## API Endpoints

### 1. Register Device
**Endpoint:** `POST /api/devices/register/`

**Description:** Register a new device or update existing device. M3U URL is optional.

**Request Body:**
```json
{
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "m3u_url": "http://example.com/playlist.m3u"  // Optional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "device": {
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_name": "Android TV - Living Room",
    "m3u_url": "http://example.com/playlist.m3u",
    "created": true
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "mac_address is required"
}
```

---

### 2. Get Playlist
**Endpoint:** `GET /api/devices/{mac_address}/playlist.m3u?refresh=false`

**Description:** Get M3U playlist for device. **Blocked if expired.**

**Query Parameters:**
- `refresh` (optional): `true` to force refresh cache

**Response (200 OK):**
```
#EXTM3U
#EXTINF:-1 tvg-id="channel1" tvg-name="Channel 1",Channel 1
http://example.com/stream1.m3u8
...
```

**Response (403 Forbidden - Expired):**
```json
{
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": {
    "is_active": false,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0
  }
}
```

**Response (404 Not Found - No M3U URL):**
```json
{
  "error": "No playlist configured",
  "message": "M3U playlist URL has not been configured for this device yet."
}
```

---

### 3. Get Device Info
**Endpoint:** `GET /api/devices/{mac_address}/info/`

**Description:** Get device information and cache status. **Returns warning if expired.**

**Response (200 OK - Active):**
```json
{
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "m3u_url": "http://example.com/playlist.m3u",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "last_seen": "2024-01-05T12:30:00Z",
  "cache": {
    "has_cache": true,
    "cache_valid": true,
    "cache_updated": "2024-01-05T10:00:00Z",
    "cache_expires_in_hours": 24,
    "cache_size_bytes": 5242880
  },
  "activation_status": {
    "is_active": true,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "last_activity": "2024-01-05T12:00:00Z",
    "days_remaining": 2,
    "expired": false
  }
}
```

**Response (200 OK - Expired):**
```json
{
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "m3u_url": "http://example.com/playlist.m3u",
  "is_active": false,
  "created_at": "2024-01-01T00:00:00Z",
  "last_seen": "2024-01-10T12:30:00Z",
  "cache": { ... },
  "activation_status": {
    "is_active": false,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0
  },
  "warning": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app."
}
```

---

### 4. Refresh Playlist
**Endpoint:** `POST /api/devices/{mac_address}/refresh/`

**Description:** Force refresh M3U playlist cache. **Blocked if expired.**

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Playlist refreshed successfully",
  "cache": {
    "has_cache": true,
    "cache_valid": true,
    "cache_updated": "2024-01-05T12:35:00Z",
    "cache_expires_in_hours": 24,
    "cache_size_bytes": 5242880
  }
}
```

**Response (403 Forbidden - Expired):**
```json
{
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": {
    "is_active": false,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0
  }
}
```

---

### 5. Track Activity (Heartbeat)
**Endpoint:** `POST /api/devices/{mac_address}/activity/`

**Description:** Track device activity. Updates `last_activity` timestamp. **Always returns status.**

**Response (200 OK - Active):**
```json
{
  "success": true,
  "is_active": true,
  "last_activity": "2024-01-05T12:40:00Z",
  "activation_status": {
    "is_active": true,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "last_activity": "2024-01-05T12:40:00Z",
    "days_remaining": 2,
    "expired": false
  }
}
```

**Response (200 OK - Expired):**
```json
{
  "success": true,
  "is_active": false,
  "last_activity": "2024-01-10T12:40:00Z",
  "activation_status": {
    "is_active": false,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0
  },
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app."
}
```

---

### 6. Get Activation Status
**Endpoint:** `GET /api/devices/{mac_address}/status/`

**Description:** Get detailed activation status. **Always accessible, even when expired.**

**Response (200 OK - Active):**
```json
{
  "success": true,
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "is_active": true,
  "activation_type": "FREE_TRIAL",
  "expires_at": "2024-01-08T00:00:00Z",
  "activated_at": null,
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity": "2024-01-05T12:00:00Z",
  "days_remaining": 2,
  "expired": false
}
```

**Response (200 OK - Expired):**
```json
{
  "success": true,
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "is_active": false,
  "activation_type": "FREE_TRIAL",
  "expires_at": "2024-01-08T00:00:00Z",
  "activated_at": null,
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity": "2024-01-10T12:00:00Z",
  "days_remaining": 0,
  "expired": true,
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app."
}
```

**Response (200 OK - Yearly Active):**
```json
{
  "success": true,
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "is_active": true,
  "activation_type": "YEARLY",
  "expires_at": "2025-01-05T00:00:00Z",
  "activated_at": "2024-01-05T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity": "2024-01-05T12:00:00Z",
  "days_remaining": 365,
  "expired": false
}
```

**Response (200 OK - Lifetime):**
```json
{
  "success": true,
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "is_active": true,
  "activation_type": "LIFETIME",
  "expires_at": null,
  "activated_at": "2024-01-05T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity": "2024-01-05T12:00:00Z",
  "days_remaining": null,
  "expired": false
}
```

---

### 7. Activate Device (Admin Only)
**Endpoint:** `POST /api/devices/{mac_address}/activate/`

**Description:** Activate device with yearly or lifetime license. **Admin operation.**

**Request Body:**
```json
{
  "activation_type": "YEARLY"  // or "LIFETIME"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Device activated with YEARLY license",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "device_name": "Android TV - Living Room",
  "is_active": true,
  "activation_type": "YEARLY",
  "expires_at": "2025-01-05T00:00:00Z",
  "activated_at": "2024-01-05T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity": "2024-01-05T12:00:00Z",
  "days_remaining": 365,
  "expired": false
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid activation_type. Must be YEARLY or LIFETIME"
}
```

---

## Scenarios

### Scenario 1: New User Installs App (No M3U URL)

**Timeline:**
- **Day 0, 00:00** - User installs app

**Actions:**
1. App generates MAC address: `AA:BB:CC:DD:EE:FF`
2. App calls `POST /api/devices/register/` without M3U URL:
   ```json
   {
     "mac_address": "AA:BB:CC:DD:EE:FF",
     "device_name": "Android TV - Living Room",
     "m3u_url": null
   }
   ```

**Backend Response:**
```json
{
  "success": true,
  "device": {
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_name": "Android TV - Living Room",
    "m3u_url": null,
    "created": true
  }
}
```

**Backend State:**
- Device created with `activation_type = FREE_TRIAL`
- `expires_at = created_at + 7 days` (2024-01-08T00:00:00Z)
- `is_active = True`
- `m3u_url = null`

**App Behavior:**
- Shows "No Playlist" screen
- Displays MAC address
- User can copy MAC address
- Backend admin can add M3U URL later

---

### Scenario 2: Admin Adds M3U URL

**Timeline:**
- **Day 0, 10:00** - Admin adds M3U URL via backend

**Actions:**
1. Admin updates device in Django admin or via API
2. Sets `m3u_url = "http://example.com/playlist.m3u"`

**App Behavior:**
1. User clicks "RELOAD" button
2. App calls `GET /api/devices/{mac}/info/`
3. Receives device info with M3U URL
4. App calls `GET /api/devices/{mac}/playlist.m3u`
5. Downloads and parses M3U
6. Shows channel categories (Live TV, Movies, Series)

---

### Scenario 3: User Uses App During Trial

**Timeline:**
- **Day 0, 12:00** - User opens app
- **Day 1, 15:00** - User watches channels
- **Day 3, 20:00** - User refreshes playlist
- **Day 5, 18:00** - User checks status

**Actions:**

**Day 0, 12:00 - First Use:**
```http
POST /api/devices/AA:BB:CC:DD:EE:FF/activity/
```
**Response:**
```json
{
  "success": true,
  "is_active": true,
  "last_activity": "2024-01-01T12:00:00Z",
  "activation_status": {
    "is_active": true,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "days_remaining": 7,
    "expired": false
  }
}
```

**Day 3, 20:00 - Refresh Playlist:**
```http
POST /api/devices/AA:BB:CC:DD:EE:FF/refresh/
```
**Response:**
```json
{
  "success": true,
  "message": "Playlist refreshed successfully",
  "cache": { ... }
}
```

**Day 5, 18:00 - Check Status:**
```http
GET /api/devices/AA:BB:CC:DD:EE:FF/status/
```
**Response:**
```json
{
  "success": true,
  "is_active": true,
  "activation_type": "FREE_TRIAL",
  "expires_at": "2024-01-08T00:00:00Z",
  "days_remaining": 2,
  "expired": false
}
```

**App Behavior:**
- All features work normally
- Shows days remaining: "2 days remaining"
- Activity tracked every 5 minutes

---

### Scenario 4: Trial Expires (8+ Days)

**Timeline:**
- **Day 0, 00:00** - Device registered
- **Day 1-7** - No activity
- **Day 8, 10:00** - User opens app

**Actions:**

**Day 8, 10:00 - User Opens App:**
1. App calls `POST /api/devices/AA:BB:CC:DD:EE:FF/activity/`

**Response:**
```json
{
  "success": true,
  "is_active": false,
  "last_activity": "2024-01-08T10:00:00Z",
  "activation_status": {
    "is_active": false,
    "activation_type": "FREE_TRIAL",
    "expires_at": "2024-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0
  },
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app."
}
```

2. App calls `GET /api/devices/AA:BB:CC:DD:EE:FF/playlist.m3u`

**Response (403 Forbidden):**
```json
{
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": { ... }
}
```

**App Behavior:**
- Shows "TRIAL PERIOD EXPIRED" screen
- Displays MAC address
- Shows error message
- "CHECK STATUS" button available
- "EXIT" button available
- All playlist operations blocked

---

### Scenario 5: Admin Activates Device (Yearly)

**Timeline:**
- **Day 8, 11:00** - Admin activates device

**Actions:**
1. Admin calls `POST /api/devices/AA:BB:CC:DD:EE:FF/activate/`:
   ```json
   {
     "activation_type": "YEARLY"
   }
   ```

**Response:**
```json
{
  "success": true,
  "message": "Device activated with YEARLY license",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "is_active": true,
  "activation_type": "YEARLY",
  "expires_at": "2025-01-08T11:00:00Z",
  "activated_at": "2024-01-08T11:00:00Z",
  "days_remaining": 365,
  "expired": false
}
```

**Backend State:**
- `activation_type = YEARLY`
- `activated_at = 2024-01-08T11:00:00Z`
- `expires_at = 2025-01-08T11:00:00Z` (365 days from activation)
- `is_active = True`

**App Behavior:**
1. User clicks "CHECK STATUS" button
2. App calls `GET /api/devices/AA:BB:CC:DD:EE:FF/status/`
3. Receives updated status: `is_active = true`
4. App automatically loads playlist
5. All features work normally
6. Shows "365 days remaining"

---

### Scenario 6: Admin Activates Device (Lifetime)

**Timeline:**
- **Day 8, 12:00** - Admin activates with lifetime

**Actions:**
1. Admin calls `POST /api/devices/AA:BB:CC:DD:EE:FF/activate/`:
   ```json
   {
     "activation_type": "LIFETIME"
   }
   ```

**Response:**
```json
{
  "success": true,
  "message": "Device activated with LIFETIME license",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "is_active": true,
  "activation_type": "LIFETIME",
  "expires_at": null,
  "activated_at": "2024-01-08T12:00:00Z",
  "days_remaining": null,
  "expired": false
}
```

**Backend State:**
- `activation_type = LIFETIME`
- `expires_at = null` (never expires)
- `is_active = True` (always)

**App Behavior:**
- All features work normally
- No expiration date shown
- Status always shows `is_active = true`

---

### Scenario 7: Yearly License Expires

**Timeline:**
- **Day 0** - Device activated with yearly (expires Day 365)
- **Day 365, 10:00** - License expires
- **Day 366, 15:00** - User opens app

**Actions:**

**Day 366, 15:00 - User Opens App:**
1. App calls `POST /api/devices/AA:BB:CC:DD:EE:FF/activity/`

**Response:**
```json
{
  "success": true,
  "is_active": false,
  "last_activity": "2025-01-09T15:00:00Z",
  "activation_status": {
    "is_active": false,
    "activation_type": "YEARLY",
    "expires_at": "2025-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0
  },
  "error": "Device activation expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app."
}
```

2. App calls `GET /api/devices/AA:BB:CC:DD:EE:FF/playlist.m3u`

**Response (403 Forbidden):**
```json
{
  "error": "Device activation expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": { ... }
}
```

**App Behavior:**
- Shows expired screen
- User must contact admin to reactivate

---

### Scenario 8: Same Device Re-registers

**Timeline:**
- **Day 0** - Device registered
- **Day 5** - Same MAC address registers again

**Actions:**
1. App calls `POST /api/devices/register/` with same MAC address

**Backend Behavior:**
- `get_or_create()` finds existing device
- `created = False`
- Updates:
  - `device_name` (if provided)
  - `m3u_url` (if provided and different)
  - `last_seen = now`
- **Does NOT reset trial period** (uses original `created_at`)

**Response:**
```json
{
  "success": true,
  "device": {
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_name": "Updated Device Name",
    "m3u_url": "http://new-url.com/playlist.m3u",
    "created": false
  }
}
```

**Backend State:**
- Trial period continues from Day 0
- Still expires on Day 7 (not Day 12)

---

### Scenario 9: Device Never Calls Activity Endpoint

**Timeline:**
- **Day 0** - Device registered
- **Day 1-7** - App never sends heartbeat
- **Day 8** - Trial expires

**Backend Behavior:**
- Trial expires based on `created_at + 7 days`
- `last_activity` remains `null`
- `is_active` set to `False` on first API call after expiration

**First API Call After Expiration:**
```http
GET /api/devices/AA:BB:CC:DD:EE:FF/playlist.m3u
```

**Response (403):**
```json
{
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": {
    "is_active": false,
    "expires_at": "2024-01-08T00:00:00Z",
    "expired": true,
    "days_remaining": 0,
    "last_activity": null
  }
}
```

---

### Scenario 10: Activate During Trial (Before Expiration)

**Timeline:**
- **Day 0** - Device registered (trial expires Day 7)
- **Day 3** - Admin activates with yearly

**Actions:**
1. Admin calls `POST /api/devices/AA:BB:CC:DD:EE:FF/activate/`:
   ```json
   {
     "activation_type": "YEARLY"
   }
   ```

**Response:**
```json
{
  "success": true,
  "message": "Device activated with YEARLY license",
  "is_active": true,
  "activation_type": "YEARLY",
  "expires_at": "2025-01-04T00:00:00Z",  // 365 days from activation (Day 3)
  "activated_at": "2024-01-04T00:00:00Z",
  "days_remaining": 365,
  "expired": false
}
```

**Backend State:**
- Trial period replaced by yearly license
- New expiration: `activated_at + 365 days`
- User gets full 365 days from activation date

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | Success | Request successful |
| 400 | Bad Request | Invalid request data |
| 403 | Forbidden | Device expired or unauthorized |
| 404 | Not Found | Device not found or M3U URL not set |
| 500 | Internal Server Error | Server error |

### Error Response Format

All error responses follow this format:
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "activation_status": { ... }  // If activation-related
}
```

### Common Errors

**1. Device Not Found:**
```json
{
  "error": "Device not found"
}
```

**2. Invalid MAC Address:**
```json
{
  "error": "Invalid MAC address format. Expected XX:XX:XX:XX:XX:XX"
}
```

**3. Trial Expired:**
```json
{
  "error": "Trial period expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": {
    "is_active": false,
    "expired": true,
    "days_remaining": 0
  }
}
```

**4. Activation Expired:**
```json
{
  "error": "Device activation expired",
  "message": "Your free trial has expired. Please activate your device to continue using the app.",
  "activation_status": {
    "is_active": false,
    "expired": true,
    "days_remaining": 0
  }
}
```

**5. No Playlist Configured:**
```json
{
  "error": "No playlist configured",
  "message": "M3U playlist URL has not been configured for this device yet."
}
```

**6. Invalid Activation Type:**
```json
{
  "error": "Invalid activation_type. Must be YEARLY or LIFETIME"
}
```

---

## Database Schema

### Device Model

```python
class Device(models.Model):
    # Device Identification
    mac_address = CharField(max_length=17, unique=True, db_index=True)
    device_name = CharField(max_length=255, blank=True)
    
    # M3U Playlist
    m3u_url = URLField(blank=True, null=True)  # Optional
    m3u_cache = TextField(blank=True)
    m3u_cache_updated = DateTimeField(null=True, blank=True)
    cache_expiry_hours = IntegerField(default=24)
    m3u_last_modified = DateTimeField(null=True, blank=True)
    m3u_etag = CharField(max_length=255, blank=True)
    
    # Activation & Licensing
    is_active = BooleanField(default=True)
    activation_type = CharField(
        max_length=20,
        choices=[
            ('FREE_TRIAL', 'Free Trial (7 days)'),
            ('YEARLY', 'Yearly (1 year)'),
            ('LIFETIME', 'Lifetime'),
        ],
        default='FREE_TRIAL'
    )
    activated_at = DateTimeField(null=True, blank=True)
    expires_at = DateTimeField(null=True, blank=True)
    last_activity = DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = DateTimeField(auto_now_add=True)
    last_seen = DateTimeField(auto_now=True)
```

### Indexes

```python
indexes = [
    Index(fields=['mac_address']),
    Index(fields=['is_active', 'created_at']),
    Index(fields=['activation_type', 'expires_at']),
]
```

---

## Activation Status Logic

### `check_activation_status()` Method

```python
def check_activation_status(self):
    now = timezone.now()
    
    # Lifetime never expires
    if self.activation_type == 'LIFETIME':
        self.is_active = True
        return True
    
    # Check if expired
    if self.expires_at and now > self.expires_at:
        self.is_active = False
        return False
    
    # Still active
    self.is_active = True
    return True
```

### `get_activation_status()` Method

Returns detailed status dictionary:
```python
{
    'is_active': bool,
    'activation_type': str,
    'expires_at': str (ISO format) or None,
    'activated_at': str (ISO format) or None,
    'created_at': str (ISO format),
    'last_activity': str (ISO format) or None,
    'days_remaining': int or None,
    'expired': bool
}
```

---

## App Integration

### Activity Tracking

App sends heartbeat every 5 minutes:
```kotlin
viewModelScope.launch {
    while (true) {
        delay(300000) // 5 minutes
        deviceRepository.trackActivity()
    }
}
```

### Status Checking

App checks status on:
- App startup
- Before loading playlist
- Before refreshing playlist
- When user clicks "RELOAD"

### Expired Device Handling

When `isExpired = true`:
- Shows `ExpiredScreen` UI
- Blocks all playlist operations
- Displays MAC address for activation
- Shows "CHECK STATUS" button

---

## Summary

### Key Points

1. **Registration:** M3U URL is optional - device can be registered without it
2. **Trial Period:** 7 days from `created_at`, not `last_activity`
3. **Expiration:** Automatic checking on all API calls
4. **Blocking:** Expired devices cannot access playlists (403 Forbidden)
5. **Activity Tracking:** Optional but recommended (heartbeat every 5 min)
6. **Activation:** Admin-only operation via `/activate/` endpoint
7. **Status:** Always accessible via `/status/` endpoint

### Activation Flow

```
New Device
    ↓
Register (FREE_TRIAL, expires_at = created_at + 7 days)
    ↓
Use App (activity tracking, playlist access)
    ↓
[After 7 days]
    ↓
Trial Expires (is_active = False)
    ↓
All Playlist Operations Blocked (403)
    ↓
Admin Activates (YEARLY or LIFETIME)
    ↓
Device Active Again (is_active = True)
    ↓
Full Access Restored
```

---

## Testing Examples

### cURL Commands

**Register Device:**
```bash
curl -X POST http://localhost:8000/api/devices/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_name": "Test Device",
    "m3u_url": "http://example.com/playlist.m3u"
  }'
```

**Get Status:**
```bash
curl http://localhost:8000/api/devices/AA:BB:CC:DD:EE:FF/status/
```

**Track Activity:**
```bash
curl -X POST http://localhost:8000/api/devices/AA:BB:CC:DD:EE:FF/activity/
```

**Activate Device:**
```bash
curl -X POST http://localhost:8000/api/devices/AA:BB:CC:DD:EE:FF/activate/ \
  -H "Content-Type: application/json" \
  -d '{
    "activation_type": "YEARLY"
  }'
```

**Get Playlist:**
```bash
curl http://localhost:8000/api/devices/AA:BB:CC:DD:EE:FF/playlist.m3u
```

---

**End of Documentation**
