'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Mic,
  ArrowRight,
  Play
} from 'lucide-react'

export default function SuccessStories() {
  const stories = [
    {
      company: "TechCorp Global",
      industry: "Technology",
      logo: "🚀",
      title: "Automated Customer Onboarding Pipeline",
      description: "Reduced onboarding time from 3 days to 30 minutes by connecting Salesforce, Slack, and Google Workspace through voice commands.",
      prompt: "Create an onboarding workflow that triggers when a new customer signs up in Salesforce, automatically creates their Slack account, sends them a welcome email with login credentials, adds them to Google Workspace, and notifies the account manager",
      results: [
        { label: "Time Saved", value: "85%", icon: Clock },
        { label: "Process Accuracy", value: "99.2%", icon: CheckCircle },
        { label: "Team Productivity", value: "+150%", icon: TrendingUp }
      ],
      gradient: "from-primary-500/20 to-accent-500/20",
      accentColor: "text-primary-400"
    },
    {
      company: "FinanceFlow Inc",
      industry: "Financial Services",
      logo: "💰",
      title: "Compliance Report Generation",
      description: "Automated monthly compliance reporting by integrating bank APIs, audit tools, and regulatory platforms with natural language commands.",
      prompt: "Build a monthly compliance report that pulls transaction data from our banking API, cross-references it with our audit database, generates regulatory summaries, and automatically emails the completed report to the compliance team on the 1st of each month",
      results: [
        { label: "Report Generation", value: "90% Faster", icon: TrendingUp },
        { label: "Compliance Accuracy", value: "100%", icon: CheckCircle },
        { label: "Cost Reduction", value: "$50K/month", icon: Clock }
      ],
      gradient: "from-success-500/20 to-emerald-500/20",
      accentColor: "text-success-400"
    },
    {
      company: "RetailMax Enterprise",
      industry: "E-commerce",
      logo: "🛍️",
      title: "Inventory Management Automation",
      description: "Connected inventory systems, supplier APIs, and sales channels to automatically reorder products and update pricing across all platforms.",
      prompt: "Monitor inventory levels across all warehouses, automatically reorder products when stock falls below 50 units, update pricing on Amazon and Shopify based on supplier costs, and send low-stock alerts to the purchasing team",
      results: [
        { label: "Stock Accuracy", value: "98.7%", icon: CheckCircle },
        { label: "Manual Tasks", value: "-75%", icon: Clock },
        { label: "Revenue Growth", value: "+32%", icon: TrendingUp }
      ],
      gradient: "from-accent-500/20 to-orange-500/20",
      accentColor: "text-accent-400"
    },
    {
      company: "HealthTech Solutions",
      industry: "Healthcare",
      logo: "🏥",
      title: "Patient Data Synchronization",
      description: "Seamlessly integrated EMR systems, lab results, and patient communication platforms to ensure real-time data consistency across all healthcare providers.",
      prompt: "Sync patient data between our EMR system and lab results database, automatically update patient records when new test results arrive, send notifications to doctors for critical values, and maintain HIPAA-compliant audit logs",
      results: [
        { label: "Data Accuracy", value: "99.8%", icon: CheckCircle },
        { label: "Processing Speed", value: "10x Faster", icon: TrendingUp },
        { label: "Patient Satisfaction", value: "+45%", icon: Users }
      ],
      gradient: "from-purple-500/20 to-pink-500/20",
      accentColor: "text-purple-400"
    }
  ]

  return (
    <section className="relative py-32 overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-amber-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Success Stories</span>
            </div>
            <h2 className="text-5xl xl:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
                Real-World 
              </span>
              
              <span className="bg-gradient-to-r from-indigo-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent px-2">
                Use Cases
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover how <span className="text-indigo-400 font-semibold">enterprise teams</span> are revolutionizing their workflows with 
              <span className="text-amber-400 font-semibold">voice-powered automation</span>
            </p>
          </div>

          {/* Enhanced Use Cases Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Use Case 1 - Enhanced */}
            <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Enhanced Category Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-amber-300">Business Automation</span>
                </div>
                
                {/* Enhanced Title */}
                <h4 className="text-2xl font-bold mb-4 text-slate-50 group-hover:text-amber-100 transition-colors duration-300">
                  Lead Management
                </h4>
                
                {/* Enhanced Voice Command */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-600/50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed italic">
                      "Create a workflow that sends me Slack notifications when we get new leads in HubSpot"
                    </p>
                  </div>
                </div>
                
                {/* Enhanced Generation Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm font-semibold">Generated in 12 seconds</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">HubSpot + Slack</div>
                </div>
              </div>
            </div>

            {/* Use Case 2 - Enhanced */}
            <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Enhanced Category Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-indigo-300">Data Integration</span>
                </div>
                
                {/* Enhanced Title */}
                <h4 className="text-2xl font-bold mb-4 text-slate-50 group-hover:text-indigo-100 transition-colors duration-300">
                  Payment Sync
                </h4>
                
                {/* Enhanced Voice Command */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-600/50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed italic">
                      "Import customer data from Stripe to Airtable every hour"
                    </p>
                  </div>
                </div>
                
                {/* Enhanced Generation Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm font-semibold">Generated in 8 seconds</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Stripe + Airtable</div>
                </div>
              </div>
            </div>

            {/* Use Case 3 - Enhanced */}
             <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
               {/* Card Glow Effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               <div className="relative">
                 {/* Enhanced Category Badge */}
                 <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                   <span className="text-sm font-bold text-emerald-300">Content Management</span>
                 </div>
                 
                 {/* Enhanced Title */}
                 <h4 className="text-2xl font-bold mb-4 text-slate-50 group-hover:text-emerald-100 transition-colors duration-300">
                   Social Media
                 </h4>
                 
                 {/* Enhanced Voice Command */}
                 <div className="bg-slate-900/50 backdrop-blur border border-slate-600/50 rounded-xl p-4 mb-6">
                   <div className="flex items-start gap-3">
                     <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                       <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                     </div>
                     <p className="text-slate-300 text-base leading-relaxed italic">
                       "Auto-post Instagram content to Twitter and LinkedIn"
                     </p>
                   </div>
                 </div>
                 
                 {/* Enhanced Generation Time */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-emerald-400">
                     <div className="w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                       <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                     </div>
                     <span className="text-sm font-semibold">Generated in 15 seconds</span>
                   </div>
                   <div className="text-xs text-slate-500 font-medium">Social Platforms</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
  )
} 