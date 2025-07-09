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
      gradient: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/30",
      iconBg: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      icon: Database,
      title: "Drive → Dropbox", 
      description: "Auto backup files between clouds",
      prompt: "Build an automation that backs up new files from Google Drive to Dropbox",
      gradient: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/30",
      iconBg: "from-emerald-500 to-teal-500"
    },
    {
      id: 3,
      icon: Share2,
      title: "Blog → Social",
      description: "Auto-post to all social platforms",
      prompt: "Create a workflow that posts new blog articles to all my social media accounts",
      gradient: "from-purple-500/10 to-pink-500/10", 
      border: "border-purple-500/30",
      iconBg: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-slate-200 mb-2">
          🚀 Popular Automations
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Click any card to start building your workflow
        </p>
      </div>

      {/* Solution Cards - Responsive Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl w-full">
          {solutions.map((solution) => {
            const Icon = solution.icon
            return (
              <Card 
                key={solution.id} 
                className={`bg-gradient-to-br ${solution.gradient} border ${solution.border} backdrop-blur-sm hover:border-opacity-70 hover:scale-105 transition-all duration-300 cursor-pointer group w-full`}
                onClick={() => onSelectSolution(solution.prompt)}
              >
                <CardContent className="p-3 md:p-4 text-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${solution.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-slate-200 mb-1 md:mb-2 group-hover:text-white transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2 md:mb-3 leading-relaxed">
                    {solution.description}
                  </p>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="w-full h-7 md:h-8 text-xs md:text-sm text-slate-400 hover:text-white hover:bg-white/10 group-hover:bg-white/20"
                  >
                    Try Now
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-4 md:mt-6">
        <p className="text-xs text-slate-500">
          Or describe your own automation below ↓
        </p>
      </div>
    </div>
  )
} 