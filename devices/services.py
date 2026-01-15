"""
Service layer for M3U playlist fetching and caching.
Handles downloading, caching, and serving M3U files efficiently.
App parses M3U locally - no channel storage in database.
"""
import gzip
import logging
import socket
from datetime import timedelta
from typing import Optional, Tuple, Dict, Any
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from django.utils import timezone
from .models import Device

logger = logging.getLogger(__name__)


class M3UService:
    """Service for handling M3U playlist operations."""
    
    @staticmethod
    def fetch_m3u(url: str, timeout: int = 10) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        """
        Fetch M3U file from URL.
        
        Returns:
            Tuple of (content, etag, last_modified)
            Returns (None, None, None) on error
        """
        try:
            request = Request(url)
            request.add_header('User-Agent', 'MetaPlayer/1.0')
            
            # Add If-None-Match and If-Modified-Since for conditional requests
            with urlopen(request, timeout=timeout) as response:
                content = response.read()
                
                # Try to decode as UTF-8
                try:
                    m3u_content = content.decode('utf-8')
                except UnicodeDecodeError:
                    # Fallback to latin-1 if UTF-8 fails
                    m3u_content = content.decode('latin-1')
                
                # Get ETag and Last-Modified from headers
                etag = response.headers.get('ETag', '')
                last_modified_str = response.headers.get('Last-Modified', '')
                last_modified = None
                
                if last_modified_str:
                    try:
                        from email.utils import parsedate_to_datetime
                        last_modified = parsedate_to_datetime(last_modified_str)
                    except Exception:
                        pass
                
                return m3u_content, etag, last_modified
                
        except HTTPError as e:
            if e.code == 304:  # Not Modified
                logger.info(f"M3U not modified: {url}")
                return None, None, None
            logger.error(f"HTTP error fetching M3U: {e.code} - {url}")
            return None, None, None
        except socket.timeout:
            logger.error(f"Timeout fetching M3U (exceeded {timeout}s): {url}")
            return None, None, None
        except URLError as e:
            logger.error(f"URL error fetching M3U: {e.reason} - {url}")
            return None, None, None
        except Exception as e:
            logger.error(f"Unexpected error fetching M3U: {str(e)} - {url}")
            return None, None, None
    
    @staticmethod
    def get_m3u_for_device(device: Device, force_refresh: bool = False) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
        """
        Get M3U content for a device, using cache if available and valid.
        
        Args:
            device: Device instance
            force_refresh: If True, force refresh even if cache is valid
            
        Returns:
            Tuple of (M3U content, error_info)
            Returns (content, None) on success, (None, error_info) on error
        """
        # Check cache first (unless forced refresh)
        if not force_refresh and device.is_cache_valid() and device.m3u_cache:
            logger.info(f"Using cached M3U for device {device.mac_address}")
            return device.m3u_cache, None
        
        # Fetch fresh M3U
        logger.info(f"Fetching fresh M3U for device {device.mac_address}")
        content, etag, last_modified = M3UService.fetch_m3u(device.m3u_url)
        
        if content is None:
            # If fetch failed, try to use stale cache
            if device.m3u_cache:
                logger.warning(f"Fetch failed, using stale cache for device {device.mac_address}")
                return device.m3u_cache, None
            
            # No cache available - return error info
            error_info = {
                'type': 'fetch_failed',
                'message': 'Failed to fetch M3U playlist from IPTV service and no cached data available.',
                'has_cache': False,
                'suggestion': 'Please check your IPTV service credentials and try again later.'
            }
            return None, error_info
        
        # Update cache
        device.m3u_cache = content
        device.m3u_cache_updated = timezone.now()
        if etag:
            device.m3u_etag = etag
        if last_modified:
            device.m3u_last_modified = last_modified
        device.save(update_fields=[
            'm3u_cache',
            'm3u_cache_updated',
            'm3u_etag',
            'm3u_last_modified'
        ])
        
        logger.info(f"M3U cache updated for device {device.mac_address}")
        return content, None
    
    @staticmethod
    def compress_m3u(content: str) -> bytes:
        """Compress M3U content using gzip."""
        return gzip.compress(content.encode('utf-8'))
    
    @staticmethod
    def get_cache_info(device: Device) -> dict:
        """Get cache information for a device."""
        return {
            'has_cache': bool(device.m3u_cache),
            'cache_valid': device.is_cache_valid(),
            'cache_updated': device.m3u_cache_updated.isoformat() if device.m3u_cache_updated else None,
            'cache_expires_in_hours': device.cache_expiry_hours,
            'cache_size_bytes': len(device.m3u_cache) if device.m3u_cache else 0,
        }
