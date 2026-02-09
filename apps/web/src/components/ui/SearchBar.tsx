'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, FileText, BookOpen, Activity, User, ChevronRight } from 'lucide-react'

// Type definitions
type ResultType = 'module' | 'exercise' | 'prompt' | 'wellness'

interface SearchResult {
  type: ResultType
  title: string
  description: string
  url: string
  module?: string
}

const MOCK_RESULTS: SearchResult[] = [
  { type: 'module', title: 'Identity Module', description: 'Discover your authentic self', url: '/dashboard/identity', module: 'identity' },
  { type: 'module', title: 'Emotional Intelligence', description: 'Master your emotions', url: '/dashboard/emotional', module: 'emotional' },
  { type: 'exercise', title: 'Values Clarification', description: 'Exercise to identify core values', url: '/dashboard/identity', module: 'identity' },
  { type: 'prompt', title: 'Gratitude Journal', description: 'Daily gratitude prompt', url: '/dashboard/wellness', module: 'wellness' },
  { type: 'wellness', title: 'Sleep Tracking', description: 'Log your sleep hours', url: '/dashboard/wellness', module: 'wellness' },
]

function getTypeIcon(type: ResultType) {
  switch (type) {
    case 'module': return <FileText className="w-4 h-4" />
    case 'exercise': return <BookOpen className="w-4 h-4" />
    case 'prompt': return <Activity className="w-4 h-4" />
    case 'wellness': return <User className="w-4 h-4" />
  }
}

function getTypeColor(type: ResultType): string {
  switch (type) {
    case 'module': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
    case 'exercise': return 'text-green-500 bg-green-50 dark:bg-green-900/20'
    case 'prompt': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
    case 'wellness': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
  }
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.length > 1) {
      const lowerQuery = searchQuery.toLowerCase()
      const filtered = MOCK_RESULTS.filter((r) => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.module?.toLowerCase().includes(lowerQuery)
      )
      setResults(filtered)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [])

  useEffect(() => {
    handleSearch(query)
  }, [query, handleSearch])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].url
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }, [results, selectedIndex])

  const handleClear = useCallback(() => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search modules, exercises, prompts..."
          className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
        >
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 uppercase">{results.length} results</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, index) => (
              <a
                key={`${result.type}-${result.title}`}
                href={result.url}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                  index === selectedIndex ? 'bg-slate-50 dark:bg-slate-700/50' : ''
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <span className={`p-1.5 rounded ${getTypeColor(result.type)}`}>
                  {getTypeIcon(result.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-sm text-slate-500 truncate">{result.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">↑↓</kbd> to navigate
              <span className="mx-2">·</span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">↵</kbd> to select
              <span className="mx-2">·</span>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">esc</kbd> to close
            </p>
          </div>
        </div>
      )}

      {isOpen && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 text-center z-50">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 dark:text-slate-400">No results found for "{query}"</p>
          <p className="text-sm text-slate-500 mt-1">Try different keywords or browse modules</p>
        </div>
      )}
    </div>
  )
}
