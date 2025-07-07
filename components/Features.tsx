'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  Brain, 
  Rocket, 
  Zap,
  CheckCircle,
  Globe
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Mic,
      title: "Voice-First Interface",
      description: "Describe complex workflows naturally in 29+ languages. No coding required, just speak your automation needs and watch them come to life instantly.",
      badge: "29+ Languages",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
      borderColor: "border-indigo-500/30",
      hoverColor: "hover:border-indigo-500/30",
      gradientFrom: "from-indigo-500/5",
      gradientTo: "to-purple-500/5"
    },
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "WorkFlow AI creates production-ready n8n workflows with proper error handling, data validation, and enterprise-grade security best practices.",
      badge: "Production-Ready Quality",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
      hoverColor: "hover:border-amber-500/30",
      gradientFrom: "from-amber-500/5",
      gradientTo: "to-orange-500/5"
    },
    {
      icon: Rocket,
      title: "Instant Deployment",
      description: "Automatically deploy and activate workflows in your n8n instance with one click. Test, validate, and go live in seconds with zero friction.",
      badge: "One-Click Deployment",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
      hoverColor: "hover:border-emerald-500/30",
      gradientFrom: "from-emerald-500/5",
      gradientTo: "to-teal-500/5"
    },
    {
      icon: Zap,
      title: "MCP Integration",
      description: "Connect your Remote MCP Server and unlock advanced development capabilities with seamless n8n workflow integration and real-time synchronization.",
      badge: "Advanced Integration",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      hoverColor: "hover:border-purple-500/30",
      gradientFrom: "from-purple-500/5",
      gradientTo: "to-pink-500/5"
    }
  ]

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-amber-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Our Features</span>
          </div>
          
          <h2 className="text-5xl xl:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
              Everything you need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
              automate
            </span>
            {' '}
            <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
              with
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              confidence
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            WorkFlow AI combines the power of <span className="text-indigo-400 font-semibold">voice commands</span>, artificial intelligence, and enterprise-grade 
            automation to deliver the most <span className="text-amber-400 font-semibold">intuitive workflow creation</span> experience ever built.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 ${feature.hoverColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${feature.color.split('-')[1]}-500/10`}
            >
              {/* Enhanced Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative">
                <div className="flex items-start space-x-4">
                  {/* Enhanced Icon */}
                  <div className={`w-14 h-14 ${feature.bgColor} backdrop-blur border ${feature.borderColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-50 group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className={`inline-flex items-center gap-2 ${feature.bgColor} backdrop-blur border ${feature.borderColor} rounded-full px-3 py-1`}>
                        <div className={`w-1.5 h-1.5 ${feature.color.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                        <span className={`${feature.color} text-xs font-medium`}>
                          {feature.badge}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-6 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-indigo-500/20 backdrop-blur border border-indigo-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-50 mb-2">Multi-Language Support</h4>
              <p className="text-sm text-slate-400">Speak in any of 29+ languages and get perfect workflows every time</p>
            </div>
          </div>
          
          <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-6 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-amber-500/20 backdrop-blur border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-50 mb-2">Error Handling</h4>
              <p className="text-sm text-slate-400">Built-in error handling and validation ensures robust workflows</p>
            </div>
          </div>
          
          <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-6 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-50 mb-2">Real-Time Sync</h4>
              <p className="text-sm text-slate-400">Instant synchronization with your n8n instance for seamless integration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 