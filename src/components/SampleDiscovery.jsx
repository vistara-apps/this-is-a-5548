import React, { useState } from 'react';
import { ArrowLeft, Music, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function SampleDiscovery({ track, samples, onClearanceRequest, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);

  const filteredSamples = samples.filter(sample =>
    sample.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-textPrimary">Sample Discovery</h1>
            <p className="text-textSecondary">Detected samples in "{track?.title}"</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search for samples..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-default pl-10"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Music className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-textPrimary">{track?.title}</h2>
            <p className="text-textSecondary">
              {samples.length} potential samples detected
            </p>
          </div>
        </div>
      </div>

      {/* Sample Results */}
      <div className="space-y-4">
        {filteredSamples.length === 0 ? (
          <div className="card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              {samples.length === 0 ? 'No samples detected' : 'No matching samples'}
            </h3>
            <p className="text-textSecondary">
              {samples.length === 0 
                ? 'Your track appears to be original or contains unrecognized samples.'
                : 'Try adjusting your search query.'
              }
            </p>
          </div>
        ) : (
          filteredSamples.map((sample) => (
            <div key={sample.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-textPrimary">
                        {sample.originalTitle}
                      </h3>
                      <p className="text-textSecondary">by {sample.artist}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-textSecondary">Sample Time</label>
                      <p className="text-textPrimary">
                        {formatTime(sample.startTime)} - {formatTime(sample.endTime)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-textSecondary">Duration</label>
                      <p className="text-textPrimary">
                        {(sample.endTime - sample.startTime).toFixed(1)}s
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-textSecondary">Confidence</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(sample.confidence)}`}>
                        {(sample.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-textSecondary">Rights Holder</label>
                      <p className="text-textPrimary">{sample.rightsHolder}</p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => onClearanceRequest(sample)}
                    className="btn-primary"
                  >
                    Start Clearance
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      {samples.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              samples.forEach(sample => onClearanceRequest(sample));
            }}
            className="btn-primary"
          >
            Clear All Samples
          </button>
          <button className="btn-outline">
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}