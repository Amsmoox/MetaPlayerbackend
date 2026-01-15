import { useState } from 'react'
import { getDeviceInfo, registerDevice } from '../services/api'
import ToastNotification from '../components/ToastNotification'

function UploadList() {
  const [mode, setMode] = useState('upload') // 'upload' or 'delete'
  const [step, setStep] = useState(1)
  const [macAddress, setMacAddress] = useState('')
  const [m3uUrl, setM3uUrl] = useState('')
  const [playlistName, setPlaylistName] = useState('')
  const [deviceInfo, setDeviceInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const formatMacAddress = (value) => {
    // Remove all non-hex characters (keep only 0-9, A-F, a-f)
    let cleaned = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase()
    
    // Limit to 12 hex characters (MAC address is 6 pairs of 2 hex digits)
    cleaned = cleaned.slice(0, 12)
    
    // Insert colons after every 2 characters
    let formatted = ''
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 2 === 0) {
        formatted += ':'
      }
      formatted += cleaned[i]
    }
    
    return formatted
  }

  const handleMacAddressChange = (e) => {
    const formatted = formatMacAddress(e.target.value)
    setMacAddress(formatted)
  }

  const handleMacAddressSubmit = async (e) => {
    e.preventDefault()
    
    if (!macAddress.trim()) {
      showToast('Please enter a MAC address', 'error')
      return
    }

    // Format MAC address (uppercase, ensure proper format)
    const formattedMac = macAddress.trim().toUpperCase().replace(/[^0-9A-F:]/g, '')
    
    if (formattedMac.length !== 17 || formattedMac.split(':').length !== 6) {
      showToast('Invalid MAC address format. Expected format: XX:XX:XX:XX:XX:XX', 'error')
      return
    }

    setIsLoading(true)
    try {
      const response = await getDeviceInfo(formattedMac)
      if (response.data) {
        // Device exists, proceed to next step
        setMacAddress(formattedMac)
        setDeviceInfo(response.data)
        setStep(2)
      }
    } catch (error) {
      // Check for 404 (device not found) - check this FIRST
      // 404 means the device doesn't exist in our records
      if (error.response?.status === 404) {
        showToast("Couldn't find your Mac in our records, please install the app first", 'error')
      } 
      // Check for network errors (no response object means network issue)
      else if (!error.response) {
        showToast('Network error. Please check your internet connection and try again.', 'error')
      }
      // Check for other HTTP errors (500, 400, etc.)
      else if (error.response?.status) {
        showToast(`Unable to verify MAC address. Please try again later.`, 'error')
      }
      // Generic error fallback - default to friendly message
      else {
        showToast("Couldn't find your Mac in our records, please install the app first", 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleM3UUpload = async (e) => {
    e.preventDefault()
    
    if (!m3uUrl.trim()) {
      showToast('Please enter an M3U URL', 'error')
      return
    }

    if (!playlistName.trim()) {
      showToast('Please enter a playlist name', 'error')
      return
    }

    // Validate URL format
    try {
      new URL(m3uUrl)
    } catch {
      showToast('Please enter a valid URL', 'error')
      return
    }

    setIsLoading(true)
    try {
      const response = await registerDevice({
        mac_address: macAddress,
        device_name: playlistName,
        m3u_url: m3uUrl.trim()
      })
      
      if (response.data) {
        showToast('Playlist uploaded successfully!', 'success')
        // Reset form after success
        setTimeout(() => {
          setStep(1)
          setMacAddress('')
          setM3uUrl('')
          setPlaylistName('')
        }, 2000)
      }
    } catch (error) {
      if (error.response?.data?.error) {
        showToast(error.response.data.error, 'error')
      } else {
        showToast('An error occurred while uploading the playlist', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlaylist = async () => {
    if (!deviceInfo) {
      showToast('Device information not available', 'error')
      return
    }

    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete the playlist? This will clear the M3U URL for this device.')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await registerDevice({
        mac_address: macAddress,
        device_name: deviceInfo.device_name || '',
        m3u_url: '' // Empty string to clear the M3U URL
      })
      
      if (response.data) {
        showToast('Playlist deleted successfully!', 'success')
        // Reset form after success
        setTimeout(() => {
          setStep(1)
          setMacAddress('')
          setDeviceInfo(null)
        }, 2000)
      }
    } catch (error) {
      if (error.response?.data?.error) {
        showToast(error.response.data.error, 'error')
      } else {
        showToast('An error occurred while deleting the playlist', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setStep(1)
    setMacAddress('')
    setM3uUrl('')
    setPlaylistName('')
    setDeviceInfo(null)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Manage your playlist
        </h1>

        {/* Main Content Grid: 60% left, 40% right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          {/* Left Side - Main Content (60%) */}
          <div className="lg:col-span-3">
            {/* Mode Tabs */}
            <div className="mb-6">
              <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleModeChange('upload')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    mode === 'upload'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Upload Playlist
                </button>
                <button
                  onClick={() => handleModeChange('delete')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    mode === 'delete'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Delete Playlist
                </button>
              </div>
            </div>

            {/* Step 1: MAC Address Input */}
            {step === 1 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white mb-6">Step 1: Enter your MAC Address</h2>
                <form onSubmit={handleMacAddressSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="macAddress" className="block text-sm font-medium text-gray-300 mb-2">
                      MAC Address
                    </label>
                    <input
                      type="text"
                      id="macAddress"
                      value={macAddress}
                      onChange={handleMacAddressChange}
                      placeholder="XX:XX:XX:XX:XX:XX"
                      maxLength={17}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                      disabled={isLoading}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the MAC address from your MetaPlayer app
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20"
                  >
                    {isLoading ? 'Checking...' : 'Next'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Upload Mode - M3U URL and Name */}
            {step === 2 && mode === 'upload' && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Step 2: Upload Playlist</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
                    >
                      Change MAC
                    </button>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">MAC Address</p>
                    <p className="text-sm font-mono text-orange-400">{macAddress}</p>
                  </div>
                </div>

                <form onSubmit={handleM3UUpload} className="space-y-4">
                  <div>
                    <label htmlFor="playlistName" className="block text-sm font-medium text-gray-300 mb-2">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      id="playlistName"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="My Playlist"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="m3uUrl" className="block text-sm font-medium text-gray-300 mb-2">
                      M3U URL
                    </label>
                    <input
                      type="url"
                      id="m3uUrl"
                      value={m3uUrl}
                      onChange={(e) => setM3uUrl(e.target.value)}
                      placeholder="https://example.com/playlist.m3u"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      disabled={isLoading}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter the URL to your M3U playlist file
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-orange-800 disabled:to-orange-900 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Playlist
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Delete Mode - Delete Confirmation */}
            {step === 2 && mode === 'delete' && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Step 2: Delete Playlist</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-orange-500 text-sm transition-colors"
                    >
                      Change MAC
                    </button>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">MAC Address</p>
                    <p className="text-sm font-mono text-orange-400">{macAddress}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {deviceInfo?.m3u_url ? (
                    <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4">
                      <p className="text-sm text-orange-200">
                        We detected a playlist. Are you sure you want to delete it?
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                      <p className="text-sm text-yellow-300">No playlist is currently configured for this device.</p>
                    </div>
                  )}

                  <button
                    onClick={handleDeletePlaylist}
                    disabled={isLoading || !deviceInfo?.m3u_url}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Playlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Important Note (40%) */}
          <div className="lg:col-span-2">
            <div className="bg-red-900/30 border-2 border-red-600/50 rounded-lg p-6 sticky top-4">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-lg">!</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-200 ml-3">Important Notice</h3>
              </div>
              <div className="space-y-3 text-sm text-red-100 leading-relaxed">
                <p>
                  <strong>MetaPlayer does not provide channels or content.</strong>
                </p>
                <p>
                  We are a media player application only. We do not offer, sell, or distribute IPTV subscriptions, channels, or any form of content.
                </p>
                <p>
                  Users must supply their own M3U playlists or XtreamCode server credentials. MetaPlayer is not responsible for the content uploaded to it.
                </p>
                <div className="pt-3 border-t border-red-700/50">
                  <p className="text-xs text-red-300">
                    By using this service, you acknowledge that you are responsible for the content you provide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - How to Use Steps */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Steps */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Playlist
              </h3>
              <ol className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">1</span>
                  <span>Enter your device MAC address from the MetaPlayer app</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">2</span>
                  <span>Click "Next" to verify your device</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">3</span>
                  <span>Enter a playlist name and your M3U URL</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">4</span>
                  <span>Click "Upload Playlist" to save</span>
                </li>
              </ol>
            </div>

            {/* Delete Steps */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Playlist
              </h3>
              <ol className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">1</span>
                  <span>Enter your device MAC address from the MetaPlayer app</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">2</span>
                  <span>Click "Next" to verify your device</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">3</span>
                  <span>Review the confirmation message</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">4</span>
                  <span>Click "Delete Playlist" to remove it</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </div>
  )
}

export default UploadList
