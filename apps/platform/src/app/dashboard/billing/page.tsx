'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient, type BillingInfo } from '@/lib/api'
import { formatDate } from '@/lib/utils'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    credits: 10000,
    features: [
      'Keyword Research API',
      'Basic SEO Audits',
      'Email Support',
      'API Documentation',
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    credits: 50000,
    features: [
      'All Starter features',
      'Advanced SEO Audits',
      'Competitor Analysis',
      'Content Optimization',
      'Priority Support',
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    credits: 200000,
    features: [
      'All Professional features',
      'White-label API',
      'Custom Integrations',
      'Dedicated Account Manager',
      'Phone Support',
    ]
  }
]

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    const loadBillingInfo = async () => {
      try {
        const data = await apiClient.getBillingInfo()
        setBilling(data)
      } catch (error) {
        console.error('Error loading billing info:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBillingInfo()
  }, [])

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId)
    try {
      const { checkout_url } = await apiClient.createCheckoutSession(planId)
      window.open(checkout_url, '_blank')
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setUpgrading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Billing</h1>
        <Card>
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing</h1>

      {/* Current Plan Info */}
      {billing && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold capitalize">{billing.current_plan}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">${billing.plan_price}/{billing.billing_cycle}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="text-lg font-semibold">{formatDate(billing.next_billing_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="text-lg font-semibold">{billing.payment_method}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = billing?.current_plan?.toLowerCase() === plan.id
            
            return (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>
                    {plan.credits.toLocaleString()} credits per month
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgrading === plan.id}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {upgrading === plan.id ? (
                        'Processing...'
                      ) : (
                        <>
                          Upgrade to {plan.name}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Billing FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Billing FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">How do credits work?</h4>
            <p className="text-sm text-muted-foreground">
              Credits are consumed based on the complexity of your API requests. Simple keyword lookups consume fewer credits than comprehensive SEO audits.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">What happens if I exceed my credits?</h4>
            <p className="text-sm text-muted-foreground">
              API requests will be rate-limited once you reach your monthly credit limit. Consider upgrading to a higher plan for more credits.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Do unused credits roll over?</h4>
            <p className="text-sm text-muted-foreground">
              Credits reset monthly and do not roll over to the next billing period. Make sure to utilize your allocated credits each month.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}