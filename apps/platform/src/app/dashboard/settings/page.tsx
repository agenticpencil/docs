'use client'

import { useAuth } from '@/hooks/use-auth'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D2A26]">Settings</h1>
        <p className="text-[#8B8680] text-sm mt-1">Manage your account settings</p>
      </div>

      <div className="rounded-xl border border-[#E8E4DE] p-6" style={{ backgroundColor: '#F5F3EF' }}>
        <h2 className="text-base font-semibold text-[#2D2A26] mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#8B8680]">Email</p>
            <p className="text-sm font-medium text-[#2D2A26] mt-1">{user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-[#8B8680]">User ID</p>
            <p className="text-sm font-mono text-[#5C5750] mt-1">{user?.id || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
