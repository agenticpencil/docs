'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getProfile, getApiKeys, getUsageLogs, type ProfileRow, type ApiKeyRow, type UsageLogRow } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { Key, BarChart3, CreditCard, Zap, ArrowRight, Rocket, BookOpen, Terminal } from 'lucide-react'
import { formatDate } from '@/lib/utils'

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

  const hasKeys = keys.length > 0

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-card/50 border-border">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-8 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </p>
      </div>

      {/* Getting Started (no API keys yet) */}
      {!hasKeys && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Get Started with AgenticPencil</CardTitle>
                <CardDescription>Set up your API key to start using our SEO tools</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">1</div>
                <div>
                  <p className="font-medium">Create an API Key</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Generate your first key to authenticate requests</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">2</div>
                <div>
                  <p className="font-medium">Make your first call</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Try the keyword research or content audit endpoint</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">3</div>
                <div>
                  <p className="font-medium">Scale your SEO</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Integrate into your workflow and grow</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Link href="/dashboard/keys">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Key className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </Link>
              <a href="https://docs.agenticpencil.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Docs
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.plan_id || 'Free'}</div>
            <Link href="/dashboard/billing" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mt-1">
              Upgrade <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.credits_used?.toLocaleString() ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resets {profile?.credits_reset_at ? formatDate(profile.credits_reset_at) : 'monthly'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keys.length}</div>
            <Link href="/dashboard/keys" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mt-1">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick code snippet */}
      {hasKeys && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-base">Quick Start</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-black/50 border border-border rounded-lg p-4 text-sm text-emerald-300 overflow-x-auto">
{`curl -X POST https://api.agenticpencil.com/v1/keywords/research \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"keyword": "seo tools", "country": "us"}'`}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {logs.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest API calls</CardDescription>
            </div>
            <Link href="/dashboard/usage">
              <Button variant="ghost" size="sm" className="text-emerald-400">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${log.status_code < 400 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="text-sm font-medium">{log.endpoint}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{log.credits_used} credits</p>
                    <p className="text-xs text-muted-foreground">{log.status_code}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
