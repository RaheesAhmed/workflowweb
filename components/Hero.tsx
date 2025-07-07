'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthModal } from '@/components/AuthModal'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { 
  Sparkles,
  Mic,
  Play,
  ArrowRight,
  Zap,
  CheckCircle,
  Loader2
} from 'lucide-react'

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, loading } = useAuth()

  const handleMainButtonClick = () => {
    if (user) {
      // User is logged in, navigate to dashboard
      window.location.href = '/dashboard'
    } else {
      // User is not logged in, show auth modal
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Launch Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">World's First AI-Powered n8n Workflow Generator</span>
            </div>
            
            {/* Enhanced Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
                Build
              </span>
              {' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                n8n
              </span>
              {' '}
              <span className="bg-gradient-to-r from-slate-50 via-amber-200 to-slate-50 bg-clip-text text-transparent">
                workflows
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-50 via-emerald-200 to-slate-50 bg-clip-text text-transparent">
                with your
              </span>
              {' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                voice
              </span>
            </h1>
            
            {/* Enhanced Subheadline */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The fastest way to create <span className="text-indigo-400 font-semibold">production-ready automation workflows</span>. 
              Just describe what you want, and get a complete{' '}
              <span className="text-emerald-400 font-semibold">n8n workflow</span>{' '}
              ready to import and run.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleMainButtonClick}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 text-lg px-10 py-4 h-auto font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : user ? (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Try Free Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white text-lg px-10 py-4 h-auto font-semibold backdrop-blur-sm group"
              >
                <Play className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
            
            {/* Enhanced Trust Signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-slate-900" />
                </div>
                <span className="text-emerald-400 font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-slate-900" />
                </div>
                <span className="text-emerald-400 font-medium">5 Free Workflows</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-slate-900" />
                </div>
                <span className="text-emerald-400 font-medium">Ready in 30 Seconds</span>
              </div>
            </div>

          </div>
        </div>
        
        {/* Enhanced Stats Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-2">
                  <Zap className="w-8 h-8" />
                  30s
                </div>
                <div className="text-slate-50 font-semibold mb-1">Workflow Creation Time</div>
                <div className="text-sm text-slate-400">From idea to deployment</div>
              </div>
            </div>
            
            <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-2">
                  🔥 500+
                </div>
                <div className="text-slate-50 font-semibold mb-1">n8n Nodes Supported</div>
                <div className="text-sm text-slate-400">Every integration you need</div>
              </div>
            </div>
            
            <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-2">
                  ✨ 100%
                </div>
                <div className="text-slate-50 font-semibold mb-1">Production Ready</div>
                <div className="text-sm text-slate-400">Ready to run instantly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </>
  )
} 