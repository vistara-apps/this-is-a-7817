import React from 'react'
import { Crown, Check, X } from 'lucide-react'
import Button from './ui/Button'
import Modal from './ui/Modal'

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const features = [
    'Unlimited symptom analyses',
    'Advanced AI insights',
    'Detailed condition information',
    'Priority support',
    'Export health data',
    'Symptom tracking history'
  ]

  return (
    <Modal onClose={onClose}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-gray-600">
            Get unlimited access to all features and take control of your health
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-gray-800">$5</span>
            <span className="text-gray-600">/month</span>
          </div>
          
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={onSubscribe}
            className="flex-1"
          >
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          7-day free trial • Cancel anytime • No commitment
        </p>
      </div>
    </Modal>
  )
}

export default SubscriptionModal