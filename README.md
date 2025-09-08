# Symptom Scout

Your AI-powered health guide, in your pocket.

## Overview

Symptom Scout is an AI-powered web application that helps users understand their health symptoms, assess urgency, and find relevant information. Built with React and powered by OpenAI's GPT-4, it provides intelligent health guidance while maintaining user privacy and security.

## Features

### Core Features
- **🔍 Symptom Checker**: AI-powered analysis of user-reported symptoms with urgency assessment
- **📊 Symptom Tracking**: Personal health journal with treatment effectiveness tracking
- **📚 Condition Information Hub**: Curated, easy-to-understand information about health conditions
- **👤 User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **💳 Subscription Management**: Freemium model with Stripe integration

### Premium Features
- **Unlimited symptom checks** (vs 3/month for free users)
- **Detailed condition information** with treatment recommendations
- **Advanced symptom tracking** with data export capabilities
- **Priority support** and personalized health insights

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** with custom design system
- **Lucide React** for consistent iconography
- **Recharts** for data visualization

### Backend Services
- **Supabase** for authentication and database
- **OpenAI API (GPT-4)** for AI-powered symptom analysis
- **Stripe** for subscription management and payments

### State Management
- **React Context API** for global state
- **Local Storage** for offline data persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional for demo mode)
- Supabase project (optional for full features)
- Stripe account (optional for payments)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/vistara-apps/this-is-a-7817.git
cd this-is-a-7817
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (optional)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (optional)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser to `http://localhost:5173`**

## Demo Mode

The application works in **demo mode** without any API keys:
- Mock AI responses for symptom analysis
- Local storage for data persistence
- Simulated authentication and subscription flows
- Full UI/UX experience without external dependencies

## Database Setup (Optional)

For full functionality with user accounts and data persistence:

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL schema from `docs/database-schema.sql` in your Supabase SQL editor
3. Configure Row Level Security (RLS) policies
4. Add your Supabase credentials to `.env`

## Stripe Setup (Optional)

For subscription functionality:

1. Create a [Stripe](https://stripe.com) account
2. Set up products and pricing in Stripe Dashboard
3. Configure webhooks for subscription events
4. Add your Stripe publishable key to `.env`

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   └── AuthModal.jsx
│   ├── ui/                # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── InputText.jsx
│   │   └── Modal.jsx
│   ├── Header.jsx         # Navigation header
│   ├── HomePage.jsx       # Landing page
│   ├── SymptomChecker.jsx # AI symptom analysis
│   ├── SymptomTracker.jsx # Health tracking
│   ├── ConditionInfo.jsx  # Health information
│   └── SubscriptionModal.jsx
├── contexts/
│   └── AuthContext.jsx    # Authentication state
├── services/              # API integrations
│   ├── aiService.js       # OpenAI integration
│   ├── supabaseService.js # Database operations
│   └── stripeService.js   # Payment processing
├── hooks/
│   └── useLocalStorage.js # Local storage hook
├── App.jsx               # Main app component
└── main.jsx              # App entry point

docs/
├── API_DOCUMENTATION.md  # Complete API documentation
└── database-schema.sql   # Supabase database schema
```

## Design System

### Colors
- **Primary**: `hsl(210, 80%, 50%)` - Professional blue
- **Accent**: `hsl(160, 60%, 45%)` - Health-focused green
- **Background**: `hsl(220, 20%, 98%)` - Clean light gray
- **Text**: `hsl(220, 20%, 15%)` - High contrast dark

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Semantic sizing (display, heading1, heading2, body, caption)
- **Line Heights**: Optimized for readability

### Components
- **Consistent spacing** using 8px grid system
- **Rounded corners** with 6px/10px/16px radius scale
- **Subtle shadows** for depth and hierarchy
- **Responsive design** with mobile-first approach

## API Documentation

Comprehensive API documentation is available in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md), including:

- OpenAI integration patterns
- Supabase database operations
- Stripe payment flows
- Authentication workflows
- Error handling strategies
- Security considerations

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- **ESLint** for code quality
- **Prettier** for consistent formatting
- **Conventional Commits** for clear git history
- **Component-first** architecture
- **Custom hooks** for reusable logic

## Deployment

### Frontend Deployment

**Vercel (Recommended):**
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

**Netlify:**
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure environment variables

### Backend Services

- **Supabase**: Managed PostgreSQL with real-time features
- **Stripe**: Managed payment processing
- **OpenAI**: Managed AI API service

## Security & Privacy

### Data Protection
- **HTTPS everywhere** for secure data transmission
- **JWT authentication** with automatic token refresh
- **Row Level Security** in database
- **Input validation** and sanitization
- **Rate limiting** on API endpoints

### Health Data Privacy
- **HIPAA-compliant** data handling practices
- **User consent** for data processing
- **Data encryption** at rest and in transit
- **Secure data retention** policies
- **User data export** capabilities

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure responsive design works on all devices
- Test with both demo mode and real API keys

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## Roadmap

### Upcoming Features
- **Mobile app** (React Native)
- **Telemedicine integration**
- **Wearable device sync**
- **Advanced analytics dashboard**
- **Multi-language support**

### Technical Improvements
- **GraphQL API** for more efficient data fetching
- **Real-time notifications** for health reminders
- **Offline support** with service workers
- **Advanced caching** for better performance

## Disclaimer

⚠️ **Important Medical Disclaimer**

This application is for informational and educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns, emergencies, or before making any decisions related to your health or treatment.

The AI-powered symptom analysis is not a substitute for professional medical evaluation and should not be used for emergency situations. If you are experiencing a medical emergency, please contact emergency services immediately.

---

**Built with ❤️ for better health outcomes**
