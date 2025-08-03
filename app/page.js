'use client'

import { useState } from 'react'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      console.log('Sending request to backend...')

      const response = await fetch(`https://partify-backend.onrender.com/predict`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Success response:', data)
      setResult(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(`Failed to analyze image: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetQuote = () => {
    if (!result?.whatsapp_url) return
    
    // Save image to user's device for easy sharing
    if (selectedFile) {
      const link = document.createElement('a')
      link.href = preview
      link.download = `car-damage-${result.prediction.toLowerCase().replace(/\s+/g, '-')}.jpg`
      // link.click() // Uncomment if you want auto-download
    }
    
    // Open WhatsApp
    window.open(result.whatsapp_url, '_blank')
  }

  const downloadImage = () => {
    if (!preview) return
    
    const link = document.createElement('a')
    link.href = preview
    link.download = `car-damage-${result?.prediction?.toLowerCase().replace(/\s+/g, '-') || 'photo'}.jpg`
    link.click()
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)'
    }}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span>🚗</span> PartiFy
          </h1>
          <p className="text-gray-600 text-lg">
            AI-Powered Car Damage Detection & Instant Quotes
          </p>
          <p className="text-sm text-gray-500 mt-2">
            📱 Direct connection to garage: +971 58 262 9804
          </p>
        </div>

        {/* Upload Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#3b82f6'
            e.target.style.backgroundColor = '#eff6ff'
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#d1d5db'
            e.target.style.backgroundColor = 'transparent'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Upload Car Damage Photo
                  </p>
                  <p style={{ color: '#6b7280' }}>
                    Click to select a clear photo of the damaged area
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Preview Section */}
        {preview && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Selected Image:</h3>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '256px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#1d4ed8'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#2563eb'
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Damage 🔍'
                )}
              </button>
              
              <button
                onClick={downloadImage}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  fontWeight: '600',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                title="Download image to send to garage"
              >
                📥
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>AI Detection Results:</h3>
            
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem', marginRight: '8px' }}>✅</span>
                <span style={{ fontWeight: '600', color: '#15803d' }}>Damage Detected</span>
              </div>
              <p style={{ fontSize: '1.125rem', marginBottom: '4px' }}>
                <strong>Damaged Part:</strong> {result.prediction}
              </p>
              {result.confidence && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  AI Confidence: {Math.round(result.confidence * 100)}%
                </p>
              )}
            </div>

            {/* Instructions */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fed7aa',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.25rem', marginRight: '8px' }}>💡</span>
                <span style={{ fontWeight: '600', color: '#92400e' }}>Next Steps:</span>
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
                <li>Click "Get Quote" to open WhatsApp</li>
                <li>Send your car damage photo to the garage</li>
                <li>Receive your repair quote within 30 minutes</li>
              </ol>
            </div>

            <button
              onClick={handleGetQuote}
              style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: 'white',
                fontWeight: '600',
                padding: '16px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              <span style={{ marginRight: '8px' }}>💬</span>
              Get Quote from Garage (+971 58 262 9804)
            </button>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#dc2626', fontSize: '1.25rem', marginRight: '8px' }}>❌</span>
              <span style={{ color: '#b91c1c' }}>{error}</span>
            </div>
          </div>
        )}

        {/* Garage Info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            🔧 Professional Auto Repair Service
          </h4>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            WhatsApp: +971 58 262 9804 • Usually responds within 30 minutes
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Powered by AI • Get accurate repair quotes instantly
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
