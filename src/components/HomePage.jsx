import React from 'react'
import { Activity, Search, TrendingUp, BookOpen, ArrowRight } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

const HomePage = ({ onNavigate }) => {
  const features = [
    {
      icon: Search,
      title: 'Symptom Checker',
      description: 'Describe your symptoms and get AI-powered insights about potential conditions.',
      action: () => onNavigate('symptom-checker')
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Log your symptoms over time and monitor your health journey.',
      action: () => onNavigate('symptom-tracker')
    },
    {
      icon: BookOpen,
      title: 'Learn More',
      description: 'Access comprehensive information about various health conditions.',
      action: () => onNavigate('condition-info')
    }
  ]

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Symptom Scout
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your AI-powered health guide, in your pocket. Get instant insights about your symptoms and make informed health decisions.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => onNavigate('symptom-checker')}
            className="inline-flex items-center space-x-2"
          >
            <span>Check Your Symptoms</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="glass-effect border-white/20 hover:border-white/30 transition-all cursor-pointer" onClick={feature.action}>
                <div className="p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass-effect border-white/20 max-w-2xl mx-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to understand your health better?
              </h2>
              <p className="text-white/70 mb-6">
                Start with our free symptom checker and discover what your body is telling you.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => onNavigate('symptom-checker')}
                className="inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage