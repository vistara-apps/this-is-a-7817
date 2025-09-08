import React, { useState } from 'react'
import { Search, AlertTriangle, Info, Clock, ArrowRight } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import InputText from './ui/InputText'
import Modal from './ui/Modal'
import { analyzeSymptoms } from '../services/aiService'

const SymptomChecker = ({ onNavigate, checkUsageLimit, incrementUsage, isSubscribed, usageCount }) => {
  const [symptoms, setSymptoms] = useState('')
  const [severity, setSeverity] = useState('mild')
  const [duration, setDuration] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!checkUsageLimit()) {
      return
    }

    if (!symptoms.trim()) {
      alert('Please describe your symptoms')
      return
    }

    setIsAnalyzing(true)
    
    try {
      const analysis = await analyzeSymptoms({
        symptoms: symptoms.trim(),
        severity,
        duration
      })
      
      setResults(analysis)
      setShowResults(true)
      incrementUsage()
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze symptoms. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency':
        return 'text-red-400 bg-red-500/20'
      case 'urgent':
        return 'text-orange-400 bg-orange-500/20'
      case 'moderate':
        return 'text-yellow-400 bg-yellow-500/20'
      default:
        return 'text-green-400 bg-green-500/20'
    }
  }

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency':
      case 'urgent':
        return AlertTriangle
      default:
        return Info
    }
  }

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Symptom Checker
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Describe your symptoms in detail and get AI-powered insights about potential conditions and urgency level.
          </p>
          {!isSubscribed && (
            <p className="text-yellow-400 mt-2">
              {3 - usageCount} free analyses remaining
            </p>
          )}
        </div>

        <Card className="glass-effect border-white/20 max-w-2xl mx-auto">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Describe your symptoms
                </label>
                <InputText
                  variant="textarea"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms in detail (e.g., fever, headache, sore throat, fatigue...)"
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Duration
                  </label>
                  <InputText
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 days, 1 week"
                    className="w-full"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Analyze Symptoms</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Results Modal */}
        {showResults && results && (
          <Modal onClose={() => setShowResults(false)}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
              
              {/* Urgency Assessment */}
              <div className="mb-6">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getUrgencyColor(results.urgency)}`}>
                  {React.createElement(getUrgencyIcon(results.urgency), { className: "w-5 h-5" })}
                  <span className="font-medium">{results.urgency} Priority</span>
                </div>
                <p className="text-gray-600 mt-2">{results.urgencyReason}</p>
              </div>

              {/* Potential Conditions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Potential Conditions</h3>
                <div className="space-y-3">
                  {results.conditions.map((condition, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{condition.name}</h4>
                        <span className="text-sm text-blue-600 font-medium">{condition.likelihood}%</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{condition.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowResults(false)
                          onNavigate('condition-info', condition)
                        }}
                        className="text-xs"
                      >
                        Learn More
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{results.recommendations}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="primary" onClick={() => onNavigate('symptom-tracker')}>
                  Track These Symptoms
                </Button>
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default SymptomChecker