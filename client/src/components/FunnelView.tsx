'use client'

import { Brain, Code, Gamepad2, Calendar, Users } from 'lucide-react'

const funnelStages = [
  { id: 'swipe', label: 'Swipe', count: 0, color: 'from-blue-500 to-cyan-500' },
  { id: 'personality', label: 'Personality Test', count: 0, color: 'from-purple-500 to-pink-500' },
  { id: 'code-battle', label: 'Code Battle', count: 0, color: 'from-orange-500 to-red-500' },
  { id: 'game', label: 'Mini Games', count: 0, color: 'from-green-500 to-emerald-500' },
  { id: 'interview', label: 'Final Interview', count: 0, color: 'from-indigo-500 to-purple-600' }
]

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'swipe': return <Users className="w-4 h-4" />
    case 'personality': return <Brain className="w-4 h-4" />
    case 'code-battle': return <Code className="w-4 h-4" />
    case 'game': return <Gamepad2 className="w-4 h-4" />
    case 'interview': return <Calendar className="w-4 h-4" />
    default: return <Users className="w-4 h-4" />
  }
}

interface Candidate {
  id: number
  name: string
  title: string
  stage: string
  matchScore: number
  personalityScore?: number
  codeBattleScore?: number
  gameScore?: number
}

interface FunnelViewProps {
  candidates: Candidate[]
}

export default function FunnelView({ candidates }: FunnelViewProps) {
  // Calculate funnel counts
  const stageCounts = funnelStages.map(stage => ({
    ...stage,
    count: candidates.filter(c => c.stage === stage.id).length
  }))

  return (
    <div className="space-y-8">
      {/* Funnel Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Candidate Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stageCounts.map((stage) => (
            <div key={stage.id} className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                {getStageIcon(stage.id)}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{stage.label}</h3>
              <div className="text-3xl font-black text-violet-600">{stage.count}</div>
              <div className="text-sm text-gray-500">candidates</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Funnel View */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h3 className="text-2xl font-black text-gray-900 mb-6">Candidate Progression</h3>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{candidate.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Match Score</div>
                  <div className="text-xl font-black text-violet-600">{candidate.matchScore}%</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-500">Current Stage</div>
                  <div className="flex items-center gap-2">
                    {getStageIcon(candidate.stage)}
                    <span className="font-bold text-gray-900 capitalize">{candidate.stage.replace('-', ' ')}</span>
                  </div>
                </div>

                {candidate.personalityScore && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Personality</div>
                    <div className="text-xl font-bold text-purple-600">{candidate.personalityScore}%</div>
                  </div>
                )}

                {candidate.codeBattleScore && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Code Battle</div>
                    <div className="text-xl font-bold text-orange-600">{candidate.codeBattleScore}%</div>
                  </div>
                )}

                {candidate.gameScore && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Games</div>
                    <div className="text-xl font-bold text-green-600">{candidate.gameScore}%</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
                    View Details
                  </button>
                  {candidate.stage === 'interview' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Book Interview
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
