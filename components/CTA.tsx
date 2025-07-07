'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  ArrowRight, 
  Mic,
  Zap,
  CheckCircle
} from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Main CTA Card */}
        <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-12 lg:p-16 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
          {/* Enhanced Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-amber-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative text-center max-w-4xl mx-auto">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-amber-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Ready to Get Started?</span>
            </div>
            
            {/* Enhanced Headline */}
            <h2 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
                Transform your workflow
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-50 via-amber-200 to-slate-50 bg-clip-text text-transparent">
                with
              </span>
              {' '}
              <span className="bg-gradient-to-r from-indigo-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                AI automation
              </span>
            </h2>
            
            {/* Enhanced Subheadline */}
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of teams who've already discovered the power of <span className="text-indigo-400 font-semibold">voice-driven automation</span>. 
              Create your first workflow in under <span className="text-amber-400 font-semibold">30 seconds</span>.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 text-lg px-10 py-4 h-auto font-semibold group"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white text-lg px-10 py-4 h-auto font-semibold backdrop-blur-sm"
              >
                View Demo
              </Button>
            </div>
            
            {/* Enhanced Trust Signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
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
                <span className="text-emerald-400 font-medium">Setup in 2 Minutes</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Quick Start Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-6 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-indigo-500/20 backdrop-blur border border-indigo-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">1. Speak Your Workflow</h3>
              <p className="text-sm text-slate-400">Describe your automation in plain English - no technical knowledge needed</p>
            </div>
          </div>
          
          <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-6 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-amber-500/20 backdrop-blur border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">2. AI Generates Code</h3>
              <p className="text-sm text-slate-400">Our AI creates production-ready n8n workflows with proper error handling</p>
            </div>
          </div>
          
          <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-6 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">3. Deploy & Run</h3>
              <p className="text-sm text-slate-400">Import directly into n8n and start automating your processes instantly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 