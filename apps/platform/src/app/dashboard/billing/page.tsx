'use client'

import { useEffect, useState } from 'react'
import { Check, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProfile, createCheckoutSession, type ProfileRow } from '@/lib/api'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    credits: 10_000,
    features: ['Keyword Research API', 'Basic Content Audits', 'Email Support', 'API Documentation'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    credits: 50_000,
    popular: true,
    features: ['All Starter features', 'Keyword Gap Analysis', 'Content Recommendations', 'Advanced Audits', 'Priority Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    credits: 200_000,
    features: ['All Professional features', 'White-label API', 'Custom Integrations', 'Dedicated Account Manager', 'Phone Support'],
  },
]

const faqs = [
  ['How do credits work?', 'Credits are consumed per API request. Different endpoints cost different amounts based on complexity.'],
  ['Can I change plans anytime?', 'Yes — upgrades apply immediately. Downgrades take effect at the next billing cycle.'],
  ['What happens when credits run out?', 'API requests are rate-limited until your credits reset at the start of your billing cycle.'],
  ['Do unused credits roll over?', 'No, credits reset each billing period. Use them while they last!'],
]

export default function BillingPage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    getProfile().then(p => { setProfile(p); setLoading(false) })
  }, [])

  const PAYMENT_LINKS: Record<string, string> = {
    starter: 'https://buy.stripe.com/6oU8wPbzt6wDeLs3yh73G00',
    professional: 'https://buy.stripe.com/bJedR932X9IPavc8SB73G01',
    enterprise: 'https://buy.stripe.com/7sY28r7jdg7d0UC2ud73G02',
  }

  const handleUpgrade = (planId: string) => {
    const url = PAYMENT_LINKS[planId]
    if (url) window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[#EDE9E3] rounded w-32 animate-pulse" />
        <div className="rounded-xl border border-[#E8E4DE] p-6 animate-pulse" style={{ backgroundColor: '#F5F3EF' }}>
          <div className="h-6 bg-[#E8E4DE] rounded w-1/4" />
        </div>
      </div>
    )
  }

  const currentPlan = profile?.plan_id || 'free'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D2A26]">Billing</h1>
        <p className="text-[#8B8680] text-sm mt-1">Manage your subscription and upgrade your plan</p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
        <h2 className="text-base font-semibold text-[#2D2A26] mb-4">Current Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[#8B8680]">Plan</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-semibold text-[#2D2A26] capitalize">{currentPlan}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EDE9E3] text-[#8B7355]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8B6FC0]" />
                Active
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-[#8B8680]">Credits Used</p>
            <p className="text-lg font-semibold text-[#2D2A26] mt-1">{profile?.credits_used?.toLocaleString() ?? 0}</p>
          </div>
          <div>
            <p className="text-sm text-[#8B8680]">Credits Reset</p>
            <p className="text-lg font-semibold text-[#2D2A26] mt-1">
              {profile?.credits_reset_at ? new Date(profile.credits_reset_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 transition-all duration-200 ${
                isCurrent
                  ? 'border-[#8B6FC0] ring-1 ring-[#8B6FC0]/20'
                  : plan.popular
                    ? 'border-[#D4A574] ring-1 ring-[#D4A574]/20'
                    : 'border-[#E8E4DE] hover:border-[#D4CFC7]'
              }`}
              style={{ backgroundColor: '#F5F3EF' }}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#D4A574] text-white px-4 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-[#8B6FC0] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current
                  </span>
                </div>
              )}
              <div className="text-center pt-2 mb-6">
                <h3 className="text-xl font-semibold text-[#2D2A26]">{plan.name}</h3>
                <div className="text-3xl font-bold text-[#2D2A26] mt-2">
                  ${plan.price}
                  <span className="text-sm font-normal text-[#B0AAA2]">/mo</span>
                </div>
                <p className="text-sm text-[#8B8680] mt-1">{plan.credits.toLocaleString()} credits/month</p>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#5C5750]">
                    <div className="h-4 w-4 rounded-full bg-[#EDE9E3] flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-[#8B7355]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button className="w-full rounded-lg border-[#E8E4DE] text-[#B0AAA2]" disabled variant="outline">Current Plan</Button>
              ) : (
                <Button
                  className={`w-full rounded-lg shadow-none transition-all ${
                    plan.popular
                      ? 'bg-[#2D2A26] hover:bg-[#3D3A36] text-[#FAF9F6]'
                      : 'border-[#E8E4DE] bg-white text-[#2D2A26] hover:bg-[#EDE9E3]'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={upgrading === plan.id}
                >
                  {upgrading === plan.id ? 'Processing...' : (
                    <>Upgrade to {plan.name} <ExternalLink className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* FAQs */}
      <div className="rounded-xl border border-[#E8E4DE]" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="p-6 pb-3">
          <h2 className="text-base font-semibold text-[#2D2A26]">Frequently Asked Questions</h2>
        </div>
        <div className="px-6 pb-6">
          {faqs.map(([q, a], i) => (
            <div key={q} className="border-b border-[#E8E4DE] last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between w-full py-4 text-left hover:text-[#2D2A26] transition-colors"
              >
                <h4 className="font-medium text-sm text-[#5C5750]">{q}</h4>
                <ChevronDown className={`h-4 w-4 text-[#B0AAA2] transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <p className="text-sm text-[#8B8680] pb-4 -mt-1">{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
