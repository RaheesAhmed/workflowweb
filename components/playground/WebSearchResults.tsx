'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  ExternalLink, 
  Globe,
  Clock,
  Eye
} from 'lucide-react'

interface WebSearchResult {
  type: 'web_search_result'
  url: string
  title: string
  page_age?: string
  encrypted_content?: string
}

interface WebSearchQuery {
  query: string
  results: WebSearchResult[]
  timestamp?: Date
}

interface WebSearchResultsProps {
  searchQueries: WebSearchQuery[]
  className?: string
}

export function WebSearchResults({ searchQueries, className = '' }: WebSearchResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedQueries, setExpandedQueries] = useState<Set<number>>(new Set())

  if (!searchQueries || searchQueries.length === 0) {
    return null
  }

  const totalResults = searchQueries.reduce((acc, query) => acc + query.results.length, 0)
  const uniqueUrls = new Set(searchQueries.flatMap(query => query.results.map(r => r.url)))

  const toggleQueryExpansion = (index: number) => {
    const newExpanded = new Set(expandedQueries)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedQueries(newExpanded)
  }

  return (
    <Card className={`bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm ${className}`}>
      <CardContent className="p-3 md:p-4">
        {/* Header with toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 p-0 h-auto hover:bg-transparent text-blue-300 hover:text-blue-200"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Search className="w-4 h-4" />
            <span className="font-semibold text-sm">Web Search Results</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              {searchQueries.length} {searchQueries.length === 1 ? 'query' : 'queries'}
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              {uniqueUrls.size} {uniqueUrls.size === 1 ? 'site' : 'sites'}
            </Badge>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-3">
            {searchQueries.map((searchQuery, queryIndex) => (
              <div key={queryIndex} className="border border-blue-500/20 rounded-lg overflow-hidden">
                {/* Query Header */}
                <div 
                  className="bg-blue-500/10 p-3 cursor-pointer hover:bg-blue-500/15 transition-colors"
                  onClick={() => toggleQueryExpansion(queryIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {expandedQueries.has(queryIndex) ? (
                        <ChevronDown className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      )}
                      <Search className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-blue-200 truncate">
                        "{searchQuery.query}"
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs h-5">
                        {searchQuery.results.length} results
                      </Badge>
                      {searchQuery.timestamp && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {searchQuery.timestamp.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Query Results */}
                {expandedQueries.has(queryIndex) && (
                  <div className="p-3 space-y-2 bg-slate-800/30">
                    {searchQuery.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg hover:bg-blue-500/10 transition-colors group">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                          <Globe className="w-4 h-4 text-blue-300" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-200 text-sm font-medium line-clamp-2 group-hover:underline transition-colors"
                                title={result.title}
                              >
                                {result.title}
                              </a>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-1" title={result.url}>
                                {result.url}
                              </p>
                              {result.page_age && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span className="text-xs text-slate-400">
                                    Updated: {result.page_age}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/20"
                            >
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                title="Open link"
                              >
                                <ExternalLink className="w-3 h-3 text-blue-400" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary when collapsed */}
        {!isExpanded && (
          <div className="mt-2 text-xs text-slate-400">
            Click to view {totalResults} search results from {uniqueUrls.size} websites
          </div>
        )}
      </CardContent>
    </Card>
  )
}
