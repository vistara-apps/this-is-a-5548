-- SampleSecure Database Schema for Supabase
-- This file contains all the SQL commands needed to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  artist_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  payment_status TEXT DEFAULT 'active' CHECK (payment_status IN ('active', 'inactive', 'past_due', 'canceled')),
  stripe_customer_id TEXT UNIQUE,
  usage_stats JSONB DEFAULT '{"searches": 0, "uploads": 0, "clearance_requests": 0}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks table
CREATE TABLE tracks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  original_filename TEXT,
  audio_file_url TEXT,
  ipfs_hash TEXT,
  arweave_id TEXT,
  duration FLOAT,
  file_size BIGINT,
  format TEXT,
  detected_samples JSONB DEFAULT '[]'::jsonb,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rights holders table
CREATE TABLE rights_holders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_info JSONB DEFAULT '{}'::jsonb,
  agreed_terms JSONB DEFAULT '{}'::jsonb,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Samples table
CREATE TABLE samples (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_track_id TEXT,
  original_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  release_date DATE,
  label TEXT,
  genre TEXT,
  isrc TEXT,
  detected_from_track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  match_type TEXT DEFAULT 'similar' CHECK (match_type IN ('exact', 'partial', 'similar')),
  rights_holder_id UUID REFERENCES rights_holders(id),
  waveform_data JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clearance requests table
CREATE TABLE clearance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  sample_id UUID REFERENCES samples(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  rights_holder_id UUID REFERENCES rights_holders(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'expired')),
  negotiation_terms JSONB DEFAULT '{}'::jsonb,
  license_agreement_url TEXT,
  payment_amount DECIMAL(10,2),
  payment_currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  communication_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Royalty splits table
CREATE TABLE royalty_splits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clearance_request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  splits JSONB NOT NULL, -- Array of {party: string, percentage: number, wallet_address?: string}
  total_percentage DECIMAL(5,2) DEFAULT 100.00 CHECK (total_percentage = 100.00),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disputed')),
  effective_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance tracking table
CREATE TABLE compliance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clearance_request_id UUID REFERENCES clearance_requests(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  license_terms JSONB NOT NULL,
  usage_restrictions JSONB DEFAULT '{}'::jsonb,
  territorial_rights JSONB DEFAULT '{}'::jsonb,
  renewal_date TIMESTAMP WITH TIME ZONE,
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'warning', 'violation')),
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  alerts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('clearance_update', 'payment_due', 'compliance_alert', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tracks_user_id ON tracks(user_id);
CREATE INDEX idx_tracks_created_at ON tracks(created_at DESC);
CREATE INDEX idx_samples_detected_from_track_id ON samples(detected_from_track_id);
CREATE INDEX idx_samples_confidence ON samples(confidence DESC);
CREATE INDEX idx_clearance_requests_user_id ON clearance_requests(user_id);
CREATE INDEX idx_clearance_requests_status ON clearance_requests(status);
CREATE INDEX idx_clearance_requests_created_at ON clearance_requests(created_at DESC);
CREATE INDEX idx_compliance_records_user_id ON compliance_records(user_id);
CREATE INDEX idx_compliance_records_renewal_date ON compliance_records(renewal_date);
CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rights_holders_updated_at BEFORE UPDATE ON rights_holders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clearance_requests_updated_at BEFORE UPDATE ON clearance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_royalty_splits_updated_at BEFORE UPDATE ON royalty_splits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rights_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalty_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tracks policies
CREATE POLICY "Users can view own tracks" ON tracks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracks" ON tracks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracks" ON tracks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tracks" ON tracks FOR DELETE USING (auth.uid() = user_id);

-- Samples policies
CREATE POLICY "Users can view samples from own tracks" ON samples FOR SELECT USING (
  EXISTS (SELECT 1 FROM tracks WHERE tracks.id = samples.detected_from_track_id AND tracks.user_id = auth.uid())
);
CREATE POLICY "Users can insert samples for own tracks" ON samples FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM tracks WHERE tracks.id = samples.detected_from_track_id AND tracks.user_id = auth.uid())
);

-- Clearance requests policies
CREATE POLICY "Users can view own clearance requests" ON clearance_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clearance requests" ON clearance_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clearance requests" ON clearance_requests FOR UPDATE USING (auth.uid() = user_id);

