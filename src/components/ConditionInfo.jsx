import React, { useState } from 'react'
import { ArrowLeft, Search, BookOpen, ExternalLink } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import InputText from './ui/InputText'

const ConditionInfo = ({ condition, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Common conditions database
  const conditions = [
    {
      name: 'Common Cold',
      description: 'A viral infection of the upper respiratory tract, typically caused by rhinoviruses.',
      symptoms: ['Runny nose', 'Sore throat', 'Cough', 'Sneezing', 'Mild fever'],
      causes: ['Viral infection', 'Exposure to infected individuals', 'Weakened immune system'],
      treatments: ['Rest', 'Plenty of fluids', 'Over-the-counter pain relievers', 'Throat lozenges'],
      prevention: ['Frequent handwashing', 'Avoiding close contact with sick individuals', 'Maintaining good hygiene'],
      whenToSeeDoctor: 'If symptoms persist for more than 10 days, or if you develop high fever, severe headache, or difficulty breathing.'
    },
    {
      name: 'Influenza (Flu)',
      description: 'A contagious respiratory illness caused by influenza viruses.',
      symptoms: ['High fever', 'Body aches', 'Fatigue', 'Headache', 'Dry cough'],
      causes: ['Influenza virus infection', 'Seasonal outbreaks', 'Close contact with infected persons'],
      treatments: ['Antiviral medications', 'Rest', 'Fluids', 'Fever reducers'],
      prevention: ['Annual flu vaccination', 'Good hygiene', 'Avoiding crowded places during outbreaks'],
      whenToSeeDoctor: 'If you have difficulty breathing, chest pain, persistent fever, or if you are in a high-risk group.'
    },
    {
      name: 'Headache',
      description: 'Pain in the head or upper neck, which can be caused by various factors.',
      symptoms: ['Head pain', 'Sensitivity to light', 'Nausea', 'Tension in neck and shoulders'],
      causes: ['Stress', 'Dehydration', 'Sleep deprivation', 'Eye strain', 'Certain foods'],
      treatments: ['Rest in dark room', 'Hydration', 'Over-the-counter pain relievers', 'Cold/warm compress'],
      prevention: ['Regular sleep schedule', 'Stress management', 'Staying hydrated', 'Regular meals'],
      whenToSeeDoctor: 'If headaches are severe, frequent, or accompanied by fever, confusion, or vision changes.'
    },
    {
      name: 'Food Poisoning',
      description: 'Illness caused by consuming contaminated food or beverages.',
      symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach cramps', 'Fever'],
      causes: ['Bacterial contamination', 'Viral infection', 'Parasites', 'Toxins in food'],
      treatments: ['Rest', 'Fluid replacement', 'BRAT diet', 'Avoiding dairy and fatty foods'],
      prevention: ['Proper food handling', 'Cooking at correct temperatures', 'Good hygiene', 'Safe food storage'],
      whenToSeeDoctor: 'If you have signs of severe dehydration, blood in stool, high fever, or symptoms lasting more than several days.'
    }
  ]

  // Use provided condition or search for one
  const displayCondition = condition || conditions.find(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredConditions = searchQuery 
    ? conditions.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conditions

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            className="glass-effect border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Health Information
          </h1>
        </div>

        {!condition && (
          <Card className="glass-effect border-white/20 mb-8">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-white" />
                <InputText
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for health conditions..."
                  className="flex-1"
                />
              </div>
            </div>
          </Card>
        )}

        {displayCondition ? (
          <Card className="glass-effect border-white/20">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {displayCondition.name}
              </h2>
              <p className="text-white/80 text-lg mb-8">
                {displayCondition.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Symptoms</h3>
                    <ul className="space-y-2">
                      {displayCondition.symptoms.map((symptom, index) => (
                        <li key={index} className="text-white/70 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Causes</h3>
                    <ul className="space-y-2">
                      {displayCondition.causes.map((cause, index) => (
                        <li key={index} className="text-white/70 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Treatment Options</h3>
                    <ul className="space-y-2">
                      {displayCondition.treatments.map((treatment, index) => (
                        <li key={index} className="text-white/70 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                          <span>{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Prevention</h3>
                    <ul className="space-y-2">
                      {displayCondition.prevention.map((prevention, index) => (
                        <li key={index} className="text-white/70 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                          <span>{prevention}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <h3 className="text-lg font-semibold text-red-400 mb-2">When to See a Doctor</h3>
                <p className="text-white/80">{displayCondition.whenToSeeDoctor}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => onNavigate('symptom-checker')}
                >
                  Check Your Symptoms
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onNavigate('symptom-tracker')}
                >
                  Track Progress
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Browse Health Conditions</h2>
            {filteredConditions.map((cond, index) => (
              <Card key={index} className="glass-effect border-white/20 hover:border-white/30 transition-all cursor-pointer" onClick={() => onNavigate('condition-info', cond)}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{cond.name}</h3>
                      <p className="text-white/70">{cond.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/50" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ConditionInfo