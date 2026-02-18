'use client'

import { useEffect, useState } from 'react'
import { Copy, Plus, Trash2, Key, AlertCircle, CheckCircle2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getApiKeys, deactivateApiKey, registerApiKey, type ApiKeyRow } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { formatDate } from '@/lib/utils'

export default function ApiKeysPage() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newApiKey, setNewApiKey] = useState('')
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { loadKeys() }, [])

  const loadKeys = async () => {
    const keys = await getApiKeys()
    setApiKeys(keys)
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!user?.email) return
    setCreating(true)
    setError('')
    try {
      const result = await registerApiKey(user.email)
      setNewApiKey(result.api_key)
      setShowCreateDialog(false)
      setShowNewKeyDialog(true)
      await loadKeys()
    } catch (err: any) {
      setError(err.message || 'Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (keyId: string) => {
    const ok = await deactivateApiKey(keyId)
    if (ok) setApiKeys(prev => prev.filter(k => k.id !== keyId))
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[#EDE9E3] rounded w-48 animate-pulse" />
        <div className="rounded-xl border border-[#E8E4DE] p-6 animate-pulse" style={{ backgroundColor: '#F5F3EF' }}>
          <div className="h-6 bg-[#E8E4DE] rounded w-1/4" />
          <div className="h-4 bg-[#E8E4DE] rounded w-2/3 mt-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#2D2A26]">API Keys</h1>
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-xs font-medium bg-[#EDE9E3] text-[#8B8680]">
            {apiKeys.length}
          </span>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-lg bg-[#2D2A26] hover:bg-[#3D3A36] text-[#FAF9F6] shadow-none text-sm h-9 px-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Key
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl border-[#E8E4DE]" style={{ backgroundColor: '#FAF9F6' }}>
            <DialogHeader>
              <DialogTitle className="text-[#2D2A26]">Create New API Key</DialogTitle>
              <DialogDescription className="text-[#8B8680]">
                A new API key will be generated for your account ({user?.email}).
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="flex items-center gap-2 text-[#C47A6C] text-sm bg-[#F5EDEB] border border-[#E8D5D0] rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={creating} className="border-[#E8E4DE] text-[#5C5750] hover:bg-[#F0EDE8]">
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating} className="bg-[#2D2A26] hover:bg-[#3D3A36] text-[#FAF9F6]">
                {creating ? 'Creating...' : 'Generate Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-[#8B8680] text-sm -mt-3">Manage your API authentication keys</p>

      <div className="rounded-xl border border-[#E8E4DE]" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="p-6 pb-3">
          <h2 className="text-base font-semibold text-[#2D2A26]">Your API Keys</h2>
          <p className="text-sm text-[#B0AAA2] mt-1">Keep your keys secure. Never share them publicly.</p>
        </div>
        <div className="px-6 pb-6">
          {apiKeys.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-[#EDE9E3] flex items-center justify-center mx-auto mb-5">
                <Key className="h-7 w-7 text-[#B0AAA2]" />
              </div>
              <h3 className="font-medium text-[#2D2A26] mb-1">No API keys yet</h3>
              <p className="text-sm text-[#B0AAA2] mb-6 max-w-xs mx-auto">Create your first API key to start authenticating requests</p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-[#2D2A26] hover:bg-[#3D3A36] text-[#FAF9F6] shadow-none">
                <Plus className="mr-2 h-4 w-4" />
                Create your first API key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E8E4DE] hover:bg-transparent">
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Key</TableHead>
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Created At</TableHead>
                  <TableHead className="text-[#8B8680] font-medium text-xs uppercase tracking-wider">Last Used At</TableHead>
                  <TableHead className="w-[80px] text-[#8B8680] font-medium text-xs uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id} className="border-[#E8E4DE] hover:bg-[#EDE9E3]/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-[#5C5750]">
                          {key.key_prefix}••••••••
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5750]">
                        <span className="h-2 w-2 rounded-full bg-[#8B6FC0]" />
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-[#8B8680]">
                      {formatDate(key.created_at)}
                    </TableCell>
                    <TableCell className="text-sm text-[#B0AAA2]">
                      —
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#B0AAA2] hover:text-[#C47A6C] hover:bg-[#F5EDEB] rounded-lg"
                        onClick={() => handleRevoke(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* New key reveal dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="rounded-xl border-[#E8E4DE]" style={{ backgroundColor: '#FAF9F6' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#2D2A26]">
              <CheckCircle2 className="h-5 w-5 text-[#7C9A72]" />
              API Key Created
            </DialogTitle>
            <DialogDescription className="text-[#8B8680]">
              Copy your key now — it won&apos;t be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-[#EDE9E3] border border-[#E8E4DE] rounded-xl">
              <code className="text-sm font-mono break-all text-[#2D2A26]">{newApiKey}</code>
            </div>
            <Button onClick={() => copyToClipboard(newApiKey)} className={`w-full ${copied ? 'bg-[#7C9A72] hover:bg-[#6B8862]' : 'bg-[#2D2A26] hover:bg-[#3D3A36]'} text-[#FAF9F6]`}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewKeyDialog(false)} className="border-[#E8E4DE] text-[#5C5750] hover:bg-[#F0EDE8]">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
