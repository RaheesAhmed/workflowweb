'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Database, 
  Share2,
  ArrowRight,
  Zap,
  Clock
} from 'lucide-react'

interface WelcomeProps {
  onSelectSolution: (prompt: string) => void
}

export function Welcome({ onSelectSolution }: WelcomeProps) {
  const solutions = [
    {
      id: 1,
      icon: Mail,
      title: "Email → Slack",
      description: "Get Slack alerts for important emails",
      prompt: "Create a workflow that sends me a Slack notification when I receive important emails",
      iconColor: "text-blue-400",
      hoverColor: "hover:bg-blue-500/10"
    },
    {
      id: 2,
      icon: Database,
      title: "Drive → Dropbox", 
      description: "Auto backup files between clouds",
      prompt: "Build an automation that backs up new files from Google Drive to Dropbox",
      iconColor: "text-emerald-400",
      hoverColor: "hover:bg-emerald-500/10"
    },
    {
      id: 3,
      icon: Share2,
      title: "Blog → Social",
      description: "Auto-post to all social platforms",
      prompt: "Create a workflow that posts new blog articles to all my social media accounts",
      iconColor: "text-purple-400",
      hoverColor: "hover:bg-purple-500/10"
    },
    {
      id: 4,
      icon: Clock,
      title: "Task Scheduler",
      description: "Schedule tasks and reminders",
      prompt: "Create a workflow that schedules recurring tasks and sends me reminders",
      iconColor: "text-amber-400",
      hoverColor: "hover:bg-amber-500/10"
    },
    {
      id: 5,
      icon: Zap,
      title: "API Integrations",
      description: "Connect different services",
      prompt: "Build a workflow that integrates multiple APIs to automate data syncing",
      iconColor: "text-indigo-400",
      hoverColor: "hover:bg-indigo-500/10"
    }
  ]

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      {/* Compact Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-200 mb-1">
          Get Started with Popular Workflows
        </h2>
        <p className="text-sm text-slate-400">
          Click to try or describe your own automation below
        </p>
      </div>

      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        {solutions.map((solution) => {
          const Icon = solution.icon
          return (
            <button
              key={solution.id}
              onClick={() => onSelectSolution(solution.prompt)}
              className={`p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 ${solution.hoverColor} transition-all duration-200 text-left group hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-1.5 rounded-md bg-slate-700/50 ${solution.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-slate-200 text-sm group-hover:text-white transition-colors">
                  {solution.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {solution.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Or Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs text-slate-500 bg-slate-900">or</span>
        </div>
      </div>

      {/* Custom Input Hint */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          Describe your automation idea in your own words
        </p>
      </div>
    </div>
  )
}
