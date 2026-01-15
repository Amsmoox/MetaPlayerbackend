"""
API views for device and M3U playlist management.
App parses M3U locally - backend only caches and serves M3U files.
"""
import logging
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.utils import timezone
from datetime import timedelta
import json

from .models import Device

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class DeviceRegisterView(View):
    """Register a new device or update existing device."""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            mac_address = data.get('mac_address', '').strip().upper()
            device_name = data.get('device_name', '').strip()
            m3u_url = data.get('m3u_url', '').strip()
            
            if not mac_address:
                return JsonResponse(
                    {'error': 'mac_address is required'},
                    status=400
                )
            
            # Validate MAC address format (basic check)
            if len(mac_address) != 17 or mac_address.count(':') != 5:
                return JsonResponse(
                    {'error': 'Invalid MAC address format. Expected XX:XX:XX:XX:XX:XX'},
                    status=400
                )
            
            # m3u_url is optional - device can be registered without it
            # Get or create device
            device, created = Device.objects.get_or_create(
                mac_address=mac_address,
                defaults={
                    'device_name': device_name,
                    'm3u_url': m3u_url if m3u_url else None,
                    'activation_type': Device.ACTIVATION_FREE_TRIAL,
                    'expires_at': timezone.now() + timedelta(days=7),  # 7-day free trial
                }
            )
            
            # Update if exists
            if not created:
                device.device_name = device_name or device.device_name
                # Only update m3u_url if provided
                if m3u_url:
                    device.m3u_url = m3u_url
                device.last_seen = timezone.now()
                # Only set free trial if device was never activated (no expires_at)
                if not device.expires_at and device.activation_type == Device.ACTIVATION_FREE_TRIAL:
                    device.expires_at = device.created_at + timedelta(days=7)
                device.save()
            
            # No need to pre-fetch - app will fetch directly from IPTV service
            
            return JsonResponse({
                'success': True,
                'device': {
                    'mac_address': device.mac_address,
                    'device_name': device.device_name,
                    'm3u_url': device.m3u_url,
                    'created': created,
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse(
                {'error': 'Invalid JSON'},
                status=400
            )
        except Exception as e:
            logger.error(f"Error registering device: {str(e)}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )


@method_decorator(csrf_exempt, name='dispatch')
class PlaylistView(View):
    """Get M3U playlist for a device."""
    
    def get(self, request, mac_address):
        try:
            mac_address = mac_address.upper().strip()
            
            try:
                device = Device.objects.get(mac_address=mac_address)
            except Device.DoesNotExist:
                return JsonResponse(
                    {'error': 'Device not found'},
                    status=404
                )
            
            # Check activation status - expired devices cannot access playlist
            is_active = device.check_activation_status()
            if not is_active:
                status = device.get_activation_status()
                error_msg = 'Trial period expired' if device.activation_type == Device.ACTIVATION_FREE_TRIAL else 'Device activation expired'
                return JsonResponse(
                    {
                        'error': error_msg,
                        'message': 'Your free trial has expired. Please activate your device to continue using the app.',
                        'activation_status': status
                    },
                    status=403
                )
            
            # Check if M3U URL is set
            if not device.m3u_url:
                return JsonResponse(
                    {
                        'error': 'No playlist configured',
                        'message': 'M3U playlist URL has not been configured for this device yet.'
                    },
                    status=404
                )
            
            # Update last_seen
            device.last_seen = timezone.now()
            device.save(update_fields=['last_seen'])
            
            # Simply return the IPTV URL - let the app fetch it directly
            return JsonResponse({
                'm3u_url': device.m3u_url,
                'mac_address': device.mac_address,
                'device_name': device.device_name
            })
            
        except Exception as e:
            logger.error(f"Error getting playlist: {str(e)}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )


@method_decorator(csrf_exempt, name='dispatch')
class DeviceInfoView(View):
    """Get device information and cache status."""
    
    def get(self, request, mac_address):
        try:
            mac_address = mac_address.upper().strip()
            
            try:
                device = Device.objects.get(mac_address=mac_address)
            except Device.DoesNotExist:
                return JsonResponse(
                    {'error': 'Device not found'},
                    status=404
                )
            
            # Check activation status - expired devices can still see info but with warning
            is_active = device.check_activation_status()
            activation_status = device.get_activation_status()
            
            response_data = {
                'mac_address': device.mac_address,
                'device_name': device.device_name,
                'm3u_url': device.m3u_url,
                'is_active': is_active,
                'created_at': device.created_at.isoformat(),
                'last_seen': device.last_seen.isoformat(),
                'activation_status': activation_status,
            }
            
            # Add warning if expired
            if not is_active:
                error_msg = 'Trial period expired' if device.activation_type == Device.ACTIVATION_FREE_TRIAL else 'Device activation expired'
                response_data['warning'] = error_msg
                response_data['message'] = 'Your free trial has expired. Please activate your device to continue using the app.'
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Error getting device info: {str(e)}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )


@csrf_exempt
@require_http_methods(["POST"])
def refresh_playlist(request, mac_address):
    """Force refresh M3U playlist cache for a device."""
    try:
        mac_address = mac_address.upper().strip()
        
        try:
            device = Device.objects.get(mac_address=mac_address)
        except Device.DoesNotExist:
            return JsonResponse(
                {'error': 'Device not found'},
                status=404
            )
        
        # Check activation status - expired devices cannot refresh playlist
        is_active = device.check_activation_status()
        if not is_active:
            status = device.get_activation_status()
            error_msg = 'Trial period expired' if device.activation_type == Device.ACTIVATION_FREE_TRIAL else 'Device activation expired'
            return JsonResponse(
                {
                    'error': error_msg,
                    'message': 'Your free trial has expired. Please activate your device to continue using the app.',
                    'activation_status': status
                },
                status=403
            )
        
        # Check if M3U URL is set
        if not device.m3u_url:
            return JsonResponse(
                {
                    'error': 'No playlist configured',
                    'message': 'M3U playlist URL has not been configured for this device yet.'
                },
                status=404
            )
        
        # No caching - just return the URL
        return JsonResponse({
            'success': True,
            'message': 'Playlist URL retrieved',
            'm3u_url': device.m3u_url,
            'mac_address': device.mac_address,
        })
        
    except Exception as e:
        logger.error(f"Error refreshing playlist: {str(e)}")
        return JsonResponse(
            {'error': 'Internal server error'},
            status=500
        )


@method_decorator(csrf_exempt, name='dispatch')
class DeviceActivityView(View):
    """
    Track device activity (heartbeat).
    Called by app to indicate it's being used.
    Updates last_activity timestamp.
    """
    
    def post(self, request, mac_address):
        try:
            mac_address = mac_address.upper().strip()
            
            try:
                device = Device.objects.get(mac_address=mac_address)
            except Device.DoesNotExist:
                return JsonResponse(
                    {'error': 'Device not found'},
                    status=404
                )
            
            # Update activity timestamp
            device.last_activity = timezone.now()
            device.last_seen = timezone.now()
            device.save(update_fields=['last_activity', 'last_seen'])
            
            # Check activation status
            is_active = device.check_activation_status()
            status = device.get_activation_status()
            
            response_data = {
                'success': True,
                'is_active': is_active,
                'last_activity': device.last_activity.isoformat(),
                'activation_status': status,
            }
            
            # Add clear message if expired
            if not is_active:
                error_msg = 'Trial period expired' if device.activation_type == Device.ACTIVATION_FREE_TRIAL else 'Device activation expired'
                response_data['error'] = error_msg
                response_data['message'] = 'Your free trial has expired. Please activate your device to continue using the app.'
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Error updating device activity: {str(e)}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )


@method_decorator(csrf_exempt, name='dispatch')
class DeviceStatusView(View):
    """
    Get device activation status.
    Returns detailed information about activation, expiration, etc.
    """
    
    def get(self, request, mac_address):
        try:
            mac_address = mac_address.upper().strip()
            
            try:
                device = Device.objects.get(mac_address=mac_address)
            except Device.DoesNotExist:
                return JsonResponse(
                    {'error': 'Device not found'},
                    status=404
                )
            
            # Check and update activation status
            is_active = device.check_activation_status()
            status = device.get_activation_status()
            
            response_data = {
                'success': True,
                'mac_address': device.mac_address,
                'device_name': device.device_name,
                **status,
            }
            
            # Add clear message if expired
            if not is_active:
                error_msg = 'Trial period expired' if device.activation_type == Device.ACTIVATION_FREE_TRIAL else 'Device activation expired'
                response_data['error'] = error_msg
                response_data['message'] = 'Your free trial has expired. Please activate your device to continue using the app.'
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Error getting device status: {str(e)}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )


@method_decorator(csrf_exempt, name='dispatch')
class DeviceActivateView(View):
    """
    Activate device with yearly or lifetime license.
    Requires activation_type in POST body: 'YEARLY' or 'LIFETIME'
    """
    
    def post(self, request, mac_address):
        try:
            mac_address = mac_address.upper().strip()
            data = json.loads(request.body)
            activation_type = data.get('activation_type', '').strip().upper()
            
            if activation_type not in [Device.ACTIVATION_YEARLY, Device.ACTIVATION_LIFETIME]:
                return JsonResponse(
                    {'error': f'Invalid activation_type. Must be {Device.ACTIVATION_YEARLY} or {Device.ACTIVATION_LIFETIME}'},
                    status=400
                )
            
            try:
                device = Device.objects.get(mac_address=mac_address)
            except Device.DoesNotExist:
                return JsonResponse(
                    {'error': 'Device not found'},
                    status=404
                )
            
            now = timezone.now()
            
            # Update activation
            device.activation_type = activation_type
            device.activated_at = now
            
            if activation_type == Device.ACTIVATION_YEARLY:
                device.expires_at = now + timedelta(days=365)
            elif activation_type == Device.ACTIVATION_LIFETIME:
                device.expires_at = None  # Never expires
            
            device.is_active = True
            device.save()
            
            # Get updated status
            status = device.get_activation_status()
            
            return JsonResponse({
                'success': True,
                'message': f'Device activated with {activation_type} license',
                'mac_address': device.mac_address,
                **status,
            })
            
        except json.JSONDecodeError:
            return JsonResponse(
                {'error': 'Invalid JSON'},
                status=400
            )
        except Exception as e:
            logger.error(f"Error activating device: {str(e)}")
            return JsonResponse(
                {'error': 'Internal server error'},
                status=500
            )
