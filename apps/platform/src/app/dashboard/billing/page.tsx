'use client'

import { useEffect, useState } from 'react'
import { Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function BillingPage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    getProfile().then(p => { setProfile(p); setLoading(false) })
  }, [])

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId)
    try {
      const { checkout_url } = await createCheckoutSession(planId)
      window.open(checkout_url, '_blank')
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setUpgrading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Billing</h1>
        <Card className="bg-card/50 border-border">
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/2 mt-2" />
          </CardHeader>
        </Card>
      </div>
    )
  }

  const currentPlan = profile?.plan_id || 'free'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and upgrade your plan</p>
      </div>

      {/* Current plan summary */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="text-lg font-semibold capitalize mt-0.5">{currentPlan}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits Used</p>
            <p className="text-lg font-semibold mt-0.5">{profile?.credits_used?.toLocaleString() ?? 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits Reset</p>
            <p className="text-lg font-semibold mt-0.5">
              {profile?.credits_reset_at ? new Date(profile.credits_reset_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentPlan === plan.id
          return (
            <Card
              key={plan.id}
              className={`relative bg-card/50 ${plan.popular ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-border'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                <CardDescription>{plan.credits.toLocaleString()} credits/month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="w-full" disabled variant="outline">Current Plan</Button>
                ) : (
                  <Button
                    className={`w-full ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id}
                  >
                    {upgrading === plan.id ? 'Processing...' : (
                      <>Upgrade to {plan.name} <ExternalLink className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ['How do credits work?', 'Credits are consumed per API request. Different endpoints cost different amounts based on complexity.'],
            ['Can I change plans anytime?', 'Yes — upgrades apply immediately. Downgrades take effect at the next billing cycle.'],
            ['What happens when credits run out?', 'API requests are rate-limited until your credits reset at the start of your billing cycle.'],
            ['Do unused credits roll over?', 'No, credits reset each billing period. Use them while they last!'],
          ].map(([q, a]) => (
            <div key={q}>
              <h4 className="font-semibold text-sm mb-1">{q}</h4>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
