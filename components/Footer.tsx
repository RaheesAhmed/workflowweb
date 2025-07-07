'use client'

import { Logo } from './Logo'
import Link from 'next/link'
import { 
  ExternalLink
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-slate-900/50 border-t border-slate-700/50">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Enhanced Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Logo size={32} className="interactive-scale" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">WorkFlow AI</h3>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              The world's first <span className="text-indigo-400 font-semibold">AI-powered n8n workflow generator</span>. Create production-ready automations 
              with just your voice - <span className="text-amber-400 font-semibold">no coding required</span>.
            </p>
            
          </div>
          
          {/* Enhanced n8n Reference */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 mb-4 w-fit">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Built for n8n</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-50 mb-2">Powered by n8n</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              WorkFlow AI generates workflows specifically for <span className="text-indigo-400 font-medium">n8n</span>, the powerful open-source workflow automation platform.
            </p>
            <a 
              href="https://n8n.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center text-sm font-medium group"
            >
              Learn more about n8n
              <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>
        </div>
        
        {/* Enhanced Bottom Section */}
        <div className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm">
            © 2024 <span className="text-slate-300 font-medium">WorkFlow AI</span>. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-slate-400 hover:text-slate-200 text-sm transition-colors duration-200 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-slate-200 text-sm transition-colors duration-200 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 