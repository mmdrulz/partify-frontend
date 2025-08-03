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

      const response = await fetch(`https://partify-backend.onrender.com/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetQuote = async () => {
    if (!result?.prediction) return

    try {
      const response = await fetch(
        `https://partify-backend.onrender.com/whatsapp-link?part=${encodeURIComponent(result.prediction)}`
      )
      const data = await response.json()
      window.open(data.whatsapp_url, '_blank')
    } catch (err) {
      console.error('Failed to generate WhatsApp link:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚗 PartiFy
          </h1>
          <p className="text-gray-600 text-lg">
            AI-Powered Car Damage Detection & Instant Quotes
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="text-6xl">📸</div>
                <div>
                  <p className="text-xl font-semibold text-gray-700">
                    Upload Car Image
                  </p>
                  <p className="text-gray-500 mt-1">
                    Click to select a photo of your damaged car
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Selected Image:</h3>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg border"
            />
            
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Damage...
                </div>
              ) : (
                'Analyze Damage 🔍'
              )}
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Detection Results:</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-green-600 text-xl mr-2">✅</span>
                <span className="font-semibold text-green-800">Damage Detected</span>
              </div>
              <p className="text-lg">
                <strong>Part:</strong> {result.prediction}
              </p>
              {result.confidence && (
                <p className="text-sm text-gray-600 mt-1">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
              )}
            </div>

            <button
              onClick={handleGetQuote}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <span className="mr-2">💬</span>
              Get Quote on WhatsApp
            </button>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 text-xl mr-2">❌</span>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          Powered by AI • Get instant repair quotes
        </div>
      </div>
    </div>
  )
}
