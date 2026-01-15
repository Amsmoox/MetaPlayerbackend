-- SQL Schema for MetaPlayer Backend
-- Device and M3U Playlist Management

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mac_address VARCHAR(17) NOT NULL UNIQUE,
    device_name VARCHAR(255) NOT NULL DEFAULT '',
    m3u_url TEXT NOT NULL,
    m3u_cache TEXT NOT NULL DEFAULT '',
    m3u_cache_updated DATETIME NULL,
    cache_expiry_hours INTEGER NOT NULL DEFAULT 24,
    m3u_last_modified DATETIME NULL,
    m3u_etag VARCHAR(255) NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_mac_address ON devices(mac_address);
CREATE INDEX IF NOT EXISTS idx_devices_active_created ON devices(is_active, created_at);
CREATE INDEX IF NOT EXISTS idx_devices_cache_updated ON devices(m3u_cache_updated);

-- Note: This schema is for SQLite (default Django database)
-- For PostgreSQL, use:
--   id SERIAL PRIMARY KEY
--   mac_address VARCHAR(17) NOT NULL UNIQUE
--   BOOLEAN instead of BOOLEAN
--   TIMESTAMP instead of DATETIME
