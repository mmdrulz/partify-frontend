'use client';

import { useState } from 'react';

export default function PartifyApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);

  const BACKEND_URL = 'https://partify-backend.onrender.com';

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      setAnnotatedImage(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      setAnnotatedImage(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Sending request to:', `${BACKEND_URL}/predict`);
      
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analysis result:', data);

      if (data.success) {
        setResult(data);
        setAnnotatedImage(data.annotated_image);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Failed to analyze image: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const openWhatsApp = () => {
    if (result && result.whatsapp_url) {
      window.open(result.whatsapp_url, '_blank');
    }
  };

  const downloadAnnotatedImage = () => {
    if (annotatedImage) {
      const link = document.createElement('a');
      link.href = annotatedImage;
      link.download = 'damage-analysis-with-detections.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnnotatedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0'
          }}>
            🚗 PartiFy
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            margin: 0
          }}>
            AI-Powered Car Damage Detection
          </p>
          <div style={{
            background: '#f0f8ff',
            padding: '10px',
            borderRadius: '10px',
            marginTop: '15px',
            border: '1px solid #e0e7ff'
          }}>
            📞 Garage Contact: <strong>+971 58 262 9804</strong>
          </div>
        </div>

        {/* Upload Area */}
        {!result && (
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: '3px dashed #667eea',
                borderRadius: '15px',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#f8faff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '20px'
              }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '10px',
                      marginBottom: '15px'
                    }}
                  />
                  <p style={{ color: '#667eea', fontWeight: 'bold' }}>
                    ✅ Image Ready for Analysis
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📸</div>
                  <p style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#667eea',
                    margin: '0 0 10px 0'
                  }}>
                    Upload Car Damage Photo
                  </p>
                  <p style={{ color: '#666', margin: 0 }}>
                    Drag & drop or click to select
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: analyzing ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: analyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {analyzing ? '🔍 Analyzing with AI...' : '🚀 Analyze Damage'}
              </button>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#dc2626', margin: 0, fontWeight: 'bold' }}>
              ❌ {error}
            </p>
          </div>
        )}

        {/* Results Display */}
        {result && result.success && (
          <div>
            {/* Annotated Image */}
            {annotatedImage && (
              <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                <h3 style={{
                  color: '#374151',
                  marginBottom: '15px',
                  fontSize: '1.3rem'
                }}>
                  📊 AI Analysis with Detection Boxes
                </h3>
                <div style={{
                  border: '3px solid #10b981',
                  borderRadius: '15px',
                  padding: '10px',
                  background: '#f0fdf4'
                }}>
                  <img
                    src={annotatedImage}
                    alt="Damage Analysis"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                      marginBottom: '15px'
                    }}
                  />
                  <button
                    onClick={downloadAnnotatedImage}
                    style={{
                      padding: '10px 20px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    📥 Download Analysis
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            <div style={{
              background: result.analysis.damage_detected ? '#f0fdf4' : '#fef3c7',
              border: `2px solid ${result.analysis.damage_detected ? '#10b981' : '#f59e0b'}`,
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: result.analysis.damage_detected ? '#065f46' : '#92400e',
                marginBottom: '15px',
                fontSize: '1.3rem'
              }}>
                {result.analysis.damage_detected ? '🔍 Damage Detected!' : '✅ No Major Damage Found'}
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '15px'
              }}>
                {result.analysis.summary}
              </p>

              {result.analysis.damage_detected && (
                <div>
                  <h4 style={{ color: '#374151', marginBottom: '10px' }}>
                    🎯 Detected Issues:
                  </h4>
                  {result.analysis.damage_parts.slice(0, 3).map((damage, index) => (
                    <div key={index} style={{
                      background: 'white',
                      padding: '10px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {damage.confidence > 0.8 ? '🔴' : damage.confidence > 0.6 ? '🟡' : '⚪'} 
                        {' '}{damage.type}
                      </span>
                      <span style={{ float: 'right', color: '#6b7280' }}>
                        {(damage.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                  ))}
                  
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#374151'
                  }}>
                    📊 Total Detections: <strong>{result.analysis.total_detections}</strong><br/>
                    🎯 Highest Confidence: <strong>{(result.analysis.highest_confidence * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp Integration */}
            <div style={{
              background: '#dcfce7',
              border: '2px solid #16a34a',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#15803d', marginBottom: '15px' }}>
                📱 Get Professional Quote
              </h3>
              
              <button
                onClick={openWhatsApp}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#25d366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>💬</span>
                Send Analysis to Garage via WhatsApp
              </button>
              
              <p style={{
                color: '#15803d',
                fontSize: '0.9rem',
                margin: 0,
                fontStyle: 'italic'
              }}>
                Analysis report and annotated image will be shared with {result.garage_number}
              </p>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetAnalysis}
              style={{
                width: '100%',
                padding: '12px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Analyze Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
