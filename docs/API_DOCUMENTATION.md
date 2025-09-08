# Symptom Scout API Documentation

## Overview

Symptom Scout is an AI-powered health application that helps users understand their symptoms, assess urgency, and track their health over time. This document outlines the complete API architecture and integration requirements.

## Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Authentication**: Supabase Auth

### Backend Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Processing**: OpenAI API (GPT-4)
- **Payments**: Stripe
- **File Storage**: Supabase Storage (for future features)

## API Integrations

### 1. OpenAI API Integration

**Purpose**: Process user symptoms and provide AI-powered health insights

**Endpoint**: `https://api.openai.com/v1/chat/completions`

**Authentication**: Bearer token (API key)

**Request Format**:
```javascript
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful medical AI assistant..."
    },
    {
      "role": "user", 
      "content": "Analyze these symptoms: headache, fever, fatigue..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 800
}
```

**Response Format**:
```javascript
{
  "urgency": "Low|Moderate|High|Emergency",
  "urgencyReason": "Brief explanation of urgency level",
  "conditions": [
    {
      "name": "Condition name",
      "likelihood": 75,
      "description": "Brief description"
    }
  ],
  "recommendations": "General recommendations for next steps"
}
```

**Implementation**: See `src/services/aiService.js`

**Error Handling**:
- Network errors: Fallback to mock responses
- Rate limiting: Implement exponential backoff
- Invalid responses: Parse and validate JSON

### 2. Supabase Integration

**Purpose**: User authentication, data storage, and real-time updates

**Base URL**: `https://[project-id].supabase.co`

#### Authentication Endpoints

**Sign Up**:
```javascript
POST /auth/v1/signup
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Sign In**:
```javascript
POST /auth/v1/token?grant_type=password
{
  "email": "user@example.com", 
  "password": "password123"
}
```

**Sign Out**:
```javascript
POST /auth/v1/logout
Authorization: Bearer [access_token]
```

#### Database Operations

**Create Symptom Entry**:
```javascript
POST /rest/v1/symptom_entries
Authorization: Bearer [access_token]
{
  "reported_symptoms": "headache, fever, fatigue",
  "severity": "moderate",
  "duration": "2 days",
  "notes": "Started yesterday morning"
}
```

**Get Symptom Entries**:
```javascript
GET /rest/v1/symptom_entries?user_id=eq.[user_id]&order=timestamp.desc
Authorization: Bearer [access_token]
```

**Create Treatment Log**:
```javascript
POST /rest/v1/treatment_logs
Authorization: Bearer [access_token]
{
  "symptom_entry_id": "uuid",
  "treatment": "Rest and hydration",
  "effectiveness": 7,
  "notes": "Feeling better after rest"
}
```

**Implementation**: See `src/services/supabaseService.js`

### 3. Stripe Integration

**Purpose**: Handle subscription payments and billing

**Base URL**: `https://api.stripe.com/v1`

**Authentication**: Bearer token (secret key for backend, publishable key for frontend)

#### Frontend Integration

**Initialize Stripe**:
```javascript
import { loadStripe } from '@stripe/stripe-js'
const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY)
```

**Create Checkout Session** (Backend Required):
```javascript
POST /api/create-checkout-session
{
  "priceId": "price_premium_monthly",
  "userId": "user-uuid",
  "successUrl": "https://app.com/success",
  "cancelUrl": "https://app.com/cancel"
}
```

**Redirect to Checkout**:
```javascript
const { error } = await stripe.redirectToCheckout({
  sessionId: session.id
})
```

