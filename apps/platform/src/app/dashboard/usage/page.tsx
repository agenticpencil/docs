'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getProfile, getUsageLogs, type ProfileRow, type UsageLogRow } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Download } from 'lucide-react'

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

  const planLimits: Record<string, number> = { free: 50, starter: 10000, professional: 50000, enterprise: 200000 }
  const creditLimit = planLimits[profile?.plan_id || 'free'] || 50
  const creditsUsed = profile?.credits_used ?? 0
  const creditsRemaining = Math.max(creditLimit - creditsUsed, 0)
  const totalCalls = logs.length

  // Build daily usage for bar chart (last 14 days)
  const dailyUsage: Record<string, number> = {}
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dailyUsage[d.toISOString().split('T')[0]] = 0
  }
  logs.forEach(log => {
    const day = new Date(log.created_at).toISOString().split('T')[0]
    if (dailyUsage[day] !== undefined) dailyUsage[day] += log.credits_used
  })
  const dailyEntries = Object.entries(dailyUsage)
  const maxDaily = Math.max(...Object.values(dailyUsage), 1)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[#EDE9E3] rounded w-32 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-[#E8E4DE] p-6 animate-pulse" style={{ backgroundColor: '#F5F3EF' }}>
              <div className="h-4 bg-[#E8E4DE] rounded w-1/2 mb-3" />
              <div className="h-8 bg-[#E8E4DE] rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D2A26]">Usage</h1>
          <p className="text-[#8B8680] text-sm mt-1">Monitor your API consumption and activity</p>
        </div>
        <Button variant="outline" className="rounded-lg border-[#E8E4DE] bg-[#F5F3EF] text-[#5C5750] hover:bg-[#EDE9E3] shadow-none text-sm h-9 px-4">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Big stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
          <p className="text-sm text-[#8B8680] mb-2">Credits Used</p>
          <p className="text-3xl font-bold text-[#2D2A26]">{creditsUsed.toLocaleString()}</p>
          <p className="text-xs text-[#B0AAA2] mt-1">This billing period</p>
        </div>
        <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
          <p className="text-sm text-[#8B8680] mb-2">Total API Calls</p>
          <p className="text-3xl font-bold text-[#2D2A26]">{totalCalls.toLocaleString()}</p>
          <p className="text-xs text-[#B0AAA2] mt-1">Recent requests</p>
        </div>
        <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
          <p className="text-sm text-[#8B8680] mb-2">Credits Remaining</p>
          <p className="text-3xl font-bold text-[#2D2A26]">{creditsRemaining.toLocaleString()}</p>
          <p className="text-xs text-[#B0AAA2] mt-1">of {creditLimit.toLocaleString()} total</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#EDE9E3] text-[#5C5750] border border-[#E8E4DE]">
          All API keys
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#EDE9E3] text-[#5C5750] border border-[#E8E4DE]">
          All Endpoints
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#EDE9E3] text-[#5C5750] border border-[#E8E4DE]">
          Last 14 days
        </span>
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
        <h2 className="text-base font-semibold text-[#2D2A26] mb-6">Daily Usage</h2>
        <div className="flex items-end gap-1.5 h-40">
          {dailyEntries.map(([date, val]) => {
            const pct = (val / maxDaily) * 100
            const dayLabel = new Date(date + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full relative" style={{ height: '128px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-[#D4A574] hover:bg-[#C4956A] transition-colors"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                    title={`${dayLabel}: ${val} credits`}
                  />
                </div>
                <span className="text-[9px] text-[#B0AAA2] leading-none hidden md:block">
                  {new Date(date + 'T00:00:00').getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent API Calls table */}
      <div className="rounded-xl border border-[#E8E4DE]" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="p-6 pb-3">
          <h2 className="text-base font-semibold text-[#2D2A26]">Recent API Calls</h2>
          <p className="text-sm text-[#B0AAA2] mt-1">Your latest requests</p>
        </div>
        <div className="px-6 pb-6">
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E8E4DE] hover:bg-transparent">
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Endpoint</TableHead>
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Credits</TableHead>
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id} className="border-[#E8E4DE] hover:bg-[#EDE9E3]/50 transition-colors">
                    <TableCell className="font-medium text-[#2D2A26]">{log.endpoint}</TableCell>
                    <TableCell className="text-[#5C5750]">{log.credits_used}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        log.status_code < 400 ? 'text-[#7C9A72]' : 'text-[#C47A6C]'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${log.status_code < 400 ? 'bg-[#7C9A72]' : 'bg-[#C47A6C]'}`} />
                        {log.status_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#B0AAA2]">{formatDate(log.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <h3 className="font-medium text-[#2D2A26] mb-1">No usage logs yet</h3>
              <p className="text-sm text-[#B0AAA2]">Start making API calls to see activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
