import React, { useState, useEffect } from 'react'
import { Plus, Calendar, TrendingUp, Download } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import InputText from './ui/InputText'
import Modal from './ui/Modal'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SymptomTracker = ({ onNavigate }) => {
  const [symptomEntries, setSymptomEntries] = useLocalStorage('symptomEntries', [])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEntry, setNewEntry] = useState({
    symptoms: '',
    severity: 5,
    notes: '',
    treatments: ''
  })

  const handleAddEntry = () => {
    if (!newEntry.symptoms.trim()) {
      alert('Please describe your symptoms')
      return
    }

    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...newEntry
    }

    setSymptomEntries(prev => [entry, ...prev])
    setNewEntry({ symptoms: '', severity: 5, notes: '', treatments: '' })
    setShowAddModal(false)
  }

  const deleteEntry = (id) => {
    setSymptomEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const exportData = () => {
    const dataStr = JSON.stringify(symptomEntries, null, 2)
    const dataBlob = new Blob([dataStr], {type: 'application/json'})
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'symptom-tracking-data.json'
    link.click()
  }

  // Prepare chart data
  const chartData = symptomEntries
    .slice(0, 7)
    .reverse()
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      severity: entry.severity
    }))

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Symptom Tracker
            </h1>
            <p className="text-white/70">
              Track your symptoms over time and monitor your health progress.
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button
              variant="secondary"
              onClick={exportData}
              disabled={symptomEntries.length === 0}
              className="inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Symptoms</span>
            </Button>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="glass-effect border-white/20 mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Severity Trend</span>
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                    <YAxis domain={[1, 10]} stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="severity" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {symptomEntries.length === 0 ? (
            <Card className="glass-effect border-white/20">
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
                <p className="text-white/70 mb-4">Start tracking your symptoms to monitor your health progress.</p>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  Log Your First Entry
                </Button>
              </div>
            </Card>
          ) : (
            symptomEntries.map((entry) => (
              <Card key={entry.id} className="glass-effect border-white/20">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entry.symptoms}</h3>
                      <p className="text-white/70 text-sm">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/70 text-sm">Severity:</span>
                      <span className="text-white font-medium">{entry.severity}/10</span>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 text-sm ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <div className="mb-3">
                      <h4 className="text-white font-medium text-sm mb-1">Notes:</h4>
                      <p className="text-white/70 text-sm">{entry.notes}</p>
                    </div>
                  )}
                  
                  {entry.treatments && (
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">Treatments:</h4>
                      <p className="text-white/70 text-sm">{entry.treatments}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Add Entry Modal */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Log Symptoms</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Symptoms *
                  </label>
                  <InputText
                    variant="textarea"
                    value={newEntry.symptoms}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, symptoms: e.target.value }))}
                    placeholder="Describe your current symptoms..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Severity Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.severity}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Mild (1)</span>
                    <span className="font-medium text-gray-700">{newEntry.severity}</span>
                    <span>Severe (10)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Notes
                  </label>
                  <InputText
                    variant="textarea"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about your condition..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Treatments Tried
                  </label>
                  <InputText
                    value={newEntry.treatments}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, treatments: e.target.value }))}
                    placeholder="Medications, remedies, etc."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button variant="primary" onClick={handleAddEntry}>
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default SymptomTracker