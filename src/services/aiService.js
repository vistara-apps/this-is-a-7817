import OpenAI from 'openai'

// Initialize OpenAI with environment variables or fallback
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

// Mock responses for demo purposes when API key is not available
const mockResponses = [
  {
    urgency: 'Low',
    urgencyReason: 'Based on the symptoms described, this appears to be a common condition that can typically be managed at home. Monitor symptoms and consider seeing a healthcare provider if they worsen or persist.',
    conditions: [
      {
        name: 'Common Cold',
        likelihood: 75,
        description: 'A viral infection of the upper respiratory tract that typically resolves on its own within 7-10 days.'
      },
      {
        name: 'Seasonal Allergies',
        likelihood: 60,
        description: 'An immune system response to airborne allergens like pollen, dust, or pet dander.'
      },
      {
        name: 'Minor Viral Infection',
        likelihood: 45,
        description: 'A mild viral infection that causes temporary discomfort but usually resolves without treatment.'
      }
    ],
    recommendations: 'Get plenty of rest, stay hydrated, and consider over-the-counter remedies for symptom relief. If symptoms persist for more than 10 days or worsen significantly, consult a healthcare provider.'
  },
  {
    urgency: 'Moderate',
    urgencyReason: 'These symptoms warrant attention and you should consider scheduling an appointment with a healthcare provider within the next few days.',
    conditions: [
      {
        name: 'Influenza',
        likelihood: 70,
        description: 'A contagious respiratory illness caused by influenza viruses, typically more severe than a common cold.'
      },
      {
        name: 'Bacterial Infection',
        likelihood: 55,
        description: 'A bacterial infection that may require antibiotic treatment from a healthcare provider.'
      },
      {
        name: 'Sinusitis',
        likelihood: 40,
        description: 'Inflammation of the sinuses that can be caused by viral, bacterial, or fungal infections.'
      }
    ],
    recommendations: 'Schedule an appointment with your healthcare provider within the next 2-3 days. Rest, stay hydrated, and monitor your symptoms closely. Seek immediate care if symptoms worsen significantly.'
  }
]

export const analyzeSymptoms = async ({ symptoms, severity, duration }) => {
  try {
    // Check if we have a valid API key
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-key') {
      // Return mock response for demo
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
      return mockResponses[Math.floor(Math.random() * mockResponses.length)]
    }

    const prompt = `As a medical AI assistant, analyze these symptoms and provide a structured response:

Symptoms: ${symptoms}
Severity: ${severity}
Duration: ${duration || 'Not specified'}

Please provide a JSON response with the following structure:
{
  "urgency": "Low|Moderate|High|Emergency",
  "urgencyReason": "Brief explanation of urgency level",
  "conditions": [
    {
      "name": "Condition name",
      "likelihood": "percentage as number",
      "description": "Brief description"
    }
  ],
  "recommendations": "General recommendations for next steps"
}

Important: This is for informational purposes only and should not replace professional medical advice.`

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful medical AI assistant. Provide informative responses but always recommend consulting healthcare professionals for serious concerns.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    })

    const response = completion.choices[0].message.content
    
    try {
      return JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Return a fallback response
      return mockResponses[0]
    }
    
  } catch (error) {
    console.error('AI Service Error:', error)
    
    // Return mock response as fallback
    await new Promise(resolve => setTimeout(resolve, 1500))
    return mockResponses[Math.floor(Math.random() * mockResponses.length)]
  }
}