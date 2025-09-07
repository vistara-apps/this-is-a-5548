import React, { useState, useRef } from 'react';
import { Upload, Music, Play, Pause, CheckCircle } from 'lucide-react';

export function AudioUploader({ onUpload, userTier, onUpgradeNeeded }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const tierLimits = {
    free: 2,
    pro: 999,
    premium: 999
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Check tier limits
    if (userTier === 'free' && Math.random() > 0.5) { // Simulate hitting limit
      onUpgradeNeeded();
      return;
    }

    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }

    setUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const trackData = {
      id: `track-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      size: file.size,
      duration: null // Would be detected from audio
    };
    
    setUploadedFile(trackData);
    setUploading(false);
    
    // Start sample detection
    onUpload(trackData);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadedFile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold text-center text-textPrimary mb-4">
            Track Uploaded Successfully!
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-textPrimary">{uploadedFile.title}</h3>
                  <p className="text-sm text-textSecondary">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button
                onClick={togglePlayback}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
            
            <audio
              ref={audioRef}
              src={uploadedFile.url}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
          
          <p className="text-center text-textSecondary">
            We're analyzing your track for potential samples. This may take a few moments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-textPrimary mb-4">
          Upload Your Track
        </h2>
        <p className="text-textSecondary">
          Upload your audio file to automatically detect samples and begin the clearance process
        </p>
        <div className="mt-4 flex justify-center">
          <span className="text-sm text-textSecondary">
            {userTier === 'free' ? 'Free tier: 2 uploads/month' : 'Unlimited uploads'}
          </span>
        </div>
      </div>

      <div
        className={`card p-12 border-2 border-dashed transition-colors duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {uploading ? (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Uploading your track...
              </h3>
              <p className="text-textSecondary">Please wait while we process your file</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Drop your audio file here
              </h3>
              <p className="text-textSecondary mb-6">
                or click to browse your files
              </p>
              <button
                onClick={onButtonClick}
                className="btn-primary"
              >
                Select Audio File
              </button>
              <p className="text-sm text-textSecondary mt-4">
                Supports MP3, WAV, FLAC, and more • Max 100MB
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}