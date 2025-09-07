import axios from 'axios';

// Audio fingerprinting and sample detection service
export class AudioProcessingService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_AUDIO_API_URL || '/api/audio';
  }

  // Upload audio file to IPFS/Arweave for permanent storage
  async uploadAudioFile(file) {
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await axios.post(`${this.apiBaseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // You can emit progress events here for UI updates
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return {
        success: true,
        data: {
          fileUrl: response.data.fileUrl,
          ipfsHash: response.data.ipfsHash,
          arweaveId: response.data.arweaveId,
          duration: response.data.duration,
          fileSize: response.data.fileSize,
          format: response.data.format
        }
      };
    } catch (error) {
      console.error('Error uploading audio file:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload audio file'
      };
    }
  }

  // Generate audio fingerprint for sample detection
  async generateFingerprint(audioUrl) {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/fingerprint`, {
        audioUrl
      });

      return {
        success: true,
        data: {
          fingerprint: response.data.fingerprint,
          duration: response.data.duration,
          peaks: response.data.peaks,
          spectralData: response.data.spectralData
        }
      };
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate audio fingerprint'
      };
    }
  }

  // Detect samples in uploaded track
  async detectSamples(audioUrl, fingerprint) {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/detect-samples`, {
        audioUrl,
        fingerprint
      });

      return {
        success: true,
        data: response.data.samples.map(sample => ({
          id: sample.id,
          originalTrackId: sample.original_track_id,
          originalTitle: sample.original_title,
          artist: sample.artist,
          startTime: sample.start_time,
          endTime: sample.end_time,
          confidence: sample.confidence,
          rightsHolder: sample.rights_holder,
          label: sample.label,
          releaseYear: sample.release_year,
          genre: sample.genre,
          isrc: sample.isrc,
          matchType: sample.match_type, // 'exact', 'partial', 'similar'
          waveformData: sample.waveform_data
        }))
      };
    } catch (error) {
      console.error('Error detecting samples:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to detect samples'
      };
    }
  }

  // Get sample metadata from external databases
  async getSampleMetadata(sampleId) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/sample-metadata/${sampleId}`);

      return {
        success: true,
        data: {
          title: response.data.title,
          artist: response.data.artist,
          album: response.data.album,
          releaseDate: response.data.release_date,
          label: response.data.label,
          rightsHolders: response.data.rights_holders,
          publishingInfo: response.data.publishing_info,
          masterRights: response.data.master_rights,
          syncRights: response.data.sync_rights,
          territorialRights: response.data.territorial_rights,
          usageRestrictions: response.data.usage_restrictions,
          standardRates: response.data.standard_rates
        }
      };
    } catch (error) {
      console.error('Error getting sample metadata:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get sample metadata'
      };
    }
  }

  // Validate audio file format and quality
  validateAudioFile(file) {
    const validFormats = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac', 'audio/flac'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    const minSize = 1024; // 1KB

    const errors = [];

    if (!validFormats.includes(file.type)) {
      errors.push('Invalid file format. Supported formats: MP3, WAV, MP4, AAC, FLAC');
    }

    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 100MB');
    }

    if (file.size < minSize) {
      errors.push('File size too small. Minimum size is 1KB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Extract audio features for analysis
  async extractAudioFeatures(audioUrl) {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/extract-features`, {
        audioUrl
      });

      return {
        success: true,
        data: {
          tempo: response.data.tempo,
          key: response.data.key,
          timeSignature: response.data.time_signature,
          loudness: response.data.loudness,
          energy: response.data.energy,
          danceability: response.data.danceability,
          valence: response.data.valence,
          acousticness: response.data.acousticness,
          instrumentalness: response.data.instrumentalness,
          speechiness: response.data.speechiness,
          spectralCentroid: response.data.spectral_centroid,
          spectralRolloff: response.data.spectral_rolloff,
          zeroCrossingRate: response.data.zero_crossing_rate,
          mfcc: response.data.mfcc
        }
      };
    } catch (error) {
      console.error('Error extracting audio features:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to extract audio features'
      };
    }
  }

  // Generate waveform visualization data
  async generateWaveform(audioUrl) {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/generate-waveform`, {
        audioUrl
      });

      return {
        success: true,
        data: {
          peaks: response.data.peaks,
          duration: response.data.duration,
          sampleRate: response.data.sample_rate,
          channels: response.data.channels
        }
      };
    } catch (error) {
      console.error('Error generating waveform:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate waveform'
      };
    }
  }

  // Mock sample detection for development/demo purposes
  async mockSampleDetection(file) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockSamples = [
      {
        id: `sample-${Date.now()}-1`,
        originalTrackId: 'original-1',
        originalTitle: 'Classic Soul Groove',
        artist: 'The Soul Collective',
        startTime: 15.5,
        endTime: 25.2,
        confidence: 0.95,
        rightsHolder: 'Universal Music Group',
        label: 'Motown Records',
        releaseYear: 1973,
        genre: 'Soul',
        isrc: 'USMO17300123',
        matchType: 'exact',
        waveformData: Array.from({ length: 100 }, () => Math.random() * 0.8)
      },
      {
        id: `sample-${Date.now()}-2`,
        originalTrackId: 'original-2',
        originalTitle: 'Vintage Hip-Hop Break',
        artist: 'Beat Master Supreme',
        startTime: 45.1,
        endTime: 52.8,
        confidence: 0.87,
        rightsHolder: 'Independent Music Collective',
        label: 'Underground Beats',
        releaseYear: 1989,
        genre: 'Hip-Hop',
        isrc: 'USUB19890456',
        matchType: 'partial',
        waveformData: Array.from({ length: 100 }, () => Math.random() * 0.6)
      },
      {
        id: `sample-${Date.now()}-3`,
        originalTrackId: 'original-3',
        originalTitle: 'Jazz Piano Riff',
        artist: 'Miles Ahead Trio',
        startTime: 78.3,
        endTime: 85.1,
        confidence: 0.72,
        rightsHolder: 'Blue Note Records',
        label: 'Blue Note',
        releaseYear: 1965,
        genre: 'Jazz',
        isrc: 'USBN19650789',
        matchType: 'similar',
        waveformData: Array.from({ length: 100 }, () => Math.random() * 0.4)
      }
    ];

    return {
      success: true,
      data: mockSamples
    };
  }
}

export const audioProcessingService = new AudioProcessingService();
