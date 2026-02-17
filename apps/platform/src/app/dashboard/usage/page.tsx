'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiClient, type UsageLog, type UsageStats } from '@/lib/api'
import { formatDate, formatBytes } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['hsl(var(--primary))', 'hsl(142.1 76.2% 50%)', 'hsl(47 96% 53%)', 'hsl(215 78% 54%)']

export default function UsagePage() {
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, statsData] = await Promise.all([
          apiClient.getUsageLogs(50),
          apiClient.getUsageStats()
        ])
        setUsageLogs(logsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading usage data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getEndpointBreakdown = () => {
    const breakdown: Record<string, number> = {}
    usageLogs.forEach(log => {
      if (breakdown[log.endpoint]) {
        breakdown[log.endpoint] += log.credits_consumed
      } else {
        breakdown[log.endpoint] = log.credits_consumed
      }
    })

    return Object.entries(breakdown)
      .map(([endpoint, credits]) => ({ endpoint, credits }))
      .sort((a, b) => b.credits - a.credits)
  }

  const pieChartData = getEndpointBreakdown().slice(0, 4)

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Usage</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Usage</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.credits_used.toLocaleString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.credits_remaining.toLocaleString()} remaining` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.usage_this_month.toLocaleString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Credits consumed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.api_calls_today.toLocaleString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage by Endpoint</CardTitle>
            <CardDescription>Credit consumption breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="credits"
                      label={({ endpoint, percent }) => `${endpoint} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                No usage data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Usage</CardTitle>
            <CardDescription>Latest API calls and credit consumption</CardDescription>
          </CardHeader>
          <CardContent>
            {usageLogs.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {usageLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium text-sm">{log.endpoint}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{log.credits_consumed} credits</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(log.request_size + log.response_size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No usage logs found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Logs</CardTitle>
          <CardDescription>Complete history of your API usage</CardDescription>
        </CardHeader>
        <CardContent>
          {usageLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Size</TableHead>
                  <TableHead>Response Size</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.endpoint}</TableCell>
                    <TableCell>{log.credits_consumed}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatBytes(log.request_size)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatBytes(log.response_size)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No usage logs found. Start using the API to see your activity here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}