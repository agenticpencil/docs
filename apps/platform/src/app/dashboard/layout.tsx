'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  LogOut,
  User,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getUsage, getProfile, type UsageData } from '@/lib/api'

const navSections = [
  {
    label: 'OVERVIEW',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
      { name: 'Cost & Billing', href: '/dashboard/billing', icon: CreditCard },
    ],
  },
  {
    label: 'MANAGE',
    items: [
      { name: 'API Keys', href: '/dashboard/keys', icon: Key },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (user) {
      getUsage()
        .then(setUsage)
        .catch(async () => {
          const profile = await getProfile()
          if (profile) {
            const planLimits: Record<string, number> = { free: 50, starter: 10000, professional: 50000, enterprise: 200000 }
            setUsage({
              credits_used: profile.credits_used || 0,
              credits_limit: planLimits[profile.plan_id] || 50,
              plan: profile.plan_id || 'free',
            })
          }
        })
    }
  }, [user])

  useEffect(() => {
    if (!user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B7355] border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const sidebarW = collapsed ? 'w-16' : 'w-60'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn('fixed inset-y-0 left-0 flex flex-col border-r border-[#E8E4DE] transition-all duration-200', sidebarW)} style={{ backgroundColor: '#FDFCFA' }}>
          {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-[#E8E4DE]">
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: 'var(--font-serif)' }}>Agentic Pencil</span>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-[#F0EDE8] text-[#8B8680] transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.label}>
                {!collapsed && (
                  <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-[#B0AAA2] uppercase">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                          collapsed && 'justify-center px-2',
                          isActive
                            ? 'bg-[#EDE9E3] text-[#2D2A26] font-medium'
                            : 'text-[#8B8680] hover:text-[#2D2A26] hover:bg-[#F0EDE8]'
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Docs link */}
          {!collapsed && (
            <div className="px-3 pb-2">
              <a
                href="https://docs.agenticpencil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#8B8680] hover:text-[#2D2A26] hover:bg-[#F0EDE8] transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </a>
            </div>
          )}

          {/* Credits bar */}
          {!collapsed && usage && (
            <div className="px-4 py-3 border-t border-[#E8E4DE]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#8B8680]">Credits</span>
                <span className="text-xs text-[#8B8680]">
                  {usage.credits_used.toLocaleString()} / {usage.credits_limit.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-[#EDE9E3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D2A26] rounded-full transition-all"
                  style={{ width: `${Math.min((usage.credits_used / usage.credits_limit) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#B0AAA2] capitalize">{usage.plan} plan</span>
                <Link href="/dashboard/billing" className="text-[10px] text-[#8B7355] hover:text-[#2D2A26]">
                  Upgrade
                </Link>
              </div>
            </div>
          )}

          {/* User section */}
          <div className="border-t border-[#E8E4DE] p-3">
            {!collapsed ? (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-full bg-[#EDE9E3] flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-[#8B7355]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#2D2A26] truncate">{user.email}</p>
                    <p className="text-[10px] text-[#B0AAA2] capitalize">{usage?.plan || 'Free'} plan</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="h-7 w-7 flex-shrink-0 text-[#B0AAA2] hover:text-[#2D2A26] hover:bg-[#F0EDE8]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <button onClick={signOut} className="w-full flex justify-center p-1 text-[#B0AAA2] hover:text-[#2D2A26]" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Footer */}
          {!collapsed && (
            <div className="border-t border-[#E8E4DE] px-4 py-2.5 flex items-center gap-3 text-[10px] text-[#B0AAA2]">
              <a href="#" className="hover:text-[#8B8680] transition-colors">API status</a>
              <span>·</span>
              <a href="#" className="hover:text-[#8B8680] transition-colors">Help & support</a>
              <span>·</span>
              <a href="https://docs.agenticpencil.com" className="hover:text-[#8B8680] transition-colors">Docs</a>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className={cn('flex-1 transition-all duration-200', collapsed ? 'ml-16' : 'ml-60')}>
          <div className="p-8 max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
