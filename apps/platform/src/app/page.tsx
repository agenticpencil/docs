'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Github } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const { user, loading, signInWithGitHub, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B7355] border-t-transparent"></div>
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F6' }}>
      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">✏️</span>
          <span className="font-semibold text-xl text-[#2D2A26]">AgenticPencil</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-[#8B8680]">
          <a href="https://agenticpencil.com" className="hover:text-[#2D2A26] transition-colors">Product</a>
          <a href="https://docs.agenticpencil.com" className="hover:text-[#2D2A26] transition-colors">API Docs</a>
        </div>
      </nav>

      {/* Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#E8E4DE] p-8" style={{ backgroundColor: '#F5F3EF' }}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#2D2A26] mb-2">Welcome to <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>AgenticPencil</span></h1>
            <p className="text-[#8B8680] text-sm">Sign in to access your AI-powered SEO tools</p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={signInWithGitHub}
              className="w-full h-11 rounded-lg border border-[#E8E4DE] bg-white text-[#2D2A26] hover:bg-[#F5F3EF] transition-all"
              variant="outline"
            >
              <Github className="mr-2.5 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button 
              onClick={signInWithGoogle}
              className="w-full h-11 rounded-lg border border-[#E8E4DE] bg-white text-[#2D2A26] hover:bg-[#F5F3EF] transition-all"
              variant="outline"
            >
              <svg className="mr-2.5 h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-xs text-[#B0AAA2] pt-5">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
