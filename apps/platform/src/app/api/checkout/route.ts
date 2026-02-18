import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

function getStripe() {
  const Stripe = require('stripe')
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

const PRICES: Record<string, { priceId: string; name: string }> = {
  starter: { priceId: 'price_1T2CHQHIkE0hxXXIlKXtmAaM', name: 'Starter' },
  professional: { priceId: 'price_1T2CHRHIkE0hxXXICt637EFs', name: 'Professional' },
  enterprise: { priceId: 'price_1T2CHRHIkE0hxXXIGmLvKbWh', name: 'Enterprise' },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const planId = body.plan_id

    const priceInfo = PRICES[planId]
    if (!priceInfo) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get authenticated user from Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Can't set cookies in some contexts
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .eq('email', user.email)
      .single()

    const stripe = getStripe()
    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: profile?.id || user.id },
      })
      customerId = customer.id
      if (profile) {
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', profile.id)
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceInfo.priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/dashboard/billing?cancelled=true`,
      metadata: { user_id: profile?.id || user.id, plan: planId },
    })

    return NextResponse.json({ checkout_url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 })
  }
}