**Implementation**: See `src/services/stripeService.js`

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  subscription_status: 'free' | 'premium' | 'cancelled'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
  updated_at: string
}
```

### SymptomEntry
```typescript
interface SymptomEntry {
  id: string
  user_id: string
  timestamp: string
  reported_symptoms: string
  severity: 'mild' | 'moderate' | 'severe'
  duration?: string
  notes?: string
  potential_conditions: Condition[]
  urgency_assessment: 'low' | 'moderate' | 'high' | 'emergency'
  urgency_reason?: string
  ai_recommendations?: string
  created_at: string
  updated_at: string
}
```

### TreatmentLog
```typescript
interface TreatmentLog {
  id: string
  user_id: string
  symptom_entry_id?: string
  timestamp: string
  treatment: string
  effectiveness: number // 1-10 scale
  notes?: string
  created_at: string
  updated_at: string
}
```

### ConditionInfo
```typescript
interface ConditionInfo {
  id: string
  name: string
  description: string
  common_symptoms: string[]
  treatments: string[]
  lifestyle_recommendations: string[]
  sources_url: string[]
  when_to_seek_help: string
  created_at: string
  updated_at: string
}
```

## Authentication Flow

### 1. User Registration
1. User submits email/password
2. Frontend calls `supabase.auth.signUp()`
3. Supabase creates auth user
4. Database trigger creates user profile
5. Usage tracking initialized
6. User receives confirmation email (if enabled)

### 2. User Login
1. User submits credentials
2. Frontend calls `supabase.auth.signInWithPassword()`
3. Supabase validates and returns JWT
4. Frontend stores session
5. User profile and usage data loaded

### 3. Session Management
- JWT tokens automatically refreshed by Supabase client
- Session state managed by AuthContext
- Automatic logout on token expiration

## Subscription Flow

### 1. Free to Premium Upgrade
1. User clicks "Upgrade" button
2. Frontend creates Stripe checkout session
3. User redirected to Stripe Checkout
4. Payment processed by Stripe
5. Webhook updates user subscription status
6. User gains premium features

### 2. Subscription Management
1. User accesses billing portal
2. Frontend creates Stripe portal session
3. User redirected to Stripe portal
4. Changes processed by Stripe
5. Webhooks update subscription status

## Usage Limits & Features

### Free Tier
- 3 symptom checks per month
- Basic condition information
- Symptom tracking
- No data export

### Premium Tier
- Unlimited symptom checks
- Detailed condition information
- Advanced symptom tracking
- Data export to PDF
- Priority support
- Personalized health insights

## Error Handling

### API Errors
```javascript
try {
  const result = await apiCall()
  return { data: result, error: null }
} catch (error) {
  console.error('API Error:', error)
  return { data: null, error: error.message }
}
```

### User-Friendly Error Messages
- Network errors: "Connection issue. Please try again."
- Authentication errors: "Please sign in to continue."
- Usage limit errors: "Upgrade to Premium for unlimited access."
- Validation errors: "Please check your input and try again."

## Security Considerations

### Data Protection
- All API calls use HTTPS
- JWT tokens for authentication
- Row Level Security (RLS) in database
- Input validation and sanitization
- Rate limiting on API endpoints

### Health Data Privacy
- HIPAA-compliant data handling
- User data encryption at rest
- Secure data transmission
- User consent for data processing
- Data retention policies

## Rate Limiting

### OpenAI API
- 3 requests per minute for free users
- 60 requests per minute for premium users
- Exponential backoff on rate limit errors

### Supabase
- 100 requests per minute per user
- Connection pooling for efficiency
- Automatic retry with backoff

### Stripe
- 100 requests per second
- Idempotency keys for safety
- Webhook signature verification

## Monitoring & Analytics

### Error Tracking
- Frontend errors logged to console
- API errors tracked with context
- User feedback collection
- Performance monitoring

### Usage Analytics
- Feature usage tracking
- Conversion funnel analysis
- User engagement metrics
- Subscription analytics

## Development Setup

### Environment Variables
```bash
# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App
VITE_APP_URL=http://localhost:5173
```

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Set up Supabase database (see schema.sql)
6. Configure Stripe webhooks

### Testing
- Unit tests for services
- Integration tests for API calls
- E2E tests for user flows
- Mock services for development

## Deployment

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel/Netlify
- Configure environment variables
- Set up custom domain

### Backend Services
- Supabase: Managed service
- Stripe: Managed service
- OpenAI: Managed service
- Configure webhooks and callbacks

## API Versioning

### Current Version: v1
- All endpoints prefixed with `/v1/`
- Backward compatibility maintained
- Deprecation notices for changes
- Migration guides for updates

## Support & Documentation

### Developer Resources
- API documentation (this file)
- Database schema documentation
- Code examples and tutorials
- Troubleshooting guides

### User Support
- In-app help system
- Email support for premium users
- Knowledge base articles
- Community forums

## Future Enhancements

### Planned Features
- Mobile app (React Native)
- Telemedicine integration
- Wearable device sync
- Advanced analytics dashboard
- Multi-language support

### API Improvements
- GraphQL endpoint
- Real-time subscriptions
- Batch operations
- Advanced filtering
- Caching layer

---

For technical support or questions about this API documentation, please contact the development team.
