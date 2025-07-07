'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles
} from 'lucide-react'

export default function Hero() {

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh-bg opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Launch Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300">
            <Sparkles className="w-4 h-4 mr-2" />
            World's First AI-Powered n8n Workflow Generator
          </Badge>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold  mb-4 leading-tight">
            Build{' '}
            <span className="text-gradient-ai animate-shimmer">
              n8n
            </span>{' '}
            workflows
            <br />
            with your{' '}
            <span className="text-gradient-ai animate-shimmer">
              voice
            </span>
          </h1>
          

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            The fastest way to create production-ready automation workflows. 
            Just describe what you want, and get a complete{' '}
            <span className="text-emerald-400 font-semibold">n8n workflow</span>{' '}
            ready to import and run.
          </p>
          

          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="btn-premium text-lg px-10 py-4 h-auto font-semibold"
            >
              🎤 Try Free Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white text-lg px-10 py-4 h-auto font-semibold"
            >
              🎬 View Demo
            </Button>
          </div>
          
          {/* Trust Signals */}
          <div className="flex items-center justify-center gap-6 mb-12 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              No Credit Card Required
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              5 Free Workflows
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Ready in 30 Seconds
            </div>
          </div>

        </div>
      </div>
      
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="card-glass text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="text-3xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">⚡ 30s</div>
              <div className="text-gray-300 font-medium">Workflow Creation Time</div>
              <div className="text-sm text-gray-400 mt-1">From idea to deployment</div>
            </CardContent>
          </Card>
          
          <Card className="card-glass text-center hover:border-primary-500/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="text-3xl font-bold text-primary-400 mb-2 group-hover:scale-110 transition-transform duration-300">🔥 500+</div>
              <div className="text-gray-300 font-medium">n8n Nodes Supported</div>
              <div className="text-sm text-gray-400 mt-1">Every integration you need</div>
            </CardContent>
          </Card>
          
          <Card className="card-glass text-center hover:border-accent-500/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="text-3xl font-bold text-accent-400 mb-2 group-hover:scale-110 transition-transform duration-300">✨ 100%</div>
              <div className="text-gray-300 font-medium">Production Ready</div>
              <div className="text-sm text-gray-400 mt-1">Import and run instantly</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 