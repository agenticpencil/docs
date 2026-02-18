'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getProfile, getApiKeys, getUsageLogs, type ProfileRow, type ApiKeyRow, type UsageLogRow } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [keys, setKeys] = useState<ApiKeyRow[]>([])
  const [logs, setLogs] = useState<UsageLogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, k, l] = await Promise.all([getProfile(), getApiKeys(), getUsageLogs(10)])
      setProfile(p)
      setKeys(k)
      setLogs(l)
      setLoading(false)
    }
    load()
  }, [])

  const planLimits: Record<string, number> = { free: 50, starter: 10000, professional: 50000, enterprise: 200000 }
  const creditLimit = planLimits[profile?.plan_id || 'free'] || 50

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[#EDE9E3] rounded w-72 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-[#E8E4DE] p-6 animate-pulse" style={{ backgroundColor: '#F5F3EF' }}>
              <div className="h-4 bg-[#E8E4DE] rounded w-2/3 mb-3" />
              <div className="h-8 bg-[#E8E4DE] rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const userName = user?.email ? user.email.split('@')[0] : ''

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-semibold text-[#2D2A26]">
          {getGreeting()}, {userName}
        </h1>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/keys">
          <Button className="rounded-lg border border-[#D8D4CE] bg-white text-[#2D2A26] hover:bg-[#F5F3EF] shadow-none font-medium text-sm h-10 px-4" variant="outline">
            Create API Key
          </Button>
        </Link>
        <a href="https://docs.agenticpencil.com" target="_blank" rel="noopener noreferrer">
          <Button className="rounded-lg border border-[#D8D4CE] bg-white text-[#2D2A26] hover:bg-[#F5F3EF] shadow-none font-medium text-sm h-10 px-4" variant="outline">
            Read Docs
          </Button>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
          <p className="text-sm text-[#8B8680] mb-1">Plan</p>
          <p className="text-2xl font-bold text-[#2D2A26] capitalize">{profile?.plan_id || 'Free'}</p>
          <Link href="/dashboard/billing" className="text-xs text-[#8B7355] hover:text-[#6B5640] font-medium flex items-center gap-1 mt-2 transition-colors">
            Upgrade <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
          <p className="text-sm text-[#8B8680] mb-1">Credits Used</p>
          <p className="text-2xl font-bold text-[#2D2A26]">
            {(profile?.credits_used ?? 0).toLocaleString()}
            <span className="text-sm font-normal text-[#B0AAA2] ml-1">/ {creditLimit.toLocaleString()}</span>
          </p>
          <p className="text-xs text-[#B0AAA2] mt-2">
            Resets {profile?.credits_reset_at ? formatDate(profile.credits_reset_at) : 'monthly'}
          </p>
        </div>

        <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
          <p className="text-sm text-[#8B8680] mb-1">API Keys</p>
          <p className="text-2xl font-bold text-[#2D2A26]">{keys.length}</p>
          <Link href="/dashboard/keys" className="text-xs text-[#8B7355] hover:text-[#6B5640] font-medium flex items-center gap-1 mt-2 transition-colors">
            Manage <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {logs.length > 0 && (
        <div className="rounded-xl border border-[#E8E4DE]" style={{ backgroundColor: '#F5F3EF' }}>
          <div className="flex items-center justify-between p-6 pb-3">
            <div>
              <h2 className="text-base font-semibold text-[#2D2A26]">Recent Activity</h2>
              <p className="text-sm text-[#B0AAA2]">Latest API calls</p>
            </div>
            <Link href="/dashboard/usage">
              <Button variant="ghost" size="sm" className="text-[#8B8680] hover:text-[#2D2A26] hover:bg-[#EDE9E3]">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="px-6 pb-6">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center justify-between py-3 border-b border-[#E8E4DE] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${log.status_code < 400 ? 'bg-[#7C9A72]' : 'bg-[#C47A6C]'}`} />
                  <div>
                    <p className="text-sm font-medium text-[#2D2A26]">{log.endpoint}</p>
                    <p className="text-xs text-[#B0AAA2]">{formatDate(log.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#5C5750]">{log.credits_used} credits</p>
                  <p className="text-xs text-[#B0AAA2]">{log.status_code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      <div className="rounded-xl border border-[#E8E4DE]" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="p-6">
          <h2 className="text-base font-semibold text-[#2D2A26] mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-sm font-medium text-[#B0AAA2] w-4 shrink-0">1.</span>
              <div>
                <p className="text-sm font-medium text-[#2D2A26]">Create an API key</p>
                <p className="text-sm text-[#8B8680] mt-0.5">
                  Go to <Link href="/dashboard/keys" className="text-[#2D2A26] underline underline-offset-2">API Keys</Link> and generate your first key. Save it securely — it won&apos;t be shown again.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-sm font-medium text-[#B0AAA2] w-4 shrink-0">2.</span>
              <div>
                <p className="text-sm font-medium text-[#2D2A26]">Make your first API call</p>
                <p className="text-sm text-[#8B8680] mt-0.5">
                  Use your key to call any endpoint. Start with{' '}
                  <a href="https://docs.agenticpencil.com/api-reference/keywords-research" target="_blank" rel="noopener noreferrer" className="text-[#2D2A26] underline underline-offset-2">Keyword Research</a>{' '}
                  or{' '}
                  <a href="https://docs.agenticpencil.com/api-reference/content-recommend" target="_blank" rel="noopener noreferrer" className="text-[#2D2A26] underline underline-offset-2">Content Recommendations</a>.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-sm font-medium text-[#B0AAA2] w-4 shrink-0">3.</span>
              <div>
                <p className="text-sm font-medium text-[#2D2A26]">Read the documentation</p>
                <p className="text-sm text-[#8B8680] mt-0.5">
                  Full API reference, authentication guide, and examples at{' '}
                  <a href="https://docs.agenticpencil.com" target="_blank" rel="noopener noreferrer" className="text-[#2D2A26] underline underline-offset-2">docs.agenticpencil.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
