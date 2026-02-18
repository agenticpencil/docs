'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'API Keys', href: '/dashboard/keys', icon: Key },
  { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-card/50 backdrop-blur border-r border-border flex flex-col">
          <div className="p-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                AgenticPencil
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-64">
          <div className="p-8 max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
