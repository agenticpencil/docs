'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

interface OutlineSection {
  h2: string
  target_keywords: string[]
}

interface CannibRisk {
  keyword: string
  pages: string[]
  severity: 'high' | 'medium' | 'low'
}

interface Recommendation {
  priority: number
  title: string
  target_keyword: string
  search_volume: number
  keyword_difficulty: number
  weighted_difficulty: number
  cpc: number
  search_intent: string
  concept: string
  outline: OutlineSection[]
  content_type: string
  estimated_word_count: number
  opportunity_score: number
  cannibalization_risk: CannibRisk | null
}

interface ContentPlan {
  id: string
  domain: string
  brand_context: string | null
  recommendations: Recommendation[]
  cannibalization: CannibRisk[]
  metadata: any
  created_at: string
}

function DifficultyBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-[#EDE9E3] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${Math.min(value, 100)}%`,
          backgroundColor: value > 70 ? '#8B8680' : value > 40 ? '#B0AAA2' : '#2D2A26',
        }}
      />
    </div>
  )
}

function ContentTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded border border-[#E8E4DE] text-[#8B8680]">
      {type}
    </span>
  )
}

function RecommendationCard({ rec, expanded, onToggle }: { rec: Recommendation; expanded: boolean; onToggle: () => void }) {
  return (
    <div
      className="border border-[#E8E4DE] rounded-lg bg-white cursor-pointer transition-colors hover:border-[#B0AAA2]"
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F5F3EF] flex items-center justify-center text-xs font-medium text-[#8B8680]">
              {rec.priority}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[#2D2A26] truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                {rec.title}
              </h3>
              <p className="text-xs text-[#8B8680] mt-0.5">{rec.target_keyword}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <ContentTypeBadge type={rec.content_type} />
            <div className="text-right">
              <p className="text-sm font-medium text-[#2D2A26]">{rec.opportunity_score}</p>
              <p className="text-[10px] text-[#B0AAA2]">score</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-[#B0AAA2]">Volume</p>
            <p className="text-[#2D2A26] font-medium">{rec.search_volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[#B0AAA2]">Difficulty</p>
            <div className="mt-1">
              <DifficultyBar value={rec.weighted_difficulty} />
            </div>
            <p className="text-[#8B8680] mt-0.5">{rec.weighted_difficulty}</p>
          </div>
          <div>
            <p className="text-[#B0AAA2]">CPC</p>
            <p className="text-[#2D2A26] font-medium">${rec.cpc.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[#B0AAA2]">Intent</p>
            <p className="text-[#2D2A26] font-medium capitalize">{rec.search_intent}</p>
          </div>
        </div>

        {rec.cannibalization_risk && (
          <div className="mt-3 px-3 py-2 rounded bg-[#FDF6EC] border border-[#E8DCC8] text-xs text-[#8B7355]">
            Cannibalization risk ({rec.cannibalization_risk.severity}): "{rec.cannibalization_risk.keyword}" across {rec.cannibalization_risk.pages.length} pages
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-[#E8E4DE] p-4 bg-[#FDFCFA]">
          <p className="text-xs text-[#8B8680] mb-3">{rec.concept}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B0AAA2] mb-2">Outline ({rec.estimated_word_count} words)</p>
          <div className="space-y-2">
            {rec.outline.map((section, i) => (
              <div key={i} className="pl-3 border-l-2 border-[#E8E4DE]">
                <p className="text-sm text-[#2D2A26]" style={{ fontFamily: 'var(--font-serif)' }}>{section.h2}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {section.target_keywords.map((kw, j) => (
                    <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F3EF] text-[#8B8680]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PlansPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<ContentPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<ContentPlan | null>(null)
  const [expandedRec, setExpandedRec] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('content_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setPlans(data || [])
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#8B7355] border-t-transparent" />
      </div>
    )
  }

  if (selectedPlan) {
    const cannibWarnings = selectedPlan.cannibalization?.filter(c => c.severity === 'high' || c.severity === 'medium') || []

    return (
      <div>
        <button
          onClick={() => { setSelectedPlan(null); setExpandedRec(null) }}
          className="text-sm text-[#8B8680] hover:text-[#2D2A26] mb-4 transition-colors"
        >
          &larr; Back to plans
        </button>

        <div className="mb-6">
          <h1 className="text-2xl text-[#2D2A26]" style={{ fontFamily: 'var(--font-serif)' }}>
            {selectedPlan.domain}
          </h1>
          <p className="text-sm text-[#8B8680] mt-1">
            {new Date(selectedPlan.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {selectedPlan.brand_context && ` · ${selectedPlan.brand_context}`}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-[#B0AAA2]">
            <span>{selectedPlan.recommendations?.length || 0} recommendations</span>
            <span>{selectedPlan.metadata?.existing_keywords_count || 0} existing keywords</span>
            <span>{selectedPlan.metadata?.sitemap_pages_count || 0} sitemap pages</span>
          </div>
        </div>

        {cannibWarnings.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[#FDF6EC] border border-[#E8DCC8]">
            <p className="text-xs font-medium text-[#8B7355] mb-1">Cannibalization Warnings</p>
            {cannibWarnings.map((c, i) => (
              <p key={i} className="text-xs text-[#8B7355]">
                "{c.keyword}" — {c.pages.length} competing pages ({c.severity})
              </p>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {(selectedPlan.recommendations || []).map((rec) => (
            <RecommendationCard
              key={rec.priority}
              rec={rec}
              expanded={expandedRec === rec.priority}
              onToggle={() => setExpandedRec(expandedRec === rec.priority ? null : rec.priority)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl text-[#2D2A26] mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
        Content Plans
      </h1>
      <p className="text-sm text-[#8B8680] mb-6">
        Generated content strategies from the /v1/content/recommend endpoint.
      </p>

      {plans.length === 0 ? (
        <div className="text-center py-16 text-sm text-[#B0AAA2]">
          <p>No content plans yet.</p>
          <p className="mt-1">Use the API to generate your first content plan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="w-full text-left p-4 border border-[#E8E4DE] rounded-lg bg-white hover:border-[#B0AAA2] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#2D2A26]">{plan.domain}</p>
                  <p className="text-xs text-[#8B8680] mt-0.5">
                    {plan.recommendations?.length || 0} recommendations
                    {plan.brand_context && ` · ${plan.brand_context}`}
                  </p>
                </div>
                <p className="text-xs text-[#B0AAA2]">
                  {new Date(plan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
