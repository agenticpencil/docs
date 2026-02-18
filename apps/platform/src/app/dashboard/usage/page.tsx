'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getProfile, getUsageLogs, type ProfileRow, type UsageLogRow } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { BarChart3, Zap, Activity } from 'lucide-react'

export default function UsagePage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [logs, setLogs] = useState<UsageLogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [p, l] = await Promise.all([getProfile(), getUsageLogs(100)])
      setProfile(p)
      setLogs(l)
      setLoading(false)
    }
    load()
  }, [])

  // Endpoint breakdown
  const breakdown: Record<string, { calls: number; credits: number }> = {}
  logs.forEach(log => {
    if (!breakdown[log.endpoint]) breakdown[log.endpoint] = { calls: 0, credits: 0 }
    breakdown[log.endpoint].calls++
    breakdown[log.endpoint].credits += log.credits_used
  })
  const endpointList = Object.entries(breakdown)
    .map(([endpoint, data]) => ({ endpoint, ...data }))
    .sort((a, b) => b.credits - a.credits)

  const totalCreditsFromLogs = logs.reduce((s, l) => s + l.credits_used, 0)
  const successRate = logs.length > 0
    ? Math.round((logs.filter(l => l.status_code < 400).length / logs.length) * 100)
    : 100

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Usage</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-card/50 border-border">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-1/3 mt-2" />
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
        <h1 className="text-3xl font-bold">Usage</h1>
        <p className="text-muted-foreground mt-1">Monitor your API consumption and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total API Calls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Recent requests</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {logs.filter(l => l.status_code >= 400).length} errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint breakdown */}
      {endpointList.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-base">Usage by Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {endpointList.map(({ endpoint, calls, credits }) => {
              const pct = totalCreditsFromLogs > 0 ? (credits / totalCreditsFromLogs) * 100 : 0
              return (
                <div key={endpoint}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{endpoint}</span>
                    <span className="text-muted-foreground">{calls} calls · {credits} credits</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Logs table */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-base">Recent API Calls</CardTitle>
          <CardDescription>Your latest requests</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id} className="border-border">
                    <TableCell className="font-medium">{log.endpoint}</TableCell>
                    <TableCell>{log.credits_used}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        log.status_code < 400
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}>
                        {log.status_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(log.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No usage logs yet. Start making API calls to see activity here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
