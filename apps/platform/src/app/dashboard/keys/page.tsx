'use client'

import { useEffect, useState } from 'react'
import { Copy, Plus, Trash2, Key, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

  useEffect(() => {
    loadKeys()
  }, [])

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
        <h1 className="text-3xl font-bold">API Keys</h1>
        <Card className="bg-card/50 border-border">
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-2/3 mt-2" />
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-1">Manage your API authentication keys</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                A new API key will be generated for your account ({user?.email}).
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating} className="bg-emerald-600 hover:bg-emerald-700">
                {creating ? 'Creating...' : 'Generate Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Keep your keys secure. Never share them publicly or commit them to source control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-muted-foreground mb-4">No API keys yet</p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Create your first API key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Key Prefix</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id} className="border-border">
                    <TableCell>
                      <code className="text-sm bg-black/30 px-2 py-1 rounded text-emerald-300">
                        {key.key_prefix}••••••••
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(key.created_at)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-400"
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
        </CardContent>
      </Card>

      {/* New key reveal dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>🎉 API Key Created</DialogTitle>
            <DialogDescription>
              Copy your key now — it won't be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-black/40 border border-border rounded-lg">
              <code className="text-sm text-emerald-300 break-all">{newApiKey}</code>
            </div>
            <Button
              onClick={() => copyToClipboard(newApiKey)}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
