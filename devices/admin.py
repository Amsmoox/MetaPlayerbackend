from django.contrib import admin
from .models import Device


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = [
        'mac_address',
        'device_name',
        'is_active',
        'activation_type',
        'expires_at',
        'days_remaining_display',
        'm3u_url',
        'has_cache',
        'created_at',
        'last_activity',
    ]
    list_filter = [
        'is_active',
        'activation_type',
        'created_at',
        'last_seen',
    ]
    search_fields = ['mac_address', 'device_name', 'm3u_url']
    readonly_fields = [
        'created_at',
        'last_seen',
        'last_activity',
        'm3u_cache_updated',
        'cache_info_display',
        'activation_status_display',
    ]
    
    fieldsets = (
        ('Device Information', {
            'fields': ('mac_address', 'device_name', 'is_active')
        }),
        ('Activation & Licensing', {
            'fields': (
                'activation_type',
                'activated_at',
                'expires_at',
                'last_activity',
                'activation_status_display',
            )
        }),
        ('M3U Playlist', {
            'fields': ('m3u_url', 'm3u_cache_updated', 'cache_expiry_hours')
        }),
        ('Cache Information', {
            'fields': ('cache_info_display', 'm3u_etag', 'm3u_last_modified')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'last_seen')
        }),
    )
    
    def has_cache(self, obj):
        """Check if device has cached M3U."""
        return bool(obj.m3u_cache)
    has_cache.boolean = True
    has_cache.short_description = 'Has Cache'
    
    def cache_updated(self, obj):
        """Display when cache was last updated."""
        if obj.m3u_cache_updated:
            return obj.m3u_cache_updated.strftime('%Y-%m-%d %H:%M:%S')
        return 'Never'
    cache_updated.short_description = 'Cache Updated'
    
    def cache_info_display(self, obj):
        """Display cache information."""
        if obj.m3u_cache:
            size_mb = len(obj.m3u_cache) / (1024 * 1024)
            is_valid = obj.is_cache_valid()
            status = "Valid" if is_valid else "Expired"
            return f"{status} - {size_mb:.2f} MB"
        return "No cache"
    cache_info_display.short_description = 'Cache Status'
    
    def days_remaining_display(self, obj):
        """Display days remaining for license."""
        if obj.expires_at:
            from django.utils import timezone
            now = timezone.now()
            if now > obj.expires_at:
                return "Expired"
            delta = obj.expires_at - now
            return f"{delta.days} days"
        elif obj.activation_type == Device.ACTIVATION_LIFETIME:
            return "Lifetime"
        return "N/A"
    days_remaining_display.short_description = 'Days Remaining'
    
    def activation_status_display(self, obj):
        """Display detailed activation status."""
        status = obj.get_activation_status()
        if status['expired']:
            return f"❌ EXPIRED ({obj.activation_type})"
        elif status['days_remaining'] is None:
            return f"✅ LIFETIME"
        else:
            return f"✅ Active ({status['days_remaining']} days remaining)"
    activation_status_display.short_description = 'Activation Status'
