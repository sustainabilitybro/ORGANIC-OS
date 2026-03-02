'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Spinner } from '@/components/design-system'
import { Star, GitFork, Eye, AlertCircle, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'

interface Repo {
  name: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  url: string
  updated_at: string
  open_issues: number
  watchers: number
  topics: string[]
  recent_commits: Commit[]
}

interface Commit {
  sha: string
  message: string
  author: string
  date: string
}

interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  head_branch: string
  head_sha: string
  run_number: number
  event: string
  created_at: string
  actor: string
}

interface Issue {
  id: number
  number: number
  title: string
  state: string
  user: string
  labels: string[]
  comments: number
  created_at: string
  repo: string
}

export default function GitHubDashboard() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'issues'>('overview')

  useEffect(() => {
    async function fetchData() {
      try {
        const [reposRes, workflowsRes, issuesRes] = await Promise.all([
          fetch('/api/github/repos'),
          fetch('/api/github/actions'),
          fetch('/api/github/issues')
        ])

        if (!reposRes.ok || !workflowsRes.ok || !issuesRes.ok) {
          throw new Error('Failed to fetch GitHub data')
        }

        const reposData = await reposRes.json()
        const workflowsData = await workflowsRes.json()
        const issuesData = await issuesRes.json()

        setRepos(reposData.repos || [])
        setWorkflows(workflowsData.workflow_runs || [])
        setIssues(issuesData.issues || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Card className="p-8 max-w-md">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Error Loading Data</h2>
          </div>
          <p className="mt-4 text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0)
  const totalForks = repos.reduce((sum, r) => sum + r.forks, 0)

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3A3226]">GitHub Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your open-source projects</p>
          </div>
          <a
            href="https://github.com/sustainabilitybro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#6B7F3B] hover:underline"
          >
            @sustainabilitybro
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Stars</p>
                <p className="text-2xl font-bold">{totalStars}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <GitFork className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Forks</p>
                <p className="text-2xl font-bold">{totalForks}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold">{issues.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {(['overview', 'workflows', 'issues'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium capitalize ${
                activeTab === tab
                  ? 'text-[#6B7F3B] border-b-2 border-[#6B7F3B]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <Card key={repo.name} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-[#3A3226]">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#6B7F3B]"
                    >
                      {repo.name}
                    </a>
                  </h3>
                  {repo.language && (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {repo.language}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                  {repo.description || 'No description'}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" /> {repo.forks}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {repo.watchers}
                  </span>
                </div>
                {repo.recent_commits && repo.recent_commits.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Latest commit</p>
                    <div className="text-sm">
                      <p className="font-mono text-[#6B7F3B]">
                        {repo.recent_commits[0].sha}
                      </p>
                      <p className="text-gray-600 truncate">
                        {repo.recent_commits[0].message}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-4">
            {workflows.map((run) => (
              <Card key={run.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {run.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-500" />
                  ) : run.conclusion === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : run.conclusion === 'failure' ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">{run.name}</p>
                    <p className="text-sm text-gray-500">
                      {run.head_branch} • #{run.run_number} • {run.event}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(run.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">by {run.actor}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">
                      <a
                        href={`https://github.com/sustainabilitybro/${issue.repo}/issues/${issue.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#6B7F3B]"
                      >
                        {issue.title}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      #{issue.number} opened by {issue.user} in {issue.repo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.labels.map((label) => (
                      <span
                        key={label}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
