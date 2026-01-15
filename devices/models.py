from django.db import models
from django.utils import timezone
from datetime import timedelta


class Device(models.Model):
    """
    Device model to store MAC address and M3U playlist information.
    Implements caching to avoid re-downloading large M3U files.
    App parses M3U locally - no channel records stored in database.
    Includes activation/licensing system with free trial, yearly, and lifetime options.
    """
    # Activation types for device licensing
    ACTIVATION_FREE_TRIAL = 'FREE_TRIAL'
    ACTIVATION_YEARLY = 'YEARLY'
    ACTIVATION_LIFETIME = 'LIFETIME'
    
    ACTIVATION_CHOICES = [
        (ACTIVATION_FREE_TRIAL, 'Free Trial (7 days)'),
        (ACTIVATION_YEARLY, 'Yearly (1 year)'),
        (ACTIVATION_LIFETIME, 'Lifetime'),
    ]
    mac_address = models.CharField(
        max_length=17,
        unique=True,
        db_index=True,
        help_text="MAC address in format XX:XX:XX:XX:XX:XX"
    )
    device_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional device name for identification"
    )
    m3u_url = models.URLField(
        blank=True,
        null=True,
        help_text="URL to the M3U playlist file (optional on first registration)"
    )
    m3u_cache = models.TextField(
        blank=True,
        help_text="Cached M3U file content to avoid re-downloading"
    )
    m3u_cache_updated = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when M3U cache was last updated"
    )
    cache_expiry_hours = models.IntegerField(
        default=24,
        help_text="Number of hours before cache expires (default: 24)"
    )
    m3u_last_modified = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last modified timestamp from M3U source (for cache validation)"
    )
    m3u_etag = models.CharField(
        max_length=255,
        blank=True,
        help_text="ETag from M3U source (for cache validation)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this device is active (computed from activation status)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the device was first registered"
    )
    last_seen = models.DateTimeField(
        auto_now=True,
        help_text="Last time the device accessed the API"
    )
    last_activity = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last time the app was used (heartbeat)"
    )
    activation_type = models.CharField(
        max_length=20,
        choices=ACTIVATION_CHOICES,
        default=ACTIVATION_FREE_TRIAL,
        help_text="Type of activation/license"
    )
    activated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the device was activated (for paid licenses)"
    )
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the license expires (null for lifetime)"
    )

    class Meta:
        db_table = 'devices'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['mac_address']),
            models.Index(fields=['is_active', 'created_at']),
            models.Index(fields=['activation_type', 'expires_at']),
        ]

    def __str__(self):
        return f"{self.device_name or 'Unknown'} ({self.mac_address})"

    def is_cache_valid(self):
        """Check if the cached M3U is still valid based on expiry time."""
        if not self.m3u_cache or not self.m3u_cache_updated:
            return False
        
        expiry_time = self.m3u_cache_updated + timedelta(hours=self.cache_expiry_hours)
        return timezone.now() < expiry_time

    def needs_cache_refresh(self):
        """Check if cache needs to be refreshed."""
        return not self.is_cache_valid()
    
    def check_activation_status(self):
        """
        Check and update activation status based on expiration.
        Returns True if device is active, False otherwise.
        """
        now = timezone.now()
        
        # Lifetime activation never expires
        if self.activation_type == self.ACTIVATION_LIFETIME:
            self.is_active = True
            self.save(update_fields=['is_active'])
            return True
        
        # Check if expired
        if self.expires_at and now > self.expires_at:
            self.is_active = False
            self.save(update_fields=['is_active'])
            return False
        
        # Still active
        self.is_active = True
        self.save(update_fields=['is_active'])
        return True
    
    def get_activation_status(self):
        """Get detailed activation status information."""
        now = timezone.now()
        is_active = self.check_activation_status()
        
        status = {
            'is_active': is_active,
            'activation_type': self.activation_type,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'activated_at': self.activated_at.isoformat() if self.activated_at else None,
            'created_at': self.created_at.isoformat(),
            'last_activity': self.last_activity.isoformat() if self.last_activity else None,
        }
        
        if self.expires_at:
            if now > self.expires_at:
                status['days_remaining'] = 0
                status['expired'] = True
            else:
                delta = self.expires_at - now
                status['days_remaining'] = delta.days
                status['expired'] = False
        else:
            status['days_remaining'] = None
            status['expired'] = False
        
        return status
