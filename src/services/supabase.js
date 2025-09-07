import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema helper functions
export const createTables = async () => {
  // Users table
  const { error: usersError } = await supabase.rpc('create_users_table');
  if (usersError) console.error('Error creating users table:', usersError);

  // Tracks table
  const { error: tracksError } = await supabase.rpc('create_tracks_table');
  if (tracksError) console.error('Error creating tracks table:', tracksError);

  // Samples table
  const { error: samplesError } = await supabase.rpc('create_samples_table');
  if (samplesError) console.error('Error creating samples table:', samplesError);

  // Clearance requests table
  const { error: clearanceError } = await supabase.rpc('create_clearance_requests_table');
  if (clearanceError) console.error('Error creating clearance requests table:', clearanceError);

  // Rights holders table
  const { error: rightsError } = await supabase.rpc('create_rights_holders_table');
  if (rightsError) console.error('Error creating rights holders table:', rightsError);
};

// User management
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Track management
export const uploadTrack = async (userId, trackData) => {
  const { data, error } = await supabase
    .from('tracks')
    .insert([{
      user_id: userId,
      title: trackData.title,
      audio_file_url: trackData.audioFileUrl,
      detected_samples: trackData.detectedSamples || [],
      created_at: new Date().toISOString()
    }])
    .select();
  
  return { data, error };
};

export const getUserTracks = async (userId) => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Sample management
export const createSample = async (sampleData) => {
  const { data, error } = await supabase
    .from('samples')
    .insert([{
      original_track_id: sampleData.originalTrackId,
      detected_from_track_id: sampleData.detectedFromTrackId,
      start_time: sampleData.startTime,
      end_time: sampleData.endTime,
      confidence: sampleData.confidence,
      created_at: new Date().toISOString()
    }])
    .select();
  
  return { data, error };
};

// Clearance request management
export const createClearanceRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('clearance_requests')
    .insert([{
      track_id: requestData.trackId,
      sample_id: requestData.sampleId,
      rights_holder: requestData.rightsHolder,
      status: 'pending',
      negotiation_terms: requestData.negotiationTerms,
      license_agreement_url: requestData.licenseAgreementUrl,
      payment_status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select();
  
  return { data, error };
};

export const updateClearanceRequest = async (requestId, updates) => {
  const { data, error } = await supabase
    .from('clearance_requests')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select();
  
  return { data, error };
};

export const getClearanceRequests = async (userId) => {
  const { data, error } = await supabase
    .from('clearance_requests')
    .select(`
      *,
      tracks!inner(user_id),
      samples(*)
    `)
    .eq('tracks.user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Rights holder management
export const createRightsHolder = async (rightsHolderData) => {
  const { data, error } = await supabase
    .from('rights_holders')
    .insert([{
      name: rightsHolderData.name,
      contact_info: rightsHolderData.contactInfo,
      agreed_terms: rightsHolderData.agreedTerms || {},
      created_at: new Date().toISOString()
    }])
    .select();
  
  return { data, error };
};

export const getRightsHolders = async () => {
  const { data, error } = await supabase
    .from('rights_holders')
    .select('*')
    .order('name');
  
  return { data, error };
};
