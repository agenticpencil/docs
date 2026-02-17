'use client'

import { useEffect, useState } from 'react'
import { Eye, Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiClient, type ApiResult } from '@/lib/api'
import { formatDate, truncateString } from '@/lib/utils'

export default function ResultsPage() {
  const [results, setResults] = useState<ApiResult[]>([])
  const [filteredResults, setFilteredResults] = useState<ApiResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResult, setSelectedResult] = useState<ApiResult | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await apiClient.getResults(100)
        setResults(data)
        setFilteredResults(data)
      } catch (error) {
        console.error('Error loading results:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = results.filter(result =>
        result.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.result_type.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredResults(filtered)
    } else {
      setFilteredResults(results)
    }
  }, [searchTerm, results])

  const downloadResult = (result: ApiResult) => {
    const dataStr = JSON.stringify(result.result_data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${result.result_type}_${result.id}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getResultPreview = (resultData: any) => {
    if (typeof resultData === 'object' && resultData !== null) {
      // Handle common result structures
      if (resultData.keywords && Array.isArray(resultData.keywords)) {
        return `Keywords: ${resultData.keywords.slice(0, 3).join(', ')}${resultData.keywords.length > 3 ? '...' : ''}`
      }
      if (resultData.score) {
        return `Score: ${resultData.score}${resultData.issues ? ` (${resultData.issues.length} issues)` : ''}`
      }
      if (resultData.summary) {
        return truncateString(resultData.summary, 100)
      }
      // Generic object preview
      const keys = Object.keys(resultData).slice(0, 3)
      return `${keys.join(', ')}${Object.keys(resultData).length > 3 ? '...' : ''}`
    }
    return truncateString(String(resultData), 100)
  }

  const getResultTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'keyword_research':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'seo_audit':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'content_analysis':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'competitor_analysis':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Results</h1>
        <Card>
          <CardHeader className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Results</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      {/* Results Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.reduce((sum, r) => sum + r.credits_used, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Results</CardTitle>
          <CardDescription>
            View and download results from your API calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultTypeColor(result.result_type)}`}>
                        {result.result_type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{result.endpoint}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {getResultPreview(result.result_data)}
                      </p>
                    </TableCell>
                    <TableCell>{result.credits_used}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(result.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedResult(result)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {result.result_type.replace('_', ' ')} Result
                              </DialogTitle>
                              <DialogDescription>
                                {result.endpoint} - {formatDate(result.created_at)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                {JSON.stringify(result.result_data, null, 2)}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => downloadResult(result)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              {searchTerm ? (
                <p className="text-muted-foreground">
                  No results found for "{searchTerm}"
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No results found. Start using the API to see your results here.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}