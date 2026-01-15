"""
URL configuration for devices app.
"""
from django.urls import path
from . import views

app_name = 'devices'

urlpatterns = [
    # Register device
    path('register/', views.DeviceRegisterView.as_view(), name='register'),
    
    # Get playlist for device (raw M3U - app parses locally)
    path('<str:mac_address>/playlist.m3u', views.PlaylistView.as_view(), name='playlist'),
    
    # Get device info
    path('<str:mac_address>/info/', views.DeviceInfoView.as_view(), name='device_info'),
    
    # Force refresh playlist cache
    path('<str:mac_address>/refresh/', views.refresh_playlist, name='refresh_playlist'),
    
    # Track device activity (heartbeat)
    path('<str:mac_address>/activity/', views.DeviceActivityView.as_view(), name='device_activity'),
    
    # Get device activation status
    path('<str:mac_address>/status/', views.DeviceStatusView.as_view(), name='device_status'),
    
    # Activate device (yearly or lifetime)
    path('<str:mac_address>/activate/', views.DeviceActivateView.as_view(), name='device_activate'),
]