-- Royalty splits policies
CREATE POLICY "Users can view own royalty splits" ON royalty_splits FOR SELECT USING (
  EXISTS (SELECT 1 FROM clearance_requests WHERE clearance_requests.id = royalty_splits.clearance_request_id AND clearance_requests.user_id = auth.uid())
);
CREATE POLICY "Users can manage own royalty splits" ON royalty_splits FOR ALL USING (
  EXISTS (SELECT 1 FROM clearance_requests WHERE clearance_requests.id = royalty_splits.clearance_request_id AND clearance_requests.user_id = auth.uid())
);

-- Compliance records policies
CREATE POLICY "Users can view own compliance records" ON compliance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own compliance records" ON compliance_records FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Rights holders policies (public read for discovery)
CREATE POLICY "Anyone can view rights holders" ON rights_holders FOR SELECT TO authenticated USING (true);

-- Functions for common operations

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update usage stats
CREATE OR REPLACE FUNCTION public.update_usage_stats(
  user_uuid UUID,
  stat_type TEXT,
  increment_by INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET usage_stats = jsonb_set(
    usage_stats,
    ARRAY[stat_type],
    ((COALESCE(usage_stats->>stat_type, '0'))::INTEGER + increment_by)::TEXT::JSONB
  )
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  user_uuid UUID,
  stat_type TEXT,
  limit_value INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
BEGIN
  SELECT COALESCE((usage_stats->>stat_type)::INTEGER, 0) INTO current_usage
  FROM user_profiles
  WHERE id = user_uuid;
  
  RETURN current_usage < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION public.create_audit_log(
  user_uuid UUID,
  action_name TEXT,
  resource_type_name TEXT,
  resource_uuid UUID,
  old_data JSONB DEFAULT NULL,
  new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
  VALUES (user_uuid, action_name, resource_type_name, resource_uuid, old_data, new_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default rights holders for demo
INSERT INTO rights_holders (name, contact_info, verification_status) VALUES
('Universal Music Group', '{"email": "licensing@umg.com", "phone": "+1-555-0123"}', 'verified'),
('Sony Music Entertainment', '{"email": "clearance@sonymusic.com", "phone": "+1-555-0124"}', 'verified'),
('Warner Music Group', '{"email": "licensing@wmg.com", "phone": "+1-555-0125"}', 'verified'),
('Independent Music Collective', '{"email": "rights@indiemusic.com", "phone": "+1-555-0126"}', 'verified'),
('Blue Note Records', '{"email": "licensing@bluenote.com", "phone": "+1-555-0127"}', 'verified'),
('Motown Records', '{"email": "clearance@motown.com", "phone": "+1-555-0128"}', 'verified');

-- Create views for common queries

-- View for user dashboard stats
CREATE VIEW user_dashboard_stats AS
SELECT 
  up.id,
  up.email,
  up.subscription_tier,
  up.usage_stats,
  COUNT(DISTINCT t.id) as total_tracks,
  COUNT(DISTINCT cr.id) as total_clearance_requests,
  COUNT(DISTINCT cr.id) FILTER (WHERE cr.status = 'approved') as approved_requests,
  COUNT(DISTINCT cr.id) FILTER (WHERE cr.status = 'pending') as pending_requests
FROM user_profiles up
LEFT JOIN tracks t ON up.id = t.user_id
LEFT JOIN clearance_requests cr ON up.id = cr.user_id
GROUP BY up.id, up.email, up.subscription_tier, up.usage_stats;

-- View for compliance alerts
CREATE VIEW compliance_alerts AS
SELECT 
  cr.id,
  cr.user_id,
  up.email,
  t.title as track_title,
  comp.renewal_date,
  comp.compliance_status,
  comp.alerts
FROM compliance_records comp
JOIN clearance_requests cr ON comp.clearance_request_id = cr.id
JOIN tracks t ON cr.track_id = t.id
JOIN user_profiles up ON cr.user_id = up.id
WHERE comp.renewal_date <= NOW() + INTERVAL '30 days'
   OR comp.compliance_status != 'compliant';

COMMENT ON TABLE user_profiles IS 'Extended user profile information beyond Supabase auth';
COMMENT ON TABLE tracks IS 'Audio tracks uploaded by users for sample detection';
COMMENT ON TABLE samples IS 'Detected samples within uploaded tracks';
COMMENT ON TABLE clearance_requests IS 'Requests for sample clearance and licensing';
COMMENT ON TABLE royalty_splits IS 'Royalty distribution agreements for cleared samples';
COMMENT ON TABLE compliance_records IS 'Compliance tracking for active licenses';
COMMENT ON TABLE notifications IS 'User notifications for various events';
COMMENT ON TABLE audit_logs IS 'Audit trail for all user actions';
COMMENT ON TABLE rights_holders IS 'Music rights holders and their contact information';
