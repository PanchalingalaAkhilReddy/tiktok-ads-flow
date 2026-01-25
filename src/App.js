import React, { useState } from 'react';

function App() {
  // State for OAuth
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [connecting, setConnecting] = useState(false);

  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState('Traffic');
  const [adText, setAdText] = useState('');
  const [cta, setCta] = useState('');
  const [musicOption, setMusicOption] = useState('no-music');
  const [musicId, setMusicId] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Error states
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // TODO: Replace with actual TikTok OAuth
  // For now using mock authentication
  const handleConnect = () => {
    setConnecting(true);
    setErrorMsg('');
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        name: 'Test User',
        id: 'user_' + Math.random().toString(36).substr(2, 9)
      };
      const mockToken = 'mock_token_' + Date.now();
      
      setUser(mockUser);
      setToken(mockToken);
      setConnected(true);
      setConnecting(false);
      setSuccessMsg('Successfully connected to TikTok!');
      
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1200);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setUser(null);
    setToken('');
  };

  // Validate music ID (mock validation)
  const validateMusic = (id) => {
    // Simple validation - in real app would call TikTok API
    if (!id || id.length < 3) {
      return false;
    }
    // Mock: accept IDs that start with number
    return /^\d/.test(id);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Generate mock music ID for uploaded file
      setMusicId('uploaded_' + Date.now());
      if (errors.music) {
        setErrors({...errors, music: ''});
      }
    }
  };

  const handleSubmit = () => {
    console.log('Submit clicked'); // Debug log
    
    setErrorMsg('');
    setSuccessMsg('');
    let newErrors = {};

    // Check if connected
    if (!connected) {
      setErrorMsg('Please connect your TikTok account first');
      return;
    }

    // Validate campaign name
    if (!campaignName.trim()) {
      newErrors.campaignName = 'Campaign name is required';
    } else if (campaignName.trim().length < 3) {
      newErrors.campaignName = 'Campaign name must be at least 3 characters';
    }

    // Validate ad text
    if (!adText.trim()) {
      newErrors.adText = 'Ad text is required';
    } else if (adText.length > 100) {
      newErrors.adText = 'Ad text cannot exceed 100 characters';
    }

    // Validate CTA
    if (!cta) {
      newErrors.cta = 'Please select a call to action';
    }

    // IMPORTANT: Music validation based on objective
    if (objective === 'Conversions') {
      // Music is required for Conversions
      if (musicOption === 'no-music') {
        newErrors.music = 'Music is required for Conversion campaigns';
      } else if (musicOption === 'existing') {
        if (!musicId.trim()) {
          newErrors.musicId = 'Please enter a Music ID';
        } else if (!validateMusic(musicId)) {
          newErrors.musicId = 'Invalid Music ID. Please check and try again.';
        }
      } else if (musicOption === 'upload' && !uploadedFile) {
        newErrors.music = 'Please upload a music file';
      }
    } else {
      // For Traffic, music is optional but if provided must be valid
      if (musicOption === 'existing' && musicId.trim() && !validateMusic(musicId)) {
        newErrors.musicId = 'Invalid Music ID. Please check and try again.';
      }
    }

    setErrors(newErrors);

    // If there are errors, show message and stop
    if (Object.keys(newErrors).length > 0) {
      setErrorMsg('Please fix the errors before submitting');
      return;
    }

    // Submit the ad
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock response - could randomly fail to show error handling
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        setSuccessMsg('Ad created successfully!');
        console.log('Ad created:', { campaignName, objective, adText, cta, musicOption });
        
        // Reset form
        setCampaignName('');
        setAdText('');
        setCta('');
        setMusicOption('no-music');
        setMusicId('');
        setUploadedFile(null);
      } else {
        setErrorMsg('Failed to create ad. Your session may have expired. Please try reconnecting.');
      }
      
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: '#000', padding: '20px', borderRadius: '8px 8px 0 0' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>TikTok Ads Manager</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Create your ad campaign</p>
        </div>

        <div style={{ padding: '20px' }}>
          
          {/* Success Message */}
          {successMsg && (
            <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>
              {successMsg}
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>
              {errorMsg}
            </div>
          )}

          {/* OAuth Section */}
          {!connected ? (
            <div style={{ marginBottom: '30px' }}>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Connect your TikTok Ads account to continue
              </p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: connecting ? '#ccc' : '#fe2c55',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: connecting ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {connecting ? 'Connecting...' : 'Connect TikTok Account'}
              </button>
            </div>
          ) : (
            <div style={{ background: '#e8f5e9', padding: '12px', marginBottom: '30px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#2e7d32', fontWeight: '600' }}>
                ✓ Connected as {user?.name}
              </span>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Form - only show when connected */}
          {connected && (
            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Create Ad</h2>

              {/* Campaign Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => {
                    setCampaignName(e.target.value);
                    if (errors.campaignName) setErrors({...errors, campaignName: ''});
                  }}
                  placeholder="Enter campaign name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.campaignName ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.campaignName && (
                  <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.campaignName}</span>
                )}
              </div>

              {/* Objective */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Campaign Objective *
                </label>
                <select
                  value={objective}
                  onChange={(e) => {
                    setObjective(e.target.value);
                    // Reset music option if switching to Conversions and had no-music
                    if (e.target.value === 'Conversions' && musicOption === 'no-music') {
                      setMusicOption('existing');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Traffic">Traffic</option>
                  <option value="Conversions">Conversions</option>
                </select>
              </div>

              {/* Ad Text */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Ad Text * ({adText.length}/100)
                </label>
                <textarea
                  value={adText}
                  onChange={(e) => {
                    setAdText(e.target.value);
                    if (errors.adText) setErrors({...errors, adText: ''});
                  }}
                  placeholder="Enter your ad text"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.adText ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                {errors.adText && (
                  <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.adText}</span>
                )}
              </div>

              {/* CTA */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Call to Action *
                </label>
                <select
                  value={cta}
                  onChange={(e) => {
                    setCta(e.target.value);
                    if (errors.cta) setErrors({...errors, cta: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.cta ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select CTA</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Download">Download</option>
                  <option value="Book Now">Book Now</option>
                </select>
                {errors.cta && (
                  <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.cta}</span>
                )}
              </div>

              {/* Music Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px' }}>
                  Music {objective === 'Conversions' && '*'}
                </label>
                
                {objective === 'Conversions' && (
                  <div style={{ background: '#fff3cd', padding: '8px', marginBottom: '10px', borderRadius: '4px', fontSize: '13px', color: '#856404' }}>
                    Note: Music is required for Conversion campaigns
                  </div>
                )}

                {/* Option 1: Existing Music */}
                <div style={{ marginBottom: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="music"
                      checked={musicOption === 'existing'}
                      onChange={() => {
                        setMusicOption('existing');
                        setUploadedFile(null);
                        if (errors.music) setErrors({...errors, music: ''});
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Use Existing Music ID</span>
                  </label>
                  
                  {musicOption === 'existing' && (
                    <div style={{ marginTop: '10px', marginLeft: '24px' }}>
                      <input
                        type="text"
                        value={musicId}
                        onChange={(e) => {
                          setMusicId(e.target.value);
                          if (errors.musicId) setErrors({...errors, musicId: ''});
                        }}
                        placeholder="Enter Music ID"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: errors.musicId ? '1px solid #dc3545' : '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                      {errors.musicId && (
                        <span style={{ color: '#dc3545', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {errors.musicId}
                        </span>
                      )}
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px', marginBottom: 0 }}>
                        Tip: Enter a Music ID starting with a number (e.g., 12345)
                      </p>
                    </div>
                  )}
                </div>

                {/* Option 2: Upload Music */}
                <div style={{ marginBottom: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="music"
                      checked={musicOption === 'upload'}
                      onChange={() => {
                        setMusicOption('upload');
                        setMusicId('');
                        if (errors.music) setErrors({...errors, music: ''});
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Upload Custom Music</span>
                  </label>
                  
                  {musicOption === 'upload' && (
                    <div style={{ marginTop: '10px', marginLeft: '24px' }}>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        style={{ fontSize: '14px' }}
                      />
                      {uploadedFile && (
                        <p style={{ fontSize: '13px', color: '#28a745', marginTop: '8px', marginBottom: 0 }}>
                          ✓ {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Option 3: No Music */}
                <div style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  opacity: objective === 'Conversions' ? 0.5 : 1,
                  background: objective === 'Conversions' ? '#f8f9fa' : 'white'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: objective === 'Conversions' ? 'not-allowed' : 'pointer' }}>
                    <input
                      type="radio"
                      name="music"
                      checked={musicOption === 'no-music'}
                      onChange={() => {
                        if (objective !== 'Conversions') {
                          setMusicOption('no-music');
                          setMusicId('');
                          setUploadedFile(null);
                          if (errors.music) setErrors({...errors, music: ''});
                        }
                      }}
                      disabled={objective === 'Conversions'}
                      style={{ marginRight: '8px' }}
                    />
                    <span>No Music</span>
                    {objective === 'Conversions' && (
                      <span style={{ marginLeft: '8px', fontSize: '12px', color: '#dc3545' }}>
                        (Not allowed for Conversions)
                      </span>
                    )}
                  </label>
                </div>

                {errors.music && (
                  <span style={{ color: '#dc3545', fontSize: '12px', display: 'block', marginTop: '8px' }}>
                    {errors.music}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: submitting ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Creating Ad...' : 'Create Ad'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;