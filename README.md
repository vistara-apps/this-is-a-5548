# SampleSecure

**Clear music samples legally, effortlessly.**

SampleSecure is a comprehensive platform that simplifies music sample clearance for remix artists, helping them identify owners, manage legal agreements, and track usage with powerful tools designed for the modern music industry.

## 🎵 Features

### Core Features
- **🔍 Automated Sample Discovery**: Scan uploaded audio tracks to identify potential music samples and provide preliminary ownership information
- **📋 Clearance Workflow Management**: Guided process for contacting rights holders, negotiating terms, and generating licensing agreements
- **💰 Royalty Split Management**: Easily split royalties with original rights holders and collaborators based on agreed-upon terms
- **📊 Usage Rights & Compliance Tracker**: Maintain records of all cleared samples with automatic monitoring of license terms

### Technical Features
- **🔐 User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **💳 Subscription Management**: Tiered pricing with Stripe integration
- **☁️ Cloud Storage**: IPFS/Arweave integration for permanent file storage
- **🎚️ Audio Processing**: Advanced audio fingerprinting and sample detection
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🔔 Real-time Notifications**: Toast notifications for user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (for backend services)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5548.git
   cd this-is-a-5548
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual API keys and configuration:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   # ... other variables
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

### Backend Services
- **Supabase** - Authentication, database, and real-time features
- **Stripe** - Payment processing and subscription management
- **Audio Processing API** - Sample detection and audio analysis
- **IPFS/Arweave** - Decentralized file storage

### Database Schema
```sql
-- Users table (managed by Supabase Auth)
user_profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  subscription_tier TEXT DEFAULT 'free',
  payment_status TEXT DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Tracks table
tracks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  title TEXT,
  audio_file_url TEXT,
  detected_samples JSONB,
  created_at TIMESTAMP
)

-- Samples table
samples (
  id UUID PRIMARY KEY,
  original_track_id TEXT,
  detected_from_track_id UUID REFERENCES tracks(id),
  start_time FLOAT,
  end_time FLOAT,
  confidence FLOAT,
  created_at TIMESTAMP
)

-- Clearance requests table
clearance_requests (
  id UUID PRIMARY KEY,
  track_id UUID REFERENCES tracks(id),
  sample_id UUID REFERENCES samples(id),
  rights_holder TEXT,
  status TEXT DEFAULT 'pending',
  negotiation_terms JSONB,
  license_agreement_url TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Rights holders table
rights_holders (
  id UUID PRIMARY KEY,
  name TEXT,
  contact_info JSONB,
  agreed_terms JSONB,
  created_at TIMESTAMP
)
```

## 💳 Subscription Tiers

### Free Tier
- Up to 3 sample searches per month
- Basic sample detection
- Manual clearance workflow
- Email support

### Pro Tier ($29/month)
- Unlimited sample searches
- Advanced sample detection
- Automated clearance workflow
- Basic royalty split tools
- Priority email support
- Usage analytics

### Premium Tier ($79/month)
- Everything in Pro
- Advanced royalty split management
- Compliance tracking & alerts
- API access
- White-label options
- Dedicated account manager
- Phone support

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up authentication providers
3. Create the database tables using the schema above
4. Configure Row Level Security (RLS) policies
5. Add your Supabase URL and anon key to `.env`

### Stripe Setup
1. Create a Stripe account
2. Set up your products and pricing
3. Configure webhooks for subscription events
4. Add your publishable key and price IDs to `.env`

### Audio Processing
The application includes a mock audio processing service for development. For production:
1. Set up an audio processing backend (Python/Node.js)
2. Implement audio fingerprinting (e.g., using librosa, aubio)
3. Connect to music databases for sample identification
4. Configure IPFS/Arweave for permanent storage

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Docker
```bash
# Build the Docker image
docker build -t samplesecure .

# Run the container
docker run -p 3000:3000 samplesecure
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in existing user
- `POST /auth/signout` - Sign out user
- `POST /auth/reset-password` - Reset user password

### Audio Processing Endpoints
- `POST /api/audio/upload` - Upload audio file
- `POST /api/audio/detect-samples` - Detect samples in audio
- `GET /api/audio/sample-metadata/:id` - Get sample metadata

### Subscription Endpoints
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/create-portal-session` - Create customer portal
- `GET /api/stripe/subscription-status/:id` - Get subscription status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@samplesecure.com
- **Documentation**: [docs.samplesecure.com](https://docs.samplesecure.com)
- **Discord**: [Join our community](https://discord.gg/samplesecure)

## 🗺️ Roadmap

- [ ] Advanced AI-powered sample detection
- [ ] Integration with major music platforms (Spotify, Apple Music)
- [ ] Mobile app (React Native)
- [ ] Blockchain-based rights management
- [ ] Advanced analytics and reporting
- [ ] White-label solutions for labels and distributors

---

Built with ❤️ for the music community
